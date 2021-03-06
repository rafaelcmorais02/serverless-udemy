import { v4 as uuid } from "uuid"
import AWS from "aws-sdk"
import commomMiddleware from "../lib/commomMiddleware";
import createError from "http-errors"
import { getGuestByEmail, guetGuestEmailGSI } from "../utils/utilFunctions";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function guestRegister(event, context) {
  console.log(JSON.stringify(event))
  const { guestName, age, gender, invitedBy, email, phone } = event.body

  // const guestEmail = await getGuestByEmail(email)
  const guestEmail = await guetGuestEmailGSI(email)

  if (guestEmail.length > 0) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: "email já cadastrado" }),
    }
  }

  const now = new Date()
  const guest = {
    id: uuid(), //Automaticamente cria um unique id
    guestName,
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
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ guest }),
  };
}

export const handler = commomMiddleware(guestRegister)

