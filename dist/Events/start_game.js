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
const PartyType_1 = require("../Types/PartyType");
module.exports = {
    exec: (io, socket, payload, parties, players) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const party = parties.get(payload.id);
        if (party) {
            const player = party.players.find(p => p.socket === socket.id);
            if (player && player.id === party.host.id && (party.mode === PartyType_1.GameMode.Individual || (party.teams[0].players.length > 0 && party.teams[1].players.length > 0))) {
                const response = yield fetch("https://submagic-free-tools.fly.dev/api/youtube-info", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        url: payload.url
                    }),
                });
                const data = yield response.json();
                if (data === null || data === void 0 ? void 0 : data.error) {
                    socket.emit("response#start_game", { error: "Lien youtube non detecté" });
                }
                else {
                    if ((data === null || data === void 0 ? void 0 : data.formats.length) === 0) {
                        socket.emit("response#start_game", { error: "Aucun format de vidéo." });
                    }
                    else {
                        party.gameState = PartyType_1.GameState.Game;
                        party.currentTrack.url = (_a = data === null || data === void 0 ? void 0 : data.formats[0]) === null || _a === void 0 ? void 0 : _a.url;
                        io.to(`party#${party.id}`).emit("update_party", party);
                    }
                }
            }
        }
    })
};
