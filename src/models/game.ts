import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Moves, MovesId } from './moves';
import type { player, playerId } from './player';

export interface gameAttributes {
  id: string;
  type: "PVP" | "PVE";
  state: "ONGOING" | "FINISHED" | "ABANDONED";
  current_turn_user: string;
  creator_id: string;
  opponent_id?: string;
  grid_creator: object;
  grid_opponent?: object;
  winner_id?: string | null ;
} 

export type gamePk = "id";
export type gameId = game[gamePk];
export type gameOptionalAttributes = "id" | "state" | "opponent_id" | "grid_opponent" | "winner_id";
export type gameCreationAttributes = Optional<gameAttributes, gameOptionalAttributes>;

export class game extends Model<gameAttributes, gameCreationAttributes> implements gameAttributes {
  id!: string;
  type!: "PVP" | "PVE";
  state!: "ONGOING" | "FINISHED" | "ABANDONED";
  current_turn_user!: string;
  creator_id!: string;
  opponent_id?: string;
  grid_creator!: object;
  grid_opponent?: object;
  winner_id?: string;


  // game hasMany Moves via gameId
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
  // game belongsTo player via creator_id
  creator!: player;
  getCreator!: Sequelize.BelongsToGetAssociationMixin<player>;
  setCreator!: Sequelize.BelongsToSetAssociationMixin<player, playerId>;
  createCreator!: Sequelize.BelongsToCreateAssociationMixin<player>;
  // game belongsTo player via winner_id
  winner!: player;
  getWinner!: Sequelize.BelongsToGetAssociationMixin<player>;
  setWinner!: Sequelize.BelongsToSetAssociationMixin<player, playerId>;
  createWinner!: Sequelize.BelongsToCreateAssociationMixin<player>;

  static initModel(sequelize: Sequelize.Sequelize): typeof game {
    return game.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      type: {
        type: DataTypes.ENUM("PVP", "PVE"),
        allowNull: false
      },
      state: {
        type: DataTypes.ENUM("ONGOING", "FINISHED", "ABANDONED"),
        allowNull: false,
        defaultValue: "ONGOING"
      },
      current_turn_user: {
        type: DataTypes.UUID,
        allowNull: false
      },
      creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'player',
          key: 'id'
        }
      },
      opponent_id: {
        type: DataTypes.UUID,
        //allowNull: true QUI CAMBIO PUO DARE ERRORE, in particolare se trova righe con id nullo va in errore quindi devi resettare il db forse
        allowNull: false,
        references: {
          model: 'player',
          key: 'id'
        }
      },
      grid_creator: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      grid_opponent: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      winner_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'player',
          key: 'id'
        }
      },
    }, {
    sequelize,
    tableName: 'game',
    timestamps:false,
    schema: 'public',
    indexes: [
      {
        name: "game_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
