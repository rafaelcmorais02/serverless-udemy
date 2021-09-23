import { v4 as uuid } from "uuid"
import AWS from "aws-sdk"
import commomMiddleware from "../lib/commomMiddleware";
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
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ guest }),
  };
}

export const handler = commomMiddleware(guestRegister)

