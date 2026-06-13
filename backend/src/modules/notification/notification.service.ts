import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationType, NotificationRelatedType } from '../../common/enums/notification-type.enum';
import { Notification } from './entity/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  async findByUser(userId: string, isRead?: boolean) {
    const where: any = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead;
    }
    return this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' }
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationRepository.count({
      where: { userId, isRead: false }
    });
    return { count };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId }
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true }
    );
    return { success: true };
  }

  async create(dto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(dto);
    return this.notificationRepository.save(notification);
  }

  async createBidAcceptedNotification(bidderId: string, requirementId: string, requirementTitle: string) {
    return this.create({
      userId: bidderId,
      type: NotificationType.BidAccepted,
      title: '报价已被采纳',
      content: `您对需求「${requirementTitle}」的报价已被采纳，请前往查看并准备签署合同。`,
      relatedType: NotificationRelatedType.Requirement,
      relatedId: requirementId
    });
  }

  async createContractSignedNotification(contractId: string, buyerId: string, freelancerId: string, contractNo: string) {
    await Promise.all([
      this.create({
        userId: buyerId,
        type: NotificationType.ContractSigned,
        title: '合同已签署',
        content: `合同「${contractNo}」已完成签署，项目正式启动。`,
        relatedType: NotificationRelatedType.Contract,
        relatedId: contractId
      }),
      this.create({
        userId: freelancerId,
        type: NotificationType.ContractSigned,
        title: '合同已签署',
        content: `合同「${contractNo}」已完成签署，请开始工作。`,
        relatedType: NotificationRelatedType.Contract,
        relatedId: contractId
      })
    ]);
  }

  async createContractCompletedNotification(contractId: string, buyerId: string, freelancerId: string, contractNo: string) {
    await Promise.all([
      this.create({
        userId: buyerId,
        type: NotificationType.ContractCompleted,
        title: '合同已完成',
        content: `合同「${contractNo}」已全部完成，请确认验收。`,
        relatedType: NotificationRelatedType.Contract,
        relatedId: contractId
      }),
      this.create({
        userId: freelancerId,
        type: NotificationType.ContractCompleted,
        title: '合同已完成',
        content: `合同「${contractNo}」已全部完成，等待尾款结算。`,
        relatedType: NotificationRelatedType.Contract,
        relatedId: contractId
      })
    ]);
  }

  async createContractTerminatedNotification(contractId: string, buyerId: string, freelancerId: string, contractNo: string) {
    await Promise.all([
      this.create({
        userId: buyerId,
        type: NotificationType.ContractTerminated,
        title: '合同已终止',
        content: `合同「${contractNo}」已终止。`,
        relatedType: NotificationRelatedType.Contract,
        relatedId: contractId
      }),
      this.create({
        userId: freelancerId,
        type: NotificationType.ContractTerminated,
        title: '合同已终止',
        content: `合同「${contractNo}」已终止，请查看详情。`,
        relatedType: NotificationRelatedType.Contract,
        relatedId: contractId
      })
    ]);
  }
}
