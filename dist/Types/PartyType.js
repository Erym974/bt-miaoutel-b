"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMode = exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState["Game"] = "Game";
    GameState["Lobby"] = "Lobby";
    GameState["Scoreboard"] = "Scoreboard";
})(GameState || (exports.GameState = GameState = {}));
var GameMode;
(function (GameMode) {
    GameMode["Individual"] = "Individual";
    GameMode["Team"] = "Team";
})(GameMode || (exports.GameMode = GameMode = {}));
