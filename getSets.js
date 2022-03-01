const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { headers, SETS_TABLENAME, SET_TYPE } = require("./config");

const getCount = async () => {
  const params = {
    TableName: SETS_TABLENAME,
    KeyConditionExpression: "PK = :pk AND SK = :sk",
    ExpressionAttributeValues: {
      ":pk": "SET_COUNT",
      ":sk": SET_TYPE,
    },
    ScanIndexForward: false,
  };

  const { Items } = await dynamoDb.query(params).promise();
  const { count } = Items[0];
  return count;
};

const getSixRandomNums = (max) => {
  const nums = [];
  while (nums.length < 6) {
    const num = Math.floor(Math.random() * max);
    if (nums.includes(num)) continue;
    nums.push(num);
  }
  return nums;
};

module.exports.handler = async (event) => {
  // get count
  const count = await getCount();
  const pokemonList = [];
  const sets = [];

  let i = 0;
  while (sets.length < 6) {
    const randomNums = getSixRandomNums(count);
  
    const Keys = randomNums.map((SK) => {
      return {
        PK: `${SET_TYPE}_SET`,
        SK: SK.toString(),
      };
    });
  
    console.log("Keys");
    console.log(Keys);
  
    const params = {
      RequestItems: {
        [SETS_TABLENAME]: {
          Keys,
        },
      },
    };
  
    console.log(params);
    const res = await dynamoDb.batchGet(params).promise();
    const batch = res.Responses["pkmn-sets"];

    for (const b of batch) {
      const { set } = b;
      if (pokemonList.includes(set.pokemon)) 
        continue;

      pokemonList.push(set.pokemon);
      sets.push(b);
    }
    i++;
    
    if (i > 10) {
      throw("Can't find unique pokemon");
    }
  }

  // TODO: handle duplicates of the same Pokemon
  

  return {
    statusCode: 200,
    body: JSON.stringify(sets),
    headers,
  };
};
