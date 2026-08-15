import { ClientServiceCheckOrCreateInput } from '../../inputs/client';
import { ClientServiceCheckOrCreateOutput } from '../../outputs/client';
import { ClientServiceSubject } from '../../services';
import { KeyMapper } from '../../types';

interface ClientServiceMapper {
  [ClientServiceSubject.CheckOrCreate]: {
    [KeyMapper.Input]: ClientServiceCheckOrCreateInput;
    [KeyMapper.Output]: ClientServiceCheckOrCreateOutput;
  };
}

export type ClientServiceInputMapper<T extends ClientServiceSubject> =
  ClientServiceMapper[T][KeyMapper.Input];

export type ClientServiceOutputMapper<T extends ClientServiceSubject> =
  ClientServiceMapper[T][KeyMapper.Output];
