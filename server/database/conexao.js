const sq = require('sequelize');
const fs = require('fs');
const path = require('path');
const configLocal = require('./DB_config');

const sequelize = new sq.Sequelize(configLocal);

exports.connection = async () => {
  const db = {};
  const models = path.join(__dirname, '../models');

  fs.readdirSync(models)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'); 
    })
    .forEach(file => {
      modelName = file.slice(0, file.length - 3);
      
      const model = require(path.join(models, file));
      db[modelName] = model;
    });
  
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate)
      db[modelName].associate(db);
  });

  sequelize.authenticate()
    .then(() => {
      console.log(`Banco de dados local conectado com sucesso!`);
      sequelize.sync({ alter: true });
    })
    .catch(err => {
      console.log("Não foi possível conectar com o banco de dados local.");
      console.error(err);
    });
};

exports.exeQuery = async (sql, replacements, transaction) => {
  await sequelize.authenticate();

    const [results, metadata] = await sequelize.query(sql, { replacements: replacements, transaction: transaction });
    if (!results.length)
      throw new sq.EmptyResultError('Pesquisa não retornou dados.');
   
  return results;
};

exports.exeRawQuery = async (sql, replacements, transaction) => {
  await sequelize.authenticate(); 
  await sequelize.query(sql,{replacements: replacements, transaction: transaction});
}


exports.db = sequelize;