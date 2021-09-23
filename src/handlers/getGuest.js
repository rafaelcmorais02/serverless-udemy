import AWS from "aws-sdk"
import commomMiddleware from "../lib/commomMiddleware";
import createError from "http-errors"

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getGuest(event, context) {
    let guest
    const { id } = event.pathParameters

    try {
        const result = guest = await dynamoDb.get({
            TableName: process.env.GUEST_TABLE_NAME,
            Key: { id }
        }).promise()
        guest = result.Item
    } catch (error) {

        console.error(error)
        throw new createError.InternalServerError(error)
    }

    if (!guest) {
        throw new createError.NotFound(`Guest with ID ${id} was not found`)
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ guest }),
    };
}

export const handler = commomMiddleware(getGuest)


