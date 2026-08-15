import { DaprClient, CommunicationProtocolEnum } from '@dapr/dapr';

export function createDaprClient() {
  return new DaprClient({
    daprHost: process.env.NX_DAPR_HOST ?? '127.0.0.1',
    daprPort: process.env.NX_DAPR_HTTP_PORT ?? '3501',
    communicationProtocol: CommunicationProtocolEnum.HTTP,
  });
}
