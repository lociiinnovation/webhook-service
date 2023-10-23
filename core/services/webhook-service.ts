import axios from 'axios';
import { WebhookBroadcastEvent, WebhookEvent, WebhookSubscription } from '../models/webhook';
import { IServiceFactory } from '../ports/service-factory';
import { logger } from '@locii/truuth-lib';

export class WebhookService {
    constructor(private readonly factory: IServiceFactory) {
    }

    async publishEvents(event: WebhookEvent): Promise<void> {
        const repository = await this.factory.createWebhookEventRepository();
        const eventBus = await this.factory.createEventBus();
        const subscriptions = await repository.getWebhookSubscriptions(event.type);
        subscriptions.forEach(async subscription => {
            logger.debug('Publishing event to webhook', { subscription });
            const broadcastEvent: WebhookBroadcastEvent = {
                payload: event.payload,
                subscription
            }
            await eventBus.publishEvent('Webhook - Broadcast Event', { body: broadcastEvent });
        });
    }

    async broadcastEvents(payload: any, subscription: WebhookSubscription): Promise<void> {
        try {
            await axios({
                method: 'POST',
                url: subscription.url,
                headers: {
                    Authorization: subscription.authToken,
                },
                data: payload,
                insecureHTTPParser: true,
            });
        } catch (err) {
            logger.error('Got error response from webhook url', { err });
            if (err?.response?.status >= 500) {
                // do not retry on 4xx
                throw err;
            }
        }
    }

}
