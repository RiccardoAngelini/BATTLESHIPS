import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Moves, MovesId } from './moves';
import type { game, gameId } from './game';

export interface playerAttributes {
  id: string;
  name?: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  tokens: number;
  score: number;
}

export type playerPk = "id";
export type playerId = player[playerPk];
export type playerOptionalAttributes = "id" | "role" | "tokens" | "score" | "name";
export type playerCreationAttributes = Optional<playerAttributes, playerOptionalAttributes>;



export class player extends Model<playerAttributes, playerCreationAttributes> implements playerAttributes {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  role!: "USER" | "ADMIN";
  tokens!: number;
  score!: number;
 

  // player hasMany Moves via playerId
  Moves!: Moves[];
  getMoves!: Sequelize.HasManyGetAssociationsMixin<Moves>;
  setMoves!: Sequelize.HasManySetAssociationsMixin<Moves, MovesId>;
  addMove!: Sequelize.HasManyAddAssociationMixin<Moves, MovesId>;
  addMoves!: Sequelize.HasManyAddAssociationsMixin<Moves, MovesId>;
  createMove!: Sequelize.HasManyCreateAssociationMixin<Moves>;
  removeMove!: Sequelize.HasManyRemoveAssociationMixin<Moves, MovesId>;
  removeMoves!: Sequelize.HasManyRemoveAssociationsMixin<Moves, MovesId>;
  hasMove!: Sequelize.HasManyHasAssociationMixin<Moves, MovesId>;
  hasMoves!: Sequelize.HasManyHasAssociationsMixin<Moves, MovesId>;
  countMoves!: Sequelize.HasManyCountAssociationsMixin;
  // player hasMany game via creator_id
  games!: game[];
  getGames!: Sequelize.HasManyGetAssociationsMixin<game>;
  setGames!: Sequelize.HasManySetAssociationsMixin<game, gameId>;
  addGame!: Sequelize.HasManyAddAssociationMixin<game, gameId>;
  addGames!: Sequelize.HasManyAddAssociationsMixin<game, gameId>;
  createGame!: Sequelize.HasManyCreateAssociationMixin<game>;
  removeGame!: Sequelize.HasManyRemoveAssociationMixin<game, gameId>;
  removeGames!: Sequelize.HasManyRemoveAssociationsMixin<game, gameId>;
  hasGame!: Sequelize.HasManyHasAssociationMixin<game, gameId>;
  hasGames!: Sequelize.HasManyHasAssociationsMixin<game, gameId>;
  countGames!: Sequelize.HasManyCountAssociationsMixin;
  // player hasMany game via winner_id
  winner_games!: game[];
  getWinner_games!: Sequelize.HasManyGetAssociationsMixin<game>;
  setWinner_games!: Sequelize.HasManySetAssociationsMixin<game, gameId>;
  addWinner_game!: Sequelize.HasManyAddAssociationMixin<game, gameId>;
  addWinner_games!: Sequelize.HasManyAddAssociationsMixin<game, gameId>;
  createWinner_game!: Sequelize.HasManyCreateAssociationMixin<game>;
  removeWinner_game!: Sequelize.HasManyRemoveAssociationMixin<game, gameId>;
  removeWinner_games!: Sequelize.HasManyRemoveAssociationsMixin<game, gameId>;
  hasWinner_game!: Sequelize.HasManyHasAssociationMixin<game, gameId>;
  hasWinner_games!: Sequelize.HasManyHasAssociationsMixin<game, gameId>;
  countWinner_games!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof player {
    return player.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: "player_email_key"
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM("USER", "ADMIN"),
        allowNull: false,
        defaultValue: "USER"
      },
      tokens: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
      },
      score: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
      },

    }, {
    sequelize,
    tableName: 'player',
    schema: 'public', 
    timestamps: false,   
    indexes: [
      {
        name: "player_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "player_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
  
}
