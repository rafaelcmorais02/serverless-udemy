import AWS from "aws-sdk"
import middy from "@middy/core"
import httpJsonBodyParser from "@middy/http-json-body-parser"
import httpEventNormalizer from "@middy/http-event-normalizer"
import httpErrorHandler from "@middy/http-error-handler"
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

export const handler = middy(getGuests)
    .use(httpJsonBodyParser()) //automaticamente ele faz o parse no nosso evento json
    .use(httpEventNormalizer()) //ajusta o evento no API GAteway para evitar objetos que não existem 
    .use(httpErrorHandler()) //ajuda a lidar com erros


