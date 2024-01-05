import { handler } from '../../aws/functions/http/save-webhooks';
import baseEvent from '../events/get-webhook-event.json';
import { WebhookSubscription, WEBHOOK_TYPE, AUTHENTICATION_TYPE } from '../../core/models/webhook';
import { WebhookEventsRepository } from '../../aws/adapters/webhook-repository';
import { Context, ContextData } from '@locii/truuth-lib';
import { MongoClient } from 'mongodb';

const context = {
  awsRequestId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
  getRemainingTimeInMillis: function () { return 0 },
  callbackWaitsForEmptyEventLoop: true,
  functionName: '',
  functionVersion: '',
  memoryLimitInMB: '',
  logGroupName: '',
  logStreamName: '',
  clientContext: null,
  identity: null,
  invokedFunctionArn: '',
  done: null,
  fail: null,
  succeed: null
};

jest.mock('../../aws/adapters/config-settings', () => {
  return {
    ConfigSettings: jest.fn(() => ({
      getConnectionInfo: jest.fn().mockResolvedValue({ url: process.env.MONGO_URL, dbName: 'verification-events' })
    }))
  };
});
const contextData: ContextData = {
  traceId: 'ABCDEFGH',
  app: 'test',
  stage: 'dev',
  service: 'service',
  functionArn: 'func',
  identity: {
    principalId: "USER|dhkjhgjkfdhgdg",
    tenant: "client",
    tenantName: "client",
    product: "KYC",
    plan: "KYC",
    roles: ["ADMIN"],
    token: ""
  }
};
const spyContext = jest.spyOn(Context, 'getCurrentValue').mockReturnValue(contextData);

describe('Get Verification event', () => {

  const repo = new WebhookEventsRepository('client');

  const mockWebhook: WebhookSubscription[] = [{
    webhookType: WEBHOOK_TYPE.BIOPASS_USER_PROVISIONING,
    description: "Biopass user integration",
    authenticationType: AUTHENTICATION_TYPE.BASIC,
    authToken: "BASIC asasdasdasda",
    tenantAlias: "client",
    url: "https://url/test"
  }, {
    webhookType: WEBHOOK_TYPE.CALLBACK,
    description: "Callback user integration",
    authenticationType: AUTHENTICATION_TYPE.BASIC,
    authToken: "BASIC asasdasdasda",
    tenantAlias: "client",
    url: "https://url/test"
  }];

  let eventSaved: WebhookSubscription[] = []

  const subscription: WebhookSubscription = {
    webhookType: WEBHOOK_TYPE.BIOPASS_USER_PROVISIONING,
    description: "Biopass user integration Test",
    authenticationType: AUTHENTICATION_TYPE.BASIC,
    authToken: "BASIC asasdasdasda",
    tenantAlias: "client",
    url: "https://url/test"
  }

  beforeAll(async () => {
    process.env.APP = 'truuth';
    process.env.COUNTRY = 'au';
    process.env.STAGE = 'dev';
    await repo.connect();

    for (const webhook of mockWebhook) {
      const result = await repo.saveWebhook(webhook);
      eventSaved.push(result);
    }
  });

  afterAll(async () => {
    spyContext.mockRestore();
    const connection = await MongoClient.connect(process.env.MONGO_URL);
    const db = connection.db();
    await db.collection('webhooks').deleteMany({});
    await connection.close();
  });

  it('Should Save the specific subscription successfully', async () => {
    const event: any = {
      ...baseEvent,
      pathParameters: { tenantAlias: 'client' }
    };

    event.body = JSON.stringify(subscription);

    const response = await handler(event, context, null);
    const body = JSON.parse(response['body']);
    expect(response['statusCode']).toBe(200);
    expect(body.subscriptionId).toBeDefined();
  });

  it('Should Save the specific subscription successfully When authentication type is none', async () => {
    const event: any = {
      ...baseEvent,
      pathParameters: { tenantAlias: 'client' }
    };

    const subscription1 = {
      webhookType: WEBHOOK_TYPE.BIOPASS_USER_PROVISIONING,
      description: "Biopass user integration Test",
      authenticationType: AUTHENTICATION_TYPE.NONE,
      tenantAlias: "client",
      url: "https://url/test"
    }
    

    event.body = JSON.stringify(subscription1);

    const response = await handler(event, context, null);
    const body = JSON.parse(response['body']);
    expect(response['statusCode']).toBe(200);
    expect(body.subscriptionId).toBeDefined();
  });

});
