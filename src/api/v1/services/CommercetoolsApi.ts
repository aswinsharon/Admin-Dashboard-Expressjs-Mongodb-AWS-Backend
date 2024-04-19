import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createRequestBuilder } from '@commercetools/api-request-builder';

const projectKey = process.env.PROJECT_KEY;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authUrl = process.env.AUTH_URL;
const apiUrl = process.env.API_URL


const getClient = () => {
    let client: any;
    try {
        const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
            host: authUrl,
            projectKey,
            credentials: {
                clientId,
                clientSecret,
            },
            fetch
        });
        const httpMiddleware = createHttpMiddleware({
            host: apiUrl,
            fetch
        });
        client = createClient({
            middlewares: [authMiddleware, httpMiddleware],
        });
    } catch (exception) {
        console.log(exception);
    }
    return client;
}

const getTransactions = async () => {
    let uri = '';
    let requestBuilder: any;
    let channelRequest: any;
    let getTransactionsResponse: any;
    try {
        const client = getClient();
        if (client) {
            requestBuilder = createRequestBuilder({
                projectKey: projectKey
            });
            uri = requestBuilder.payments.build();
        }
        channelRequest = {
            uri: uri,
            method: 'GET'
        }
        getTransactionsResponse = client.execute(channelRequest);

    } catch (error) {
        console.error('Error:', error);
    }
    return getTransactionsResponse;
}


export default {
    getTransactions
}