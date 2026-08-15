import { registerEnumType } from '@nestjs/graphql';

export enum ServiceName {
  AUTH = 'AuthService',
  USER = 'UserService',
  PRODUCT = 'ProductService',
  BOOKING = 'BookingService',
  CDN = 'CdnService',
  STORAGE = 'StorageService',
  LOYALTY = 'LoyaltyService',
  CAMPAIGN = 'CampaignService',
  CART = 'CartService',
  ORDER = 'OrderService',
  VOUCHER = 'VoucherService',
  MEMBERSHIP = 'MembershipService',
  POINT = 'PointService',
  EVENT = 'EventService',
  SHIPPING = 'ShippingService',
  ORGANIZATION = 'OrganizationService',
  DICTIONARY = 'DictionaryService',
  FEATURE_FLAG = 'FeatureFlagService',
  SUBSCRIPTION = 'SubscriptionService',
  CLIENT = 'ClientService',
  MESSAGE = 'MessageService',
}

registerEnumType(ServiceName, {
  name: 'ServiceName',
  description: 'The type of ZMA services',
});
