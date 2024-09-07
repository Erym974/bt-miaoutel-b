import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";

type StartingGameType = {
    id: string,
    url: string
}

module.exports = {
    exec: async (io: any, socket: any, payload: StartingGameType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const party: PartyType | undefined = parties.get(payload.id);

        if(party) {
            const player : PlayerType | undefined = party.players.find(p => p.socket === socket.id);

            if(player && player.id === party.host.id) {
                party.gameState = "Game"
                party.currentTrack.url = payload.url
                io.to(`party#${party.id}`).emit("update_party", party)
            }
        }
        

    }
}