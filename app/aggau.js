/**
 * Aggau bankruptcy auction aggregator
 * Created by sidr on 01/26/2016
 */

"use strict";

var express = require("express");
var app = module.exports = express();
var log = require("log")(module);

var conf = require("conf");
var json = require("express-json");
//var cookie = require('cookie');
var cookieParser = require("cookie-parser");
var session = require("express-session");
//var bodyParser = require("body-parser");


var promise = require('bluebird');
var RedisStore = require("connect-redis")(session);

var Redis = require("redis");
promise.promisifyAll(Redis.RedisClient.prototype);
promise.promisifyAll(Redis.Multi.prototype);
var redis = Redis.createClient(conf("redis:port"), conf("redis:host"));


var http = require('http').Server(app);
//var io = app.io = require("socket.io")(http);

app.set("views", __dirname + "/views");
app.set("view engine", "jade");

//app.use(favicon(__dirname + "/../nginx/files/www/images"));
//app.use(bodyParser());
app.use(cookieParser());
app.use(json());

var sessionStore = new RedisStore(conf("redis"));
app.use(session({
    key: conf("session:key"),
    store: sessionStore,
    secret: conf("session:secret"),
    cookie: conf("session:cookie"),
    rolling: true,
    unset: "destroy",
    maxAge: null
}));

app.use(function(req, res, next){
    req.redis = res.redis = app.redis = redis;
    next();
});


// подключаем и инициализируем роуты
require("./routes")(app);


if (!module.parent) { // it is for Zombie
    http.listen(conf("port"), function () {
        log.info("Aggau is listening on port ", conf("port"), "(mode=" + conf("NODE_ENV") + ")");


        var redisAuth = conf("redis:pass") ? redis.authAsync(conf("redis:pass")) : promise.resolve();

        redisAuth.then(function() {
            redis.selectAsync("2").then(function() {
                var now = new Date();
                var time = now.getTime();

                redis.zadd(["log:server", time, "start"], function (err, response) {
                    if (err) throw err;
                    log.info("log message added");
                });

                redis.set("server:time_start", time);
                redis.getAsync("server:time_start")
                    .then(function (value) {
                        if (1 * value !== time) {
                            //throw new Error("Wrong redis set/get routine");
                            log.error("Wrong redis set/get routine: " + value + "!=" + time);
                            process.exit();
                        }
                    });

                test();
            })
        }).catch(function(err){
            log.error("Redis auth failed: " + err.message);
            process.exit();
        });

    });
}


function test() {
    var Parser = require("utp_parser");
    var parser = new Parser(2, 'torg');
    parser.parse(function(err, data){
        log.warn("PARSED DATA", data);
    });
}