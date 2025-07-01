"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moves = void 0;
const sequelize_1 = require("sequelize");
class Moves extends sequelize_1.Model {
    static initModel(sequelize) {
        return Moves.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            gameId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'game',
                    key: 'id'
                }
            },
            playerId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'player',
                    key: 'id'
                }
            },
            x: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            y: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            result: {
                type: sequelize_1.DataTypes.ENUM("HIT", "WATER", "SUNK"),
                allowNull: false
            },
            turnNumber: {
                type: sequelize_1.DataTypes.INTEGER,
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
exports.Moves = Moves;
