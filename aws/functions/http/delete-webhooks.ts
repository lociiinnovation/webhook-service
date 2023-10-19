import { APIGatewayProxyHandler } from "aws-lambda";
import { Response, Context, Errors } from '@locii/truuth-lib';
import { Middleware } from "@locii/truuth-aws-lib";
import { ServiceFactory } from '../../adapters/service-factory';
import "source-map-support/register";

export const handler: APIGatewayProxyHandler = Middleware.wrap(async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    const ctx = Context.getCurrentValue();
    const subscriptionId = event.pathParameters.subscriptionId;

    if (!subscriptionId) {
        throw new Errors.InvalidParametersError(`Subscription id not supplied`);
    }
    console.log(subscriptionId);
    const factory = new ServiceFactory(ctx.identity.tenant);
    const repository = await factory.createWebhookEventRepository();
    await repository.deleteWebhook(subscriptionId);

    return Response.ok({result: "OK"});

});
