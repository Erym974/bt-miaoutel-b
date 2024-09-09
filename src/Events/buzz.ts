import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";

type StartingGameType = {
    id: string,
    playerId: string,
    amount: number
}

module.exports = {
    exec: async (io: any, socket: any, payload: StartingGameType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const party: PartyType | undefined = parties.get(payload.id);
        
        if(party) {
            const player : PlayerType | undefined = party.players.find(p => p.socket === socket.id);
            if(player) {
                if(!party.currentRound.includes(player) && !party.roundFinished && party.currentTrack.isPlaying) {
                    party.currentRound.push(player)
                    party.currentRoundScore[player.id] = 0;
                    console.log(party);
                    
                    io.to(`party#${party.id}`).emit("update_party", party)
                }
            }
        }
        

    }
}