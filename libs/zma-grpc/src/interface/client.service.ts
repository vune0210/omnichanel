import { MicroserviceInput, ClientServiceSubject } from '@zma-nestjs-omnichannel/zma-types';
import {
  ClientServiceInputMapper,
  ClientServiceOutputMapper,
} from '@zma-nestjs-omnichannel/zma-types/mappers/client';
import { Observable } from 'rxjs';

export interface ClientService {
  checkOrCreateClient(
    input: MicroserviceInput<ClientServiceInputMapper<ClientServiceSubject.CheckOrCreate>>,
  ): Observable<ClientServiceOutputMapper<ClientServiceSubject.CheckOrCreate>>;
}
