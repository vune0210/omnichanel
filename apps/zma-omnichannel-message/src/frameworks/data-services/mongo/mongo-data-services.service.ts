import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ITenantGenericRepository,
  TenantMongoGenericRepository,
} from '@zma-nestjs-omnichannel/zma-repositories';
import { Model } from 'mongoose';

import { IDataServices } from '../../../core';

import { ClientDocument, ClientEntity } from './entities';

@Injectable()
export class MongoDataServices implements IDataServices, OnApplicationBootstrap {
  clientService: ITenantGenericRepository<ClientEntity>;

  constructor(
    @InjectModel(ClientEntity.name)
    private clientRepository: Model<ClientDocument>,
  ) {}

  onApplicationBootstrap() {
    this.clientService = new TenantMongoGenericRepository(this.clientRepository);
  }
}