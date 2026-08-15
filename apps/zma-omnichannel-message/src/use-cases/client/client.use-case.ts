import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Pagination } from '@zma-nestjs-omnichannel/zma-types';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';

import { IDataServices } from '../../core/abstracts';
import { Client } from '../../core/models';
import { PlatformEnum } from '../../core/types';
//import { ClientEntity } from '../../frameworks/dapr/statestore/mongo/enitties';
import { ClientEntity } from '../../frameworks/data-services/mongo/entities';
import { Exception } from '@zma-nestjs-omnichannel/zma-middlewares';
import { ClientFactoryService } from './client-factory.user-case.service';
import { DaprMqttPublisherService } from '../../frameworks/dapr/pubsub/mqtt/mqtt.publisher.service';

@Injectable()
export class ClientUseCase {
  constructor(
    @Inject('TEST_SERVICE') private client: ClientProxy,
    private readonly configService: ConfigService,
    private readonly dataServices: IDataServices,
    private readonly factoryService: ClientFactoryService,
    private readonly daprMqtt: DaprMqttPublisherService,
  ) {}

  async testMicroservice(): Promise<string> {
    const response = await firstValueFrom(
      this.client.send('sample', {
        body: {
          name: 'John Doe',
        },
      }),
    );
    return response;
  }

  async getAllClients(pagination: Pagination): Promise<Client[]> {
    const tenantId = 'your_tenant_id_here';
    const { skip, limit } = pagination;
    const entities = await this.dataServices.clientService.findMany({
      tenantId,
      find: {},
      options: {
        sort: { lastInteract: -1 },
        limit,
        skip,
      },
    });
    return entities.map((entity) => this.factoryService.transform(entity));
  }

  async getClient({clientPlatformId, platform}: { clientPlatformId: string; platform: PlatformEnum }): Promise<Client> {
    const tenantId = 'your_tenant_id_here';
    const entity = await this.dataServices.clientService.findOne({
      tenantId,
      find: {
        filter: { platformId: clientPlatformId, channel: platform },
      },
    });
    if (!entity) {
      throw new Exception(`Client with platform ${platform} and id ${clientPlatformId} not found`);
    }
    return this.factoryService.transform(entity);
  }

  async searchClients(pagination: Pagination, input: string): Promise<Client[]> {
    const tenantId = 'your_tenant_id_here';
    const { skip, limit } = pagination;

    const entities = await this.dataServices.clientService.findMany({
      tenantId,
      find: {
        filter: {
          $or: [
            { firstName: { $regex: input, $options: 'i'} },
            { lastName: { $regex: input, $options: 'i'} },
          ],
        },
      },
      options: {
        sort: { name: 1 },
        limit: limit,
        skip: skip,
      },
    });

    return entities.map((entity) => this.factoryService.transform(entity));
  }

  async checkOrCreateClient({ platformId, platform, name }: { platformId: string; platform: PlatformEnum, name: string }): Promise<boolean> {
    const tenantId = 'your_tenant_id_here';
    const existed = await this.dataServices.clientService.findOne({
      tenantId,
      find: { filter: { platformId, channel: platform } },
    });

    if (existed) return true;

    let client: Partial<ClientEntity> | null;

    switch (platform) {
      case PlatformEnum.Facebook:
        client = await this.fetchFacebookUser(platformId);
        break;

      case PlatformEnum.Instagram:
        client = await this.fetchInstagramUser(platformId);
        break;
      case PlatformEnum.WhatsApp:
        client = {
          platformId,
          firstName: name,
          channel: PlatformEnum.WhatsApp,
        };
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }


    if (!client) {
      console.log(`❌ Không lấy được user info từ ${platform} với ID ${platformId}`);
      return false;
    }

    await this.dataServices.clientService.create({
      tenantId,
      item: client as ClientEntity,
    });

    return true;
  }

