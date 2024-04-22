function openaddres(){
    document.getElementById("addresources").style.display="flex"
    let dialogbox = document.getElementById("resourcespopup")
    dialogbox.showModal();
    document.getElementById("updateresdiv").style.display="none"
    document.getElementById("addresdiv").style.display="block"
    document.getElementById("homecontent").style.display="none";
    displayrestable("displayrestab");
}


function openforupres(data1){
    $.ajax({
        url:'/1/consultancy/hospitalhome',
        type:'POST',
        data:{
           action: 'openforupres',
           data1:data1,
        },
        cache: false,
        success: function savefun(res){
            if(res!="No Info"){
               openaddres()
               document.getElementById("avail_res").value=res[3]
               document.getElementById("total_res").value=res[2]
               document.getElementById("resourcename").value=res[1]
               document.querySelector("#restype").value=res[0]
               document.getElementById("updateresdiv").style.display="block"
               document.getElementById("addresdiv").style.display="none"
               document.getElementById("homecontent").style.display="none";

            }
        }
    })
}


function openmanagestaff(){
    document.getElementById("managestaff").style.display="flex"
    document.getElementById("manageres").style.display="none"
    document.getElementById("homecontent").style.display="none";
}

function openmanageres(){
    document.getElementById("managestaff").style.display="none"
    document.getElementById("manageres").style.display="flex"
    document.getElementById("homecontent").style.display="none";
}




function close8(){
    let dialogbox = document.getElementById("resourcespopup")
    dialogbox.close();
    document.getElementById("addresources").style.display="none"
   
}

function openaddstaff(){
    document.getElementById("addstaffui").style.display="flex"
    let dialogbox = document.getElementById("mystaffpop")
    dialogbox.showModal();

}

function close3(){
    let dialogbox = document.getElementById("mystaffpop")
    dialogbox.close();
    document.getElementById("addstaffui").style.display="none"
}

function openeditprof(){
    document.getElementById("editpopmain").style.display="flex"
    let dialogbox = document.getElementById("myproeditui")
    dialogbox.showModal();
    $.ajax({
        url:'/1/consultancy/hospitalhome',
        type:'POST',
        data:{
           action: 'gethospedit',
        },
        cache: false,
        success: function savefun(res){
            if(res!="No Info"){
                document.getElementById("hname1").value=res[1]
                document.getElementById("husername1").value=res[0]
                document.getElementById("hemail1").value=res[2]
                document.getElementById("hmobileno1").value=res[3]
                
                if(res[5]!="" && res[5]!=null && res[5]!=undefined){
                    let date12 = new Date(res[5])
                    document.getElementById("hstarton").value= date12.getFullYear()+"-"+ ('0' + (date12.getMonth() + 1)).slice(-2)+"-"+('0' + date12.getDate()).slice(-2)
                 }
                document.getElementById("hrno1").value=res[4]
                document.getElementById("hAddress").value=res[6]
                document.getElementById("hcity").value=res[7]
                document.getElementById("hstate").value=res[8]
                document.getElementById("specialization").value=res[9]
            }
        }
    })
}

function close2(){
    let dialogbox = document.getElementById("myproeditui")
    dialogbox.close();
    document.getElementById("editpopmain").style.display="none"
}



function updateresourcedata(){
    let restype = $("#restype").val()
    let resourcename = $("#resourcename").val()
    let total_res = $("#total_res").val()
    let avail_res = $("#avail_res").val()
    if(restype=="Select" || resourcename == "" || total_res=="" || avail_res==""){
        return alert("Some Fields Are Missing")
    }
    $.ajax({
        url:'/1/consultancy/hospitalhome',
        type:'POST',
        data:{
           action: 'updateresourcedata',
           restype: restype,
           resourcename: resourcename,
           total_res: total_res,
           avail_res: avail_res,
        },
        cache: false,
        success: function savefun(res){
           alert(res)
           displayrestable("displayrestab")
        }
    })
}


function addresourcedet(){
    let restype = $("#restype").val()
    let resourcename = $("#resourcename").val()
    let total_res = $("#total_res").val()
    let avail_res = $("#avail_res").val()
    if(restype=="Select" || resourcename == "" || total_res=="" || avail_res==""){
        return alert("Some Fields Are Missing")
    }
    $.ajax({
        url:'/1/consultancy/hospitalhome',
        type:'POST',
        data:{
           action: 'addresourcedet',
           restype: restype,
           resourcename: resourcename,
           total_res: total_res,
           avail_res: avail_res,
        },
        cache: false,
        success: function savefun(res){
           alert(res)
           displayrestable("displayrestab")
           document.getElementById("restype").value=""
           document.getElementById("resourcename").value=""
           document.getElementById("total_res").value=""
           document.getElementById("avail_res").value=""
        }
    })
}

