import { IWebhookSubscriptionRepository } from "../../core/ports/webhook-subscription-repository";
import { IServiceFactory } from "../../core/ports/service-factory";
import { WebhookEventsRepository } from "./webhook-repository";
import { Messaging } from "@locii/truuth-aws-lib";

export class ServiceFactory implements IServiceFactory {
    private readonly tenantAlias: string
    constructor(tenantAlias: string) {
        this.tenantAlias = tenantAlias
    }

    async createWebhookEventRepository(): Promise<IWebhookSubscriptionRepository> {
        const repository = new WebhookEventsRepository(this.tenantAlias);
        await repository.connect();
        return repository;
    }

    async createEventBus(): Promise<Messaging.EventBus> {
        return new Messaging.EventBus();
    }
}
