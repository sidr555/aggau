/**
 * Запросы по торговым площадкам
 * Created by sidr on 05.02.16.
 */

var _ = require('underscore');
var log = require('log')(module);
var promise = require("bluebird");
var parser = require("utp_parser");


var placeRoute = module.exports = {}

placeRoute.init = function(req, res, next) {
    var fs = require("fs");
    _(JSON.parse(fs.readFileSync('app/places.json', 'utf8')))
        .each(function(data){
            req.redis.sadd("places:list", data.id);
            req.redis.hmset("places:" + data.id, data);
        });

    next(req, res);
}

placeRoute.list = function(req, res) {

    req.redis.smembersAsync("places:list")
        .then(function(list) {
            var promises = [];
            _(list).each(function (id) {
                promises.push(req.redis.hgetallAsync("places:" + id));
            });

            promise.all(promises)
                .then(function (arr) {
                    res.status(200).json(arr);
                })
        })
        .catch(function(err){
            log.error("Ошибка в списке площадок");
            next(new Error("Ошибка в списке площадок"));
        });
}

placeRoute.parse = function(req, res) {

    // загрузим настройки для парсера



    // загрузим документ

    // парсим!


}
