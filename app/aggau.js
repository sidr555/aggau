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


var Promise = require('bluebird');
var RedisStore = require("connect-redis")(session);

var Redis = require("redis");
Promise.promisifyAll(Redis.RedisClient.prototype);
Promise.promisifyAll(Redis.Multi.prototype);
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
    req.redis = res.redis = redis;
    next();
});


// подключаем и инициализируем роуты
require("./routes")(app);


if (!module.parent) { // it is for Zombie
    http.listen(conf("port"), function () {
        log.info("Aggau is listening on port ", conf("port"), "(mode=" + conf("NODE_ENV") + ")");

        var testRedis = function() {
            var now = new Date();
            var time = now.getTime();

            redis.zadd(["log:server", time, "start"], function(err, response){
                if (err) throw err;
                log.info("log message added");
            });

            var moment = require("moment");
            //log.info(moment(time, 'x').format("DD MM YYYY HH:mm"));


            redis.set("server:time_start", time);
            redis.getAsync("server:time_start")
                .then(function(value) {
                    if (1*value !== time) {
                        //throw new Error("Wrong redis set/get routine");
                        log.error("Wrong redis set/get routine: " + value + "!=" + time);
                        process.exit();
                    }
                });
        }

        if (conf("redis:pass")) {
            redis.auth(conf("redis:pass"), function(err){
                if (err) {
                    // TODO write redis log
                    log.error("Redis auth failed: " + err.message);
                    process.exit();
                } else {
                    testRedis();
                }
            });
        } else {
            testRedis();
        }

    });
}


//io.use(function ioSession(socket, next) {
//    //log.error("io.use iSession");
//    try {
//        var cookieName = config.get("session:key");
//        var cookies;
//        var data = socket.handshake || socket.request;
//        if (data.headers.cookie) cookies = cookie.parse(data.headers.cookie);
//        if (!cookies || !cookies[cookieName]) {
//            return next(new Error('Не передана кука ' + cookieName));
//        }
//        var sid = cookieParser.signedCookie(cookies[cookieName], config.get("session:secret"));
//        if (!sid) {
//            return next(new Error('Неверная сигнатура куки'));
//        }
//        console.log('session ID ( %s )', sid);
//        data.sid = sid;
//        sessionStore.get(sid, function(err, session) {
//            if (err) return next(err);
//            if (!session) return next(new Error('Не найдена сессия'));
//
//            socket.session = session;
//            //console.log('session', session);
//
//            next();
//        });
//    } catch (err) {
//        console.error(err.stack);
//        next(new Error('Ошибка сервера'));
//    }
//});
