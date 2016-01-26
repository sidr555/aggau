/**
 * Aggau bankruptcy auction aggregator
 * Created by sidr on 01/26/2016
 */

"use strict";

var express = require("express");
var app = module.exports = express();
var log = require("log")(module);

var config = require("conf");
var json = require("express-json");
var cookie = require('cookie');
var cookieParser = require("cookie-parser");
var session = require("express-session");
//var bodyParser = require("body-parser");
//var RedisStore = require("connect-redis")(session);
var http = require('http').Server(app);
var io = app.io = require("socket.io")(http);

app.set("views", __dirname + "/views");
app.set("view engine", "jade");

//app.use(favicon(__dirname + "/../nginx/files/www/images"));
//app.use(bodyParser());
app.use(cookieParser());
app.use(json());

//var sessionStore = new RedisStore(config.get("redis-store"));
//app.use(session({
//    key: config.get("session:key"),
//    store: sessionStore,
//    secret: config.get("session:secret"),
//    cookie: config.get("session:cookie"),
//    rolling: true,
//    unset: "destroy",
//    maxAge: null
//}));
//app.use(require("middlewares/helpers").flashMessages);
//app.use(require("middlewares/helpers").env_vars);


// подключаем и инициализируем роуты
require("./routes")(app);

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


if (!module.parent) { // it is for Zombie
    http.listen(config("port"), function () {
        log.info("Aggau is listening on port ", config("port"), "(mode=" + config("NODE_ENV") + ")");
    });
}