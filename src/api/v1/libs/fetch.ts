import { RequestInfo, RequestInit } from 'node-fetch';

const fetch = async (...args: [RequestInfo, RequestInit?]) =>
    await import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default fetch;
