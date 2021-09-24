import AWS from "aws-sdk"
import commomMiddleware from "../lib/commomMiddleware";
import createError from "http-errors"
<<<<<<< HEAD
import { getGuestById } from "../utils/utilFunctions";
=======
import { getGuestById } from "./getGuest";
>>>>>>> c526f6bc6d5c1ef0df458274a9fd5f7713f73536

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function updateGuest(event, context) {

    const { id } = event.pathParameters
<<<<<<< HEAD
    const { guestName, age, gender, invitedBy, phone } = event.body
=======
    const { guestName, age, gender, invitedBy, email, phone } = event.body
>>>>>>> c526f6bc6d5c1ef0df458274a9fd5f7713f73536

    const guest = await getGuestById(id)
    if (!guest) {
        throw new createError.NotFound(`Id ${id} was not found`)
    }

    let updateGuest
    try {
        const result = await dynamoDb.update({
            TableName: process.env.GUEST_TABLE_NAME,
            Key: { id },
            UpdateExpression: "set guestName =:guestName, age =:age, gender =:gender, invitedBy =:invitedBy, phone =:phone",
            ExpressionAttributeValues: {
                ":guestName": guestName,
                ":age": age,
                ":gender": gender,
                ":invitedBy": invitedBy,
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