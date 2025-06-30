"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.game = exports.Moves = void 0;
exports.initModels = initModels;
const moves_1 = require("./moves");
Object.defineProperty(exports, "Moves", { enumerable: true, get: function () { return moves_1.Moves; } });
const game_1 = require("./game");
Object.defineProperty(exports, "game", { enumerable: true, get: function () { return game_1.game; } });
const player_1 = require("./player");
Object.defineProperty(exports, "player", { enumerable: true, get: function () { return player_1.player; } });
function initModels(sequelize) {
    const Moves = moves_1.Moves.initModel(sequelize);
    const game = game_1.game.initModel(sequelize);
    const player = player_1.player.initModel(sequelize);
    Moves.belongsTo(game, { as: "game", foreignKey: "gameId" });
    game.hasMany(Moves, { as: "Moves", foreignKey: "gameId" });
    Moves.belongsTo(player, { as: "player", foreignKey: "playerId" });
    player.hasMany(Moves, { as: "Moves", foreignKey: "playerId" });
    game.belongsTo(player, { as: "creator", foreignKey: "creator_id" });
    player.hasMany(game, { as: "games", foreignKey: "creator_id" });
    game.belongsTo(player, { as: "winner", foreignKey: "winner_id" });
    player.hasMany(game, { as: "winner_games", foreignKey: "winner_id" });
    return {
        Moves: Moves,
        game: game,
        player: player,
    };
}
