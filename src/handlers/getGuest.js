import AWS from "aws-sdk"
import middy from "@middy/core"
import httpJsonBodyParser from "@middy/http-json-body-parser"
import httpEventNormalizer from "@middy/http-event-normalizer"
import httpErrorHandler from "@middy/http-error-handler"
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

export const handler = middy(getGuest)
    .use(httpJsonBodyParser()) //automaticamente ele faz o parse no nosso evento json
    .use(httpEventNormalizer()) //ajusta o evento no API GAteway para evitar objetos que não existem 
    .use(httpErrorHandler()) //ajuda a lidar com erros


