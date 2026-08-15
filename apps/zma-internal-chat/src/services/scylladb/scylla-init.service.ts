import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ScyllaDBConfigService } from '@zma-nestjs-omnichannel/zma-config';

@Injectable()
export class ScyllaInitService implements OnApplicationBootstrap {
  constructor(private readonly scyllaService: ScyllaDBConfigService) {}

  async onApplicationBootstrap() {
    const client = this.scyllaService.getClient();
    const keyspace = this.scyllaService.getKeyspace();

    await client.connect();
    Logger.log('✅ ScyllaDB connected', 'ZMA-SCYLLA');

    // await this.dropTable();
    // await this.dropKeyspace();

    // Tạo keyspace nếu chưa có
    // await client.execute(`
    //   CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    //   WITH replication = {
    //     'class': 'NetworkTopologyStrategy',
    //     'AWS_AP_EAST_1': 3
    //   };
    // `);

    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${keyspace}
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      };
    `);

    await client.execute(`USE ${keyspace};`);
    await client.execute(`
      CREATE TABLE messages (
        tenantId TEXT,
        channelId UUID,
        messageId BIGINT,
        senderId UUID,
        type TEXT,
        message TEXT,
        attachments LIST<TEXT>,
        replyTo BIGINT,
        createdAt TIMESTAMP,
        isEdited BOOLEAN,
        editedAt TIMESTAMP,
        isDeleted BOOLEAN,
        deletedAt TIMESTAMP,
        PRIMARY KEY ((tenantId, channelId), messageId)
      ) WITH CLUSTERING ORDER BY (messageId DESC);
    `);

    console.log(`✅ Data scyllaDB ok! Keyspace: ${keyspace}, Table: messages`);

    // await client.execute(`
    //   CREATE TABLE channel_counters (
    //     tenantId TEXT,
    //     channelId UUID,
    //     lastMessageId BIGINT,
    //     PRIMARY KEY ((tenantId, channelId))
    //   );
    // `);
    // console.log(`✅ Data scyllaDB ok! Keyspace: ${keyspace}, Table: channel_counters`);

    // await client.execute(`
    //   CREATE TABLE message_reactions (
    //     tenantId TEXT,
    //     channelId UUID,
    //     messageId BIGINT,
    //     emoji TEXT,
    //     userId UUID,
    //     reactedAt TIMESTAMP,
    //     PRIMARY KEY ((tenantId, channelId, messageId), userId)
    //   );
    // `);

    // console.log(`✅ Data scyllaDB ok! Keyspace: ${keyspace}, Table: message_reactions`);
  }

  async dropTable() {
    const client = this.scyllaService.getClient();
    const keyspace = this.scyllaService.getKeyspace();
    await client.execute(`DROP TABLE IF EXISTS ${keyspace}.messages;`);
    await client.execute(`DROP TABLE IF EXISTS ${keyspace}.message_reactions;`);
    console.log('🗑️ Bảng messages, message_reactions đã được xóa');
  }

  async dropKeyspace() {
    const client = this.scyllaService.getClient();
    const keyspace = this.scyllaService.getKeyspace();
    await client.execute(`DROP KEYSPACE IF EXISTS ${keyspace};`);
    console.log(`🗑️ Keyspace ${keyspace} đã được xóa`);
  }
}
