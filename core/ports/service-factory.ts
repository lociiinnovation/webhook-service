import { Messaging } from "@locii/truuth-aws-lib";
import { IWebhookSubscriptionRepository } from "./webhook-subscription-repository";
export interface IServiceFactory {
    createWebhookEventRepository(): Promise<IWebhookSubscriptionRepository>;
    createEventBus(): Promise<Messaging.EventBus>;
}
