import { APIGatewayProxyHandler } from "aws-lambda";
import { Context, Response, Validator, Errors } from '@locii/truuth-lib';
import { Middleware } from "@locii/truuth-aws-lib";
import { ServiceFactory } from '../../adapters/service-factory';
import "source-map-support/register";
import { WebhookSubscription } from "../../../core/models/webhook";

export const handler: APIGatewayProxyHandler = Middleware.wrap(async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    const tenantAlias = event.pathParameters.alias;

    if (!Context.hasPlatformAdminPermission() && !Context.hasAdminPermission(tenantAlias)) {
        throw new Errors.UnauthorizedAccessError();
    }

    if (!tenantAlias) {
        throw new Errors.UnauthorizedAccessError();
    }

    const webhook = await Validator.transformAndValidate<WebhookSubscription>(
        WebhookSubscription,
        event.body
    );

    const factory = new ServiceFactory(tenantAlias);
    const repository = await factory.createWebhookEventRepository();
    const result = await repository.saveWebhook(webhook);

    return Response.ok(result);

});
