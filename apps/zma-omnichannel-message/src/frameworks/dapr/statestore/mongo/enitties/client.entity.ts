/**
 * Core Client Entity Definition
 * Platform-agnostic client representation for Dapr state store
 */
export interface ClientEntity {
  _id?: string;
  platformId: string;
  channel: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  lastDeliveredWatermark?: Date;
  lastReadWatermark?: Date;
  lastInteractedWatermark?: Date;
  tenantId: string;
}

/**
 * Factory function to create a new ClientEntity with default values
 */
export function createClientEntity(partial: Partial<ClientEntity>): ClientEntity {
  return {
    lastDeliveredWatermark: new Date(0),
    lastReadWatermark: new Date(0),
    lastInteractedWatermark: new Date(0),
    ...partial,
  } as ClientEntity;
}
