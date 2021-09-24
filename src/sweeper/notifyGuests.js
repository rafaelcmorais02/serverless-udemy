import AWS from "aws-sdk"
import createError from "http-errors"

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function notifyGuests(event, context) {
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
    const now = new Date()
    let diff = []
    let email = []
    for (const guest of guests) {
        const createdAt = new Date(guest.createdAt)
        diff.push(parseInt(((((now - createdAt) / 1000) / 60) / 60) / 24))
        email.push(guest.email)
    }

}
export const handler = notifyGuests



