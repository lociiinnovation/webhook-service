import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum WEBHOOK_TYPE {
  CALLBACK = 'CALLBACK',
  BIOPASS_USER_PROVISIONING = 'BIOPASS_USER_PROVISIONING'
}

export enum AUTHENTICATION_TYPE {
  BASIC = 'BASIC',
  BEARER = 'BEARER'
}

export class WebhookType {
  name: string;
  code: string;
}

export class WebhookSubscription {

  subscriptionId?: string;

  @IsNotEmpty({ message: "webhook type is required" })
  @IsEnum(WEBHOOK_TYPE, { message: "webhook type is invalid" })
  webhookType: WEBHOOK_TYPE;

  @IsNotEmpty({ message: "tenant alias is required" })
  tenantAlias: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty({ message: "url is required"})
  url: string;

  @IsNotEmpty({ message: "authentication type is required" })
  @IsEnum(AUTHENTICATION_TYPE, { message: "authentication type is invalid" })
  authenticationType: AUTHENTICATION_TYPE;

  @IsNotEmpty({ message: "authToken is required" })
  authToken: string;
}

export class WebhookEvent {
  @IsNotEmpty({ message: 'webhook type required' })
  type: string;

  @IsNotEmpty({ message: 'payload is required' })
  payload: any;
}

export class WebhookBroadcastEvent {
  @IsNotEmpty({ message: 'webhook subscription is required' })
  subscription: WebhookSubscription;

  @IsNotEmpty({ message: 'payload is required' })
  payload: any;
}

export interface BaseResponse {
  result: string
}
