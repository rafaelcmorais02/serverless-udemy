import AWS from "aws-sdk"
import commomMiddleware from "../lib/commomMiddleware";
import createError from "http-errors"

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function updateGuest(event, context) {

    const { id } = event.pathParameters
    const { guestName, age, gender, invitedBy, email, phone } = event.body
    let updateGuest
    try {
        const result = await dynamoDb.update({
            TableName: process.env.GUEST_TABLE_NAME,
            Key: { id },
            UpdateExpression: "set guestName =:guestName, age =:age, gender =:gender, invitedBy =:invitedBy, email =:email, phone =:phone",
            ExpressionAttributeValues: {
                ":guestName": guestName,
                ":age": age,
                ":gender": gender,
                ":invitedBy": invitedBy,
                ":email": email,
                ":phone": phone
            },
            ReturnValues: "ALL_NEW"
        }).promise()
        updateGuest = result.Attributes
    } catch (error) {
        console.error(error)
        throw new createError.InternalServerError(error)
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ updateGuest }),
    };
}

export const handler = commomMiddleware(updateGuest)