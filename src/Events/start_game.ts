import ShortUniqueId from "short-unique-id";
import { GameMode, GameState, PartyType } from "../Types/PartyType"
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

            if(player && player.id === party.host.id && (party.mode === GameMode.Individual || (party.teams[0].players.length > 0 && party.teams[1].players.length > 0))) {
                
                const response = await fetch("https://submagic-free-tools.fly.dev/api/youtube-info", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        url: payload.url
                    }),
                })

                const data = await response.json()

                if(data?.error) {
                    socket.emit("response#start_game", { error: "Lien youtube non detecté"})
                } else {

                    if(data?.formats.length === 0) {
                        socket.emit("response#start_game", { error: "Aucun format de vidéo."})
                    } else {
                        party.gameState = GameState.Game
                        party.currentTrack.url = data?.formats[0]?.url
                        io.to(`party#${party.id}`).emit("update_party", party)
                    }
                }
            }
        }
        

    }
}