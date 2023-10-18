import { IWebhookSubscriptionRepository } from "../../core/ports/webhook-subscription-repository";
import { IServiceFactory } from "../../core/ports/service-factory";
import { WebhookEventsRepository } from "./webhook-repository";
import { String } from "aws-sdk/clients/cloudsearch";

export class ServiceFactory implements IServiceFactory {
    private readonly tenantAlias: String
    constructor(tenantAlias: string) {
        this.tenantAlias = tenantAlias
    }

    async createWebhookEventRepository(): Promise<IWebhookSubscriptionRepository> {
        const repository = new WebhookEventsRepository(this.tenantAlias);
        await repository.connect();
        return repository;
    }
}
