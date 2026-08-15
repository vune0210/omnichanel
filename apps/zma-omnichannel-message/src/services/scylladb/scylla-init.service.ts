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

    await this.dropTable();
    await this.dropKeyspace();

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
      CREATE TABLE IF NOT EXISTS messages (
        id UUID,
        tenantId TEXT,
        msgPlatformId TEXT,
        refId TEXT,
        clientPlatformId TEXT,
        platform TEXT,
        authorId TEXT,
        channelId BIGINT,
        message TEXT,
        attachments LIST<TEXT>,
        msgType TEXT,
        timestamp TIMESTAMP,
        PRIMARY KEY ((tenantId, clientPlatformId, platform), timestamp)
      ) WITH CLUSTERING ORDER BY (timestamp ASC);
    `);

    console.log(`✅ Data scyllaDB ok! Keyspace: ${keyspace}, Table: messages`);

    // await client.execute(`
    //   CREATE TABLE IF NOT EXISTS message_by_platform_id (
    //     platform TEXT,
    //     msgPlatformId TEXT,
    //     clientPlatformId TEXT,
    //     timestamp TIMESTAMP,
    //     PRIMARY KEY ((platform), msgPlatformId)
    //   );
    // `);

    // console.log(`✅ Data scyllaDB ok! Keyspace: ${keyspace}, Table: messages_by_platform_id`);
  }

  async dropTable() {
    const client = this.scyllaService.getClient();
    const keyspace = this.scyllaService.getKeyspace();
    await client.execute(`DROP TABLE IF EXISTS ${keyspace}.messages;`);
    //await client.execute(`DROP TABLE IF EXISTS ${keyspace}.message_by_platform_id;`);
    console.log('🗑️ Bảng messages, message_by_platform_id đã được xóa');
  }

  async dropKeyspace() {
    const client = this.scyllaService.getClient();
    const keyspace = this.scyllaService.getKeyspace();
    await client.execute(`DROP KEYSPACE IF EXISTS ${keyspace};`);
    console.log(`🗑️ Keyspace ${keyspace} đã được xóa`);
  }
}
