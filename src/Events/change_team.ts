import ShortUniqueId from "short-unique-id";
import { GameMode, PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";
import { TeamType } from "../Types/TeamType";

type SwitchTeamType = {
    id: string,
    newTeam: number,
}

module.exports = {
    exec: async (io: any, socket: any, payload: SwitchTeamType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const party: PartyType | undefined = parties.get(payload.id);
        
        if(party && party.mode === GameMode.Team) {
            const player : PlayerType | undefined = party.players.find(p => p.socket === socket.id);
            if(player) {

                const newTeam = payload.newTeam;
                party.teams.forEach((team: TeamType) => {
                    if(team.players.includes(player.id)) {
                        team.players = team.players.filter(p => p !== player.id);
                    }
                });
                party.teams[newTeam].players.push(player.id);

                io.to(`party#${party.id}`).emit("update_party", party);
            }
        }
        

    }
}