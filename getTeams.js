const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const {
    headers,
    TEAM_TABLENAME,
    POKETUBER
} = require('./config');

const PAGE_SIZE = 20

// Paginated API using lastEvaluated key
module.exports.handler = async (event) => {
    const ExclusiveStartKey = event.queryStringParameters && JSON.parse(event.queryStringParameters.nextKey);

    const params = {
        TableName: TEAM_TABLENAME,
        KeyConditionExpression: "poketuber = :poketuber",
        ExpressionAttributeValues: {
            ":poketuber": POKETUBER
        },
        ScanIndexForward: false,
        Limit: PAGE_SIZE,
        ExclusiveStartKey
    }

    try {
        let hasNext = false;
        const res = await dynamoDb.query(params).promise();
        const {
            Items,
            LastEvaluatedKey: nextKey
        } = res;
        if (nextKey) {
            hasNext = true;
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                Teams: Items,
                hasNext,
                nextKey
            }),
            headers,
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.statusCode || 501,
            headers: {
                ...headers,
                'Content-Type': 'text/plain'
            },
            body: 'Couldn\'t fetch Teams',
        };
    }
}