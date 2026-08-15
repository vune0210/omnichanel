import { ITenantGenericRepository } from '@zma-nestjs-omnichannel/zma-repositories';

import { CompanyEntity } from '../../frameworks/data-services/mongo/entities';

export abstract class IDataServices {
  abstract companyService: ITenantGenericRepository<CompanyEntity>;
}
