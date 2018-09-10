const express = require('express');
const sqlite = require('sqlite3');
const formidable = require('formidable');
const fs = require('fs');

const db = new sqlite.Database('db.DB');

var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
//sets a view engine/templating for ejs

app.get('/', (req, res) => {
  gotoIndex(res);
});

function gotoIndex(res){

  db.all("select * from photos order by rating desc", (err, rows) => {
    if (err){
      console.log(err);
    }
    else{
      res.render('index', {photos : rows});
      console.log(rows);
    }
  });

  console.log("request made for homepage");
}

app.get('/sendfile', (req, res) => {
  res.render('sendfile');
});

app.post('/sendfile', (req, res) => {

  db.run("update photos set rating = rating - 3");

  var form = formidable.IncomingForm();
  form.parse(req);
  
  form.on('fileBegin', (name, file) => {

    switch(file.type){
      case 'image/png':
        db.run("insert into photos (filetype, rating) values ($filetype, 13.0)", {$filetype : '.png'});
        break;
      case 'image/jpg':
        db.run("insert into photos (filetype, rating) values ($filetype, 13.0)", {$filetype : '.jpg'});
        break;
    }

    file.path = __dirname + '/public/' + file.name;
    gotoIndex(res);

  });

  form.on('file', (name, file) => {

    db.get("select MAX(file) AS file, filetype from photos", (err, row) => {
      fs.rename(__dirname + '/public/' + file.name, __dirname + '/public/' + row.file + row.filetype, function(err) {
        if (err) console.log(err);
      });

    });

  });

});

app.post('/upvote/:id', (req, res) => {

  db.run('update photos set rating = rating + 1 where file = ' + req.params.id);
  console.log("upvoted " + req.params.id);
  res.send("upvoted " + req.params.id);

});

app.post('/downvote/:id', (req, res) => {

  db.run('update photos set rating = rating - 1 where file = ' + req.params.id);
  console.log("downvoted" + req.params.id);
  res.send("downvoted " + req.params.id);

});

app.listen(80);

console.log("server online");
