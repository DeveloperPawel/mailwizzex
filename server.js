const express = require('express');
const path = require('path');
const url = require('url');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const User = require('./app/userModel');
const nev = require('email-verification')(mongoose);
const mailWizz = require("node-mailwizz");

require('dotenv').config();

const server = express();

server.use(bodyparser.urlencoded({extended: true}));
server.use(bodyparser.json());
server.use(express.static('public'));

const uri = process.env.URL;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

const config = {
    baseUrl: process.env.API,
    publicKey: process.env.publicKey,
    secret: process.env.secret
};

//create new subscriber
const subscribers = new mailWizz.ListSubscribers(config);
const lists = new mailWizz.Lists(config);

const userInfo = { //replace the values with your user info
    EMAIL: "test21@test.com",
    FNAME: "Paul",
    LNAME: "Mook"
};

const newUser = JSON.stringify(userInfo);


server.get('/', (req,res) => {
  // res.setHeader('Content-Type', 'application/json');
  //res.send('<html><body><h1>The Head</h1><p>This is the body <form method="post" action="/"><input type="submit"></form><p></body></html>');
  res.sendFile(path.join(__dirname, './public','page.html'));
  // console.log(subscribers);
  // console.log(lists);
  // lists.getList("dg458s45a430b")
  //   .then(function(result) {
  //       //TODO: do what you want
  //       console.log(result);
  //   })
  //   .catch(function(err) {
  //       //handle error here
  //       console.log('there was an error retriving the list.');
  //   });
});

server.post('*', function(req, res) {
  // res.setHeader('Content-Type', 'text/html');
  // req.body.EMAIL = userInfo.EMAIL;
  // req.body.FNAME = userInfo.FNAME;
  // req.body.LNAME = userInfo.LNAME;
  //
  console.log(req.body);
  // res.sendStatus(200);
  // console.log(JSON.stringify(userInfo));
  // sending a response does not pause the function
  // subscribers.create("dg458s45a430b", userInfo)
  //     .then(function(result) {
  //         console.log('user created: ' + userInfo);
  //     })
  //     .catch(function(err) {
  //         console.log('there was a error');
  //     });
});


// nev.configure({
//     verificationURL: 'http://myawesomewebsite.com/email-verification/${URL}',
//     persistentUserModel: User,
//     tempUserCollection: 'myawesomewebsite_tempusers',
//
//     transportOptions: {
//         service: 'Gmail',
//         auth: {
//             user: 'myawesomeemail@gmail.com',
//             pass: 'mysupersecretpassword'
//         }
//     },
//     verifyMailOptions: {
//         from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
//         subject: 'Please confirm account',
//         html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
//         text: 'Please confirm your account by clicking the following link: ${URL}'
//     }
// }, function(error, options){
// });

// nev.generateTempUserModel(User);

server.use((req, res, next)=>{
  let err = new Error('Not found');
  err.status = 404;
  next(err);
});

module.exports = server;
