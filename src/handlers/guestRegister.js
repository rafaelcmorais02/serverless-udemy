import { v4 as uuid } from "uuid"
import AWS from "aws-sdk"
import middy from "@middy/core"
import httpJsonBodyParser from "@middy/http-json-body-parser"
import httpEventNormalizer from "@middy/http-event-normalizer"
import httpErrorHandler from "@middy/http-error-handler"
import createError from "http-errors"

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function guestRegister(event, context) {

  const { name, age, gender, invitedBy, email, phone } = event.body
  const now = new Date()

  const guest = {
    id: uuid(), //Automaticamente cria um unique id
    name,
    age,
    gender,
    invitedBy,
    email,
    phone,
    createdAt: now.toISOString(), //Foramto standard para armazenar datas em um banco de dados
  }

  try {
    await dynamoDb.put({
      TableName: process.env.GUEST_TABLE_NAME,
      Item: guest,
    }).promise()
  }
  catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ guest }),
  };
}

export const handler = middy(guestRegister)
  .use(httpJsonBodyParser()) //automaticamente ele faz o parse no nosso evento json
  .use(httpEventNormalizer()) //ajusta o evento no API GAteway para evitar objetos que não existem 
  .use(httpErrorHandler()) //ajuda a lidar com erros


