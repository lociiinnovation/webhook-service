import { APIGatewayProxyHandler } from "aws-lambda";
import { Response, Context, Validator, Errors } from '@locii/truuth-lib';
import { Middleware } from "@locii/truuth-aws-lib";
import { ServiceFactory } from '../../adapters/service-factory';
import "source-map-support/register";
import { WebhookSubscription } from "../../../core/models/webhook";

export const handler: APIGatewayProxyHandler = Middleware.wrap(async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    const ctx = Context.getCurrentValue();

    const webhook = await Validator.transformAndValidate<WebhookSubscription>(
        WebhookSubscription,
        event.body
    );
    const subscriptionId = event.pathParameters.subscriptionId;

    if (!subscriptionId) {
        throw new Errors.InvalidParametersError(`Subscription id not supplied`);
    }

    const factory = new ServiceFactory(ctx.identity.tenant);
    const repository = await factory.createWebhookEventRepository();
    const webhooks = await repository.updateWebhook(subscriptionId, webhook);

    return Response.ok(webhooks);

});
