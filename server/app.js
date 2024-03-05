const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const bodyParser = require("body-parser");
const { connection, db } = require('./database/conexao');
const cors = require('cors')
const Accounts = require('./models/Accounts')
const md5 = require('md5');

const app = express();
app.use(express.json());
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const store = new SequelizeStore({ db });

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: false,
    httpOnly: true
  },
  store: store,
}));

app.use(cors({
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://ocorrencia.og1erp.com.br'],
  credentials: true,
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

connection()

function loadRoutes(app) {
  fs.readdirSync(path.join(__dirname, 'routes')).forEach(file => {
    if (file.endsWith('.js')) {
      const route = require(path.join(__dirname, 'routes', file));
      app.use(`/api/${file.slice(0, -3)}`, route);
    }
  });
}

loadRoutes(app);  // Carrega todas as rotas

async function inserirAdministrador() {
  try {
    if (process.env.USERADMIN && process.env.SENHAADMIN) {
      const administrador = await Accounts.findOne({
        where:{
          username: process.env.USERADMIN
        }
      })

      if (!administrador) {
        await Accounts.create({
          username: process.env.USERADMIN,
          password: md5(process.env.SENHAADMIN),
          administrador: true
        })
        console.log("Usuário Administrador incluído")
      }
    } else {
      console.log("Usuário Administrador não incluído")
    }
  } catch (error) {
    console.log(error)
  }
}
inserirAdministrador()

module.exports = app;