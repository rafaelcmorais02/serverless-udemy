async function guestRegister(event, context) {

  const { name, age, gender, invitedBy, email, phone } = JSON.parse(event.body)
  const now = new Date()

  const guest = {
    name,
    age,
    gender,
    invitedBy,
    email,
    phone,
    createdAt: now.toISOString(), //standard way to store dates into a database
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ guest }),
  };
}

export const handler = guestRegister;


