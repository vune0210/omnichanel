import { MicroserviceInput, UserServiceSubject } from '@zma-nestjs-omnichannel/zma-types';
import {
  UserServiceInputMapper,
  UserServiceOutputMapper,
} from '@zma-nestjs-omnichannel/zma-types/mappers/user';
import { Observable } from 'rxjs';

export interface UserService {
  userServiceCreate(
    input: MicroserviceInput<UserServiceInputMapper<UserServiceSubject.Create>>,
  ): Observable<UserServiceOutputMapper<UserServiceSubject.Create>>;

  userServiceCreateZaloUser(
    input: MicroserviceInput<UserServiceInputMapper<UserServiceSubject.CreateZaloUser>>,
  ): Observable<UserServiceOutputMapper<UserServiceSubject.CreateZaloUser>>;

  userServiceUpdate(
    input: MicroserviceInput<UserServiceInputMapper<UserServiceSubject.Update>>,
  ): Observable<UserServiceOutputMapper<UserServiceSubject.Update>>;

  userServiceDelete(
    input: MicroserviceInput<UserServiceInputMapper<UserServiceSubject.Delete>>,
  ): Observable<UserServiceOutputMapper<UserServiceSubject.Delete>>;

  userServiceFindById(
    input: MicroserviceInput<UserServiceInputMapper<UserServiceSubject.FindById>>,
  ): Observable<UserServiceOutputMapper<UserServiceSubject.FindById>>;

  userServiceFindByEmail(
    input: MicroserviceInput<UserServiceInputMapper<UserServiceSubject.FindByEmail>>,
  ): Observable<UserServiceOutputMapper<UserServiceSubject.FindByEmail>>;

  userServiceFindByZaloIdAndTenantId(
    input: MicroserviceInput<UserServiceInputMapper<UserServiceSubject.FindByZaloIdAndTenantId>>,
  ): Observable<UserServiceOutputMapper<UserServiceSubject.FindByZaloIdAndTenantId>>;

  userServiceFindZaloUsersByTenantId(
    input: MicroserviceInput<UserServiceInputMapper<UserServiceSubject.FindZaloUsersByTenantId>>,
  ): Observable<UserServiceOutputMapper<UserServiceSubject.FindZaloUsersByTenantId>>;
}
