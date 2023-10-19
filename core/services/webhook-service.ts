import axios from 'axios';
import { WebhookEvent, WebhookSubscription } from '../models/webhook';
import { IServiceFactory } from '../ports/service-factory';
import { logger } from '@locii/truuth-lib';

export class WebhookService {
    constructor(private readonly factory: IServiceFactory) {
    }

    async broadcastEvents(event: WebhookEvent): Promise<void> {
        const repository = await this.factory.createWebhookEventRepository();

        const subscriptions = await repository.getWebhookSubscriptions(event.webhookType);
        subscriptions.forEach(async subscription => {
            await this.publish(event, subscription);
        });
    }

    private async publish(data: any, subscription: WebhookSubscription): Promise<void> {
        try {
            await axios({
                method: 'POST',
                url: subscription.url,
                headers: {
                    Authorization: subscription.authToken,
                },
                data: data,
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
