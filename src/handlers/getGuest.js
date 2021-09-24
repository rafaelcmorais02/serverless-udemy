import AWS from "aws-sdk"
import commomMiddleware from "../lib/commomMiddleware";
import createError from "http-errors"
import { getGuestById } from "../utils/utilFunctions";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getGuest(event, context) {

    const { id } = event.pathParameters
    const guest = await getGuestById(id)

    return {
        statusCode: 200,
        body: JSON.stringify({ guest }),
    };
}

export const handler = commomMiddleware(getGuest)


