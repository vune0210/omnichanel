import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '@zma-nestjs-omnichannel/zma-decorators';
import { AuthenticatedUser } from '@zma-nestjs-omnichannel/zma-types';

import { StorageServicePresignedUrlGqlInput } from '../../core/inputs';
import { FileModel, Presigned } from '../../core/models';
import { FileUseCase } from '../../use-cases/file/file.use-case';

@Resolver(() => FileModel)
export class FileResolver {
  constructor(private useCase: FileUseCase) {}

  @Query(() => Presigned)
  async storageServicePresignedUrl(
    @CurrentUser() user: AuthenticatedUser, // Adjust type as needed
    @Args('input') input: StorageServicePresignedUrlGqlInput,
  ): Promise<Presigned> {
    const userId = user.id;
    return this.useCase.generatePresignedUrl({ userId, input });
  }
}
