import AWS from "aws-sdk"
const ses = new AWS.SES({ region: "sa-east-1" })

async function sendMail(event, context) {

  const params = {
    Source: "rafaelcmorais02@gmail.com",
    Destination: {
      ToAddresses: ["rafaelcmorais02@gmail.com"]
    },
    Message: {
      Body: {
        Text: {
          Data: "Hello Rafael"
        }

      },
      Subject: {
        Data: "Email de Teste"
      },
    }
  }

  try {
    const result = await ses.sendEmail(params).promise()
    console.log(result)
    return result
  } catch (error) {
    console.error(error)
  }

}

export const handler = sendMail;


