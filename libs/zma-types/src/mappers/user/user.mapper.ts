import { KafkaTopic } from '../../enums';
import { FindByIdInput } from '../../inputs';
import {
  FindZaloUsersByTenantIdInput,
  UserServiceCreateUserSubjectInput,
  UserServiceFindByEmailSubjectInput,
  UserServiceFindByZaloIdAndTenantIdSubjectInput,
} from '../../inputs/user';
import { UserServiceUserCreatedEventKafkaInput } from '../../microservice';
import { UserServiceUser } from '../../models/user';
import { BooleanOutput } from '../../outputs';
import { UserServiceSubject } from '../../services';
import { KeyMapper } from '../../types';

export interface UserServiceSubjectMapper {
  [UserServiceSubject.Create]: {
    input: UserServiceCreateUserSubjectInput;
    output: UserServiceUser;
  };
  [UserServiceSubject.FindByEmail]: {
    input: UserServiceFindByEmailSubjectInput;
    output: UserServiceUser;
  };
  [UserServiceSubject.FindById]: {
    input: FindByIdInput;
    output: UserServiceUser;
  };
  [UserServiceSubject.FindByZaloIdAndTenantId]: {
    input: UserServiceFindByZaloIdAndTenantIdSubjectInput;
    output: UserServiceUser;
  };
  [UserServiceSubject.CreateZaloUser]: {
    input: UserServiceCreateUserSubjectInput;
    output: UserServiceUser;
  };
  [UserServiceSubject.Update]: {
    input: FindByIdInput & Partial<UserServiceUser>;
    output: UserServiceUser;
  };
  [UserServiceSubject.Delete]: {
    input: FindByIdInput;
    output: BooleanOutput;
  };
  [UserServiceSubject.FindZaloUsersByTenantId]: {
    input: FindZaloUsersByTenantIdInput;
    output: {
      data: UserServiceUser[];
    };
  };
}

export type UserServiceInputMapper<T extends UserServiceSubject> =
  UserServiceSubjectMapper[T][KeyMapper.Input];
export type UserServiceOutputMapper<T extends UserServiceSubject> =
  UserServiceSubjectMapper[T][KeyMapper.Output];

export interface UserServiceEventMapper {
  [KafkaTopic.UserCreatedEventTopic]: {
    input: UserServiceUserCreatedEventKafkaInput;
    output: void;
  };
}

export type UserServiceEventInputMapper<T extends KafkaTopic> =
  UserServiceEventMapper[T][KeyMapper.Input];
export type UserServiceEventOutputMapper<T extends KafkaTopic> =
  UserServiceEventMapper[T][KeyMapper.Output];
