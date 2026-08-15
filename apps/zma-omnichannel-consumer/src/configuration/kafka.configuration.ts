import { registerAs } from '@nestjs/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export default registerAs('kafka', () => ({
  brokers: [requireEnv('NX_KAFKA_BROKER')],
  clientId: requireEnv('NX_KAFKA_CLIENT_ID'),
  groupId: requireEnv('NX_KAFKA_GROUP_ID'),
}));