  private async fetchFacebookUser(platformId: string): Promise<Partial<ClientEntity> | null> {
    const accessToken = this.configService.get<string>('NX_FACEBOOK_PAGE_ACCESS_TOKEN');
    const url = `https://graph.facebook.com/v23.0/${platformId}?fields=first_name,last_name,profile_pic&access_token=${accessToken}`;

    try {
      const res = await axios.get(url);
      const fbData = res.data;

      return {
        platformId: platformId,
        firstName: fbData.first_name,
        lastName: fbData.last_name,
        profilePicture: fbData.profile_pic,
        channel: PlatformEnum.Facebook,
      };
    } catch (err) {
      console.error('❌ Không lấy được user info từ Facebook:', err.response?.data || err.message);
      return null;
    }
  }

  private async fetchInstagramUser(platformId: string): Promise<Partial<ClientEntity> | null> {
    const accessToken = this.configService.get<string>('NX_INSTAGRAM_PAGE_ACCESS_TOKEN');
    const url = `https://graph.instagram.com/v23.0/${platformId}?fields=username,profile_pic&access_token=${accessToken}`;

    try {
      const res = await axios.get(url);
      const igData = res.data;

      return {
        platformId: platformId,
        firstName: igData.username,
        profilePicture: igData.profile_pic,
        channel: PlatformEnum.Instagram,
      };
    } catch (err) {
      console.error('❌ Không lấy được user info từ Instagram:', err.response?.data || err.message);
      return null;
    }
  }

  async updateClientDeliveredWatermark({ platform, clientPlatformId, watermark }: { platform: PlatformEnum; clientPlatformId: string; watermark: Date }): Promise<void> {
    const tenantId = 'your_tenant_id_here';
    const entity = await this.dataServices.clientService.findOne({
      tenantId,
      find: {
        filter: { channel: platform, platformId: clientPlatformId },
      },
    });

    if (!!entity) {
      const update = {
        ...entity,
        lastDeliveredWatermark: watermark,
      };
      //console.log(JSON.stringify(update.toObject(), null, 2));
      //console.log((entity as any).toObject());

      const updatedEntity = await this.dataServices.clientService.updateOne({
        tenantId,
        id: entity._id,
        update: { item: update },
      });
      if (!!updatedEntity) {
        const topic = `chat/${platform}/${clientPlatformId}/statusUpdate`;
        console.log('Publishing MQTT message to topic:', topic);
        this.daprMqtt.publish(topic, {
          status: 'delivered',
          watermark,
        });
      }
    }
  }

  async updateClientReadWatermark({ platform, clientPlatformId, watermark }: { platform: PlatformEnum; clientPlatformId: string; watermark: Date }): Promise<void> {
    const tenantId = 'your_tenant_id_here';
    const entity = await this.dataServices.clientService.findOne({
      tenantId,
      find: {
        filter: { channel: platform, platformId: clientPlatformId },
      },
    });
    if (!!entity) {
      const update = {
        ...entity,
        lastReadWatermark: watermark,
      };
      //console.log(JSON.stringify(update, null, 2));
      //console.log((entity as any).toObject());

      const updatedEntity = await this.dataServices.clientService.updateOne({
        tenantId,
        id: entity._id,
        update: { item: update },
      });
      
      if (!!updatedEntity) {
        const topic = `chat/${platform}/${clientPlatformId}/statusUpdate`;
        console.log('Publishing MQTT message to topic:', topic);
        this.daprMqtt.publish(topic, {
          status: 'read',
          watermark,
        });
      }
    }
  }

  async updateLastInteract({ platform, clientPlatformId, watermark }: { platform: PlatformEnum; clientPlatformId: string, watermark: Date }): Promise<boolean> {
    const tenantId = 'your_tenant_id_here';
    const entity = await this.dataServices.clientService.findOne({
      tenantId,
      find: {
        filter: { channel: platform, platformId: clientPlatformId },
      },
    });

    if (!entity) {
      throw new Error(`Client not found for platform: ${platform}, clientId: ${clientPlatformId}`);
    }

    const update = {
      ...entity,
      lastInteract: watermark,
    };

    const updatedEntity = await this.dataServices.clientService.updateOne({
      tenantId,
      id: entity._id,
      update: { item: update },
    });

    return !!updatedEntity;
  }
}
