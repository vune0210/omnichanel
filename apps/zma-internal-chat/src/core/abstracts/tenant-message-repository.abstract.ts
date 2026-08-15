import { MessageEntity } from '../../frameworks/data-services/scylla/entities';

export abstract class ITenantMessageRepository {
  /**
   * Lưu message mới
   */
  abstract save(item: MessageEntity): Promise<boolean>;

  /**
   * Lấy danh sách message
   */
  abstract getAllMessages(params: {
    tenantId: string;
    channelId: string;
    cursor?: number;
    limit: number;
    direction?: 'before' | 'after';
  }): Promise<MessageEntity[]>;

  /**
   * Lấy chi tiết 1 message
   */
  abstract getMessageById(params: {
    tenantId: string;
    channelId: string;
    id: number;
  }): Promise<MessageEntity | null>

  /**
   * Lấy danh sách message theo ids
   */
  abstract getMessagesByIds(params: {
    tenantId: string;
    channelId: string;
    ids: number[];
  }): Promise<MessageEntity[]>;

  /**
   * Chỉnh sửa nội dung message
   */
  abstract editMessage(params: {
    tenantId: string;
    channelId: string;
    id: number;
    newContent: string;
  }): Promise<boolean>;

  /**
   * Xóa mềm message
   */
  abstract deleteMessage(params: {
    tenantId: string;
    channelId: string;
    id: number;
  }): Promise<boolean>;
}
