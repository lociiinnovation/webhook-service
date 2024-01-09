import { APIGatewayProxyHandler } from "aws-lambda";
import { Response, Context, Errors } from '@locii/truuth-lib';
import { Lambda, Middleware } from "@locii/truuth-aws-lib";
import { ServiceFactory } from '../../adapters/service-factory';
import "source-map-support/register";
import { WEBHOOK_QUERY } from "../../../core/lib/common";

export const handler: APIGatewayProxyHandler = Middleware.wrap(async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    const tenantAlias = event.pathParameters.alias;

    if (!Context.hasPlatformAdminPermission() && !Context.hasAdminPermission(tenantAlias)) {
        throw new Errors.UnauthorizedAccessError();
    }

    const queryParams = Lambda.getQueryParameters(event, WEBHOOK_QUERY);

    const factory = new ServiceFactory(tenantAlias);
    const repository = await factory.createWebhookEventRepository();
    const webhooks = await repository.listWebhookSubscriptions(queryParams.query, queryParams.page, queryParams.limit, queryParams.sort);

    return Response.ok(webhooks);

});
