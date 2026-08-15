import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { FileModel } from '../../core/models';
import { FileEntity } from '../../frameworks/data-services/mongo/entities';

@Injectable()
export class FileFactoryService {
  transform(entity: FileEntity): FileModel {
    const model: FileModel = _.assign(entity);
    return model;
  }
}
