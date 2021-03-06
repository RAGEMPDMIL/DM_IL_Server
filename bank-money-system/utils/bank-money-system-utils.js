const db = require('../../modules/db');

module.exports.depositMoney = async function depositMoney(player, cash) {
    return new Promise(function(resolve) {
        try {
            db.query('UPDATE `accounts` SET `money` = ?, `bank` = ? WHERE `username` = ?', [player.wallet - cash, player.bank + cash, player.name], (err, result, fields) => {
                if(err) {
                    console.log(e);
                    resolve(false);
                }
                resolve(true);
            });
        } catch(e) { console.log(e); }
    });
};

module.exports.withdrawMoney = async function withdrawMoney(player, cash) {
    return new Promise(function(resolve) {
        try {
            db.query('UPDATE `accounts` SET `money` = ?, `bank` = ? WHERE `username` = ?', [player.wallet + cash, player.bank - cash, player.name], (err, result, fields) => {
                if(err) {
                    console.log(e);
                    resolve(false);
                }
                resolve(true);
            });
        } catch(e) { console.log(e); }
    });
};

module.exports.transferMoneyOnline = async function trasnferMoneyOnline(originPlayer, destinationPlayer, cash) {
    return new Promise(function(resolve){
        db.query('UPDATE `accounts` SET `bank` = ? WHERE `username` = ?', [Number(originPlayer.bank) - Number(cash), originPlayer.name], (err, result, fields) => {
            if(err) {
                console.log(err);
                resolve(false);
            }
        });

        db.query('UPDATE `accounts` SET `bank` = ? WHERE `username` = ?', [Number(destinationPlayer.bank) + Number(cash), destinationPlayer.name], (err, result, fields) => {
            if(err) {
                console.log(err);
                resolve(false);
            }
            resolve(true);
        });
    });
};

module.exports.transferMoneyOffline = async function trasnferMoneyOffline(originPlayer, username, bank, cash) {
    return new Promise(function(resolve, reject){
        db.query('UPDATE `accounts` SET `bank` = ? WHERE `username` = ?', [(Number(originPlayer.bank) - Number(cash)), originPlayer.name], (err, result, fields) => {
            if(err) {
                console.log(err);
                resolve(false);
            }
        });

        db.query('UPDATE `accounts` SET `bank` = ? WHERE `username` = ?', [Number(bank) + Number(cash), username], (err, result, fields) => {
            if(err) {
                console.log(err);
                resolve(false);
            }
            resolve(true);
        });
    });
};

module.exports.getMoneyInfo = async function getMoneyInfo(username) {
    return new Promise(function (resolve){
        try {
            db.query('SELECT `bank`, `money` FROM `accounts` WHERE BINARY `username` = ?', [username], function(err, result, rows){
                if(err) {
                    console.log(err);
                }
                resolve([result[0].bank, result[0].money]);
            });
        } catch(e) {console.log(e);}
    });
};

module.exports.playerChangeBank = async function playerChangeBank(player, amount) {
    return new Promise(function(resolve) {
        try {
            db.query('UPDATE `accounts` SET `bank` = ? WHERE `username` = ?', [player.bank - Number(amount) , player.name], (err, result, fields) => {
                if(err) {
                    console.log(e);
                    resolve(false);
                }
                resolve(true);
            });
        } catch(e) { console.log(e); }
    });
};