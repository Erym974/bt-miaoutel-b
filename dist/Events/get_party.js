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
        const party = parties.get(payload);
        const player = players.get(socket.id);
        if (party && player) {
            const isRelog = !player.connected;
            if (party.players.map((p) => p.id).includes(player.id)) {
                party.players = party.players.map((p) => player.id === p.id ? Object.assign(Object.assign({}, p), { socket: socket.id, connected: true }) : p);
                party.currentTrack.isPlaying = false;
                if (party.host.id === player.id) {
                    party.host.socket = socket.id;
                    party.host.connected = true;
                }
                if (isRelog) {
                    io.to(`party#${party.id}`).emit("player_connected", player);
                }
                socket.join(`party#${party.id}`);
                socket.broadcast.to(`party#${party.id}`).emit("update_party", party);
                return socket.emit("response#get_party", party);
            }
            else {
                return socket.emit("response#get_party", null);
            }
        }
        else {
            socket.emit("response#get_party", null);
        }
    }),
};
