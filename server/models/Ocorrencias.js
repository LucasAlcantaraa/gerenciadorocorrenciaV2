const { DataTypes } = require('sequelize');
const { db } = require('../database/conexao');

const Ocorrencias = db.define('ocorrencias', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    numeroocorrencia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricaoocorrencia: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    idclienteocorrencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dataocorrencia: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    versaoerro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    setor: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    responsavel: {
        type: DataTypes.STRING,
        allowNull: true,
    }

}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

Ocorrencias.associate = (models) => {
    Ocorrencias.hasOne(models.Solucionadas, {
        foreignKey: 'idocorrencia',
    });
    Ocorrencias.belongsTo(models.Clientes, {
        foreignKey: 'idclienteocorrencia',
    });


};

module.exports = Ocorrencias;
