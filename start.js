const http = require('http');
//const fileUpload = require('express-filupload');
const mysql =require('mysql');
const https = require('https')
const express = require('express');
const {v4 : uuidv4} = require('uuid');
const multer = require('multer');
//const express =require('express-handlebars');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var md5 = require('md5');
const session = require('express-session');
var up = bodyParser.urlencoded({ extended: false })  
const {spawn} = require('child_process');
const { join } = require('path');

//var mykey = crypto.createCipher('md5', 'ZdHSihjTO');
const app = express();
const oneDay = 24*60*60*60*1000

//const downloadrouter = express.Router();

app.use(session({
    secret: "thisismysecrctekeyfhrgfgrtry84fwir767",
    saveUninitialized:true,
    
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
  
app.use(bodyParser.urlencoded({
limit: '50mb',
parameterLimit: 100000,
extended: true 
}));

app.use("/static", express.static("static"));
//app.use(fileUpload());



const port = 65000;
const host = 'localhost';
app.set('views', './views');
app.set('view engine', 'pug');
// const mcon= mysql.createConnection({
//     host: "localhost",  
//     user: "root",  
//     database:"usersdetails",
//     password: "",
//     port: 3306
    
// })

// mcon.connect((err)=>{
//     if(err) console.log(err)
//     else{
//         console.log("Connected")
//     }
// })

app.get('/1/consultancy/login', (req, res) => {
	res.render("login.pug")
});

app.get('/1/consultancy/about',(req,res)=>{
    res.render('aboutus.pug',{userty:req.session.userty})
})

app.get('/1/consultancy/services',(req,res)=>{
    res.render('service.pug',{userty:req.session.userty})
})

app.get('/1/consultancy/contact',(req,res)=>{
    res.render('contactus.pug',{userty:req.session.userty})
})

app.get('/1/consultancy/hospitalhome',(req,res)=>{
    if(!req.session.userid || req.session.userty!="Hospital"){
        res.redirect('/1/consultancy/login')
    }else{
       res.render("hospitalhome.pug",{userid:req.session.userid,hospitalname:req.session.hospitalname,username:req.session.username,email:req.session.email,userty:req.session.userty})
        //res.render("patientspage1.pug")
    }
})
app.get('/1/consultancy/drhome',(req,res)=>{
    if(!req.session.userid || req.session.userty!="doctor"){
        res.redirect('/1/consultancy/login')
    }else{
       res.render("drpage.pug",{userid:req.session.userid,username:req.session.username,hospitalid:req.session.hospitalid,hospitalname:req.session.hospitalname,email:req.session.email,mobile:req.session.mobile,userty:req.session.userty})
        //res.render("patientspage1.pug")
    }
})

app.get('/1/consultancy/patienthome',(req, res) => {
    if(!req.session.userid || req.session.userty!="Patient"){
        res.redirect('/1/consultancy/login')
    }else{
       res.render("patientspage1.pug",{userid:req.session.userid,username:req.session.username,email:req.session.email,mobile:req.session.mobile,userty:req.session.userty})
        //res.render("patientspage1.pug")
    }
});


app.post("/1/consultancy/drhome",(req,res)=>{
    if(!req.session.userid){
        res.redirect('/1/consultancy/login')
    }else if(req.body.action=='getprofinfo'){
        mcon.query("select * from hospitalstaff where userid like'"+req.session.userid+"'",(err,result)=>{
            if(err) console.log(err)
            else if(result.length>0){
                let info2 = []
                info2.push(result[0].username)
                info2.push(result[0].email)
                info2.push(result[0].mobile)
                info2.push(result[0].aadharno)
                info2.push(result[0].designation)
                info2.push(result[0].experience)
                info2.push(result[0].specialization)
                info2.push(result[0].Age)
                info2.push(result[0].joiningdate)
                info2.push(result[0].birthdate)
                info2.push(result[0].address)
                res.send(info2)
            }else{
                res.send("Error While Fetching Data")
            }
        })
    }else if(req.body.action=="getpatientinfo"){
        mcon.query("select patients.username,patients.email,patients.mobile,patients.birthdate,patients.bloodgroup,diseaseparent.userid,diseaseparent.diseaseid,diseaseparent.diseasename,diseaseparent.startdate,diseaseparent.endate,diseaseparent.medicalficility,diseaseparent.symptoms from patients join diseaseparent on patients.userid=diseaseparent.userid where patients.secretcode='"+req.body.secretcode+"' AND patients.mobile='"+req.body.mobile+"' order by diseaseparent.startdate",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                let bdate = new Date(results[0].birthdate)
                bdate=bdate.getFullYear()+"-"+ ('0' + (bdate.getMonth() + 1)).slice(-2)+"-"+('0' + bdate.getDate()).slice(-2)
                let Table1 = "<table><tr><td>Name: "+results[0].username+"</td><td>E-mail: "+results[0].email+"</td><td>Mobile : "+results[0].mobile+"</td><td>Birth Date : "+bdate+"</td></tr></table"
                let table = "<table><tr><th>Disease_Name</th><th>Medical_faculty</th><th>Start</th><th>End</th><th>Symptoms</th><th>Action</th></tr>"
                for(let i=0;i<results.length;i++){
                    let startdate = new Date(results[i].startdate)
                    let eenddate = new Date(results[i].endate)
                    startdate=startdate.getFullYear()+"-"+ ('0' + (startdate.getMonth() + 1)).slice(-2)+"-"+('0' + startdate.getDate()).slice(-2)
                    eenddate=eenddate.getFullYear()+"-"+ ('0' + (eenddate.getMonth() + 1)).slice(-2)+"-"+('0' + eenddate.getDate()).slice(-2)
                    table+="<tr><td>"+results[i].diseasename+"</td><td>"+results[i].medicalficility+"</td><td>"+startdate+"</td><td>"+eenddate+"</td><td>"+results[i].symptoms+"</td><td><button class='btn btn-primary w-100 py-3' onclick=seemedicines('"+results[i].diseaseid+"','"+results[i].userid+"')>See Medicines</button></td></tr>"
                }
                table+="</table>"

                res.send(Table1+"<br>"+table)
            }else{
                res.send("Data Not Found")
            }
        })
    }else if(req.body.action=="seemedicines"){
        mcon.query("select * from medicinetable where userid='"+req.body.data2+"' AND diseaseid='"+req.body.data1+"' order by startfrom DESC",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let table = "<table><tr><th>Medicine</th><th>Start_From</th><th>EndOn</th><th>Time1</th><th>Time2</th><th>Time3</th><th>Remainder</th></tr>"
                for(let i=0;i<result.length;i++){
                    let startdate = new Date(result[i].startfrom)
                    let eenddate = new Date(result[i].endfrom)
                    startdate=startdate.getFullYear()+"-"+ ('0' + (startdate.getMonth() + 1)).slice(-2)+"-"+('0' + startdate.getDate()).slice(-2)
                    eenddate=eenddate.getFullYear()+"-"+ ('0' + (eenddate.getMonth() + 1)).slice(-2)+"-"+('0' + eenddate.getDate()).slice(-2)
                    let medicine=result[i].medicine.replace(/ /g,"_");
                    table+="<tr><td>"+result[i].medicine+"</td><td>"+startdate+"</td><td>"+eenddate+"</td><td>"+result[i].time1+"</td><td>"+result[i].time2+"</td><td>"+result[i].time3+"</td><td>"+result[i].reimanderstatus+"</td></tr>"
                }
                table+="</table>"
                res.send(table)
            }else{
                res.send("Medicine Entry Not Found")
            }
        })
    }else if(req.body.action=="openenterdata"){
        mcon.query("select * from patients where patients.secretcode='"+req.body.secretcode+"' AND patients.mobile='"+req.body.mobile+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                let info2=[]
                info2.push(results[0].userid)
                info2.push(results[0].username)
                info2.push(results[0].email)
                info2.push(req.session.hospitalname)
                info2.push(req.session.hosp_address)
                res.send(info2)
                
            }else{
                res.send("Code or Mobile No. Is wrong")
            }
        })
    }else if(req.body.action=="savediseaserecoreds"){
        let stdate=req.body.diseasestart+" 00:00:00"
        let ltdate=req.body.diseasestart+" 23:59:59"
        mcon.query("select * from diseaseparent where userid='"+req.body.pid+"' AND diseasename='"+req.body.diseasename+"' AND startdate between '"+stdate+"' AND '"+ltdate+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                res.send("Disease Enter With Similar Disease Is Found For Same Date")
            }else{
                var newId = uuidv4()
                mcon.query("insert into diseaseparent(userid,diseaseid,diseasename,startdate,endate,medicalficility,medicalfacilityaddress,createdate,symptoms)values('"+req.body.pid+"','"+newId+"','"+req.body.diseasename+"','"+req.body.diseasestart+"','"+req.body.diseaseend+"','"+req.body.clinic_hosp_name+"','"+req.body.clinic_hosp_address+"',now(),'"+req.body.symtoms+"')",function(err,result){
                    if(err) console.log(err)
                    else if(result.affectedRows>0){
                        res.send("Disease Entry is Saved")
                    }else{
                        res.send("error happend please try again")
                    }
                })
            }
        })
    }else if(req.body.action=="savemedicine"){
        let stdate=req.body.diseasestart+" 00:00:00"
        let ltdate=req.body.diseasestart+" 23:59:59"
        console.log(req.body.pid+" "+stdate+" "+req.body.diseasename)
        mcon.query("select * from diseaseparent where userid='"+req.body.pid+"' AND diseasename='"+req.body.diseasename+"' AND startdate between '"+stdate+"' AND '"+ltdate+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                mcon.query("select * from medicinetable where medicine='"+req.body.Medicinename+"' AND startfrom like'"+req.body.MedicineStart+"'",function(err,result2){
                    if(err) console.log(err)
                    else if(result2.length>0){
                        res.send("This medicine is register with same date")
                    }else{
                        mcon.query("insert into medicinetable(userid,diseaseid,medicine,startfrom,endfrom,reimanderstatus,createdate,time1,time2,time3)values('"+req.body.pid+"','"+results[0].diseaseid+"','"+req.body.Medicinename+"','"+req.body.MedicineStart+"','"+req.body.MedicineEnd+"','"+req.body.remainder+"',now(),'"+req.body.time1+"','"+req.body.time3+"','"+req.body.time2+"')",function(err,results3){
                            if(err) console.log(err)
                            else if(results3.affectedRows>0){
                                res.send("Successful")
                            }else{
                                res.send("error")
                            }
                        })
                    }
                })
            }else{
                res.send("No disease is register with this name and date")
            }
        }) 
    }else if(req.body.action=="getmedicnedatatable"){
        let stdate=req.body.diseasdate+" 00:00:00"
        let ltdate=req.body.diseasdate+" 23:59:59"
        mcon.query("select * from diseaseparent where userid='"+req.body.pid+"' AND diseasename='"+req.body.diseasename+"' AND startdate between '"+stdate+"' AND '"+ltdate+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                mcon.query("select * from medicinetable where userid='"+req.body.pid+"' AND diseaseid='"+results[0].diseaseid+"' order by startfrom DESC",function(err,result){
                    if(err) console.log(err)
                    else if(result.length>0){
                        let table = "<table><tr><th>Medicine</th><th>Start_From</th><th>EndOn</th><th>Time1</th><th>Time2</th><th>Time3</th><th>Remainder</th><th>Action</th></tr>"
                        for(let i=0;i<result.length;i++){
                            let startdate = new Date(result[i].startfrom)
                            let eenddate = new Date(result[i].endfrom)
                            startdate=startdate.getFullYear()+"-"+ ('0' + (startdate.getMonth() + 1)).slice(-2)+"-"+('0' + startdate.getDate()).slice(-2)
                            eenddate=eenddate.getFullYear()+"-"+ ('0' + (eenddate.getMonth() + 1)).slice(-2)+"-"+('0' + eenddate.getDate()).slice(-2)
                            let medicine=result[i].medicine.replace(/ /g,"_");
                            table+="<tr><td>"+result[i].medicine+"</td><td>"+startdate+"</td><td>"+eenddate+"</td><td>"+result[i].time1+"</td><td>"+result[i].time2+"</td><td>"+result[i].time3+"</td><td>"+result[i].reimanderstatus+"</td><td><button class='btn btn-primary w-100 py-3' onclick=deletemedicine('"+medicine+"','"+result[i].diseaseid+"')>Delete</button></td></tr>"
                        }
                        table+="</table>"
                        res.send(table)
                    }else{
                        res.send("Medicine Entry Not Found")
                    }
                })
            }else{
                res.send("Medicine Entry Not Found")
            }
        })
    }else if(req.body.action=="deletemedicine"){
        mcon.query("delete from medicinetable where diseaseid='"+req.body.disease+"' AND medicine='"+req.body.medicine+"'",function(err,results){
            if(err) console.log(err)
            else if(results.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("Unsuccessful")
            }
        })
    }else{
        res.send("Wrong Option")
        console.log("Error")
    }

})

