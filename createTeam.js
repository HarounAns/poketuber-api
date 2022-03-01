const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const {
    headers,
    TEAM_TABLENAME,
    POKETUBER
} = require('./config');


module.exports.handler = async (event) => {
    const {
        teamName,
        teamDateTs,
        pokepasteURL,
        spotlightPokemon,
    } = JSON.parse(event.body);

    if (!teamName || !teamDateTs || !pokepasteURL || !spotlightPokemon) {
        return {
            statusCode: 400,
            headers: {
                ...headers,
                'Content-Type': 'text/plain'
            },
            body: 'Missing Parameters in Body',
        };
    }

    const Item = {
        poketuber: POKETUBER,
        teamName,
        teamDateTs,
        pokepasteURL,
        spotlightPokemon,
        createdTs: new Date().toISOString(),
    }

    const params = {
        TableName: TEAM_TABLENAME,
        Item,
        ReturnValuesOnConditionCheckFailure: "ALL_OLD",
    };

    try {
        await dynamoDb.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(Item),
            headers
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.statusCode || 501,
            headers: {
                ...headers,
                'Content-Type': 'text/plain'
            },
            body: 'Couldn\'t create Team',
        };
    }
}