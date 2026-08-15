import { Injectable } from '@nestjs/common';
import { ClientScyllaPagination } from '@zma-nestjs-omnichannel/zma-types';
import { Client as ScyllaClient } from 'cassandra-driver';

import { ITenantMessageRepository } from '../../../../core/abstracts/tenant-message-repository.abstract';
import { PlatformEnum } from '../../../../core/types';
import { MessageEntity } from '../entities';

@Injectable()
export class ScyllaMessageRepository implements ITenantMessageRepository {
  constructor(private readonly scyllaClient: ScyllaClient) {}

  async save(msg: MessageEntity): Promise<boolean> {
    // Check for duplicate message by tenant, platform and msgPlatformId
    // const checkQuery = `SELECT msgPlatformId FROM message_by_platform_id WHERE tenantId = ? AND platform = ? AND msgPlatformId = ? LIMIT 1`;
    // const checkResult = await this.scyllaClient.execute(
    //   checkQuery,
    //   [msg.tenantId, msg.platform, msg.msgPlatformId],
    //   { prepare: true },
    // );
    // if (checkResult?.rowLength > 0) {
    //   console.log('⚠️ Duplicate message detected, skipping save.');
    //   return false;
    // }

    // Insert message
    const insertQuery = `
      INSERT INTO messages (
        id, tenantId, msgPlatformId, refId, clientPlatformId, platform,
        authorId, channelId, message, attachments, msgType,
        timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      msg.id,
      msg.tenantId,
      msg.msgPlatformId,
      msg.refId,
      msg.clientPlatformId,
      msg.platform,
      msg.authorId,
      msg.channelId,
      msg.message,
      msg.attachments,
      msg.msgType,
      msg.timestamp,
    ];
    try {
      await this.scyllaClient.execute(insertQuery, params, { prepare: true });
      return true;
    } catch (error) {
      console.error('❌ Lỗi khi lưu message vào ScyllaDB:', error.message);
      return false;
    }
  }

  async findByClientPlatformId({
    tenantId,
    clientPlatformId,
    platform,
    pagination,
  }: {
      tenantId: string;
      clientPlatformId: string;
      platform: string;
      pagination: ClientScyllaPagination;
    }
  ): Promise<MessageEntity[]> {
    const { limit, before } = pagination;

    // Pre-build queries để tránh string concatenation trong runtime
    const baseQuery =
      'SELECT * FROM messages WHERE tenantId = ? AND clientPlatformId = ? AND platform = ?';
    const queryWithBefore = baseQuery + ' AND timestamp < ? LIMIT ?';
    const queryWithoutBefore = baseQuery + ' LIMIT ?';

    let query: string;
    let params: any[];

    if (before) {
      query = queryWithBefore;
      params = [tenantId, clientPlatformId, platform, before, limit];
    } else {
      query = queryWithoutBefore;
      params = [tenantId, clientPlatformId, platform, limit];
    }

    const result = await this.scyllaClient.execute(query, params, { prepare: true });

    return result.rows.map((row) => this.mapRowToEntity(row));
  }

  // async markMessageAsDelivered({
  //   tenantId,
  //   clientPlatformId,
  //   platform,
  //   watermark,
  //   deliveredAt,
  // }: {
  //   tenantId: string,
  //   clientPlatformId: string,
  //   platform: PlatformEnum,
  //   watermark: number,
  //   deliveredAt: Date,
  // }): Promise<void> {
  //   const query = `
  //     SELECT timestamp FROM messages
  //     WHERE tenantId = ? AND clientPlatformId = ? AND platform = ?
  //       AND isDelivered = false AND timestamp <= ?
  //     ALLOW FILTERING
  //   `;
  //   const params = [tenantId, clientPlatformId, platform, new Date(watermark)];
  //   const result = await this.scyllaClient.execute(query, params, { prepare: true });
  //   for (const row of result.rows) {
  //     const updateQuery = `UPDATE messages SET isDelivered = true, deliveredAt = ? WHERE tenantId = ? AND clientPlatformId = ? AND platform = ? AND timestamp = ?`;
  //     const updateParams = [deliveredAt, tenantId, clientPlatformId, platform, row.timestamp];
  //     await this.scyllaClient.execute(updateQuery, updateParams, { prepare: true });
  //   }
  // }

  // async markMessageAsRead( {
  //   tenantId,
  //   clientPlatformId,
  //   platform,
  //   watermark,
  //   readAt,
  // }: {
  //   tenantId: string,
  //   clientPlatformId: string,
  //   platform: PlatformEnum,
  //   watermark: number,
  //   readAt: Date,
  // }): Promise<void> {
  //   const query = `
  //     SELECT timestamp FROM messages
  //     WHERE tenantId = ? AND clientPlatformId = ? AND platform = ?
  //       AND isRead = false AND timestamp <= ?
  //     ALLOW FILTERING
  //   `;
  //   const params = [tenantId, clientPlatformId, platform, new Date(watermark)];
  //   const result = await this.scyllaClient.execute(query, params, { prepare: true });
  //   for (const row of result.rows) {
  //     const updateQuery = `UPDATE messages SET isRead = true, readAt = ? WHERE tenantId = ? AND clientPlatformId = ? AND platform = ? AND timestamp = ?`;
  //     const updateParams = [readAt, tenantId, clientPlatformId, platform, row.timestamp];
  //     await this.scyllaClient.execute(updateQuery, updateParams, { prepare: true });
  //   }
  // }

  private mapRowToEntity(row: any): MessageEntity {
    return {
      id: row.id,
      tenantId: row.tenantid,
      msgPlatformId: row.msgplatformid,
      refId: row.refid,
      clientPlatformId: row.clientplatformid,
      platform: row.platform,
      authorId: row.authorid,
      channelId: row.channelid,
      message: row.message,
      attachments: row.attachments,
      msgType: row.msgtype,
      timestamp: row.timestamp,
    };
  }
}