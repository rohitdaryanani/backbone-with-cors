var express = require('express');
var mongoose =  require('mongoose');
var http = require('http');
var path = require('path');

var app = express();
mongoose.connect("mongodb://localhost/contactmanager");
var ContactsSchema = new mongoose.Schema({
  name : String,
  number : String,
  username : String
});
var Contacts = mongoose.model("contacts",ContactsSchema);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '.')));
});

// app.get("/contacts", function(req,res){
//   Contacts.find({},function(err,docs){
//     if(err) throw err;
//     res.send(docs);
//   });
// });

// app.post("/contacts", function(req, res){
//   var contact = new Contacts({
//     name :req.body.name,
//     number :req.body.number,
//     username :req.body.number
//   }).save(function(err,docs){
//     if(err) throw err;
//     res.send(docs);
//   });
// });

// app.put("/contacts/:id", function(req,res){
//   var id = req.params.id;
//   Contacts.findById(id, function(err, contact) {
//       if(err) throw err;
//       contact.name = req.body.name,
//       contact.number = req.body.number,
//       username = req.body.username;
//       contact.save(function(err) {
//         if(err) throw err;
//         res.send(contact);
//       });
//     });
// });

// app.del("/contacts/:id", function(req,res){
//   var id = req.params.id;
//   Contacts.findById(id, function(err, contact) {
//       contact.remove(function(err) {
//         if(err) throw err;

//       });
//     });
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