app.post('/1/consultancy/hospitalhome',up,(req,res)=>{
    if(!req.session.userid){
        res.redirect('/1/consultancy/login')
    }else if(req.body.action=="gethospedit"){
        mcon.query("select * from hospital where hospitalid='"+req.session.userid+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                let info1 = []
                if(results[0].username==undefined || results[0].username==null){
                    info1.push("")
                }else{
                    info1.push(results[0].username)
                }
                if(results[0].hospitalname==undefined || results[0].hospitalname==null){
                    info1.push("")
                }else{
                    info1.push(results[0].hospitalname)
                }
                if(results[0].email==undefined || results[0].email==null){
                    info1.push("")
                }else{
                    info1.push(results[0].email)
                }
                if(results[0].mobile==undefined || results[0].mobile==null){
                    info1.push("")
                }else{
                    info1.push(results[0].mobile)
                }
                if(results[0].hrnno==undefined || results[0].hrnno==null){
                    info1.push("")
                }else{
                    info1.push(results[0].hrnno)
                }
                if(results[0].startedon==undefined || results[0].startedon==null){
                    info1.push("")
                }else{
                    info1.push(results[0].startedon)   
                }
                if(results[0].Address==undefined || results[0].Address==null){
                    info1.push("")

                }else{
                    info1.push(results[0].Address)
                }
                if(results[0].city==undefined || results[0].city==null){
                    info1.push("")
                }else{
                    info1.push(results[0].city)
                }
                if(results[0].state==undefined || results[0].state==null){
                    info1.push("")

                }else{
                    info1.push(results[0].state)
                }
                if(results[0].specializedin==undefined || results[0].specializedin==null){
                    info1.push("")

                }else{
                    info1.push(results[0].specializedin)
                }
                res.send(info1)
            }else{
                res.send("No Info")
            }
        })
    }else if(req.body.action == "savehospprof"){
        mcon.query("update hospital set username='"+req.body.husername1+"', specializedin='"+req.body.specialization+"', hospitalname='"+req.body.hname1+"',email='"+req.body.hemail1+"',mobile='"+req.body.hmobileno1+"',hrnno='"+req.body.hrno1+"',city='"+req.body.hcity+"',state='"+req.body.hstate+"',startedon='"+req.body.hstarton+"',Address='"+req.body.hAddress+"' where hospitalid='"+req.session.userid+"'",function(err,results){
            if(err) console.log(err)
            else if(results.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("Unsuccessful")
            }
        })
    }else if(req.body.action=="savestaffdetails"){
        let userpass = req.body.hcomfirmpass
        try {
            userpass=md5(userpass)
        } catch (error) {
            console.log(error)
            res.send("error")
        }
        
        var newId = uuidv4()
        mcon.query("select * from hospitalstaff where mobile='"+req.body.mobilenostaff+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                res.send("This number is all ready registerd with this or another organization")
            }else{
                mcon.query("insert into hospitalstaff(userid,email,birthdate,hospitalid,mobile,aadharno,designation,experience,specialization,Age,joiningdate,address,username,password)values('"+newId+"','"+req.body.emailidstaff+"','"+req.body.birthstaff+"','"+req.session.userid+"','"+req.body.mobilenostaff+"','"+req.body.Adharno+"','"+req.body.position+"','"+req.body.experience+"','"+req.body.specialization+"','"+req.body.Age+"','"+req.body.joiningdatestaff+"','"+req.body.staffaddress+"','"+req.body.staffname+"','"+userpass+"')",function(err,results){
                    if(err) console.log(err)
                    else if(results.affectedRows>0){
                        res.send("Successful")
                    }else{
                        res.send("error")
                    }       
                })
            }
        })
    }else if(req.body.action=="stafftable"){
        mcon.query("select * from hospitalstaff where hospitalid='"+req.session.userid+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let table="<table><tr><th>username</th><th>email</th><th>mobile</th><th>designation</th><th>specialization</th><th>experience</th><th>aadharno</th><th>birthdate</th><th>joiningdate</th><th>Action</th></tr>"
                for(let i=0;i<result.length;i++){
                    let birthdate = new Date(result[i].birthdate)
                    let joiningdate = new Date(result[i].joiningdate)
                    birthdate=birthdate.getFullYear()+"-"+ ('0' + (birthdate.getMonth() + 1)).slice(-2)+"-"+('0' + birthdate.getDate()).slice(-2)
                    joiningdate=joiningdate.getFullYear()+"-"+ ('0' + (joiningdate.getMonth() + 1)).slice(-2)+"-"+('0' + joiningdate.getDate()).slice(-2)
                    table+="<tr><td>"+result[i].username+"</td><td>"+result[i].email+"</td><td>"+result[i].mobile+"</td><td>"+result[i].designation+"</td><td>"+result[i].specialization+"</td><td>"+result[i].experience+"</td><td>"+result[i].aadharno+"</td><td>"+birthdate+"</td><td>"+joiningdate+"</td><td><button class='btn btn-primary w-100 py-3' style='width:20px;' onclick=removestaff('"+result[i].userid+"')>Remove</button></td></tr>"
                }
                res.send(table)
            }else{
                res.send("No Data")
            }
        })

    }else if(req.body.action=="addresourcedet"){
        var newId = uuidv4();
        mcon.query("insert into `hospital resources`(hospitalid,resourcetype,resourcename,total_res,avail_res,createdate)values('"+req.session.userid+"','"+req.body.restype+"','"+req.body.resourcename+"','"+req.body.total_res+"','"+req.body.avail_res+"',now())",function(err,result){
            if(err) console.log(err)
            else if(result.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("Unsuccessful")
            }
        })

    }else if(req.body.action=="openforupres"){
        let resname = req.body.data1
        resname = resname.replace(/_/g," ");
        mcon.query("select * from `hospital resources` where hospitalid like'"+req.session.userid+"' AND resourcename='"+resname+"'",function(error,result){
            if(error) console.log(error) 
            else if(result.length>0){
                let info1 = []
                info1.push(result[0].resourcetype)
                info1.push(result[0].resourcename)
                info1.push(result[0].total_res)
                info1.push(result[0].avail_res)
                res.send(info1)
            }else{
                res.send("No Info")
            }
        })
    }else if(req.body.action=="updateresourcedata"){
        mcon.query("update `hospital resources` set resourcetype='"+req.body.restype+"', total_res='"+req.body.total_res+"',avail_res='"+req.body.avail_res+"' where hospitalid like'"+req.session.userid+"' AND resourcename='"+req.body.resourcename+"'",function(err,results){
            if(err) console.log(err)
            else if(results.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("Unsuccessful")
            }
        })
    }
    else if(req.body.action=="resourcesstatus"){
        mcon.query("select * from `hospital resources` where hospitalid like'"+req.session.userid+"' order by createdate",function(err,results){
            if(err) console.log(err) 
            else if(results.length>0){
                let data1="";
                for(let i=0;i<results.length;i++){
                    let resourcename = results[i].resourcename
                    resourcename = resourcename.replace(/ /g,"_");
                    data1+="<div class='col-lg-4 col-6'><div class='bg-light text-center rounded-circle py-4'><h6 class='mb-0' onclick=openforupres('"+resourcename+"')>"+results[i].resourcename+"<small class='d-block text-primary'>Total "+results[i].total_res+"</small><small class='d-block text-primary'>Avail "+results[i].avail_res+"</small></h6></div></div>"
                }
                if(results.length==1){
                    data1+="<div class='col-lg-4 col-6'><div class='bg-light text-center rounded-circle py-4'>No Data<h6 class='mb-0'>No Data<small class='d-block text-primary'>No Data</small></h6></div></div>"
                    data1+="<div class='col-lg-4 col-6'><div class='bg-light text-center rounded-circle py-4'>No Data<h6 class='mb-0'>No Data<small class='d-block text-primary'>No Data</small></h6></div></div>"
                }else if(results.length==2){
                    data1+="<div class='col-lg-4 col-6'>No Data<h6 class='mb-0'>No Data<small class='d-block text-primary'>No Data</small></h6></div></div>"
                }
                res.send(data1)
            }else{
                let data1="<div class='col-lg-4 col-6'><div class='bg-light text-center rounded-circle py-4'><h6 class='mb-0'>No Data<small class='d-block text-primary'>No Data</small></h6></div></div><div class='col-lg-4 col-6'><div class='bg-light text-center rounded-circle py-4'>No Data<h6 class='mb-0'>No Data<small class='d-block text-primary'>No Data</small></h6></div></div>"
                data1+="<div class='col-lg-4 col-6'>No Data<h6 class='mb-0'>No Data<small class='d-block text-primary'>No Data</small></h6></div></div>"
                res.send(data1)
            }
        })
    }else if(req.body.action=="displayrestable"){
        mcon.query("select * from `hospital resources` where hospitalid like'"+req.session.userid+"' order by createdate",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let table="<table><tr><th>Res. Type</th><th>Res.Name</th><th>Total Res.</th><th>Availble_Res</th></tr>"
                for(let i=0;i<result.length;i++){
                    table+="<tr><td>"+result[i].resourcetype+"</td><td>"+result[i].resourcename+"</td><td>"+result[i].total_res+"</td><td>"+result[i].avail_res+"</td></tr>"
                }
                res.send(table)
            }else{
                res.send("No Data")
            }
        })
    }else if(req.body.action=="removestaff"){
        mcon.query("delete from hospitalstaff where hospitalid='"+req.session.userid+"' AND userid='"+req.body.data1+"'",function(err,result){
            if(err) console.log(err)
            else if(result.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("unsuccessful")
            }
        })
    }else{
        console.log("Wrong Choice")
    }
})


