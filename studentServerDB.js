const { response } = require("express");
let express = require("express");
let app = express();

app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONs, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Request-With,Content-Type,Access"
    );
    next();

});
const port=2410;
app.listen(port, () =>console.log(`Node app listening on port ${port}!`));

let {getConnections} = require("./modDB.js");
///svr/students; And

// app.get("/svr/students",function(req,res){
//     let course = req.query.course;
//     let connection = getConnections();
//     // let sql = "SELECT * FROM students";

//     let options = "";
//     let optionsArr = [];
//     if(course){
//         options = " WHERE course=? ";
//         optionsArr.push(course)
//     }
//     let sql = `SELECT * FROM students ${options}`;
//     connection.query(sql,optionsArr, function(err,result){
//         if(err) 
//         {
//             console.log();
//             res.status(404).send("Error in fetching data");
//         }
//         else res.send(result);
//     })
// });

// path : "/svr/students?course=React,Node" 
app.get("/svr/students",function(req,res){
    let course = req.query.course; //  /svr/students?course=React,Node
    let grade = req.query.grade; //  /svr/students?course=React,Node&grade=A
    let sort = req.query.sort;
    
    let connection = getConnections();
    // let sql = "SELECT * FROM students";
    let options = "";
    let optionsArr = [];
    if(course){
        let courseArr = course.split(",")
        options = " WHERE course IN(?) ";
        optionsArr.push(courseArr)
    }
    if(grade){
        options=options ? `${options} AND grade=?` : "WHERE grade=?";  //  /svr/students?course=React,Node&grade=A
        optionsArr.push(grade);
    }
    if(sort)
    {
        options = `${options} ORDER BY ${sort}`;
    }
    let sql = `SELECT * FROM students ${options}`;
    connection.query(sql,optionsArr, function(err,result){
        if(err) 
        {
            console.log();
            res.status(404).send("Error in fetching data");
        }
        else res.send(result);
    })
});

// /svr/students/:id
app.get("/svr/students/:id",function(req,res){
    let id = +req.params.id;
    let connection = getConnections();
    let sql = "SELECT * FROM students WHERE id=?";
    connection.query(sql,id, function(err,result){
        if(err) 
        {
            console.log();
            res.status(404).send("Error in fetching data");
        }
        else if(result.length===0){
            res.status(404).send("No students found");
        }
        else{
            res.send(result[0])
        }
    });
});


// /svr/students/course/:name

app.get("/svr/students/course/:name",function(req,res){
    let name = req.params.name;
    let connection = getConnections();
    let sql = "SELECT * FROM students WHERE course=?";
    connection.query(sql,name, function(err,result){
        if(err) 
        {
            console.log();
            res.status(404).send("Error in fetching data");
        }
        else
        {
            res.send(result[0])
        }
    });
});



//  Post Oprations

app.post("/svr/students", function(req, res){
    let body = req.body;
    let connection = getConnections();

    let sql1 = "SELECT * FROM students WHERE name=?";
    connection.query(sql1, body.name, function(err, result){
        if(err){
            console.log(err);
            res.status(404).send("Error in inserting data");
        }
        else if(result.length>0){
            res.status(404).send(`Name is already exists : ${body.name}`)
        }
        else{
            let sql2 = "INSERT INTO students(name,course,grade,city) VALUES(?,?,?,?)";
            connection.query(sql2,[body.name,body.course,body.grade,body.city], 
                function(err,result){
                    if(err){
                        console.log(err);
                        res.status(404).send("Error in inserting data")
                    }
                    else{
                        res.send(`post siccess. Id of new student is ${result.insertId}`)
                    }
                
            });
        }
    });
    // let sql = "INSERT INTO students(name,course,grade,city) VALUES(?,?,?,?)";
    // connection.query(sql,[body.name,body.course,body.grade,body.city], 
    //     function(err,result){
    //         if(err){
    //             console.log(err);
    //             res.status(404).send("Error in inserting data")
    //         }
    //         else{
    //             res.send(`post siccess. Id of new student is ${result.insertId}`)
    //         }
        
    // })
});


//  Update the details

app.put("/svr/students/:id",function(req,res){
    let id = req.params.id;
    let body = req.body;
    let connection= getConnections();
    let sql = "UPDATE students SET name=?, course=?, grade=?, city=? WHERE id=?";
    let params = [body.name,body.course,body.grade,body.city,id];
    connection.query(sql,params, function(err,result){
        if(err)
        {
            console.log(err);
            res.status(404).send("Error in updating data") 
        }
        else if(result.affectedRows===0){
            res.status(404).send("No update happened");
        }
        else res.send("Update Success");
    });
});


/// Delete 
app.delete("/svr/students/:id",function(req,res){
    let id = req.params.id;
    let connection= getConnections();
    let sql = "DELETE FROM students WHERE id=?";
    connection.query(sql,id, function(err,result){
        if(err)
        {
            console.log(err);
            res.status(404).send("Error in deleting data") 
        }
        else if(result.affectedRows===0){
            res.status(404).send("No delete happened");
        }
        else res.send("Delete Success");
    });
});

// Truncate data

app.get("/svr/resetData", function(req,res){
    let connection= getConnections();
    // let sql = "DELETE FROM students";
    let sql = "TRUNCATE TABLE students";
    connection.query(sql, function(err,result){
        if(err)
        {
            console.log(err);
            res.status(404).send("Error in deleting data") 
        }
        else
        {
            console.log(`Deleted success. Deleted ${result.affectedRows} rows`);
            let {studentData} = require("./studentData.js");
            let arr = studentData.map((st)=>[
                st.name,
                st.course,
                st.grade,
                st.city]
            );
            let sql2 = "INSERT INTO students(name,course,grade,city) VALUES?";
            connection.query(sql2,[arr],function(err,result){
                if(err){
                    console.log(err);
                    res.status(404).send("Error in inserting data");
                }
                else res.send(`Reset success. Inserted ${result.affectedRows},rows`)
            });
        }
    });    
})