var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to the database by using your mlab dbuser credentials
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds251277.mlab.com:51277/taskmanagerapp');

//create a schema
var todoSchema = new mongoose.Schema({
	item: String
});

//create a model
var Todo = mongoose.model('Todo', todoSchema);

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

	app.get('/todo', function(req, res){
		//get data from mongodb and pass it to view
		Todo.find({}, function(err, data){
			if(err) throw err;
			res.render('todo', {todos: data});
		});	
	});

	app.post('/todo', urlencodedParser, function(req, res){
		//get data from the view and add it to mongodb
		var newTodo = Todo(req.body).save(function(err, data){
			if(err) throw err;
			res.json(data);
		});
	});

	app.delete('/todo/:item', function(req, res){
		//delete the requested item from mongodb
		Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
			if(err) throw err;
			res.json(data);
		});
	});
};