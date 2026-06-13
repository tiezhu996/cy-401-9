import { Controller, Get, Put, Param, Request, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findByUser(@Request() req: any, @Query('isRead') isRead?: string) {
    const userId = req.user.id;
    const readFlag = isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.notificationService.findByUser(userId, readFlag);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: any) {
    return this.notificationService.getUnreadCount(req.user.id);
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Put('read-all')
  markAllAsRead(@Request() req: any) {
    return this.notificationService.markAllAsRead(req.user.id);
  }
}
