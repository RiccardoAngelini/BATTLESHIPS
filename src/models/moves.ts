import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { game, gameId } from './game';
import type { player, playerId } from './player';

export interface MovesAttributes {
  id: number;
  gameId: string;
  playerId: string | null;
  x?: number;
  y?: number;
  result: "HIT" | "WATER" | "SUNK";
  turnNumber?: number;
}

export type MovesPk = "id";
export type MovesId = Moves[MovesPk];
export type MovesOptionalAttributes = "id" | "x" | "y" | "turnNumber" ;
export type MovesCreationAttributes = Optional<MovesAttributes, MovesOptionalAttributes>;

export class Moves extends Model<MovesAttributes, MovesCreationAttributes> implements MovesAttributes {
  id!: number;
  gameId!: string;
  playerId!: string| null;
  x?: number;
  y?: number;
  result!: "HIT" | "WATER" | "SUNK";
  turnNumber?: number;
 

  // Moves belongsTo game via gameId
  game!: game;
  getGame!: Sequelize.BelongsToGetAssociationMixin<game>;
  setGame!: Sequelize.BelongsToSetAssociationMixin<game, gameId>;
  createGame!: Sequelize.BelongsToCreateAssociationMixin<game>;
  // Moves belongsTo player via playerId
  player!: player;
  getPlayer!: Sequelize.BelongsToGetAssociationMixin<player>;
  setPlayer!: Sequelize.BelongsToSetAssociationMixin<player, playerId>;
  createPlayer!: Sequelize.BelongsToCreateAssociationMixin<player>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Moves {
    return Moves.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    gameId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'game',
        key: 'id'
      }
    },
    playerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'player',
        key: 'id'
      }
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    result: {
      type: DataTypes.ENUM("HIT","WATER","SUNK"),
      allowNull: false
    },
    turnNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Moves',
    schema: 'public',
    timestamps: false, 
    indexes: [
      {
        name: "Moves_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
