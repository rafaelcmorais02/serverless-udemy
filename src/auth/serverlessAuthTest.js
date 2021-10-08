import jwt from 'jsonwebtoken';

const generatePolicy = (principalId, methodArn) => {
    const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: apiGatewayWildcard,
                },
            ],
        },
    };
};

export async function handler(event, context) {
    if (!event.authorizationToken) {
        throw 'Unauthorized';
    }
    const token = event.authorizationToken.replace('Bearer ', '');

    try {
        const claims = jwt.verify(token, process.env.AUTH_TEST);
        const policy = generatePolicy(claims.sub, event.methodArn);
        const log = {
            eventInfo: event,
            policyInfo: policy
        }
        console.log(JSON.stringify(log))
        return {
            ...policy,
            context: claims
        };
    } catch (error) {
        console.log(error);
        throw 'Unauthorized';
    }
}

