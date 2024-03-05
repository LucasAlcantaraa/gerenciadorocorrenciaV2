const { DataTypes } = require('sequelize');
const { db } = require('../database/conexao');

const Relatorios= db.define('relatorios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },

}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

// CadOg1Web.associate = (models) => {
//     CadOg1Web.hasOne(models.Parametro, {
//         foreignKey: 'cnpj',
//     });
//     CadOg1Web.hasMany(models.Modulo, {
//         foreignKey: 'cnpj',
//     });
//     CadOg1Web.hasMany(models.ClienteVendas, {
//       foreignKey: 'cnpj',
//     });
// };

module.exports = Relatorios;
