

let mysql = require("mysql");
let connData = {
    host:"localhost",
    user : "root",
    password:"",
    database:"testDB"
};

function showPerson(){
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM persons";

    connection.query(sql,function(err,result){
        if(err) console.log("Error in database",err.message);
        else console.log(result)    
    });
}

function showPersonName(name){
    let connection=mysql.createConnection(connData);
    let sql = "SELECT * FROM persons WHERE name=?";
    connection.query(sql,name,function(err,result){
        if(err) console.log("Error in database",err.message);
        else console.log(result)    
    });
}



// function newPersons(params){
//     let connection=mysql.createConnection(connData);
//     let sql = "INSERT INTO persons(name,age) VALUES(?,?)";
//     connection.query(sql,params,function(err,result){
//         if(err) console.log("Error in database",err.message);
//         else console.log("Inserted Id is",result.insertId)    
//     });
// }


// For  the single values
function newPersons(params){
    let connection=mysql.createConnection(connData);
    let sql = "INSERT INTO persons(name,age) VALUES(?,?)";
    connection.query(sql,params,function(err,result){
        if(err) console.log("Error in database",err.message);
        else 
        {
            console.log("Inserted Id is",result.insertId);
            let sql2="SELECT * FROM persons";

            connection.query(sql2,function(err,result){
                if(err) console.log("Error in database",err.message);
                else console.log(result)    
            });
        }       
    });
}

/// for the multiple values insertions

function insertPersons(params){
    let connection=mysql.createConnection(connData);
    let sql = "INSERT INTO persons(name,age) VALUES(?)";
    connection.query(sql,[params],function(err,result){
        if(err) console.log(err);
        else console.log(result)
    });
}

// increment the age of the persons

function updatePersons(id){
    let connection=mysql.createConnection(connData);
    let sql = "UPDATE persons SET age=age+1 WHERE id=?";
    connection.query(sql,id,function(err,result){
        if(err) console.log(err);
        else console.log(result)
    });
}

function changeAge(id,newAge){
    let connection=mysql.createConnection(connData);
    let sql = "UPDATE persons SET age=? WHERE id=?";
    connection.query(sql,[newAge,id],function(err,result){
        if(err) console.log(err);
        else console.log(result)
    });
}

// Deleting the data

function resetData(){
    let connection=mysql.createConnection(connData);
    let sql1 = "DELETE FROM persons";
    connection.query(sql1,function(err,result){
        if(err) console.log(err);
        else 
        {
            console.log("Successfully deleted. Affected rows",result.affectedRows)
            let {persons} = require("./testData.js");
            let arr = persons.map(p=>[p.name,p.age]);
            let sql2 = "INSERT INTO persons(name,age) VALUES ?";
            connection.query(sql2,[arr], function(err, result){
                if(err) console.log(err);
                else console.log("Successfully inserted.",result.affectedRows)
            })
            showPerson();
        }
    });
};

resetData();


// changeAge(4,56)
// showPerson();
// showPersonName("taslim");
// newPersons(["Anna",25]);
// insertPersons(["Anita",24],["Juli",25],["Stefen",25]);

// updatePersons(6);
