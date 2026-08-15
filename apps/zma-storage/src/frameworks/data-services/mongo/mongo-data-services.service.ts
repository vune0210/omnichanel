import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  IGenericRepository,
  MongoGenericRepository,
} from '@zma-nestjs-omnichannel/zma-repositories';
import { Model } from 'mongoose';

import { IDataServices } from '../../../core';

import { FileDocument, FileEntity } from './entities';

@Injectable()
export class MongoDataServices implements IDataServices, OnApplicationBootstrap {
  fileService: IGenericRepository<FileEntity>;

  constructor(
    @InjectModel(FileEntity.name)
    private fileRepository: Model<FileDocument>,
  ) {}

  onApplicationBootstrap() {
    this.fileService = new MongoGenericRepository(this.fileRepository);
  }
}
