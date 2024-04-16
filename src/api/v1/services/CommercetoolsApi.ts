
// import fs from 'fs';

import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';

// const getPaymentsQueryGql = fs.readFileSync('../resources/graphql/getPayments.gql');

const projectKey = process.env.PROJECT_KEY;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authUrl = process.env.AUTH_URL;
const apiUrl = process.env.API_URL


const getClient = async () => {
    try {
        const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
            host: authUrl,
            projectKey,
            credentials: {
                clientId,
                clientSecret,
            },
        });
        const httpMiddleware = createHttpMiddleware({
            host: apiUrl,
        });
        const client = createClient({
            middlewares: [authMiddleware, httpMiddleware],
        });

        return client;
    } catch (exception) {
        console.log(exception);
    }
}
getClient();