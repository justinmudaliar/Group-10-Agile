const express = require('express');
const bcrypt = require('bcrypt');

var utils = require('./utils');

var router = express.Router();

router.post('/saveUser', saveUser);

module.exports = router;

function saveUser(request, response) {
    var email = request.body.email;
    var username = request.body.username;
    var password = request.body.password;

    var db = utils.getDb();

    var query = {
        $or: [
            {email: email},
            {username: username}
        ]
    };
//comment
    db.collection('users').find(query).toArray((err, result) => {
        if (result.length > 0) {
            setTimeout(function() {
                return response.redirect('/');
            }, 2500);
        } else if (result.length == 0) {
            db.collection('users').insertOne({
                email: email,
                username: username,
                password: bcrypt.hashSync(password, 10)
            }, (err, result) => {
                if (err) {
                    response.send('Unable to register user');
                }
                response.redirect('/login');
            });
        }
    });
}