function displayrestable(data1){
    $.ajax({
        url:'/1/consultancy/hospitalhome',
        type:'POST',
        data:{
           action: 'displayrestable',
        },
        cache: false,
        success: function savefun(res){
           document.getElementById(data1).innerHTML=res
        }
    })  
}

function resourcesstatus(){
    $.ajax({
        url:'/1/consultancy/hospitalhome',
        type:'POST',
        data:{
           action: 'resourcesstatus',
        },
        cache: false,
        success: function savefun(res){
           document.getElementById("ResourcesStatus12").innerHTML=res
        }
    })
}

function savehospprof(){
    let hname1 = $("#hname1").val()
    let husername1 = $("#husername1").val()
    let hemail1 = $("#hemail1").val()
    let hmobileno1 = $("#hmobileno1").val()
    let hstarton = $("#hstarton").val()
    let hrno1 = $("#hrno1").val()
    let hAddress = $("#hAddress").val()
    let hcity = $("#hcity").val()
    let hstate = $("#hstate").val()
    let specialization=$("#specialization").val()

    $.ajax({
        url:'/1/consultancy/hospitalhome',
        type:'POST',
        data:{
           action: 'savehospprof',
           hname1:hname1,
           husername1:husername1,
           hemail1: hemail1,
           hmobileno1:hmobileno1,
           hstarton:hstarton,
           hrno1:hrno1,
           hAddress:hAddress,
           hcity:hcity,
           hstate:hstate,
           specialization:specialization,
        },
        cache: false,
        success: function savefun(res){
           alert(res)
        }
    })
}

function savestaffdetails(){
    let a=validatepass($("#hpassword").val(),$("#hcomfirmpass").val())
    if(a!=true){
        return alert(a)
    }
    let staffname = $("#staffname").val()
    let mobilenostaff = $("#mobilenostaff").val()
    let emailidstaff = $("#emailidstaff").val()
    let Adharno = $("#Adharno").val()
    let experience = $("#experience").val()
    let position = $("#position").val()
    let specialization = $("#specialization2").val()
    let birthstaff = $("#birthstaff").val()
    let Age = $("#Age ").val()
    let joiningdatestaff = $("#joiningdatestaff").val()
    let staffaddress = $("#staffaddress").val()
    let hcomfirmpass = $("#hcomfirmpass").val()
    if(position=="Select"){
        return alert("Please select position")
    }
    $.ajax({
        url:'/1/consultancy/hospitalhome',
        type:'POST',
        data:{
           action: 'savestaffdetails',
           staffname:staffname,
           mobilenostaff:mobilenostaff,
           emailidstaff:emailidstaff,
           Adharno:Adharno,
           experience:experience,
           position:position,
           specialization:specialization,
           birthstaff:birthstaff,
           Age:Age,
           joiningdatestaff:joiningdatestaff,
           staffaddress:staffaddress,
           hcomfirmpass:hcomfirmpass,
        },
        cache: false,
        success: function savefun(res){
           alert(res)
            stafftable()

        }
    })
}

function validatepass(data1,data2){
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if(data1!=data2){
       return "Password not matched"
    }
    if(data1.length<5){
       return "Password should be in range of 6 to 16 characters"
    }
    if(data1.match(regularExpression)){
       return true
    }else {
       return "It Must include at least one digit and one special character"
    }
}

function stafftable(){
    $.ajax({
        url:'/1/consultancy/hospitalhome',
        type:'POST',
        data:{
           action: 'stafftable',
        },
        cache: false,
        success: function savefun(res){
           document.getElementById("stafftable").innerHTML=res;
        }
    })
}

function removestaff(data1){
    $.ajax({
        url:'/1/consultancy/hospitalhome',
        type:'POST',
        data:{
           action: 'removestaff',
           data1: data1,
        },
        cache: false,
        success: function savefun(res){
            alert(res)
           stafftable()
        }
    })
}

window.onload = function(){  
  stafftable();
  resourcesstatus();
  
    }  