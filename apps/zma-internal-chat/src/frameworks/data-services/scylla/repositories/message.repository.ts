import { Injectable } from '@nestjs/common';
import { Client as ScyllaClient } from 'cassandra-driver';
import { MessageEntity } from '../entities';
import { ITenantMessageRepository } from '../../../../core/abstracts';


@Injectable()
export class ScyllaMessageRepository implements ITenantMessageRepository {
  constructor(private readonly scyllaClient: ScyllaClient) {}

  async save(msg: MessageEntity): Promise<boolean> {
    let newMessageId: number;
      // B1: Lấy current counter
      const res = await this.scyllaClient.execute(
        `SELECT lastMessageId FROM channel_counters WHERE tenantId=? AND channelId=?`,
        [msg.tenantId, msg.channelId]
      );
      const current = res.rowLength > 0 ? res.rows[0].lastMessageId : 0;
      newMessageId = current + 1;

      // B2: Update counter
      const updateRes = await this.scyllaClient.execute(
        `UPDATE channel_counters SET lastMessageId = ? 
        WHERE tenantId=? AND channelId=? 
        IF lastMessageId = ?`,
        [newMessageId, msg.tenantId, msg.channelId, current],
        { prepare: true }
      );
    
      if (!updateRes.rows[0]['[applied]']) {
        console.error('❌ Failed to update message counter!');
        return false; 
      }

    // B3: Lưu tin nhắn
    const insertQuery = `
      INSERT INTO messages (
        tenantId, channelId, messageId, senderId, type,
        message, attachments, replyTo, createdAt, isEdited, editedAt, isDeleted, deletedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      msg.tenantId,
      msg.channelId,
      newMessageId,
      msg.senderId,
      msg.type,
      msg.message,
      msg.attachments,
      msg.replyTo,
      msg.createdAt,
      msg.isEdited,
      msg.editedAt,
      msg.isDeleted,
      msg.deletedAt,
    ];

    try {
      await this.scyllaClient.execute(insertQuery, params, { prepare: true });
      return true;
    } catch (error) {
      console.error('❌ Error saving message to ScyllaDB:', error.message);
      return false;
    }
  }

  async getAllMessages(params: {
    tenantId: string;
    channelId: string;
    cursor?: number;
    limit?: number;
    direction?: 'before' | 'after';
  }): Promise<MessageEntity[]> {
    const { tenantId, channelId, cursor, limit, direction } = params;
    // Chuẩn hóa direction
    let effectiveDirection: 'before' | 'after' | undefined = direction;
    if (cursor !== undefined && !direction) effectiveDirection = 'before';  
    if (cursor === undefined && direction) effectiveDirection = undefined;

    // Query chính
    let query = `
      SELECT * FROM messages
      WHERE tenantId=? AND channelId=?
    `;
    const values: any[] = [tenantId, channelId];

    if (cursor !== undefined && effectiveDirection) {
      query += effectiveDirection === 'before' ? ' AND messageId < ?' : ' AND messageId > ?';
      values.push(cursor);
    }

    query += ' ORDER BY messageId DESC LIMIT ?';
    values.push(limit);

    const res = await this.scyllaClient.execute(query, values, { prepare: true });
    let rows = res.rows as unknown as MessageEntity[];

    // Nếu lấy after thì đảo ngược để trả ASC
    if (effectiveDirection === 'after') {
      rows = rows.reverse();
    }
    return rows;
  }

  async getMessageById(params: {
    tenantId: string;
    channelId: string;
    id: number;
  }): Promise<MessageEntity | null> {
    const query = `
      SELECT * FROM messages
      WHERE tenantId=? AND channelId=? AND messageId=?
      LIMIT 1
    `;
    const values = [params.tenantId, params.channelId, params.id];
    const res = await this.scyllaClient.execute(query, values, { prepare: true });
    return res.rowLength > 0 ? (res.rows[0] as unknown as MessageEntity) : null;
  }

  async getMessagesByIds(params: {
    tenantId: string;
    channelId: string;
    ids: number[];
  }): Promise<MessageEntity[]> {
    const { tenantId, channelId, ids } = params;

    if (!ids || ids.length === 0) return [];

    const placeholders = ids.map(() => '?').join(',');
    const query = `
      SELECT * FROM messages
      WHERE tenantId=? AND channelId=? AND messageId IN (${placeholders})
    `;
    const values = [tenantId, channelId, ...ids];
    const res = await this.scyllaClient.execute(query, values, { prepare: true });

    return res.rows as unknown as MessageEntity[];
  }

  async editMessage(params: {
    tenantId: string;
    channelId: string;
    id: number;
    newContent: string;
  }): Promise<boolean> {
    const query = `
      UPDATE messages
      SET message=?, isEdited=true, editedAt=toTimestamp(now())
      WHERE tenantId=? AND channelId=? AND messageId=?
    `;
    const values = [
      params.newContent,
      params.tenantId,
      params.channelId,
      params.id,
    ];
    const res = await this.scyllaClient.execute(query, values, { prepare: true });
    return res.rows[0]['[applied]'] ?? false;
  }

  async deleteMessage(params: {
    tenantId: string;
    channelId: string;
    id: number;
  }): Promise<boolean> {
    const query = `
      UPDATE messages
      SET isDeleted=true, deletedAt=toTimestamp(now())
      WHERE tenantId=? AND channelId=? AND messageId=?
    `;
    const values = [
      params.tenantId,
      params.channelId,
      params.id,
    ];
    const res = await this.scyllaClient.execute(query, values, { prepare: true });
    return res.rows[0]['[applied]'] ?? false;
  }
}
