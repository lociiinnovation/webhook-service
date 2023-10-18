import { Messaging, Middleware } from "@locii/truuth-aws-lib";
import { Context, Validator, logger } from "@locii/truuth-lib";
import { SQSHandler } from "aws-lambda";
import { WebhookEvent } from "../../../core/models/webhook";
import { ServiceFactory } from "../../adapters/service-factory";
import axios from 'axios';

export const handler: SQSHandler = Middleware.wrap(async (event) => {
    logger.debug("SQS event", event);
    const ctx = Context.getCurrentValue();
    const message = JSON.parse(event.Records[0].body);
    const request = await Validator.transformAndValidate<WebhookEvent>(WebhookEvent, JSON.stringify(message.detail.body));

    const factory = new ServiceFactory(ctx.identity.tenant);
    const repository = await factory.createWebhookEventRepository();

    const webhook = await repository.getWebhookSubscription(request.webhookType);

    try {
        try {
            await axios({
                method: 'POST',
                url: webhook.url,
                headers: {
                    Authorization: webhook.authToken,
                },
                data: request.data,
                insecureHTTPParser: true,
            });
        } catch (err) {
            logger.error('Got error response from webhook url', { err });
            if (err?.response?.status >= 500) {
                // do not retry on 4xx
                throw err;
            }
        }
    } catch (error) {
        const sqs = new Messaging.MessageQueue();
        await sqs.retryMessage(event.Records[0], 60, 3, false);
    }

});
