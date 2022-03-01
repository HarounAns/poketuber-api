const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const axios = require("axios");

const { headers, SETS_TABLENAME, SET_TYPE } = require("./config");

const getSetCount = async () => {
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
  return parseInt(count);
};

const updateSetCount = async (count) => {
  const params = {
    TableName: SETS_TABLENAME,
    Key: {
      PK: "SET_COUNT",
      SK: SET_TYPE,
    },
    UpdateExpression: "set #co = :c",
    ExpressionAttributeValues: {
      ":c": count,
    },
    ExpressionAttributeNames: {
      "#co": "count",
    },
    ReturnValues: "UPDATED_NEW",
  };

  const res = await dynamoDb.update(params).promise();
  console.log("res");
  console.log(res);
};

const isOnlyWhitespace = (str) => {
  return Boolean(!str.replace(/\s/g, "").length);
};

const convertPokePasteURLToSets = async (pokepasteURL) => {
  const {
    data: { paste },
  } = await axios.get(`${pokepasteURL}/json`);

  // get pokemon from paste
  const blocks = paste.split("\n\r");
  const moveSets = [];

  for (const block of blocks) {
    if (isOnlyWhitespace(block)) continue;

    const moveSet = {
      pokemon: null,
      paste: null,
      abilities: [],
      items: [],
      moveslots: [],
      natures: [],
      evconfigs: [],
    };

    const pokemon = block.split("@")[0].trim();
    const item = block.split("@ ")[1].split("\r\n")[0].trim();
    const ability = block.split("Ability: ")[1].split("\r\n")[0].trim();
    const nature = block.split(" Nature")[0].split("\r\n").pop();
    const moves = block.split("- ");
    const evString = block.split("EVs: ")[1].split("\r\n")[0];
    const evconfig = convertEVStringToEVConfig(evString);
    moves.shift();

    const moveslots = [];
    for (const i in moves) {
      move = moves[i].trim();
      const moveslot = { move, type: null };
      moveslots.push(moveslot);
    }

    moveSet.pokemon = pokemon;
    moveSet.paste = block.trim();
    moveSet.abilities.push(ability);
    moveSet.items.push(item);
    moveSet.moveslots.push([...moveslots]);
    moveSet.natures.push(nature);
    moveSet.evconfigs.push(evconfig);

    moveSets.push(moveSet);
  }

  return moveSets;
};

const convertEVStringToEVConfig = (evString) => {
  const evs = evString.split(" / ");
  const evConfig = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

  for (const ev of evs) {
    const [value, type] = ev.split(" ");
    evConfig[type.toLowerCase()] = parseInt(value);
  }
  return evConfig;
};

const addSetToDynamo = async (set, id) => {
  const Item = {
    PK: `${SET_TYPE}_SET`,
    SK: id.toString(),
    set,
  };

  const params = {
    TableName: SETS_TABLENAME,
    Item,
    ReturnValuesOnConditionCheckFailure: "ALL_OLD",
  };

  await dynamoDb.put(params).promise();
};

// const updateSetCount = ays

module.exports.handler = async (event) => {
  const { pokepasteURL } = JSON.parse(event.body);

  if (!pokepasteURL) {
    return {
      statusCode: 400,
      headers: {
        ...headers,
        "Content-Type": "text/plain",
      },
      body: "Missing PokePaste URL in Body",
    };
  }

  // get count
  const count = await getSetCount();

  // convert pokepaste to different sets
  const sets = await convertPokePasteURLToSets(pokepasteURL);
  console.log("sets");
  console.log(sets);

  const promiseList = [];
  for (const i in sets) {
    promiseList.push(addSetToDynamo(sets[i], count + parseInt(i) + 1));
  }

  const results = await Promise.allSettled(promiseList);

  let createdCount = 0;
  let statusCode = 200;
  for (const result of results) {
    const { status } = result;
    if (status === "rejected") {
      statusCode = 500;
      continue;
    }
    createdCount++;
  }
  console.log("results");
  console.log(results);
  console.log("createdCount");
  console.log(createdCount);

  try {
    await updateSetCount(count + createdCount);
  } catch (error) {
    // TODO: add alarm
    console.error("Could not update Set Count", error);
  }

  return {
    statusCode,
    body: JSON.stringify(results),
    headers,
  };
};
