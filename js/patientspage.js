function seehistappoint(){
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'seehistappoint',
      },
      cache: false,
      success: function savefun(res){
         alert(res)
         if(res=="Error"){
             alert(res)
         }else{
            document.getElementById("popuibooking").style.display="flex"
            let dialogbox = document.getElementById("historypopup")
            dialogbox.showModal();
            document.getElementById("displayappointment").value=res
         }
      }
   })
}
function close10(){
   document.getElementById("popuibooking").style.display="none"
   let dialogbox = document.getElementById("historypopup")
   dialogbox.close();
}

function secretcodegen(){
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'secretcodegen',
      },
      cache: false,
      success: function savefun(res){
         console.log(res)
         if(res=="Error"){
             alert(res)
         }else{
            alert("Successful")
            openeditprof();
         }
      }
   })
}


function pridicate(){
    if($("#Symptomspre").val()==""){
        return alert("Some Fields are missing")
     }
     $.ajax({
        url:'/1/consultancy/patienthome',
        type:'POST',
        data:{
           action: 'pridicate',
           symptoms: $("#Symptomspre").val(),
        },
        cache: false,
        success: function savefun(res){
           if(res=="No Disease with similar symptoms found"){
               alert(res)
           }else{
               document.getElementById("displayresult").innerHTML="Results1: "+res[0]+"</br> Results2: "+res[1]+"</br> Results3: "+res[2]+"</br> Final: "+res[3]        
           }
        }
     })
}


function saveprofchange(){
   let yname1 = $("#yname1").val();
   let yemail1 = $("#yemail1").val();
   let mobileno1 = $("#mobileno1").val();
   let birthdate1 = $("#birthdate1").val();
   let aadharno1 = $("#aadharno1").val();
   let Age1 = $("#Age1").val();
   let bloodgroup1 = $("#bloodgroup1").val();
   let Address = $("#Address").val();
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'saveprofchange',
         yname1:yname1,
         yemail1:yemail1,
         mobileno1:mobileno1,
         birthdate1:birthdate1,
         aadharno1:aadharno1,
         Age1:Age1,
         bloodgroup1:bloodgroup1,
         Address:Address,
      },
      cache: false,
      success: function savefun(res){
         alert(res)
      }
   })
}

function applyforbook(){
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'applyforbook',
         drlist: $("#drlist").val(),
         bookdate: $("#bookdate").val(),
         booktime: $("#booktime").val(),
         bookphno: $("#bookphno").val(),
         bookemail: $("#bookemail").val(),
         hospitalid: $("#hospitalidh").val(),
      },
      cache: false,
      success: function savefun(res){
         alert(res)
      }
   })
}

function clear4(){
   document.getElementById("bookdate").value="";
   document.getElementById("booktime").value="";
   document.querySelector("#drlist").value="Select";
}

function savediseaserecoreds(){
   let diseasename = $("#diseasename").val()
   let diseasestart = $("#diseasestart").val()
   let diseaseend = $("#diseaseend").val()
   let clinic_hosp_name = $("#clinic_hosp_name").val()
   let clinic_hosp_address = $("#clinic_hosp_address").val()
   let symtoms = $("#symtoms").val()
   if(diseasename=="" || diseasestart=="" || diseaseend=="" || clinic_hosp_name=="" || clinic_hosp_address=="" || symtoms == ""){
      return alert("Some fields are missin")
   }
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'savediseaserecoreds',
         diseasename: diseasename,
         diseasestart: diseasestart,
         diseaseend: diseaseend,
         clinic_hosp_name: clinic_hosp_name,
         clinic_hosp_address: clinic_hosp_address,
         symtoms: symtoms,
      },
      cache: false,
      success: function savefun(res){
         alert(res)
      }
   })
}

function savemedicine(){
   let diseasename = $("#diseasename").val()
   let diseasestart = $("#diseasestart").val()
   if(diseasename=="" || diseasestart==""){
      return alert("Disease Name And Start Date is required")
   }
   let Medicinename = $("#Medicinename").val();
   let MedicineStart = $("#MedicineStart").val();
   let MedicineEnd = $("#MedicineEnd").val();
   let time1 = $("#time1").val()
   let time3 = $("#time3").val()
   let time2 = $("#time2").val()
   if(Medicinename=="" || MedicineStart=="" || MedicineEnd==""){
      return alert("Please Enter Medicine Name, Start and End Date")
   }
   if(time1!="" || time!="" || time!=""){}else{return alert("Please Enter atleast one time")}

   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'savemedicine',
         diseasename: diseasename,
         diseasestart: diseasestart,
         Medicinename: Medicinename,
         MedicineStart: MedicineStart,
         MedicineEnd: MedicineEnd,
         time1: time1,
         time3: time3,
         time2: time2,
         remainder: $("#setremainder").val()
      },
      cache: false,
      success: function savefun(res){
         alert(res)
         getmedicnedatatable("displaytbl",diseasename,diseasestart)
      }
   })
}
function openeditemedicine(data1){
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'openeditemedicine',
         data1: data1, 
      },
      cache: false,
      success: function savefun(res){
         if(res!="No Data"){
            openeditmedicalhist();
            document.getElementById("diseasename").value=res[0]
            document.getElementById("diseasestart").value=res[4]
            document.getElementById("diseaseend").value=res[5]
            document.getElementById("clinic_hosp_name").value=res[1]
            document.getElementById("clinic_hosp_address").value=res[2]
            document.getElementById("symtoms").value=res[3]
            getmedicnedatatable("displaytbl",res[1],res[4])
         }else{
            alert("Error")
         }
      }
   })
}

