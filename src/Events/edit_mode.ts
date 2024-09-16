import ShortUniqueId from "short-unique-id";
import { GameMode, PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";

type SwitchModeType = {
    id: string,
    mode: GameMode
}

module.exports = {
    exec: async (io: any, socket: any, payload: SwitchModeType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const party: PartyType | undefined = parties.get(payload.id);

        if(party) {
            const player : PlayerType | undefined = party.players.find(p => p.socket === socket.id);

            if(player && player.id === party.host.id) {

                switch(payload.mode) {
                    case GameMode.Team:
                        party.mode = GameMode.Team;
                        // repartir les joueurs en 2 équipes
                        const players = party.players;
                        const first_team = players.slice(0, players.length / 2);
                        const second_team = players.slice(players.length / 2);
                        party.teams[0].players = first_team.map(player => player.id);
                        party.teams[1].players = second_team.map(player => player.id);
                        break;
                    default:
                        party.mode = GameMode.Individual;
                        party.teams[0] = {...party.teams[0], players: [], score: 0};
                        party.teams[1] = {...party.teams[1], players: [], score: 0};
                        break;
                }

                io.to(`party#${party.id}`).emit("update_party", party);

                console.log(party);
                
            }
        }
        

    }
}