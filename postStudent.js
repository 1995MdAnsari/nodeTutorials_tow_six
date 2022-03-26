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

// importing data

let {studentData} = require("./studentData.js")
// console.log(studentData);


app.get("/svr/students", function (req, res){
    res.send(studentData)
});


// Post the new data

app.post("/svr/students", function(req, res){
    let body = req.body;
    console.log(body);
    let maxId = studentData.reduce((acc,curr) => (curr.id >=acc ? curr.id : acc)
    ,0);
    let newStudent = {id:maxId, ...body}
    studentData.push(newStudent)
    res.send(newStudent)
});

// bu using Put mathod update the student details

app.put("/svr/students/:id", function(req, res){
    let id = +req.params.id;
    let body = req.body;
    let index = studentData.findIndex((st)=>st.id===id);
    if(index>=0)
    {
        let updateStudent = {id:id, ...body};
        studentData[index]=updateStudent;
        res.send(updateStudent);
    }
    else{
        res.status(404).send("No student found");
    }
});

app.delete("/svr/students/:id", function(req, res){
    let id=+req.params.id;
    let index = studentData.findIndex((st)=>st.id===id);
    if(index>=0){
        let deleteStudent = studentData.splice(index,1);
        res.send(deleteStudent);
    }
    else{
        res.send(404).send("No student found");
    }

});    