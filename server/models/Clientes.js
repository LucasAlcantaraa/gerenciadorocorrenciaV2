const { DataTypes } = require('sequelize');
const { db } = require('../database/conexao');

const Clientes= db.define('clientes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    codigoparceiro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    telefone2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bairro: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cep: {
        type: DataTypes.STRING,
        allowNull: true,
    }

}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

Clientes.associate = (models) => {
    Clientes.hasMany(models.Ocorrencias, {
        foreignKey: 'idclienteocorrencia',
    });
};

module.exports = Clientes;
