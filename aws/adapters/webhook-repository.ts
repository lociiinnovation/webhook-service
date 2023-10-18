import { TenantRepository, ConnectionInfo, CustomIdOptions, PaginationResult } from "@locii/truuth-db";
import { WebhookSubscription } from "../../core/models/webhook";
import { IWebhookSubscriptionRepository } from "../../core/ports/webhook-subscription-repository";
import { ConfigSettings } from './config-settings';
import { Errors } from "@locii/truuth-lib";

export class WebhookEventsRepository extends TenantRepository implements IWebhookSubscriptionRepository {

    constructor(tenantAlias: string) {
        const options: CustomIdOptions = {
            alias: "subscriptionId",
            autogenAlgorithm: "NANOID"
        }
        super('webhooks', tenantAlias, options);
    }

    async listWebhookSubscriptions(query: any, page: number, limit: number, sort: any, projection?: any): Promise<PaginationResult<WebhookSubscription[]>> {
        console.log(query);
        return this.findWithPagination(query, page, limit, sort, projection);
    }

    async getWebhookSubscription(webhookType: string, projection?: any): Promise<WebhookSubscription> {
        return this.findOne({ webhookType }, projection);
    }

    async getConnectionInfo(): Promise<ConnectionInfo> {
        const config = new ConfigSettings();
        return config.getConnectionInfo(this.tenantAlias);
    }

    async saveWebhook(request: WebhookSubscription): Promise<WebhookSubscription> {
        return this.insert(request);
    }

    async updateWebhook(subscriptionId: string, request: WebhookSubscription): Promise<WebhookSubscription> {

        const { value, lastErrorObject } = await this.findOneAndUpdate(
            { subscriptionId },
            { $set: request },
            { returnDocument: "after" }
        );

        if (!lastErrorObject.updatedExisting) {
            throw new Errors.NotFoundError("Webhook subscription does not exist");
        }
        console.log("Found object:", subscriptionId, value);
        return value;
    }

    async deleteWebhook(subscriptionId: string): Promise<void> {
        await this.delete({ subscriptionId });
    }
}