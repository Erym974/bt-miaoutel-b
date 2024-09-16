import ShortUniqueId from "short-unique-id";
import { PlayerType } from "../Types/PlayerType";
import { GameMode, GameState, PartyType } from "../Types/PartyType";

export default function createParty(host: PlayerType, parties: Map<string, PartyType>) {

    const uidGenerator = new ShortUniqueId({ length: 6 });
    let uid = uidGenerator.rnd();

    while(parties.has(uid)) {
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
        gameState: GameState.Lobby,
        mode: GameMode.Individual,
        playersTeams: new Map<string, number>(),
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
    }

    return party;

}