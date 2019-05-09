
var fs = require("fs");
//The Node.js file system module allows you to work with the file system on your computer.
var express = require('express');
var app = express();
app.use(express.json())


app.get("/courses",(req,res)=>{

    var data=fs.readFileSync(__dirname + '/courses.json');
        res.send(JSON.parse(data));
        console.log("get success")

    });
app.post("/courses",(req,res)=>{
    let name = req.body.name;
    let description=req.body.description;

    // opening the json file to read json data and then parse from buffer obj to json object
    fs.readFile(__dirname+"/courses.json",(err,data)=>{
    data = JSON.parse(data)
    
    // creating a dictionary which contain information collected from body and then push into data variable
    let dict = {}
    dict['id']=data.length+1
    dict['name']=name
    dict['description']=description
    data.push(dict)

    // writting the data into json file
    fs.writeFileSync(__dirname+"/courses.json",JSON.stringify(data,null,2))
    console.log('data posted into json file')
   
    // get request of all data to print 
    fs.readFile(__dirname+"/courses.json",(err,data)=>{
        res.send(data);
        console.log("get success")

    });

    });
});

//course by ID:
app.get("/courses/:id",(req,res)=>{
    var id=req.params.id
    console.log(id)
    fs.readFile(__dirname+"/courses.json",(err,data)=>{
    var parsing=JSON.parse(data)
    var length=parsing.length;
    if (id<=length){
        for (i of parsing){
            if (i.id==id){
                res.send(i)
            }
        }
    }else{
        res.send("please check your course id: ")
    }
    })
})

//Edit a course by ID:
app.put("/courses/:id",(req,res)=>{
    var id=req.params.id
    fs.readFile(__dirname+"/courses.json",(err,data)=>{
    var data=JSON.parse(data)
    var length=data.length;
    if (id<=length){
        for (i of data){
            if (i.id==id){
                i["name"]=req.body.name;
                i["description"]=req.body.description;
                fs.writeFileSync(__dirname+"/courses.json",JSON.stringify(data,null,2))
                res.send(i)
                console.log(data)
            }
        }
    }else{
        res.send("Please check your id")
    }
    })
    console.log(id)
})

// GET EXERCISES OF A COURSE:
app.get("/courses/:ID/exercises",(req,res)=>{
    var course_id = req.params.ID;

    var data=fs.readFileSync(__dirname + '/newcourse.json');
    var all_courses = JSON.parse(data);

    for(i of all_courses){
        var exercises=i["exercises"];
        if(exercises[0]["courseId"]==course_id){
            res.send(exercises)
        }
    }
    console.log("get success")
    res.send("error: ye id nahi hai")
   
})


// CREATE EXERCISES OF A COURSE:
app.post("/courses/:ID/exercises",(req,res)=>{
    var course_id = req.params.ID;
    var name=req.body.name;
    var content=req.body.content;
    var hint=req.body.hint;
    dic={}
    var data=fs.readFileSync("/home/aman/Desktop/expressjs/newcourse.json");
    var all_courses = JSON.parse(data);
    for(i of all_courses){
        var exercises=i["exercises"];
        if(exercises[0]["courseId"]==course_id){
            var length=exercises.length+1;
            console.log(length)
            dic["id"]=length;
            dic["name"]=name;
            dic["content"]=content;
            dic["hint"]=hint;
            i.exercises.push(dic)
            console.log(all_courses);
            
            fs.writeFile("/home/aman/Desktop/expressjs/newcourse.json", JSON.stringify(all_courses,null,2))
            return res.send(dic)
            console.log("running post:")
        }
    }
    
    console.log("get success")
   
})


// GET EXERCISE BY ID:
app.get("/courses/:id1/exercise/:id2",(req,res)=>{
    var id1=req.params.id1;
    var id2=req.params.id2;
    var alllist=[];
    console.log("your code is running...")
    fs.readFile("/home/aman/Desktop/expressjs/newcourse.json",(err,data)=>{
        data=JSON.parse(data)
        for (var i of data){
            var exercise=i["exercises"]
            for(var j of exercise){
                if(j["courseId"]==id1 && id2==j["id"]){
                    console.log("True")
                    return res.send(j)
            }
            
            }
        }
        res.send({"iderror":"id nahi hai."})
    })
})

// EDIT EXERCISE BY ID:
app.put("/courses/:id1/exercise/:id2",(req,res)=>{
    dic={}
    var id1=req.params.id1;
    var id2=req.params.id2;
    var alllist=[];
    console.log("your code is running...")
    fs.readFile("/home/aman/Desktop/expressjs/newcourse.json",(err,data)=>{
        data=JSON.parse(data)
        for (var i of data){
            var exercise=i["exercises"]
            for(var j of exercise){
                if(j["courseId"]==id1 && id2==j["id"]){
                    j["name"]=req.body.name
                    j["content"]=req.body.content
                    j["hint"]=req.body.hint
                    fs.writeFile("/home/aman/Desktop/expressjs/newcourse.json",JSON.stringify(data,null,2))
                    return res.send(j)
                    console.log("success")
                
                }
            }
        }
        res.send({"iderror":"id nahi hai."})
    });
});

// GET SUBMMISSIONS OF AN EXERCISE:
app.get("/courses/:id1/exercise/:id2/submissions",(req,res)=>{
    var id1=req.params.id1;
    var id2=req.params.id2;
    fs.readFile(__dirname+"/newcourse2.json",function(err,data){
        data=JSON.parse(data)
        for(i of data){
            var list=[];
            var exercise=i["exercise"]
            for(j of exercise){
                if(j["courseId"]==id1 &&  j["exerciseId"]==id2){
                    for (k of j.submission){
                        k["exerciseId"]=id2
                        k["courseId"]=id1
                        list.push(k)
                    }
                    res.send(list)
                    console.log(list)
                }
                
            }
        }
    });
});

// CREATE SUBMISSION OF AN EXERCISE:
app.post("/courses/:id1/exercise/:id2/submissions",(req,res)=>{
    var id1=req.params.id1;
    var id2=req.params.id2;
    var data1=req.body;
    fs.readFile(__dirname+"/newcourse2.json",function(err,data){
        data=JSON.parse(data)
        for(i of data){
            var list=[];
            var exercise=i["exercise"]
            for(j of exercise){
                if(j["courseId"]==id1 &&  j["exerciseId"]==id2){
                    var submission=j.submission
                    data1["id"]=submission.length+1
                    submission.push(data1)
                    fs.writeFile(__dirname+"/newcourse2.json",JSON.stringify(data,null,2))
                    data1["exerciseId"]=id2
                    data1["courseId"]=id1
                    res.send(data1)
                    console.log()
                }
                
            }
        }
    });
});
app.listen(1234);
