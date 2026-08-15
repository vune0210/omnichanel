import { Resolver } from '@nestjs/graphql';

import { FileUseCase } from '../../use-cases/file/file.use-case';

@Resolver()
export class FileMutation {
  constructor(private useCase: FileUseCase) {}
}
