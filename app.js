//jshint esversion: 6
const express=require("express");
const request=require("request");
const bodyparser=require("body-parser");
const https=require("https");

const app=express();
//static is used so that we use css image file in html files
app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended:true}));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    };
    
    const jsonData=JSON.stringify(data);

    const url ="https://us8.api.mailchimp.com/3.0/lists/702461e7b4";

    const options={
        method:"POST",
        auth: "krishna:90edc521fed4ec708f06ce263e7d41c1-us8"  
    }

    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }    
        
        response.on("data",function(data){
                console.log(JSON.parse(data));
            })
    })

   request.write(jsonData);
    request.end();


})

app.post("/fail",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT||3000,function(){
    console.log("running 3000");
});
//mailchimp=90edc521fed4ec708f06ce263e7d41c1-us8
//listid=702461e7b4