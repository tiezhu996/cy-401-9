import { IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { NotificationType, NotificationRelatedType } from '../../../common/enums/notification-type.enum';

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @MaxLength(120)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(NotificationRelatedType)
  @IsNotEmpty()
  relatedType: NotificationRelatedType;

  @IsString()
  @IsNotEmpty()
  relatedId: string;
}
