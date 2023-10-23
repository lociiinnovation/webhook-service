import { handler } from '../../aws/functions/sqs/broadcast-event';
import { AUTHENTICATION_TYPE, WEBHOOK_TYPE } from '../../core/models/webhook';
import { Context, ContextData } from '@locii/truuth-lib';
import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch');

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

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify({}))));

describe('Test Broadcasting events', () => {

  const message = {
    detail: {
      headers: { "requestor": { "correlationId": "foo", "truuthContext": Buffer.from(JSON.stringify(contextData)), } },
      body: {
        subscription: {
          subscriptionId: "string",
          webhookType: WEBHOOK_TYPE.CALLBACK,
          tenantAlias: "string",
          description: "string",
          url: "string",
          authenticationType: AUTHENTICATION_TYPE.BASIC,
          authToken: "string",
        },
        payload: { givenName: "Adam", familyName: "Smith" }
      }
    }
  }

  beforeAll(async () => {
    process.env.APP = 'truuth';
    process.env.COUNTRY = 'au';
    process.env.STAGE = 'dev';
  });

  afterAll(async () => {
    const connection = await MongoClient.connect(process.env.MONGO_URL);
    const db = connection.db();
    await db.collection('verification-events').deleteMany({});
    await connection.close();
    spyContext.mockRestore();
  });


  it('Should broadcast webhook successfully', async () => {
    const Records = [{ body: JSON.stringify(message) }];
    await handler({ Records: Records } as any, context, null);
  });

  it('Should return class validation error', async () => {

    const newMessage = {
      ...message
    }
    newMessage.detail.body = undefined;
    const Records = [{ body: JSON.stringify(newMessage) }];
    try {
      const response = await handler({ Records: Records } as any, context, null);
      console.log('result: ', response);
    } catch (error) {
      expect(error.code).toBe(400);
      expect(error.name).toBe("ValidationError");
    }
  });

});