function openpredictpage(){
   document.getElementById("homecontent").style.display="none";
   document.getElementById("predicationui").style.display="block";
   document.getElementById("medicineediteui").style.display="none";
   document.getElementById("seemedicalui").style.display="none";
   document.getElementById("appointmentinfo").style.display="none";
}
function openeditmedicalhist(){
   document.getElementById("homecontent").style.display="none";
   document.getElementById("predicationui").style.display="none";
   document.getElementById("medicineediteui").style.display="block";
   document.getElementById("seemedicalui").style.display="none";
   document.getElementById("appointmentinfo").style.display="none";
}
function openseemedicalhist(){
   document.getElementById("homecontent").style.display="none";
   document.getElementById("predicationui").style.display="none";
   document.getElementById("medicineediteui").style.display="none";
   document.getElementById("seemedicalui").style.display="block";
   document.getElementById("appointmentinfo").style.display="none";
   seehistory()
}
function openappointment12(){
   document.getElementById("homecontent").style.display="none";
   document.getElementById("predicationui").style.display="none";
   document.getElementById("medicineediteui").style.display="none";
   document.getElementById("seemedicalui").style.display="none";
   document.getElementById("appointmentinfo").style.display="block";
   gethospitallist('')
}

function openappointment(data1,data2){
   document.getElementById("hospitalidh").value=data1
   document.getElementById("bookappointment1").style.display="flex"
   document.getElementById("bookhospital").value=data2.replace(/_/g," ");
   let dialogbox = document.getElementById("bookappointment")
   dialogbox.showModal();
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'openappointment',
         data1:data1,
      },
      cache: false,
      success: function savefun(res){
         document.getElementById("bookinfofacility").innerHTML=res
         getdoctorlist()
      }
   })
}


function getdoctorlist(){
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'getdoctorlist',
         data1:$("#hospitalidh").val(),
      },
      cache: false,
      success: function savefun(res){
         if(res!="No Data"){
            document.getElementById("drlist").options.length=0; 
            $('#drlist').append(new Option("Choose Dr.", "Select"));  
            for(let i=0;i<res.length;i++){
               optionText =  res[i].Drname;
               optionValue = res[i].userid;
               $('#drlist').append(new Option(optionText, optionValue));  
            }

         }
      }
   })
}

function close9(){
   document.getElementById("bookappointment1").style.display="none"
   let dialogbox = document.getElementById("bookappointment")
   dialogbox.close();
}


function deletediseasehist(data1){
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'deletediseasehist',
         data1:data1,
      },
      cache: false,
      success: function savefun(res){
         alert(res)
         seehistory()
      }
   })
}

function medicinelist22(){
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'medicinelist22',
      },
      cache: false,
      async: false,
      success: function savefun(res){
         
         document.getElementById('remainderchnage').innerHTML=res
      }
   })
}

function changeremainderstatus(data1, data2, data3){
   let datan1 = data1.replace(/_/g," ");
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'changeremainderstatus',
         data1: datan1,
         data2: data2,
         data3: data3,
      },
      cache: false,
      async: false,
      success: function savefun(res){
         alert(res)
         medicinelist22()
      }
   })

}

function openreadmorepopup(){
   document.getElementById("readmoreUi").style.display="flex"
   let dialogbox = document.getElementById("readmorepop")
   dialogbox.showModal();

}

function openremaindeoption(){
   document.getElementById("remainderchangeop").style.display="flex"
   let dialogbox = document.getElementById("remainderpopup")
   dialogbox.showModal();
   medicinelist22()
}


function close7(){
   document.getElementById("readmoreUi").style.display="none"
   let dialogbox = document.getElementById("readmorepop")
   dialogbox.close();
}

function close6(){
   document.getElementById("remainderchangeop").style.display="none"
   let dialogbox = document.getElementById("remainderpopup")
   dialogbox.close();
}

function close2(){
   document.getElementById("editpopmain").style.display="none"
   let dialogbox = document.getElementById("myproeditui")
   dialogbox.close();
}


function gethospitallist(data1){
   let data2 = data1;

   if(data2==null || data2==undefined || data2==""){
      data2=$("#cityfilter").val()
   }
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: "gethospitallist",
         data1: data2,
      },
      cache: false,
      success: function savefun(res){
         document.getElementById("appointmentinfo2").innerHTML=res
      }
   })
}


