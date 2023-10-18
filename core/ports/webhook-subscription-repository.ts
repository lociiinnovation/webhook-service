import { ConnectionInfo, PaginationResult } from "@locii/truuth-db";
import { WebhookSubscription } from "../models/webhook";

export interface IWebhookSubscriptionRepository {
    listWebhookSubscriptions(query: any, page: number, limit: number, sort: any, projection?: any): Promise<PaginationResult<WebhookSubscription[]>>;
    getWebhookSubscription(eventType: string, projection?: any): Promise<WebhookSubscription>;
    getConnectionInfo(): Promise<ConnectionInfo>;
    saveWebhook(request: WebhookSubscription): Promise<WebhookSubscription>;
    deleteWebhook(webhookSubscriptionId: string): Promise<void>;
    updateWebhook(WebhookSubscriptionId: string, request: WebhookSubscription): Promise<WebhookSubscription>
}
