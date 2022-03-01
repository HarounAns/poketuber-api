const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

const TEAM_TABLENAME = "pkmn-teams";
const SETS_TABLENAME = "pkmn-sets";

// TODO: if other PokeTubers join on refactor so it doesnt automatically use emvee
const POKETUBER = 'EMVEE';
const SET_TYPE = 'EMVEE_BDSP'

const config = {
    headers,
    TEAM_TABLENAME,
    SETS_TABLENAME,
    POKETUBER,
    SET_TYPE
};


module.exports = config;