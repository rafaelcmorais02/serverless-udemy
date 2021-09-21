import { v4 as uuid } from "uuid"
import AWS from "aws-sdk"

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function guestRegister(event, context) {

  const { name, age, gender, invitedBy, email, phone } = JSON.parse(event.body)
  const now = new Date()

  const guest = {
    id: uuid(),
    name,
    age,
    gender,
    invitedBy,
    email,
    phone,
    createdAt: now.toISOString(), //standard way to store dates into a database
  }

  await dynamoDb.put({
    TableName: "GuestTable",
    Item: guest,
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({ guest }),
  };
}

export const handler = guestRegister;


