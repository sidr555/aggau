/**
 * Author: Dmitry Sidorov
 * Email: sidr@sidora.net
 * Date: 26.01.16
 */

//var log = require('log')(module);


module.exports = {
    isGuest: function(req, res, next){
        next();
    },
    isUser: function(req, res, next){
        next();
    },
    isPro: function(req, res, next){
        next();
    },
    isAdmin: function(req, res, next){
        if (!req.admin) {
            return res.status(403).send("Необходимы права администратора");
        }
        next();
    }
}
