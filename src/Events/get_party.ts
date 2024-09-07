import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType";
import { PlayerType } from "../Types/PlayerType";

module.exports = {
  exec: async (
    io: any,
    socket: any,
    payload: string,
    parties: Map<string, PartyType>,
    players: Map<string, PlayerType>
  ) => {
    const party: PartyType | undefined = parties.get(payload);
    const player: PlayerType | undefined = players.get(socket.id);

    if (party && player) {

      const isRelog = !player.connected;
      

      if (party.players.map((p: PlayerType) => p.id).includes(player.id)) {
        party.players = party.players.map((p: PlayerType) =>
          player.id === p.id ? { ...p, socket: socket.id, connected: true } : p
        );

        party.currentTrack.isPlaying = false;

        if (party.host.id === player.id) {
          party.host.socket = socket.id;
          party.host.connected = true;
        }

        if(isRelog) {
          io.to(`party#${party.id}`).emit("player_connected", player);
        }

        socket.join(`party#${party.id}`);
        socket.broadcast.to(`party#${party.id}`).emit("update_party", party);
        return socket.emit("response#get_party", party);
      } else {
        return socket.emit("response#get_party", null);
      }
    } else {
      socket.emit("response#get_party", null);
    }
  },
};
