var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
    where: {id: Number(quizId)},
    include: [{model: models.Comment}]
  }).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
//exports.index = function(req, res) {
//  models.Quiz.findAll().then(
//    function(quizes) {
//      res.render('quizes/index', { quizes: quizes});
//    }
//  ).catch(function(error) { next(error);})
//};

//Get /quize con busqueda
exports.index = function(req, res) {
	var _patron = req.query.busq || "";
	 _patron = "%" + _patron.replace(/\s/gi, "%") + "%";
	var _busqueda = {where: ["pregunta like ?", _patron]};

  models.Quiz.findAll(_busqueda).then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes, errors: []});
    }
  ).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req,res){
    var quiz = models.Quiz.build(
      {pregunta: "Pregunta", respuesta: "Respuesta", tematica: "Tematica"}
    );

    res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function (req,res){
  var quiz = models.Quiz.build( req.body.quiz );
  //metodo segun transparencias
  //quiz
  //.validate()
  //.then(
  //    function(err){
  //      if (err) {
  //        res.render('quizes/new', {quiz: quiz, errors: err.errors});
  //      } else {
  //          quiz
  //          .save({fields: ["pregunta","respuesta"]})
  //          .then( function(){ res.redirect('/quizes')})
  //      }
  //    }
  //);
  var errors = quiz.validate();//ya qe el objeto errors no tiene then(
    if (errors)
    {
        var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
       for (var prop in errors) errores[i++]={message: errors[prop]};
        res.render('quizes/new', {quiz: quiz, errors: errores});
    } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta","tematica"]})
        .then( function(){ res.redirect('/quizes')}) ;
    }
};

//GET /quizes/:id/edit
exports.edit = function(req,res){
  var quiz = req.quiz;
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.update = function(req,res){
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tematica = req.body.quiz.tematica;

  var errors = req.quiz.validate();//ya qe el objeto errors no tiene then(
    if (errors)
    {
        var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
       for (var prop in errors) errores[i++]={message: errors[prop]};
        res.render('quizes/new', {quiz: quiz, errors: errores});
    } else {
        req.quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta" , "tematica"]})
        .then( function(){ res.redirect('/quizes')}) ;
      }
};

//DELETE /quizes/:id

exports.destroy = function(req,res) {
  req.quiz.destroy().then( function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
