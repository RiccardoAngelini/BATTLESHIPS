"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = void 0;
const sequelize_1 = require("sequelize");
class game extends sequelize_1.Model {
    static initModel(sequelize) {
        return game.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("PVP", "PVE"),
                allowNull: false
            },
            state: {
                type: sequelize_1.DataTypes.ENUM("ONGOING", "FINISHED", "ABANDONED"),
                allowNull: false,
                defaultValue: "ONGOING"
            },
            current_turn_user: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false
            },
            creator_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'player',
                    key: 'id'
                }
            },
            opponent_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true
            },
            grid_creator: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false
            },
            grid_opponent: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true
            },
            winner_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'player',
                    key: 'id'
                }
            },
        }, {
            sequelize,
            tableName: 'game',
            timestamps: false,
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
exports.game = game;
