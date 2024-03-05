const { DataTypes } = require('sequelize');
const { db } = require('../database/conexao');

const Solucionadas = db.define('solucionadas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idocorrencia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    versaosolucao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    basetestada: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    procedimentos: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    resolvida: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});
Solucionadas.associate = (models) => {
    Solucionadas.belongsTo(models.Ocorrencias, {
        foreignKey: 'idocorrencia',
        targetKey: 'id',
    });
};

module.exports = Solucionadas;
