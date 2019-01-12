const sqlite3 = require("sqlite3").verbose();
const allModel = require('../js/model/all.js');
const seed = require('../js/model/seed.js');
const fs = require('fs');

let db = null;

module.exports = {
    initDatabase: function (sqlitePath) {
        return new Promise(function (resolve, reject) {
            db = new sqlite3.Database(sqlitePath, function (err) {
                if (err) {
                    reject(err);
                }
            });
            // if (sqlitePath && !sqlitePath.startsWith(':') && fs.existsSync(sqlitePath)) {
            //     resolve(db);
            //     return;
            // }
            allModel.createUserTable(db) // Create Table
            .then(function () { 
                return allModel.createTagTable(db);
            }, function (err) { reject(err)})
            .then(function () {
                return allModel.createTransactionTable(db);
            }, function (err) { reject(err)})
            .then(function () {
                return allModel.createAccountTable(db);
            }, function (err) { reject(err)})
            .then(function () {
                return seed.tag(db);// Seed Table
            }, function (err) { reject(err)})
            .then(function () {
                return seed.user(db);
            }, function (err) { reject(err) })
            .then(function () {
                return seed.account(db);
            }, function (err) { reject(err) })
            .then(function () {
                return seed.transaction(db);
            }, function (err) { reject(err) })
            .then(function () {
                resolve({ db: db });
            }, function (err) { reject(err) })

        });
    }
}