import AWS from "aws-sdk"
import commomMiddleware from "../lib/commomMiddleware";
import createError from "http-errors"

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getGuestById(id) {
    let guest

    try {
        const result = await dynamoDb.get({
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
    return guest
}

export async function getGuestByEmail(email) {
    let guest
    try {

    } catch (error) {
        console.error(error)
        throw new createError.InternalServerError(error)
    }
}

async function getGuest(event, context) {

    const { id } = event.pathParameters
    const guest = await getGuestById(id)

    return {
        statusCode: 200,
        body: JSON.stringify({ guest }),
    };
}

export const handler = commomMiddleware(getGuest)


