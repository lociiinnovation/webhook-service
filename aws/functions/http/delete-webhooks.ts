import { APIGatewayProxyHandler } from "aws-lambda";
import { Response, Context, Errors } from '@locii/truuth-lib';
import { Middleware } from "@locii/truuth-aws-lib";
import { ServiceFactory } from '../../adapters/service-factory';
import "source-map-support/register";

export const handler: APIGatewayProxyHandler = Middleware.wrap(async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    const tenantAlias = event.pathParameters.alias;
    console.log(`Admin permission of ${tenantAlias}: `, Context.hasAdminPermission(tenantAlias));
    if (!Context.hasPlatformAdminPermission() && !Context.hasAdminPermission(tenantAlias)) {
        throw new Errors.UnauthorizedAccessError();
    }
    const subscriptionId = event.pathParameters.subscriptionId;

    if (!subscriptionId) {
        throw new Errors.InvalidParametersError(`Subscription id not supplied`);
    }
    console.log(subscriptionId);
    const factory = new ServiceFactory(tenantAlias);
    const repository = await factory.createWebhookEventRepository();
    await repository.deleteWebhook(subscriptionId);

    return Response.ok({ result: "OK" });

});