function clear3(){
   document.getElementById("Medicinename").value="";
   document.getElementById("MedicineStart").value="";
   document.getElementById("MedicineEnd").value="";
   document.getElementById("time1").value="";
   document.getElementById("time3").value="";
   document.getElementById("time2").value="";
   document.querySelector("#setremainder").value="No"

}

function clear2(){
   document.getElementById("diseasename").value="";
   document.getElementById("diseasestart").value="";
   document.getElementById("diseaseend").value="";
   document.getElementById("clinic_hosp_name").value="";
   document.getElementById("clinic_hosp_address").value="";
   document.getElementById("symtoms").value="";
}

function clear1(){
   document.getElementById("Symptomspre").value=""
}



function openeditprof(){
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'getprofinfo',
      },
      cache: false,
      success: function savefun(res){
         console.log(res)
         if(res=="Error"){
             alert(res)
         }else{
            document.getElementById("yname").value=res[1]
            document.getElementById("yemail").value=res[2]
            document.getElementById("mobileno1").value=res[0]
            
            if(res[3]!="" && res[3]!=null && res[3]!=undefined){
               let date12 = new Date(res[3])
               document.getElementById("birthdate1").value= date12.getFullYear()+"-"+ ('0' + (date12.getMonth() + 1)).slice(-2)+"-"+('0' + date12.getDate()).slice(-2)
            }
            document.getElementById("aadharno1").value=res[4]
            document.getElementById("Age1").value=res[5]
            document.getElementById("bloodgroup1").value=res[7]
            document.getElementById("Address").value=res[6]
            document.getElementById("secretcode").value=res[8]
         }
      }
   })  
   document.getElementById("editpopmain").style.display="flex"
   try {
      let dialogbox = document.getElementById("myproeditui")
      dialogbox.showModal();     
   } catch (error) {
      
   }
 
}

function close5(){
   document.getElementById("medicinepoptable").style.display="none"
   let dialogbox = document.getElementById("medicineuipop")
   dialogbox.close();
}

function seemedicines(data1){
   document.getElementById("medicinepoptable").style.display="flex"
   let dialogbox = document.getElementById("medicineuipop")
   dialogbox.showModal();
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: "seemedicines",
         data1:data1,
      },
      cache: false,
      success: function savefun(res){
         if(res!="Medicine Entry Not Found"){
            document.getElementById("displaymedicinetable").innerHTML=res
         }
      }
   })
}

function getmedicnedatatable(dsiplayloc,diseasename,diseasdate){
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'getmedicnedatatable',
         diseasename:diseasename,
         diseasdate:diseasdate,
      },
      cache: false,
      success: function savefun(res){
          if(res!="Medicine Entry Not Found"){
            document.getElementById(dsiplayloc).innerHTML=res
          }
      }
   })

}

function deletemedicine(data1,data2){
   let medicine = data1.replace(/_/g," ");
   let diseasename = $("#diseasename").val()
   let diseasestart = $("#diseasestart").val()
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'deletemedicine',
         medicine:medicine,
         disease:data2,
      },
      cache: false,
      success: function savefun(res){
         alert(res)
         getmedicnedatatable("displaytbl",diseasename,diseasestart)
         try {
            close5();
         } catch (error) {
            console.log(error)
         }
      }
   })
}

function addsymptoms(){
   if($("#Symptomspre").val()==""){
      document.getElementById("Symptomspre").value=$("#symptomsoption").val()
   }else{
      document.getElementById("Symptomspre").value+=","+$("#symptomsoption").val()
   }
}

function seehistory(){
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'seehistory',
      },
      cache: false,
      success: function savefun(res){
         if(res!="No Data"){
            document.getElementById("historytable").innerHTML=res;
         }
      }
   })
}


const title = "Medicine";
var msg = "Message";
const icon = "/static/images/medicine.jpg";
const song = "/static/images/notification.wav";

function notifyMe() {
   $.ajax({
      url:'/1/consultancy/patienthome',
      type:'POST',
      data:{
         action: 'notifyMe',
      },
      cache: false,
      async: false,
      success: function savefun(res){
         if(res!="No Data"){
            msg=res;
            if (!("Notification" in window)) {
               alert("This browser does not support Desktop notifications");
             }
             if (Notification.permission === "granted") {
               callNotify(title, msg, icon);
               return;
             }
             if (Notification.permission !== "denied") {
               Notification.requestPermission((permission) => {
                 if (permission === "granted") {
                   callNotify(title, msg, icon);
                 }
               });
               return;
            }
         }else{
         
         }
         
      }
   })
   
 }
 
 function callNotify(title, msg, icone) {
   new Notification(title, { body: msg, icon: icone });
   new Audio(song).play();
 }

 setInterval(() => {
   notifyMe();
 }, 30000);