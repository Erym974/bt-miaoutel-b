"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createParty;
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const PartyType_1 = require("../Types/PartyType");
function createParty(host, parties) {
    const uidGenerator = new short_unique_id_1.default({ length: 6 });
    let uid = uidGenerator.rnd();
    while (parties.has(uid)) {
        uid = uidGenerator.rnd();
    }
    uid = uid.toUpperCase();
    const party = {
        id: uid,
        host: host,
        players: [host],
        currentTrack: {
            url: "",
            duration: 0,
            currentTime: 0,
            isPlaying: false,
        },
        scoreboard: [],
        currentRound: [],
        currentRoundScore: {},
        roundFinished: false,
        gameState: PartyType_1.GameState.Lobby,
        mode: PartyType_1.GameMode.Individual,
        playersTeams: new Map(),
        teams: [
            {
                name: "Rouge",
                players: [],
                score: 0,
                color: "#ff0000"
            },
            {
                name: "Bleu",
                players: [],
                score: 0,
                color: "#2196F3"
            }
        ],
    };
    return party;
}
