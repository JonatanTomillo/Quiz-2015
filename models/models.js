var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name     = (url[6]||null);
var user        = (url[2]||null);
var pwd         = (url[3]||null);
var protocol    = (url[1]||null);
var dialect     = (url[1]||null);
var port        = (url[5]||null);
var host        = (url[4]||null);
var storage     = process.env.DATABASE_STORAGE;
// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres:
var sequelize = new Sequelize(DB_name,user,pwd,
    { dialect:  protocol,
      protocol: protocol,
      port:     port,
      host:     host,
      storage:  storage,
      omitNull: true
    }
);

// Importar la definicion de la traba Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; // exportar definicion de la tabla quiz

sequelize.sync().success(function() {
  Quiz.count().success(function(count){
    if(count === 0){
      Quiz.create({pregunta: 'Capital de Italia',
                   respuesta: 'Roma'
                })
     .success(function(){console.log('Base de datos inicializada')});
   };
 });
});
