import { APIGatewayProxyHandler } from "aws-lambda";
import { Response, Context, logger } from '@locii/truuth-lib';
import { Middleware } from "@locii/truuth-aws-lib";
import { ServiceFactory } from '../../adapters/service-factory';
import "source-map-support/register";

export const handler: APIGatewayProxyHandler = Middleware.wrap(async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    const ctx = Context.getCurrentValue();
    logger.debug(event);

    const factory = new ServiceFactory(ctx.identity.tenant);
    const repository = await factory.createWebhookEventRepository();
    const webhookTypes = await repository.getWebhookTypesByTenantAlias();

    return Response.ok(webhookTypes);

});
