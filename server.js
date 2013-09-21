var express = require('express');
var mongoose =  require('mongoose');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var app = express();

mongoose.connection.once('open', function () {
	console.log('MongoDB connection opened.');
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));
//var options = require('./creds');
mongoose.connect('mongodb://localhost:27017/test');

// var ContactSchema = new mongoose.Schema({
// 	name: String,
// 	number: String,
// 	username: String
// });
var ContactSchema = mongoose.Schema({
		name: {
			type: String,
			required: true
		},
		number: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true,
			unique: true
		}
});
var Contact = mongoose.model('contacts', ContactSchema);

// Setup CORS related headers
var corsSettings = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
	// deal with OPTIONS method during a preflight request
	if (req.method === 'OPTIONS') {
		res.send(200);
	} else {
		next();
	}
};

app.configure(function(){
  app.set('port', process.env.PORT || 9090);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '.')));
  app.use(corsSettings);
});


function listContacts(req, res) {
	var options = {};
	if (req.query.skip) {
		options.skip = req.query.skip;
	}
	if (req.query.limit) {
		options.limit = req.query.limit;
	}
	Contact.find(null, null, options, function (err, docs) {
		if (err) {
			console.log(err);
			res.send(500, err);
		} else {
			res.send(200, docs);
		}
	});
}

// Note: For security reasons, fields must be validated before saving to database in a real world scenario.
// This is only for training purposes so it's not necessary to do validation.
function createContact(req, res) {
	Contact.create(req.body, function (err, doc) {
		if (err) {
			console.log(err);
			res.send(500, err);
		} else {
			res.send(200, doc);
		}
	});
}

function deleteContactById(req, res) {
	var id = req.params.id;
	Contact.findByIdAndRemove(id, function (err, doc) {
		if (err) {
			console.log(err);
			res.send(404, err);
		} else {
			res.send(200, doc);
		}
	});
}

function updateContactById(req, res) {
	var id = req.params.id;
	var newData = {
		name: req.body.name,
		number: req.body.number,
		username: req.body.username
	};
	Contact.findByIdAndUpdate(id, newData, function (err, doc) {
		if (err) {
			console.log(err);
			res.send(404, err);
		} else {
			res.send(200, doc);
		}
	});
}

app.get('/contacts', listContacts);
app.post('/contacts', createContact);
app.put('/contacts/:id', updateContactById);
app.delete('/contacts/:id', deleteContactById);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
