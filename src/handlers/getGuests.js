import AWS from "aws-sdk"
import commomMiddleware from "../lib/commomMiddleware";
import createError from "http-errors"

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getGuests(event, context) {

    let guests
    try {
        const result = await dynamoDb.scan({
            TableName: process.env.GUEST_TABLE_NAME
        }).promise()

        guests = result.Items

    } catch (error) {
        console.error(error)
        throw new createError.InternalServerError(error)
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ guests }),
    };
}

export const handler = commomMiddleware(getGuests)



