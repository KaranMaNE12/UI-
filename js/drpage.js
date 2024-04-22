function openenterdata(){
   if($("#hmobileno1").val()=="" || $("#secretcode2").val()==""){
      return alert("Some Fields Are Missing")
   }
   $.ajax({
      url:'/1/consultancy/drhome',
      type:'POST',
      data:{
         action: 'openenterdata',
         mobile: $("#hmobileno1").val(),
         secretcode: $("#secretcode2").val(),
      },
      cache: false,
      success: function savefun(res){
         if(res=="Code or Mobile No. Is wrong"){
             alert(res)
         }else{
            document.getElementById("pid").value=res[0];
            document.getElementById("pname").value=res[1];
            document.getElementById("pemail").value=res[2];
            document.getElementById("clinic_hosp_name").value=res[3];
            document.getElementById("clinic_hosp_address").value=res[4];
            document.getElementById("seepatienthistui").style.display="none"
            document.getElementById("medicineediteui").style.display="block"
         }
      }
   })
}


function savediseaserecoreds1(){
   
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
      url:'/1/consultancy/drhome',
      type:'POST',
      data:{
         action: 'savediseaserecoreds',
         diseasename: diseasename,
         diseasestart: diseasestart,
         diseaseend: diseaseend,
         pid: $("#pid").val(),
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

function openmanagepatient(){
   document.getElementById("seepatienthistui").style.display="block"
   document.getElementById("medicineediteui").style.display="none"
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
   document.getElementById("symtoms").value="";
}

function savemedicine2(){
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
      url:'/1/consultancy/drhome',
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
         pid: $("#pid").val(),
         remainder: $("#setremainder").val(),
      },
      cache: false,
      success: function savefun(res){
         alert(res)
         getmedicnedatatable("displaytbl",diseasename,diseasestart)
      }
   })
}


function getmedicnedatatable(dsiplayloc,diseasename,diseasdate){
   $.ajax({
      url:'/1/consultancy/drhome',
      type:'POST',
      data:{
         action: 'getmedicnedatatable',
         diseasename:diseasename,
         diseasdate:diseasdate,
         pid: $("#pid").val(),
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
      url:'/1/consultancy/drhome',
      type:'POST',
      data:{
         action: 'deletemedicine',
         medicine:medicine,
         disease:data2,
         pid: $("#pid").val(),
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

function getpatientinfo(){
   if($("#hmobileno1").val()=="" || $("#secretcode2").val()==""){
      return alert("Some Fields Are Missing")
   }
   $.ajax({
      url:'/1/consultancy/drhome',
      type:'POST',
      data:{
         action: 'getpatientinfo',
         mobile: $("#hmobileno1").val(),
         secretcode: $("#secretcode2").val(),
      },
      cache: false,
      success: function savefun(res){
         if(res=="Code or Mobile No. Is wrong"){
             alert(res)
         }else{
            document.getElementById("medicalhist").innerHTML=res
         }
      }
   })   
}


function seemedicines(data1,data2){
   document.getElementById("medicinepoptable").style.display="flex"
   let dialogbox = document.getElementById("medicineuipop")
   dialogbox.showModal();
   $.ajax({
      url:'/1/consultancy/drhome',
      type:'POST',
      data:{
         action: "seemedicines",
         data1: data1,
         data2: data2,
      },
      cache: false,
      success: function savefun(res){
         if(res!="Medicine Entry Not Found"){
            document.getElementById("displaymedicinetable").innerHTML=res
         }
      }
   })
}

function close5(){
   document.getElementById("medicinepoptable").style.display="none"
   let dialogbox = document.getElementById("medicineuipop")
   dialogbox.close();
}


function openeditprof(){
   $.ajax({
       url:'/1/consultancy/drhome',
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
             document.getElementById("yname1").value=res[0]
             document.getElementById("yemail1").value=res[1]
             document.getElementById("mobileno1").value=res[2]
             
             if(res[9]!="" && res[9]!=null && res[9]!=undefined){
                let date12 = new Date(res[9])
                document.getElementById("birthdate1").value= date12.getFullYear()+"-"+ ('0' + (date12.getMonth() + 1)).slice(-2)+"-"+('0' + date12.getDate()).slice(-2)
             }
             if(res[8]!="" && res[8]!=null && res[8]!=undefined){
               let date12 = new Date(res[8])
               document.getElementById("joiningdate").value= date12.getFullYear()+"-"+ ('0' + (date12.getMonth() + 1)).slice(-2)+"-"+('0' + date12.getDate()).slice(-2)
            }
             document.getElementById("aadharno1").value=res[3]
             document.getElementById("Age1").value=res[7]
             document.getElementById("Experience").value=res[5]
             document.getElementById("specialization").value=res[6]
             document.getElementById("designation").value=res[4]
             

          }
       }
    })  
   document.getElementById("editpopmain").style.display="flex"
   let dialogbox = document.getElementById("myproeditui")
   dialogbox.showModal();
}

function close2(){
   document.getElementById("editpopmain").style.display="none"
   let dialogbox = document.getElementById("myproeditui")
   dialogbox.close();
}

