export class MessageEntity {
  tenantId?: string;
  channelId: string;
  messageId?: number;
  senderId: string;
  type: string;
  message?: string;
  attachments?: string[];
  replyTo?: string;
  createdAt: Date;
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

