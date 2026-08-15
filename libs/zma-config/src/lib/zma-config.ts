/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { join } from 'path';

import { Logger } from '@nestjs/common';
import axios from 'axios';
import Joi from 'joi';
import * as yaml from 'js-yaml';
import _ from 'lodash';

const ZMA_CONFIGURATION = 'ZMA';
const YAML_CONFIG_FILENAME = 'application.yaml';

const getConfigurationContent = async () => {
  Logger.log('Config loading...', ZMA_CONFIGURATION);
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    Logger.log(`Config loaded from source: ${YAML_CONFIG_FILENAME}`, ZMA_CONFIGURATION);
    return readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8');
  }

  const configUrl = `${process.env['NX_CONFIG_SERVER_URL']}/${process.env['NX_SERVICE_NAME']}-${NODE_ENV}.yaml`;
  Logger.log(`Config URL: ${configUrl}`, ZMA_CONFIGURATION);

  try {
    const { data } = await axios.get(configUrl);
    Logger.log(`Config loaded from source: ${configUrl}`, ZMA_CONFIGURATION);
    return data;
  } catch (error) {
    Logger.error(`Failed to load config: ${error}`, ZMA_CONFIGURATION);
    throw error;
  }
};

export const configuration = async () => {
  const configContent = await getConfigurationContent();
  const config = yaml.load(configContent) as Record<string, any>;

  // Process MongoDB configuration
  processConfigPath({
    config,
    configPath: 'database.mongo.uri',
    envVars: {
      NX_DATABASE_MONGO_HOST: process.env['NX_DATABASE_MONGO_HOST'] as string,
      NX_DATABASE_MONGO_USERNAME: process.env['NX_DATABASE_MONGO_USERNAME'] as string,
      NX_DATABASE_MONGO_PASSWORD: process.env['NX_DATABASE_MONGO_PASSWORD'] as string,
    },
    replacements: {
      '${host}': process.env['NX_DATABASE_MONGO_HOST'] as string,
      '${username}': process.env['NX_DATABASE_MONGO_USERNAME'] as string,
      '${password}': process.env['NX_DATABASE_MONGO_PASSWORD'] as string,
    },
  });

  //Process ScyllaDB configuration
    processConfigPath({
      config,
      configPath: 'database.scylla.contactPoints',
      envVars: {
        NX_DATABASE_SCYLLA_HOSTS: process.env['NX_DATABASE_SCYLLA_HOSTS'] as string,
      },
      replacements: {
        '${hosts}': process.env['NX_DATABASE_SCYLLA_HOSTS'] as string,
      },
    });



  processConfigPath({
    config,
    configPath: 'database.scylla.port',
    envVars: {
      NX_DATABASE_SCYLLA_PORT: process.env['NX_DATABASE_SCYLLA_PORT'] as string,
    },
    replacements: {
      '${port}': process.env['NX_DATABASE_SCYLLA_PORT'] as string,
    },
  });


  processConfigPath({
    config,
    configPath: 'database.scylla.username',
    envVars: {
      NX_DATABASE_SCYLLA_USERNAME: process.env['NX_DATABASE_SCYLLA_USERNAME'] as string,
    },
    replacements: {
      '${username}': process.env['NX_DATABASE_SCYLLA_USERNAME'] as string,
    },
  });

  processConfigPath({
    config,
    configPath: 'database.scylla.password',
    envVars: {
      NX_DATABASE_SCYLLA_PASSWORD: process.env['NX_DATABASE_SCYLLA_PASSWORD'] as string,
    },
    replacements: {
      '${password}': process.env['NX_DATABASE_SCYLLA_PASSWORD'] as string,
    },
  });

  processConfigPath({
    config,
    configPath: 'database.scylla.datacenter',
    envVars: {
      NX_DATABASE_SCYLLA_DATACENTER: process.env['NX_DATABASE_SCYLLA_DATACENTER'] as string,
    },
    replacements: {
      '${datacenter}': process.env['NX_DATABASE_SCYLLA_DATACENTER'] as string,
    },
  });

  processConfigPath({
    config,
    configPath: 'database.scylla.keyspace',
    envVars: {
      NX_DATABASE_SCYLLA_KEYSPACE: process.env['NX_DATABASE_SCYLLA_KEYSPACE'] as string,
    },
    replacements: {
      '${keyspace}': process.env['NX_DATABASE_SCYLLA_KEYSPACE'] as string,
    },
  });


  // Process NATS configuration
  processConfigPath({
    config,
    configPath: 'nats.uri',
    envVars: {
      NX_NATS_SERVERS: process.env['NX_NATS_SERVERS'] as string,
    },
    replacements: {
      '${hosts}': process.env['NX_NATS_SERVERS'] as string,
    },
  });

  // Process Elasticsearch node configuration
  processConfigPath({
    config,
    configPath: 'elasticsearch.node',
    envVars: {
      NX_ELASTICSEARCH_NODE: process.env['NX_ELASTICSEARCH_NODE'] as string,
    },
    replacements: {
      '${hosts}': process.env['NX_ELASTICSEARCH_NODE'] as string,
    },
  });

  // Process Elasticsearch API key configuration
  processConfigPath({
    config,
    configPath: 'elasticsearch.apiKey',
    envVars: {
      NX_ELASTICSEARCH_API_KEY: process.env['NX_ELASTICSEARCH_API_KEY'] as string,
    },
    replacements: {
      '${apiKey}': process.env['NX_ELASTICSEARCH_API_KEY'] as string,
    },
  });

  return config;
};

const processConfigPath = ({
  config,
  configPath,
  envVars,
  replacements,
}: {
  config: Record<string, any>;
  configPath: string;
  envVars: Record<string, string>;
  replacements?: Record<string, string>;
}) => {
  if (!_.get(config, configPath)) return;

  // Validate environment variables
  const schema = Joi.object(
    Object.fromEntries(Object.keys(envVars).map((key) => [key, Joi.string().required()])),
  );

  const { error } = schema.validate(envVars);
  if (error) {
    throw new Error(`Environment variables validation failed: ${error.message}`);
  }

  // Replace placeholders in the URI
  let uri = _.get(config, configPath);
  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, envVar]) => {
      uri = uri.replace(placeholder, envVar);
    });
  }

  _.set(config, configPath, uri);
};
