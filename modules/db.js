const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'dmil',
    password : 'yuvalofek!',
    database : 'deathmatch',
    port     :   3306
});

connection.connect(function(e) {
    if(e) {
        console.log('Database didn\'t connect');
    } else {
        console.log('Database connected successfully');
    }
});

module.exports = connection;