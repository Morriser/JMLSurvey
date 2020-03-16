'use strict';

const settings      = require('./settings.json');
const express       = require('express');
const session       = require('express-session');
const path          = require("path");
const mysql         = require('mysql');
const nodemailer    = require('nodemailer');

const app = express();

app.use(express.urlencoded());      // Parse URL-encoded bodies as sent by HTML forms.
app.use(express.json())             // Parse JSON bodies as sent by API clients.
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    name:           settings.session.name,
	secret:         settings.session.secret,
	resave:         true,
    saveUninitialized: true,
    cookie: {   
        maxAge: 3600000
    }
}));

/*##########################################
                Mail
##########################################*/

const transporter = nodemailer.createTransport(settings.mail); 

function sendMail(content) {
    let message = {
        from:       settings.mail.sender,
        to:         settings.mail.receiver,
        subject:    settings.mail.subject,
        text:       content
    };

    transporter.sendMail(message, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });        
}

/*##########################################
                MySQL
##########################################*/

const con = mysql.createConnection(settings.mysql);

/*##########################################
                Routes
##########################################*/

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/chat/:userID', function(req, res) {

    // TODO: read in chat

    // [...] Check if session is active/subject is supplied

    // let userID = req.params.chatID;
    // let sql = `SELECT userID, date, message\
    //            FROM posts A\
    //            WHERE caseID = '${userID}'`
    // con.query(sql, function(error, result) {
    //     console.log(error);
    //     result.forEach((r) => {
    //             posts.push({user: r.userID, date: r.date, message: a.message});
    //     });
    //     res.render('chat', {posts: posts});
    // });
});

app.post('/', function(req, res) {

    let name            = req.body.name;
    let contactMethod   = req.body.contactmethod;
    let contactInfo     = req.body.contactinfo;
    let message         = req.body.message;

    switch(contactMethod) 
    {
        case '0':
            let mailcontent = "Inskickat av " + name + " som inte vill bli"
                              + "kontaktad.\n\n\n" + message;
            sendMail(message);
            break;
        case '1':
            let mailcontent = "Inskickat av " + name + " som vill bli kontaktad "
                              + "via mejl på adressen " + contactInfo + ".\n\n\n" + message;
            sendMail(message);
            break;
        case '2':
            let mailcontent = "Inskickat av " + name + " som vill bli kontaktad "
                              + "via telefon på numret " + contactInfo + ".\n\n\n" + message;
            sendMail(message);
            break;
        case '3':
            let mailcontent = "Inskickat av " + name + " som vill bli kontaktad "
                              + "personligen.\n\n\n" + message;
            sendMail(message);
            break;
        case '4':
            // TODO - Fix anonymous usage
            console.log("Anon")
            break;
    }
});

app.post('/chat', function(req, res) {

    // TODO: post in chat

    // if(!isLoggedIn(req)) res.redirect('/');

    // let posts = [];

    // if(con.state === 'disconnected') {
    //     res.render('index', { message: 'Nånting funkar inte som det ska :('});
    // }
    // else { 
    //     let sql = `SELECT A.user_id, A.date, A.message\
    //                FROM posts A, cases B\
    //                WHERE A.case_id = B.case_idAND (A.user1_id = '${id}' OR A.user2_id = '${id}')`
    //     con.query(sql, function(error, result) {
    //         console.log(error);
    //         result.forEach((r) => {
    //                 posts.push({user: r.user_id, date: r.date, message: a.message});
    //             });
    //         res.render('chat', {posts: posts});
    //     });
    // }
});

// CREATE TABLE cases(
//     case_id INT NOT NULL AUTO_INCREMENT,
//     user1_id INT NOT NULL,
//     user2_id INT NOT NULL,
//     PRIMARY KEY (post_id),
// ) ENGINE=INNODB;

// CREATE TABLE posts(
//     post_id INT NOT NULL AUTO_INCREMENT,
//     case_id INT NOT NULL,
//     user_id INT NOT NULL,
//     date DATETIME DEFAULT CURRENT_TIMESTAMP,
//     message TEXT,
//     PRIMARY KEY (post_id), 
//     FOREIGN KEY (case_id) REFERENCES cases(case_id) 
//     FOREIGN KEY (user_id) REFERENCES users(user_id)
// ) ENGINE=INNODB;



//     if(con.state === 'disconnected'){
//     }

//     con.query('SELECT * FROM users WHERE username = ? AND password = ?', 
//                     [username, password], function(error, result, fields) {
//         if (result.length > 0) {
//             req.session.loggedin = true;
//             req.session.username = username;
//             res.redirect('/dashboard');
//         } else {
//             res.render('login', {failedAttempt: true})
//         }			
//         res.end();
//     });
// });



var server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port
    console.log("JMLSurvey now running at http://%s:%s", host, port)
});


function isLoggedIn(req){
    if(typeof req.session != "undefined"){
        if (req.session.loggedin){
            return true;
        }
    }
    return false;
}