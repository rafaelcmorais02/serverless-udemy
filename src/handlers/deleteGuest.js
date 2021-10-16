import AWS from "aws-sdk"
import commomMiddleware from "../lib/commomMiddleware";
import createError from "http-errors"
import { getGuestById } from "../utils/utilFunctions";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function deleteGuest(event, context) {

    const { id } = event.pathParameters

    const guest = await getGuestById(id)

    if (!guest) {
        throw new createError.NotFound(`Id ${id} was not found`)
    }

    try {
        await dynamoDb.delete({
            TableName: process.env.GUEST_TABLE_NAME,
            Key: { id }
        }).promise()

    } catch (error) {
        console.error(error)
        throw new createError.InternalServerError(error)
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "convidado deletado com sucesso" }),
    };
}

export const handler = commomMiddleware(deleteGuest)