const axios = require("axios");
const API_URL =
  "https://5z67gwmfbe.execute-api.us-east-1.amazonaws.com/dev/sets";

const teams = [
  {
    pokepasteURL: "https://pokepast.es/0a62480b3ab07cf7",
    teamDateTs: "2022-01-09T00:00:00.000Z",
    teamName: "Emvee Grumpig",
    createdTs: "2022-01-12T21:15:16.065Z",
    spotlightPokemon: "Grumpig",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/2a494def3df56ef7",
    teamDateTs: "2022-01-04T00:00:00.000Z",
    teamName: "Emvee Hypno",
    createdTs: "2022-01-05T23:55:53.999Z",
    spotlightPokemon: "Hypno",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/250eb7b70f0e761a",
    teamDateTs: "2021-12-30T00:00:00.000Z",
    teamName: "Emvee Pachirisu",
    createdTs: "2022-01-05T23:55:36.234Z",
    spotlightPokemon: "Pachirisu",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/386798908138a689",
    teamDateTs: "2021-12-27T00:00:00.000Z",
    teamName: "Emvee Stantler",
    createdTs: "2021-12-30T07:04:30.930Z",
    spotlightPokemon: "Stantler",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/3c1a8162f7b012a5",
    teamDateTs: "2021-12-23T00:00:00.000Z",
    teamName: "Emvee + Sacred Metronome Mew",
    createdTs: "2021-12-28T17:11:17.508Z",
    spotlightPokemon: "Mew",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/e054dd5e13715e98",
    teamDateTs: "2021-12-21T00:00:00.000Z",
    teamName: "Emvee Floatzel",
    createdTs: "2021-12-28T17:10:47.626Z",
    spotlightPokemon: "Floatzel",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/1be552ea0f82ab44",
    teamDateTs: "2021-12-16T00:00:00.000Z",
    teamName: "Emvee Carnivine",
    createdTs: "2021-12-18T19:29:18.569Z",
    spotlightPokemon: "Carnivine",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/caba0453fad1f847",
    teamDateTs: "2021-12-13T00:00:00.000Z",
    teamName: "Emvee Beautifly",
    createdTs: "2021-12-18T19:28:37.503Z",
    spotlightPokemon: "Beautifly",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/521574d04885802a",
    teamDateTs: "2021-12-09T00:00:00.000Z",
    teamName: "Emvee Bastiodon",
    createdTs: "2021-12-18T19:27:57.296Z",
    spotlightPokemon: "Bastiodon",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/4a686129ea50aafa",
    teamDateTs: "2021-12-05T00:00:00.000Z",
    teamName: "Emvee Staraptor",
    createdTs: "2021-12-18T19:25:28.504Z",
    spotlightPokemon: "Staraptor",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/af59cac02032ca8f",
    teamDateTs: "2021-12-02T00:00:00.000Z",
    teamName: "Emvee Camerupt",
    createdTs: "2021-12-18T19:22:32.292Z",
    spotlightPokemon: "Camerupt",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/a27093e083af663a",
    teamDateTs: "2021-11-30T00:00:00.000Z",
    teamName: "Emvee Ampharos",
    createdTs: "2021-12-18T19:18:55.616Z",
    spotlightPokemon: "Ampharos",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/44962ff355663fce",
    teamDateTs: "2021-11-28T00:00:00.000Z",
    teamName: "Emvee Ursaring",
    createdTs: "2021-12-18T19:18:00.372Z",
    spotlightPokemon: "Ursaring",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/c251da5896e6566c",
    teamDateTs: "2021-11-26T00:00:00.000Z",
    teamName: "Emvee Rampardos",
    createdTs: "2021-12-18T19:17:10.824Z",
    spotlightPokemon: "Rampardos",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/b162273116fd3106",
    teamDateTs: "2021-11-24T00:00:00.000Z",
    teamName: "Emvee Bibarel",
    createdTs: "2021-12-18T19:14:09.383Z",
    spotlightPokemon: "Bibarel",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/6dc0787f4d19f1e0",
    teamDateTs: "2021-11-22T00:00:00.000Z",
    teamName: "Emvee Yanmega",
    createdTs: "2021-12-20T01:14:53.502Z",
    spotlightPokemon: "Yanmega",
    poketuber: "EMVEE",
  },
  {
    pokepasteURL: "https://pokepast.es/84cf899dfa057467",
    teamDateTs: "2021-11-20T00:00:00.000Z",
    teamName: "Emvee Honchkrow",
    createdTs: "2021-12-18T19:12:49.364Z",
    spotlightPokemon: "Honchkrow",
    poketuber: "EMVEE",
  }
];

const addSets = async (pokepasteURL) => {
  return await axios.post(API_URL, { pokepasteURL });
};

const main = async () => {
  for (const team of teams) {
      try {
          const res = await addSets(team.pokepasteURL);
          console.log(res.status);
      } catch (error) {
          console.log('error with set', team);
          console.log(error);
      }
  }
};

main();
