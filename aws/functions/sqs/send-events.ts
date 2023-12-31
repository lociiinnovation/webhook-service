import { Messaging, Middleware } from "@locii/truuth-aws-lib";
import { Context, Validator, logger } from "@locii/truuth-lib";
import { SQSHandler } from "aws-lambda";
import { WebhookEvent } from "../../../core/models/webhook";
import { ServiceFactory } from "../../adapters/service-factory";
import { WebhookService } from "../../../core/services/webhook-service";

export const handler: SQSHandler = Middleware.wrap(async (event) => {
    logger.debug("SQS event", event);
    const ctx = Context.getCurrentValue();
    const message = JSON.parse(event.Records[0].body);
    const request = await Validator.transformAndValidate<WebhookEvent>(WebhookEvent, JSON.stringify(message.detail.body));

    const factory = new ServiceFactory(ctx.identity.tenant);
    const service = new WebhookService(factory);

    try {
        await service.publishEvents(request);
    } catch (error) {
        const sqs = new Messaging.MessageQueue();
        await sqs.retryMessage(event.Records[0], 60, 3, false);
    }

});
