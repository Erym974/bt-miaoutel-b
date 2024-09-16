import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType";
import { PlayerType } from "../Types/PlayerType";
import createParty from "../Functions/createParty";

type RestartGameType = {
  id: string;
  newParty: string | undefined;
};

module.exports = {
  exec: async (
    io: any,
    socket: any,
    payload: RestartGameType,
    parties: Map<string, PartyType>,
    players: Map<string, PlayerType>
  ) => {
    const party: PartyType | undefined = parties.get(payload.id);

    if (party) {
      const player: PlayerType | undefined = party.players.find(
        (p) => p.socket === socket.id
      );

      if (player && player.id === party.host.id) {

        const newParty = createParty(player, parties);

        parties.set(newParty.id, newParty);
        player.score = 0;
        socket.leave(`party#${party.id}`);
        socket.join(`party#${newParty.id}`);
        socket.emit("response#restart", newParty);

        io.to(`party#${party.id}`).emit("new_game_available", newParty);
      } else {
        if (payload.newParty && player) {
          const newParty: PartyType | undefined = parties.get(payload.newParty);

          if (newParty) {
            newParty.players.push(player);
            player.score = 0;
            socket.leave(`party#${party.id}`);
            socket.emit("response#restart", newParty);
            socket.join(`party#${newParty.id}`);
            socket.broadcast.to(`party#${newParty.id}`).emit("update_party", newParty);
          }
        }
      }
    }
  },
};
