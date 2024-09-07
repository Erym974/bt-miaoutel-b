import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType";
import { PlayerType } from "../Types/PlayerType";

module.exports = {
  exec: async (
    io: any,
    socket: any,
    payload: any,
    parties: Map<string, PartyType>,
    players: Map<string, PlayerType>
  ) => {
    const player: PlayerType | undefined = players.get(socket.id);

    if (player) {
      let party: PartyType | null = null;

      for (let [key, value] of parties) {
        if (value.players.find((p) => p.id === player.id)) {
          party = value;
          break;
        }
      }

      if (party) {
        switch (party.gameState) {
          case "Game":

            player.connected = false;
            party.players = party.players.map((p : PlayerType) => 
                p.id === player.id ? { ...p, connected: false } : p
              );

              party.currentTrack.isPlaying = false;

              if(party.host.socket === socket.id) {
                party.host.connected = false;
              }
            io.to(`party#${party.id}`).emit("player_disconnect", player);
            io.to(`party#${party.id}`).emit("update_party", party);
            break;
          default:
            party.players = party.players.filter((p) => p.id !== player.id);
            if(party.host.socket === socket.id) {
              if(party.players.length > 0) {
                party.host = party.players[0];
              } else {
                parties.delete(party.id);
              }
            }
            io.to(`party#${party.id}`).emit("update_party", party);
            break;
        }
      } else {
        console.log(`Player ${player.id} disconnected`);
        players.delete(player.socket);
      }
    }
  },
};