app.post('/1/consultancy/login',up,(req,res)=>{
    if(req.body.action=="registeruser"){
        var username = req.body.username;
        var usermail = req.body.usermail
        var userdate = req.body.userdate
        var usermobile = req.body.usermobile
        var userpass = req.body.userpass;
        var newId = uuidv4()
        userpass = md5(userpass)

        if(username=="" || username==undefined || username == null || usermail=="" || usermail==undefined || usermail == null || userpass == "" || userpass == undefined){
            res.send("Some fields are missing")
        }
        if(userdate=="" || userdate==undefined || userdate == null || usermobile=="" || usermobile==undefined || usermobile == null){
            res.send("Some fields are missing")
        }
        mcon.query("select * from patients where mobile like'"+usermobile+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                res.send("This number is already registered")
            }else{
                mcon.query("insert into patients(userid,username,email,mobile,birthdate,password,createdate)values('"+newId+"','"+username+"','"+usermail+"','"+usermobile+"','"+userdate+"','"+userpass+"',now())",function(err,results){
                    if(err) console.log(err)
                    else if(results.affectedRows>0){
                        mcon.commit((err)=>{
                            if(err) console.log(err)
                        })
                        res.send("You have registered successfully")
                    }else{
                        res.send("Error Occured")
                    }
                })
            }
        })
    }else if(req.body.action=="hospitalregister"){
        var username = req.body.username;
        var hospitalname = req.body.hospitalname
        var hemail = req.body.hemail
        var startedon = req.body.startedon;
        var hmobile = req.body.hmobile;
        var hrnno=req.body.hrnno;
        var userpass=req.body.password;
        var newId = uuidv4()
        userpass = md5(userpass)

        if(username=="" || username==undefined || username == null || hospitalname=="" || hospitalname==undefined || hemail == null || hemail == "" || hemail == undefined){
            res.send("Some fields are missing")
        }
        if(hmobile=="" || hmobile==undefined || hmobile == null || userpass=="" || userpass==undefined || userpass == null){
            res.send("Some fields are missing")
        }
        mcon.query("select * from hospital where mobile like'"+hmobile+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                res.send("This number is already registered")
            }else{
                mcon.query("insert into hospital(hospitalid,username,hospitalname,email,mobile,hrnno,startedon,password,createddate)values('"+newId+"','"+username+"','"+hospitalname+"','"+hemail+"','"+hmobile+"','"+hrnno+"','"+startedon+"','"+userpass+"',now())",function(err,results){
                    if(err) console.log(err)
                    else if(results.affectedRows>0){
                        mcon.commit((err)=>{
                            if(err) console.log(err)
                        })
                        res.send("You have registered successfully")
                    }else{
                        res.send("Error Occured")
                    }
                })
            }
        })
    }
    else if(req.body.action=="login"){
        let userpass;
        let mobileno = req.body.mobileno;
        let loginty = req.body.logintype;
        try {
            userpass = md5(req.body.password);
        } catch (error) {
            console.log(error)
            userpass = " "
        }
        if(loginty=="patient"){
            mcon.query("select * from patients where mobile='"+mobileno+"' and password='"+userpass+"'",function(err,results){
                if(err){
                    console.log(err)
                    res.send(err)
                }
                else if(results.length>0){
                    req.session.userid=results[0].userid
                    req.session.username=results[0].username
                    req.session.email=results[0].email
                    req.session.mobile=results[0].mobile
                    req.session.userty="Patient"
                    res.send("Successful")
                
                }else{
                    res.send("Password or Mobile No are incorrect")
                }
            })
        }else if(loginty=="Hospital"){
            mcon.query("select * from hospital where mobile='"+mobileno+"' and password='"+userpass+"'",function(err,results){
                if(err) console.log(err)
                else if(results.length>0){
                    req.session.userid=results[0].hospitalid
                    req.session.username=results[0].username
                    req.session.hospitalname=results[0].hospitalname
                    req.session.email=results[0].email
                    req.session.mobile=results[0].mobile
                    req.session.userty="Hospital"
                    res.send("HSuccessful")
                }else{
                    res.send("Password or Mobile No are incorrect")
                }
            })
        }else if(loginty=="Hospitalstaff"){
            mcon.query("select hospitalstaff.hospitalid,hospitalstaff.userid,hospitalstaff.username,hospitalstaff.email,hospitalstaff.mobile,hospital.hospitalname,hospital.Address from hospitalstaff join hospital on hospitalstaff.hospitalid=hospital.hospitalid where hospitalstaff.mobile='"+mobileno+"' and hospitalstaff.password='"+userpass+"'",function(err,results){
                if(err) console.log(err)
                else if(results.length>0){
                    req.session.hospitalid=results[0].hospitalid
                    req.session.userid=results[0].userid
                    req.session.username=results[0].username
                    req.session.hospitalname=results[0].hospitalname
                    req.session.hosp_address=results[0].Address
                    req.session.email=results[0].email
                    req.session.mobile=results[0].mobile
                    req.session.userty="doctor"
                    res.send("HSuccessfulD")
                }else{
                    res.send("Password or Mobile No are incorrect")
                }
            })            
        }else{
            res.send("yet to be done")
        }
        
    }else if(req.body.action=="logout"){
        req.session.destroy();
        res.send("Ok")
    }else{
        console.log("Wrong Choice")
        res.send("wrong Choice")
    }    
})
app.get('/1/home/consultancy',(req,res)=>{
    res.render('home2.pug')
})
app.post('/1/consultancy/patienthome',up,(req,res)=>{
    if(!req.session.userid){
        res.redirect('/1/consultancy/login')
    }else if(req.body.action=="medicinelist22"){
        mcon.query("select * from medicinetable where userid='"+req.session.userid+"' order by startfrom DESC",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let table = "<table><tr><th>Medicine</th><th>Start_From</th><th>EndOn</th><th>Time1</th><th>Time2</th><th>Time3</th><th>Remainder</th><th>Action</th></tr>"
                for(let i=0;i<result.length;i++){
                    let startdate = new Date(result[i].startfrom)
                    let eenddate = new Date(result[i].endfrom)
                    startdate=startdate.getFullYear()+"-"+ ('0' + (startdate.getMonth() + 1)).slice(-2)+"-"+('0' + startdate.getDate()).slice(-2)
                    eenddate=eenddate.getFullYear()+"-"+ ('0' + (eenddate.getMonth() + 1)).slice(-2)+"-"+('0' + eenddate.getDate()).slice(-2)
                    let medicine=result[i].medicine.replace(/ /g,"_");
                    table+="<tr><td>"+result[i].medicine+"</td><td>"+startdate+"</td><td>"+eenddate+"</td><td>"+result[i].time1+"</td><td>"+result[i].time2+"</td><td>"+result[i].time3+"</td><td>"+result[i].reimanderstatus+"</td><td><button class='btn btn-primary w-100 py-3' onclick=changeremainderstatus('"+medicine+"','"+result[i].diseaseid+"','"+result[i].reimanderstatus+"')>Change</button></td></tr>"
                }
                table+="</table>"
                res.send(table)
            }else{
                res.send("Medicine Entry Not Found")
            }
        })        
    }else if(req.body.action=="changeremainderstatus"){
        let data12=req.body.data3
        if(data12=="Yes"){
            data12="No"
        }else{
            data12="Yes"
        }
        mcon.query("update medicinetable set reimanderstatus='"+data12+"' where userid='"+req.session.userid+"' AND diseaseid='"+req.body.data2+"' AND medicine='"+req.body.data1+"'",function(err,result){
            if(err) console.log(err)
            else if(result.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("error")
            }
        })
    }
    else if(req.body.action=='pridicate'){
        var dataToSend;
        // spawn new child process to call the python script'Itching,Skin Rash,Nodal Skin Eruptions'
        const python = spawn('python', ['predicatiion.py',req.body.symptoms]);
        // collect data from script
        python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        dataToSend=dataToSend.replace(/[^a-zA-Z]/g," ")
        data2=dataToSend.split("  ")
        let arr=[]
        arr.push(data2[3])
        arr.push(data2[7])
        arr.push(data2[11])
        arr.push(data2[15])
        res.send(arr)
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
            if(code==1 || code == "1"){
                res.send("No Disease with similar symptoms found")
            }
        // send data to browser
        });
    }else if(req.body.action=='secretcodegen'){
        let passkey = Math.random().toString(36).slice(2, 10)
        
        mcon.query("update patients set secretcode='"+passkey+"' where userid='"+req.session.userid+"'",function(err,result){
            if(err) console.log(err)
            else if(result.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("Unsuccessful")
            }
        })
    }else if(req.body.action=="getprofinfo"){
        mcon.query("select * from patients where userid='"+req.session.userid+"'",function(err,results){
            if(err){
                console.log(err)
            }
            else if(results.length>0){
                let array = []
                if(results[0].mobile=="" || results[0].mobile==null || results[0].mobile==undefined)
                    array.push("");
                else{
                    array.push(results[0].mobile);
                }
                if(results[0].username=="" || results[0].username==null || results[0].username==undefined)
                    array.push("");
                else{
                    array.push(results[0].username);
                }
                if(results[0].email=="" || results[0].email==null || results[0].email==undefined)
                    array.push("");
                else{
                    array.push(results[0].email);
                }
                if(results[0].birthdate=="" || results[0].birthdate==null || results[0].birthdate==undefined)
                    array.push("");
                else{
                    array.push(results[0].birthdate);
                }
                if(results[0].adharno=="" || results[0].adharno==null || results[0].adharno==undefined)
                    array.push("");
                else{
                    array.push(results[0].adharno);
                }
                if(results[0].Age=="" || results[0].Age==null || results[0].Age==undefined)
                    array.push("");
                else{
                    array.push(results[0].Age);
                }
                if(results[0].Address=="" || results[0].Address==null || results[0].Address==undefined)
                    array.push("");
                else{
                    array.push(results[0].Address);
                }
                if(results[0].bloodgroup=="" || results[0].bloodgroup==null || results[0].bloodgroup==undefined)
                    array.push("");
                else{
                    array.push(results[0].bloodgroup);
                }
                if(results[0].secretcode=="" || results[0].secretcode==null || results[0].secretcode==undefined)
                    array.push("");
                else{
                    array.push(results[0].secretcode);
                }
                res.send(array)            
            }else{
                res.send("error")
            }
        })

    }else if(req.body.action=="seemedicines"){
        mcon.query("select * from medicinetable where userid='"+req.session.userid+"' AND diseaseid='"+req.body.data1+"' order by startfrom DESC",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let table = "<table><tr><th>Medicine</th><th>Start_From</th><th>EndOn</th><th>Time1</th><th>Time2</th><th>Time3</th><th>Remainder</th><th>Action</th></tr>"
                for(let i=0;i<result.length;i++){
                    let startdate = new Date(result[i].startfrom)
                    let eenddate = new Date(result[i].endfrom)
                    startdate=startdate.getFullYear()+"-"+ ('0' + (startdate.getMonth() + 1)).slice(-2)+"-"+('0' + startdate.getDate()).slice(-2)
                    eenddate=eenddate.getFullYear()+"-"+ ('0' + (eenddate.getMonth() + 1)).slice(-2)+"-"+('0' + eenddate.getDate()).slice(-2)
                    let medicine=result[i].medicine.replace(/ /g,"_");
                    table+="<tr><td>"+result[i].medicine+"</td><td>"+startdate+"</td><td>"+eenddate+"</td><td>"+result[i].time1+"</td><td>"+result[i].time2+"</td><td>"+result[i].time3+"</td><td>"+result[i].reimanderstatus+"</td><td><button class='btn btn-primary w-100 py-3' onclick=deletemedicine('"+medicine+"','"+result[i].diseaseid+"')>Delete</button></td></tr>"
                }
                table+="</table>"
                res.send(table)
            }else{
                res.send("Medicine Entry Not Found")
            }
        })
    }else if(req.body.action=="seehistory"){
        mcon.query("select * from diseaseparent where userid='"+req.session.userid+"' order by startdate DESC",function(err,results){
            if(err) console.log(err) 
            else if(results.length>0){
                let table = "<table><tr><th>Disease_Name</th><th>Medical_faculty</th><th>Address</th><th>Start</th><th>End</th><th>Symptoms</th><th>Action</th><th>Action</th></tr>"
                for(let i=0;i<results.length;i++){
                    let startdate = new Date(results[i].startdate)
                    let eenddate = new Date(results[i].endate)
                    startdate=startdate.getFullYear()+"-"+ ('0' + (startdate.getMonth() + 1)).slice(-2)+"-"+('0' + startdate.getDate()).slice(-2)
                    eenddate=eenddate.getFullYear()+"-"+ ('0' + (eenddate.getMonth() + 1)).slice(-2)+"-"+('0' + eenddate.getDate()).slice(-2)
                    table+="<tr><td onclick=openeditemedicine('"+results[i].diseaseid+"')>"+results[i].diseasename+"</td><td>"+results[i].medicalficility+"</td><td>"+results[i].medicalfacilityaddress+"</td><td>"+startdate+"</td><td>"+eenddate+"</td><td>"+results[i].symptoms+"</td><td><button class='btn btn-primary w-100 py-3' onclick=seemedicines('"+results[i].diseaseid+"')>See Medicines</button></td><td><button class='btn btn-primary w-100 py-3' onclick=deletediseasehist('"+results[i].diseaseid+"')>Delete</button></td></tr>"
                }
                table+="</table>"
                res.send(table)
            }else{
                res.send("No Data")
            }
        })
    }else if(req.body.action=="openeditemedicine"){
        mcon.query("select * from diseaseparent where userid='"+req.session.userid+"' AND diseaseid='"+req.body.data1+"' order by startdate DESC",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                let info1=[]
                let startdate = new Date(results[0].startdate)
                let eenddate = new Date(results[0].endate)
                startdate=startdate.getFullYear()+"-"+ ('0' + (startdate.getMonth() + 1)).slice(-2)+"-"+('0' + startdate.getDate()).slice(-2)
                eenddate=eenddate.getFullYear()+"-"+ ('0' + (eenddate.getMonth() + 1)).slice(-2)+"-"+('0' + eenddate.getDate()).slice(-2)
                info1.push(results[0].diseasename)
                info1.push(results[0].medicalficility)
                info1.push(results[0].medicalfacilityaddress)
                info1.push(results[0].symptoms)
                info1.push(startdate)
                info1.push(eenddate)
                res.send(info1)
            }else{
                res.send("No Data")
            }
        })
    }else if(req.body.action=="deletediseasehist"){
        mcon.query("delete from diseaseparent where userid='"+req.session.userid+"' AND diseaseid='"+req.body.data1+"'",function(err,results){
            if(err) console.log(err)
            else if(results.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("Error")
            }
        })
        
    }else if(req.body.action=="seehistappoint"){
        
        mcon.query("select booking.appointdate,booking.time,booking.drstatus,booking.userstatus,booking.modifieddate,hospital.hospitalname,hospitalstaff.username from booking join hospital on booking.hospitalid=hospital.hospitalid join hospitalstaff on booking.doctorid=hospitalstaff.userid where booking.userid='"+req.session.userid+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let table = "<table><tr><th>Hospital_Name</th><th>Doctor Name</th><th>BOOK_Date</th><th>Time</th><th>Status</th></tr>"
                for(let i=0;i<result.length;i++){
                    let startdate = new Date(result[i].appointdate)
                    startdate=startdate.getFullYear()+"-"+ ('0' + (startdate.getMonth() + 1)).slice(-2)+"-"+('0' + startdate.getDate()).slice(-2)
                    let medicine=result[i].medicine.replace(/ /g,"_");
                    table+="<tr><td>"+result[i].hospitalname+"</td><td>"+result[i].username+"</td><td>"+startdate+"</td><td>"+result[i].time+"</td><td>"+result[i].drstatus+"</td></tr>"
                }
                table+="</table>"
                res.send(table)
            }else{
                res.send("No Data")
            }
        })
    }else if(req.body.action=="saveprofchange"){
        mcon.query("update patients set mobile='"+req.body.mobileno1+"',bloodgroup='"+req.body.bloodgroup1+"',Address='"+req.body.Address+"',Age='"+req.body.Age1+"',adharno='"+req.body.aadharno1+"',birthdate='"+req.body.birthdate1+"',email='"+req.body.yemail1+"',username='"+req.body.yname1+"' where userid='"+req.session.userid+"'",function(err,result){
            if(err) console.log(err)
            else if(result.affectedRows>0){
                res.send("Updated")
            }else{
                res.send("Unsuccessful")
            }
        })
    }else if(req.body.action=="savediseaserecoreds"){
        let stdate=req.body.diseasestart+" 00:00:00"
        let ltdate=req.body.diseasestart+" 23:59:59"
        mcon.query("select * from diseaseparent where userid='"+req.session.userid+"' AND diseasename='"+req.body.diseasename+"' AND startdate between '"+stdate+"' AND '"+ltdate+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                res.send("Disease Enter With Similar Disease Is Found For Same Date")
            }else{
                var newId = uuidv4()
                mcon.query("insert into diseaseparent(userid,diseaseid,diseasename,startdate,endate,medicalficility,medicalfacilityaddress,createdate,symptoms)values('"+req.session.userid+"','"+newId+"','"+req.body.diseasename+"','"+req.body.diseasestart+"','"+req.body.diseaseend+"','"+req.body.clinic_hosp_name+"','"+req.body.clinic_hosp_address+"',now(),'"+req.body.symtoms+"')",function(err,result){
                    if(err) console.log(err)
                    else if(result.affectedRows>0){
                        res.send("Disease Entry is Saved")
                    }else{
                        res.send("error happend please try again")
                    }
                })
            }
        })
    }else if(req.body.action=="savemedicine"){
        let stdate=req.body.diseasestart+" 00:00:00"
        let ltdate=req.body.diseasestart+" 23:59:59"
        mcon.query("select * from diseaseparent where userid='"+req.session.userid+"' AND diseasename='"+req.body.diseasename+"' AND startdate between '"+stdate+"' AND '"+ltdate+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                mcon.query("select * from medicinetable where medicine='"+req.body.Medicinename+"' AND startfrom like'"+req.body.MedicineStart+"'",function(err,result2){
                    if(err) console.log(err)
                    else if(result2.length>0){
                        res.send("This medicine is register with same date")
                    }else{
                        mcon.query("insert into medicinetable(userid,diseaseid,medicine,startfrom,endfrom,reimanderstatus,createdate,time1,time2,time3)values('"+req.session.userid+"','"+results[0].diseaseid+"','"+req.body.Medicinename+"','"+req.body.MedicineStart+"','"+req.body.MedicineEnd+"','"+req.body.remainder+"',now(),'"+req.body.time1+"','"+req.body.time3+"','"+req.body.time2+"')",function(err,results3){
                            if(err) console.log(err)
                            else if(results3.affectedRows>0){
                                res.send("Successful")
                            }else{
                                res.send("error")
                            }
                        })
                    }
                })
            }else{
                res.send("No disease is register with this name and date")
            }
        }) 
    }else if(req.body.action=="applyforbook"){
        mcon.query("insert into booking(hospitalid,doctorid,userid,appointdate,time,drstatus,userstatus,createdate,modifieddate)values('"+req.body.hospitalid+"','"+req.body.drlist+"','"+req.session.userid+"','"+req.body.bookdate+"','"+req.body.booktime+"','Pending','Approved',now(),now())",function(err,results){
            if(err) console.log(err)
            else if(results.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("Unsuccessful")
            }
        })
    }else if(req.body.action=="getmedicnedatatable"){
        let stdate=req.body.diseasdate+" 00:00:00"
        let ltdate=req.body.diseasdate+" 23:59:59"
        mcon.query("select * from diseaseparent where userid='"+req.session.userid+"' AND diseasename='"+req.body.diseasename+"' AND startdate between '"+stdate+"' AND '"+ltdate+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                mcon.query("select * from medicinetable where userid='"+req.session.userid+"' AND diseaseid='"+results[0].diseaseid+"' order by startfrom DESC",function(err,result){
                    if(err) console.log(err)
                    else if(result.length>0){
                        let table = "<table><tr><th>Medicine</th><th>Start_From</th><th>EndOn</th><th>Time1</th><th>Time2</th><th>Time3</th><th>Remainder</th><th>Action</th></tr>"
                        for(let i=0;i<result.length;i++){
                            let startdate = new Date(result[i].startfrom)
                            let eenddate = new Date(result[i].endfrom)
                            startdate=startdate.getFullYear()+"-"+ ('0' + (startdate.getMonth() + 1)).slice(-2)+"-"+('0' + startdate.getDate()).slice(-2)
                            eenddate=eenddate.getFullYear()+"-"+ ('0' + (eenddate.getMonth() + 1)).slice(-2)+"-"+('0' + eenddate.getDate()).slice(-2)
                            let medicine=result[i].medicine.replace(/ /g,"_");
                            table+="<tr><td>"+result[i].medicine+"</td><td>"+startdate+"</td><td>"+eenddate+"</td><td>"+result[i].time1+"</td><td>"+result[i].time2+"</td><td>"+result[i].time3+"</td><td>"+result[i].reimanderstatus+"</td><td><button class='btn btn-primary w-100 py-3' onclick=deletemedicine('"+medicine+"','"+result[i].diseaseid+"')>Delete</button></td></tr>"
                        }
                        table+="</table>"
                        res.send(table)
                    }else{
                        res.send("Medicine Entry Not Found")
                    }
                })
            }else{
                res.send("Medicine Entry Not Found")
            }
        })
    }else if(req.body.action=="deletemedicine"){
        mcon.query("delete from medicinetable where diseaseid='"+req.body.disease+"' AND medicine='"+req.body.medicine+"'",function(err,results){
            if(err) console.log(err)
            else if(results.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("Unsuccessful")
            }
        })
    }else if(req.body.action=="gethospitallist"){
        let data2 = req.body.data1;
        if(data2==null || data2==undefined || data2==""){
           data2="";
        }
        mcon.query("select * from hospital where city like'%"+data2+"%'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                let table="<table><tr><th>Hospital_Name</th><th>E-mail</th><th>Mobile</th><th>HRN_No</th><th>Address</th><th>City</th><th>Specializedin</th></tr>"
                for(let i=0;i<results.length;i++){
                    resname = results[i].hospitalname.replace(/ /g,"_");
                    table+="<tr><td onclick=openappointment('"+results[i].hospitalid+"','"+resname+"')>"+results[i].hospitalname+"</td><td>"+results[i].email+"</td><td>"+results[i].mobile+"</td><td>"+results[i].hrnno+"</td><td>"+results[i].Address+"</td><td>"+results[i].city+"</td><td>"+results[i].specializedin+"</td></tr>"
                }
                table+="</table>"
                res.send(table)
            }else{
                res.send("No Data")
            }

        })
    }else if(req.body.action=="openappointment"){
        mcon.query("SELECT * FROM `hospital resources` where hospitalid='"+req.body.data1+"'",function(err,results){
             if(err) console.log(err)
             else if(results.length>0){
                let table = "<table><tr><th>Resource_Type</th><th>Resource_Name</th><th>Total Resource</th><th>Available_Resource</th></tr>"
                for(let i=0;i<results.length;i++){
                    table+="<tr><td>"+results[i].resourcetype+"</td><td>"+results[i].resourcename+"</td><td>"+results[i].total_res+"</td><td>"+results[i].avail_res+"</td></tr>"
                }
                table+="</table>";
                res.send(table)
             }else{
                res.send("No Info")
             }
        })
    }else if(req.body.action=="getdoctorlist"){
        mcon.query("select username as Drname,userid as id from hospitalstaff where hospitalid='"+req.body.data1+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                res.send(results)
            }else{
                res.send("No Data")
            }
        })
    }
    else if(req.body.action=="notifyMe"){
        let startdate = new Date()
        let startdate1=startdate.getFullYear()+"-"+ ('0' + (startdate.getMonth() + 1)).slice(-2)+"-"+('0' + startdate.getDate()).slice(-2)
        mcon.query("select * from medicinetable where userid='"+req.session.userid+"' AND reimanderstatus='Yes' AND '"+startdate1+"'>=startfrom AND endfrom>='"+startdate1+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                let data = ""
                let newdate = new Date()
                for(let i=0;i<results.length;i++){
                    if(results[i].time1!=undefined && results[i].time1!=null && results[i].time1!=""){
                        let newdate = new Date(startdate1+" "+results[i].time1)
                        var diff = newdate.getTime() - startdate.getTime();
                        var msec = diff;
                        var hh = Math.floor(msec / 1000 / 60 / 60);
                        msec -= hh * 1000 * 60 * 60;
                        var mm = Math.floor(msec / 1000 / 60);
                        msec -= mm * 1000 * 60;
                        var ss = Math.floor(msec / 1000);
                        msec -= ss * 1000;
                        if((hh == 0|| hh=='00') && (mm==10 || mm == 5)){
                            data+=results[i].medicine+" "+results[i].time1+", " 
                        }
                    }
                    if(results[i].time2!=undefined && results[i].time2!=null && results[i].time2!=""){
                        let newdate = new Date(startdate1+" "+results[i].time2)
                        var diff = newdate.getTime() - startdate.getTime();
                        var msec = diff;
                        var hh = Math.floor(msec / 1000 / 60 / 60);
                        msec -= hh * 1000 * 60 * 60;
                        var mm = Math.floor(msec / 1000 / 60);
                        msec -= mm * 1000 * 60;
                        var ss = Math.floor(msec / 1000);
                        msec -= ss * 1000;
                        if((hh == 0|| hh=='00') && (mm==10 || mm == 5)){
                            data+=results[i].medicine+" "+results[i].time2+", " 
                        }
                    }if(results[i].time3!=undefined && results[i].time3!=null && results[i].time3!=""){
                        let newdate = new Date(startdate1+" "+results[i].time3)
                        var diff = newdate.getTime() - startdate.getTime();
                        var msec = diff;
                        var hh = Math.floor(msec / 1000 / 60 / 60);
                        msec -= hh * 1000 * 60 * 60;
                        var mm = Math.floor(msec / 1000 / 60);
                        msec -= mm * 1000 * 60;
                        var ss = Math.floor(msec / 1000);
                        msec -= ss * 1000;
                        if((hh == 0|| hh=='00') && (mm==10 || mm == 5)){
                            data+=results[i].medicine+" "+results[i].time3+", " 
                        }
                    }
                }
                if(data==""){
                    data="No Data"
                }
                res.send(data)
            }else{
                res.send("No Data")
            } 
        })
    }
    else{
        console.log("Wrong Option")
        res.send("Wrong Choice")
    }
})
app.listen(port, ()=>{
    console.log('Server started at  port ${port}')
});


