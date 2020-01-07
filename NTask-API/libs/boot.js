const https = require("https");
const fs = require("fs");

module.exports = app => {
    //subindo o servidor
    if(process.env.NODE_ENV!=="test"){
        const credentials = {
            key: fs.readFileSync("ntask.key", "utf8"),
            cert: fs.readFileSync("ntask.cert", "utf8")
        };

        app.db.sequelize.sync().done(function(){
            https.createServer(credentials, app).listen(app.get("port"), function(){
                console.log("SERVIDOR RODANDO VIOLENTAMENTE NA PORTA " + app.get("port"));
            });
        });
    }
};