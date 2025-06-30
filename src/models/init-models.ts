import type { Sequelize } from "sequelize";
import { Moves as _Moves } from "./moves";
import type { MovesAttributes, MovesCreationAttributes } from "./moves";
import { game as _game } from "./game";
import type { gameAttributes, gameCreationAttributes } from "./game";
import { player as _player } from "./player";
import type { playerAttributes, playerCreationAttributes } from "./player";

export {
  _Moves as Moves,
  _game as game,
  _player as player,
};

export type {
  MovesAttributes,
  MovesCreationAttributes,
  gameAttributes,
  gameCreationAttributes,
  playerAttributes,
  playerCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Moves = _Moves.initModel(sequelize);
  const game = _game.initModel(sequelize);
  const player = _player.initModel(sequelize);

  Moves.belongsTo(game, { as: "game", foreignKey: "gameId"});
  game.hasMany(Moves, { as: "Moves", foreignKey: "gameId"});
  Moves.belongsTo(player, { as: "player", foreignKey: "playerId"});
  player.hasMany(Moves, { as: "Moves", foreignKey: "playerId"});
  game.belongsTo(player, { as: "creator", foreignKey: "creator_id"});
  player.hasMany(game, { as: "games", foreignKey: "creator_id"});
  game.belongsTo(player, { as: "winner", foreignKey: "winner_id"});
  player.hasMany(game, { as: "winner_games", foreignKey: "winner_id"});

  return {
    Moves: Moves,
    game: game,
    player: player,
  };
}
