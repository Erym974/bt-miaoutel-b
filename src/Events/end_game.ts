import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";

type EndGameType = {
    id: string
}

module.exports = {
    exec: async (io: any, socket: any, payload: EndGameType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const party: PartyType | undefined = parties.get(payload.id);

        if(party) {

            const player : PlayerType | undefined = party.players.find(p => p.socket === socket.id);

            if(player && player.id === party.host.id) {
                party.gameState = "Scoreboard"
                party.scoreboard = party.players;
                io.to(`party#${party.id}`).emit("update_party", party)
            }
        }

    }
}