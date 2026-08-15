import { registerEnumType } from '@nestjs/graphql';

export enum MessageTypeEnum {
  Text = 'TEXT',
  Image = 'IMAGE',
  Video = 'VIDEO',
  File = 'FILE',
}

registerEnumType(MessageTypeEnum, {
  name: 'MessageTypeEnum',
});
