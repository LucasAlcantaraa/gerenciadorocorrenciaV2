const { DataTypes } = require('sequelize');
const { db } = require('../database/conexao');

const Token = db.define('token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    validade: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

module.exports = Token;
