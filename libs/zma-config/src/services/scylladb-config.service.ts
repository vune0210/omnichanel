import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientOptions } from 'cassandra-driver';

@Injectable()
export class ScyllaDBConfigService {
  private client: Client;

  constructor(private readonly configService: ConfigService) {
    Logger.log('ScyllaDBConfigService constructed', 'ZMA-SCYLLA');

    const contactPoints = this.configService.get<string>('database.scylla.contactPoints', '')
      .split(',')
      .map((host) => host.trim())
      .filter((host) => !!host);

    const localDataCenter = this.configService.get<string>('database.scylla.datacenter');
    const keyspace = this.configService.get<string>('database.scylla.keyspace');
    const username = this.configService.get<string>('database.scylla.username');
    const password = this.configService.get<string>('database.scylla.password');
    const port = this.configService.get<number>('database.scylla.port');

    Logger.log('ScyllaDB config loaded', 'ZMA-SCYLLA');
    // Logger.debug(
    //   { contactPoints, localDataCenter, keyspace, username, password, port },
    //   'ZMA-SCYLLA',
    // );

    const options: ClientOptions = {
      contactPoints,
      localDataCenter,
      //keyspace,
      protocolOptions: {
        port,
      },
      credentials: username && password ? { username, password } : undefined,
      pooling: {
        coreConnectionsPerHost: {
          '0': this.configService.get<number>('database.scylla.coreConnectionsPerHost', 2),
        },
        maxRequestsPerConnection: this.configService.get<number>(
          'database.scylla.maxRequestsPerConnection',
          1024,
        ),
      },
      socketOptions: {
        connectTimeout: this.configService.get<number>('database.scylla.connectTimeout', 5000),
      },
    };

    this.client = new Client(options);
  }

  public getKeyspace(): string {
    return this.configService.get<string>('database.scylla.keyspace', '');
  }

  // async getClient(): Promise<Client> {
  //   try {
  //     await this.client.connect();
  //     Logger.log('ScyllaDB connected!', 'ZMA-SCYLLA');
  //   } catch (error) {
  //     Logger.error(`ScyllaDB connection failed: ${error}`, '', 'ZMA-SCYLLA');
  //     throw error;
  //   }
  //   return this.client;
  // }
  getClient(): Client {
    return this.client; 
  }
}
