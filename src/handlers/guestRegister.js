import { v4 as uuid } from "uuid"
import AWS from "aws-sdk"

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function guestRegister(event, context) {

  const { name, age, gender, invitedBy, email, phone } = JSON.parse(event.body)
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

  await dynamoDb.put({
    TableName: process.env.GUEST_TABLE_NAME,
    Item: guest,
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({ guest }),
  };
}

export const handler = guestRegister;


