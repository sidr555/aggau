/**
 * Author: Dmitry Sidorov
 * Date: 26.01.16
 */


module.exports = function(app) {
    var user = require("./user");

    app.get("/", user.isGuest, function(req, res){
        res.status(200).send("OK");
    });

    app.get("/admin", user.isAdmin, function(req, res){

        res.status(200).send("OK");
    });

}
