/* jshint -W104 */
const bcrypt = require('bcryptjs');
const db = require('../Modules/db');
const mailer = require('../modules/mailer');
let verificationCode=0;

// Handles user attempt to login
mp.events.add('server:auth:userLogin', async (player, username, password) => {
    let loggedAccount = await isOnline(username);
    if (loggedAccount === 'offline') {
        try {
            const res = await attemptLogin(username, password);
            if (res === 'success') {
                setUserStatus(username, 1);
                player.name = username;
                player.call('client:auth:loginHandler', ['success', username]);
                console.log(`${username} has successfully logged in`);
            } else {
                player.call('client:auth:loginHandler', ['incorrectInfo', username]);
            }
        } catch (e) {
            console.log(e);
        }
    } else if (loggedAccount === 'logged') {
        player.call('client:auth:loginHandler', ['logged', username]);
    } else {
        player.call('client:auth:loginHandler', ['doesntExist', username]);
    }
});


// Handles user attempt to register.
mp.events.add('server:auth:userRegister', async (player, username, password, email) => {
    try {
        const res = await attempRegistration(username, password, email);
        if (res === "success") {
            console.log(`${username} account has successfully created`);
            player.call('client:auth:registerHandler', ['success']);
            mp.events.call('server:auth:confirmationMail',email);
        } else {
            player.call('client:auth:registerHandler', ['userExists']);
        }
    } catch (e) {
        console.log(e);
    }
});

//Send varification code to the new account.
mp.events.add('server:auth:confirmationMail',(email)=>{
    console.log(email);
    verificationCode=Math.floor(Math.random() * 100000) + 111111;
    var mailOptions = {
        from: 'ragempdmil@gmail.com',
        to: email,
        subject: 'Death Match Israel Server Verification',
        text: `Welcome to Death Match Israel Server \n This is your verification code: ${verificationCode} \n The code is for 5 min dont waste your time.`
      };
      mailer.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
})
mp.events.add('server:register:checkVarificationMode',(player,insertedCode)=>{
    if(verificationCode==insertedCode)
    {
        db.query('SELECT * FROM `accounts` WHERE `id`=(SELECT max(`id`) FROM `accounts`)',function(error,user,fields){
            try
            {
                console.log(user.username);
                db.query('UPDATE `accounts` SET `verified` = ? WHERE `username` = ?', [1,user[0].username], function(error, result, fields) {
                    if(error) {
                        console.log(error);
                    }
                    else console.log("made it");
                }); 
            }
            catch(e) {console.log(e);}
            {
                
            }
            player.call('client:auth:verificationHandler',[true]);
        })
    }
    else
    {
        player.call('client:auth:verificationHandler',[false]);
    }
})

// Handles user quit event
mp.events.add('server:auth:onPlayerLogout', async (username) => {
    const isPlayerOnline = await isOnline(username);
    if(isPlayerOnline === 'logged') {
        setUserStatus(username, 0);
    }
});

function setUserStatus(username, status) {
    return new Promise(function(resolve) {
        try {
            db.query('UPDATE `accounts` SET `online` = ? WHERE `username` = ?', [status, username], function(error, result, fields) {
                if(error) {
                    console.log(error);
                }
                resolve(null);
            });
        } catch(e) {console.log(e);}
    });
}

function isOnline(username) {
    return new Promise(function (resolve) {
        try {
            db.query('SELECT `online` FROM `accounts` WHERE `username` = ?', [username], function (error, result, fields) {
                if (!result.length) {
                    resolve('doesntExist');
                } else if (result[0].online === 1) {
                    resolve('logged');
                } else {
                    resolve('offline');
                }
            });
        } catch (e) {
            console.log(e);
        }
    });
}

function attemptLogin(username, password) {
    return new Promise(function (resolve) {
        try {
            db.query('SELECT `username`, `password` FROM `accounts` WHERE `username` = ?', [username], function (error, result, fields) {
                if (result[0].username.length != 0) {
                    bcrypt.compare(password, result[0].password, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        result ? resolve('success') : resolve('incorrectInfo');
                    });
                } else {
                    resolve('incorrectInfo');
                }
            });
        } catch (e) {
            console.log(e);
        }
    });
}

function attempRegistration(username, password, email) {
    return new Promise(function (resolve) {
        try {
            db.query('SELECT * FROM `accounts` WHERE `username`=? OR `email`=?', [username, email], function (error, result, fields) {
                if (result.length != 0) {
                    resolve("userExists");
                } else {
                    bcrypt.hash(password, 10, (err, hash) => {
                        db.query('INSERT INTO `accounts` SET username = ?, password = ?, email = ?', [username, hash, email], function (error, result, fields) {
                            if (error) { console.log(error); } 
                            resolve("success");
                        });
                    });
                }
            });
        } catch (e) {
            console.log(e);
        }

    });
}