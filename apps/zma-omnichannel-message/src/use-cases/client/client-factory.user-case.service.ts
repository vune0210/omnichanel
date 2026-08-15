import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { Client } from '../../core/models';
import { ClientEntity } from '../../frameworks/data-services/mongo/entities';

@Injectable()
export class ClientFactoryService {
  transform(entity: ClientEntity): Client {
    const client: Client = _.assign(entity);
    return client;
  }
}
