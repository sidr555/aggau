/**
 * Author: Dmitry Sidorov
 * Date: 26.01.16
 */


module.exports = function(app) {
    var user = require("./user");
    var place = require("./place");

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

    app.get("/places", user.isGuest, place.list);

    app.get("/init", user.isGuest, function(req, res){
        place.init(req, res, function(req, res) {

            res.status(200).send("Redis db initialized");
        });
    });

    app.get("/test/{:place}/{:type}", user.isGuest, place.parse);

}
