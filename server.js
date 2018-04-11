const express = require('express');
const request = require('request')
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json())

app.get('/users/:id', (req, res) => {
    const id = req.params.id
    request('https://challenges.tate.cloud/front2018/users?page='+id)

    .pipe(res)
});

app.get('/page/:number', (req, res) => {
    const num = req.params.number
    request('https://challenges.tate.cloud/front2018/users?page='+num)
    .pipe(res)
});


app.listen(port, () => console.log(`Listening on port ${port}`));
