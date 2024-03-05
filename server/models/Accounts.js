const { DataTypes } = require('sequelize');
const { db } = require('../database/conexao');

const Accounts= db.define('accounts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    administrador:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
    
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});


module.exports = Accounts;
