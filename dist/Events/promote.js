"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    exec: (io, socket, payload, parties, players) => __awaiter(void 0, void 0, void 0, function* () {
        const party = parties.get(payload.id);
        if (party) {
            const player = party.players.find(p => p.socket === socket.id);
            if (player && player.id === party.host.id) {
                const kickedPlayer = players.get(payload.player.socket);
                if (kickedPlayer) {
                    party.players = party.players.filter(p => p.id !== kickedPlayer.id);
                    let kickedPlayerSocket = io.sockets.sockets.get(kickedPlayer.socket);
                    if (kickedPlayerSocket) {
                        kickedPlayerSocket.leave(`party#${party.id}`);
                        socket.to(kickedPlayerSocket.id).emit('kicked_by_host');
                    }
                    else {
                        console.error(`Socket for kicked player ${kickedPlayer.socket} not found.`);
                    }
                    io.to(`party#${party.id}`).emit('update_party', party);
                }
            }
        }
    })
};
