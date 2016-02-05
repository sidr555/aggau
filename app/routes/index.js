/**
 * Author: Dmitry Sidorov
 * Date: 26.01.16
 */


module.exports = function(app) {
    var user = require("./user");
    var moment = require("moment");
    moment.locale("ru-ru", {});

    var log = require("log")(module);

    app.get("/", user.isGuest, function(req, res){
        res.status(200).send("OK");
    });

    app.get("/admin", user.isAdmin, function(req, res){
        res.status(200).send("OK");
    });

    app.get("/up", user.isGuest, function(req, res){
        req.redis.getAsync("server:time_start")
            .then(function(time){
                res.status(200).send(moment(time, 'x').toNow(true));
            });
    });

}
