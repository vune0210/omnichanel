import { ITenantGenericRepository } from '@zma-nestjs-omnichannel/zma-repositories';

//import { ClientEntity } from '../../frameworks/dapr/statestore/mongo/enitties';
import { ClientEntity } from '../../frameworks/data-services/mongo/entities';


import { ITenantMessageRepository } from './tenant-message-repository.abstract';

export abstract class IDataServices {
  abstract clientService?: ITenantGenericRepository<ClientEntity>;
  abstract messageService?: ITenantMessageRepository;
}
