import { join } from 'path';

import { EnvelopArmor } from '@escape.tech/graphql-armor';
import { blockFieldSuggestionsPlugin } from '@escape.tech/graphql-armor-block-field-suggestions';
import { costLimitPlugin } from '@escape.tech/graphql-armor-cost-limit';
import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';
import { maxDirectivesPlugin } from '@escape.tech/graphql-armor-max-directives';
import { maxTokensPlugin } from '@escape.tech/graphql-armor-max-tokens';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection';
import { createInMemoryCache, useResponseCache } from '@graphql-yoga/plugin-response-cache';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { configuration, MongooseConfigService } from '@zma-nestjs-omnichannel/zma-config';
import { ZmaI18nModule } from '@zma-nestjs-omnichannel/zma-i18n';
import { AppExceptionFilter } from '@zma-nestjs-omnichannel/zma-middlewares';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import Joi from 'joi';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { HealthModule } from './controllers/health/health.module';
import { CompanyMutation } from './controllers/mutations';
import { CompanyResolver, MasterDataResolver } from './controllers/resolvers';
import { DataServicesModule } from './services/data-services/data-services.module';
import { CompanyUseCaseModule } from './use-cases/company/company.use-case.module';
import { MasterDataUseCaseModule } from './use-cases/master-data/master-data.use-case.module';

const armor = new EnvelopArmor();
const protection = armor.protect();
const cache = createInMemoryCache();
cache.invalidate([]);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: Joi.object({
        NX_SERVICE_NAME: Joi.string().required(),
        NX_JWT_SECRET: Joi.string().required(),
        NX_CONFIG_SERVER_URL: Joi.string().optional(),
      }),
      validationOptions: {
        abortEarly: true,
      },
      expandVariables: true,
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('zma-sample', {
                colors: true,
                prettyPrint: true,
              }),
            ),
          }),
          // other transports...
        ],
      }),
      inject: [],
    }),
    PassportModule,
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      resolvers: {},
      autoSchemaFile:
        process.env.NODE_ENV === 'development'
          ? join(process.cwd(), 'graphqls/zma-sample/schema.gql')
          : true,
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      sortSchema: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      graphiql: true,
      healthCheckEndpoint: '/health',
      cors: {},
      plugins: [
        ...protection.plugins,
        // useCSRFPrevention({
        //   requestHeaders: ['x-graphql-yoga-csrf'],
        // }),
        useResponseCache({
          // global cache
          session: () => null,
          ttl: 0,
          ttlPerType: {},
          ttlPerSchemaCoordinate: {},
          cache,
        }),
        useDisableIntrospection({
          isDisabled: () => process.env.NODE_ENV === 'production',
        }),
        blockFieldSuggestionsPlugin(),
        costLimitPlugin(),
        maxTokensPlugin(),
        maxDepthPlugin(),
        maxDirectivesPlugin(),
        maxAliasesPlugin(),
      ],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    HealthModule,
    DataServicesModule,
    CompanyUseCaseModule,
    MasterDataUseCaseModule,
    ZmaI18nModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    MasterDataResolver,
    CompanyResolver,
    CompanyMutation,
  ],
})
export class AppModule {}
