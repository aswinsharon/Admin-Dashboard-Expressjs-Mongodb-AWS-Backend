import express from "express";
import commerceToolsApi from '../services/CommercetoolsApi'
import { convertToAmount } from '../helpers/commonUtils';
import { Constants } from "../../../config/constants";
import { TransactionDataType } from '../interfaces/types/Types';

const getTransactionData = async (_req: express.Request, res: express.Response) => {
    try {
        const getTransactionData = await commerceToolsApi.getTransactions();

        if (getTransactionData && getTransactionData.statusCode === Constants.HTTP_OK_STATUS_CODE) {
            const transactionDataArray: TransactionDataType[] = [];

            if (getTransactionData.body && getTransactionData.body.count > 0 && getTransactionData.body.results) {
                for (const payment of getTransactionData.body.results) {
                    const transactionData: TransactionDataType = {
                        name: payment?.custom?.fields?.name || '',
                        transactionStatus: payment?.transactions[0]?.type || '',
                        dateOfTransaction: payment?.transactions[0]?.timestamp || '',
                        amount: convertToAmount(payment?.amountPlanned?.centAmount, payment?.amountPlanned?.fractionDigits) || 0,
                        paymentStatus: payment?.transactions[0]?.state
                    };
                    transactionDataArray.push(transactionData);
                }
            }
            const getTransactionsResponse = {
                statusCode: Constants.HTTP_OK_STATUS_CODE,
                transactionData: transactionDataArray
            };
            return res.status(Constants.HTTP_OK_STATUS_CODE).json(getTransactionsResponse);
        } else {
            return res.status(Constants.HTTP_BAD_REQUEST_STATUS_CODE).json({
                statusCode: Constants.HTTP_BAD_REQUEST_STATUS_CODE,
                status: 'BAD_REQUEST',
                message: 'Invalid request'
            });
        }
    } catch (exception) {
        return res.status(Constants.HTTP_SERVER_ERROR_STATUS_CODE).json({
            statusCode: Constants.HTTP_SERVER_ERROR_STATUS_CODE,
            status: Constants.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        });
    }
}


export default {
    getTransactionData
}