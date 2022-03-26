let mysql = require("mysql");
let connData = {
    host:"localhost",
    user : "root",
    password:"",
    database:"studentsDB"
};

function getConnections(){
    return mysql.createConnection(connData)
};

module.exports.getConnections = getConnections; 