import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('database.mongo.uri'),
      // Add optimized connection pool settings
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          Logger.log('MongoDB connected', 'ZMA');
        });

        connection.on('error', (err: any) => {
          Logger.error(`MongoDB connection error: ${err}`, 'ZMA');
        });

        return connection;
      },

      maxPoolSize: this.configService.get<number>('database.mongo.maxPoolSize', 100), // Adjust based on workload
      minPoolSize: this.configService.get<number>('database.mongo.minPoolSize', 10),
      serverSelectionTimeoutMS: this.configService.get<number>(
        'database.mongo.serverSelectionTimeoutMS',
        5000,
      ),
      socketTimeoutMS: this.configService.get<number>('database.mongo.socketTimeoutMS', 45000),
      autoSelectFamily: this.configService.get<boolean>('database.mongo.autoSelectFamily', true),
    };
  }
}
