import ShortUniqueId from "short-unique-id";
import { GameMode, PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";
import { TeamType } from "../Types/TeamType";

type EndTurnType = {
    id: string
}

module.exports = {
    exec: async (io: any, socket: any, payload: EndTurnType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const party: PartyType | undefined = parties.get(payload.id);

        if(party) {

            const player : PlayerType | undefined = party.players.find(p => p.socket === socket.id);

            if(player && player.id === party.host.id) {
                for (const [playerId, amount] of Object.entries(party.currentRoundScore)) {
                    if (amount !== 0) {
                        party.players = party.players.map(p => {
                            if (p.id === playerId) {
                                p.score += amount;
                            }
                            return p;
                        });
                    }
                }

                if(party.mode === GameMode.Team) {
                    party.teams.forEach((team: TeamType) => {
                        team.score = 0;
                        team.players.forEach(playerId => {
                            const player = party.players.find(p => p.id === playerId);
                            if(player) {
                                team.score += player.score;
                            }
                        })
                    })
                }

                party.currentRoundScore = {};
                party.roundFinished = false;
                party.currentTrack.isPlaying = true;
                party.currentRound = [];
                party.players = party.players.sort((a, b) => b.score - a.score)
                io.to(`party#${party.id}`).emit("update_party", party)
            }
        } 

    }
}