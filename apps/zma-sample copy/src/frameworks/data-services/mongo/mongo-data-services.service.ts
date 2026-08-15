import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  IGenericRepository,
  TenantMongoGenericRepository,
} from '@zma-nestjs-omnichannel/zma-repositories';
import { Model } from 'mongoose';

import { IDataServices } from '../../../core';

import { CompanyDocument, CompanyEntity } from './entities';

@Injectable()
export class MongoDataServices implements IDataServices, OnApplicationBootstrap {
  companyService: IGenericRepository<CompanyEntity>;

  constructor(
    @InjectModel(CompanyEntity.name)
    private companyRepository: Model<CompanyDocument>,
  ) {}

  onApplicationBootstrap() {
    this.companyService = new TenantMongoGenericRepository(this.companyRepository);
  }
}
