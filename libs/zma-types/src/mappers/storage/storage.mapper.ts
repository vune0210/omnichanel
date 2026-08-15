import {
  StorageServiceConfirmUploadedFilesInput,
  StorageServiceGenerateFileUrlsInput,
} from '../../inputs/storage';
import {
  ConfirmUploadedFilesOutput,
  StorageServiceGenerateFileUrlsOutput,
} from '../../outputs/storage';
import { StorageServiceSubject } from '../../services';
import { KeyMapper } from '../../types';

interface StorageServiceMapper {
  [StorageServiceSubject.GenerateFileUrls]: {
    [KeyMapper.Input]: StorageServiceGenerateFileUrlsInput;
    [KeyMapper.Output]: StorageServiceGenerateFileUrlsOutput;
  };
  [StorageServiceSubject.ConfirmUploadedFiles]: {
    [KeyMapper.Input]: StorageServiceConfirmUploadedFilesInput;
    [KeyMapper.Output]: { data: ConfirmUploadedFilesOutput[] };
  };
}

export type StorageServiceInputMapper<T extends StorageServiceSubject> =
  StorageServiceMapper[T][KeyMapper.Input];

export type StorageServiceOutputMapper<T extends StorageServiceSubject> =
  StorageServiceMapper[T][KeyMapper.Output];
