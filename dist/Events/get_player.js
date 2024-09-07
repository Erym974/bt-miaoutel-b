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
        if (players.has(socket.id)) {
            socket.emit("response#get_player", players.get(socket.id));
        }
        else {
            if (payload.oldPlayer) {
                if (players.has(payload.oldPlayer.socket)) {
                    players.set(socket.id, Object.assign(Object.assign({}, payload.oldPlayer), { socket: socket.id, connected: false }));
                    players.delete(payload.oldPlayer.socket);
                    socket.emit("response#get_player", players.get(socket.id));
                }
            }
            else {
                socket.emit("response#get_player", undefined);
            }
        }
    })
};
