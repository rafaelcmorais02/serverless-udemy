import AWS from "aws-sdk"
import commomMiddleware from "../lib/commomMiddleware";
import createError from "http-errors"
import { getGuestById } from "../utils/utilFunctions";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function updateGuest(event, context) {

    const { id } = event.pathParameters

    const { guestName, age, gender, invitedBy, phone } = event.body

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