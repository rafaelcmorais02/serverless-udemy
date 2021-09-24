import AWS from "aws-sdk"
import createError from "http-errors"

const dynamoDb = new AWS.DynamoDB.DocumentClient();
export async function getGuestByEmail(email) {
  let guest
  try {

    const result = await dynamoDb.scan({
      TableName: process.env.GUEST_TABLE_NAME,
      FilterExpression: "email =:email",
      ExpressionAttributeValues: {
        ":email": email
      }
    }).promise()
    guest = result.Items
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }
  return guest
}

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
