import { WEBHOOK_TYPE, WebhookType } from "../models/webhook"

export const WEBHOOK_QUERY =
{
  webhooktype: 'webhookType'
}

export const WEBHOOK_TYPES: WebhookType[] = [{ name: "Biopass User Provisioning", code: WEBHOOK_TYPE.BIOPASS_USER_PROVISIONING },
{ name: "Callback", code: WEBHOOK_TYPE.CALLBACK }];
