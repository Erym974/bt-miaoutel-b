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
        const party = parties.get(payload.id);
        if (party) {
            const player = players.get(socket.id);
            if (!player) {
                return;
            }
            let username = payload.profile.username;
            let filteredValue = username.replace(/[^a-zA-Z0-9]/g, '');
            if (filteredValue.length === 0) {
                filteredValue = `Guest${Math.floor(Math.random() * 9999) + 1000}`;
            }
            player.username = filteredValue.substring(0, 14);
            const maxPicture = parseInt(process.env.MAX_PICTURE, 10);
            const baseURL = process.env.BACK_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`^${baseURL}\\/profile_(\\d+)\\.jpg$`);
            const match = payload.profile.profile.match(regex);
            if (match) {
                const number = parseInt(match[1], 10);
                // Vérifier que le nombre est dans la plage valide
                if (number >= 1 && number <= maxPicture) {
                    player.profile = payload.profile.profile;
                }
                else {
                    player.profile = `${process.env.BACK_URL}/profile_1.jpg`;
                }
            }
            else {
                player.profile = `${process.env.BACK_URL}/profile_1.jpg`;
            }
            party.players.push(player);
            if (party.mode === PartyType_1.GameMode.Team) {
                if (party.teams[0].players.length <= party.teams[1].players.length) {
                    party.teams[0].players.push(player.id);
                }
                else {
                    party.teams[1].players.push(player.id);
                }
            }
            socket.join(`party#${party.id}`);
            socket.broadcast.to(`party#${party.id}`).emit('update_party', party);
        }
        return socket.emit("response#join_party", party);
    })
};
