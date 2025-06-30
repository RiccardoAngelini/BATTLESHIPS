"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = void 0;
const sequelize_1 = require("sequelize");
class player extends sequelize_1.Model {
    static initModel(sequelize) {
        return player.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            email: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                unique: "player_email_key"
            },
            password: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            role: {
                type: sequelize_1.DataTypes.ENUM("USER", "ADMIN"),
                allowNull: false,
                defaultValue: "USER"
            },
            tokens: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0.0
            },
            score: {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0
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
exports.player = player;
