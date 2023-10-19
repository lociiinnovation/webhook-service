import { IWebhookSubscriptionRepository } from "./webhook-subscription-repository";
export interface IServiceFactory {
    createWebhookEventRepository(): Promise<IWebhookSubscriptionRepository>;
}
