let newdate = new Date()
var dateFormat = newdate.getFullYear() + "-" +((newdate.getMonth()+1).length != 2 ? "0" + (newdate.getMonth() + 1) : (newdate.getMonth()+1)) + "-" + (newdate.getDate().length != 2 ?"0" + newdate.getDate() : newdate.getDate());
try {
   document.getElementById("cdate").value=dateFormat  
} catch (error) { }

 $(document).ready(function () {
    $('.message').click(function(){
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
     });
    
  });

  function loginpageback(){
   document.getElementById("hospitalregistartion").style.display="none"
   document.getElementById("logincontainer").style.display="block"
  }
  //function to open hospital login
  function hospitalregister(){
    document.getElementById("hospitalregistartion").style.display="block"
    document.getElementById("logincontainer").style.display="none" 
  }

// function to register hospital
function login(){
   if($("#logid").val()=="" || $("#logpass").val()=="" || $("#logintype").val()=="Select"){
      return alert("Some Fields are missing")
   }
   $.ajax({
      url:'/1/consultancy/login',
      type:'POST',
      data:{
         action: 'login',
         logintype: $("#logintype").val(),
         mobileno: $("#logid").val(),
         password: $("#logpass").val(),
      },
      cache: false,
      success: function savefun(res){
         if(res=="Successful"){
            window.location.replace("/1/consultancy/patienthome");
         }else if(res=="HSuccessful"){
            window.location.replace("/1/consultancy/hospitalhome");
         }else if(res=="HSuccessfulD"){
            window.location.replace("/1/consultancy/drhome");
         }else{
            alert(res)
         }
      }
   })
}

function logout23(){
   $.ajax({
      url:'/1/consultancy/login',
      type:'POST',
      data:{
         action: 'logout',
      },
      cache: false,
      success: function(res){
         window.location.replace('/1/consultancy/login');
      }
   })
}

function registerhospital(){
   if($("#username2").val()=="" || $("#hospitalname").val()=="" || $("#hemail").val()=="" || $("#hmobileno").val()=="" || $("#startedon").val()=="" || $("#hrnnumber").val()==""){
      return alert("Some Fields are missing")
   }
   let a=validatepass($("#hpassword").val(),$("#hcomfirmpass").val())
   if(a!=true){
      return alert(a)
   }
   $.ajax({
      url:'/1/consultancy/login',
      type:'POST',
      data:{
         action: 'hospitalregister',
         username: $("#username2").val(),
         hospitalname: $("#hospitalname").val(),
         hemail:$("#hemail").val(),
         startedon:$("#startedon").val(),
         hmobile:$("#hmobileno").val(),
         hrnno:$("#hrnnumber").val(),
         password:$("#hpassword").val(),
      },
      cache: false,
      success: function(res){
         alert(res)
         document.getElementById("username2").value=""
         document.getElementById("hospitalname").value=""
         document.getElementById("hemail").value=""
         document.getElementById("startedon").value=""
         document.getElementById("hmobileno").value=""
         document.getElementById("hrnnumber").value=""
         document.getElementById("hpassword").value=""
      }
   })
}
function registeruser(){
      if($("#username").val()=="" || $("#usermail").val()=="" || $("#userbdate").val()=="" || $("#usermobile").val()==""){
         return alert("Some Fields are missing")
      }
      let a=validatepass($("#userpass").val(),$("#userconfirm").val())
      if(a!=true){
         return alert(a)
      }
      $.ajax({
         url:'/1/consultancy/login',
         type:'POST',
         data:{
            action:"registeruser",
            username:$("#username").val(),
            usermail:$("#usermail").val(),
            userdate:$("#userbdate").val(),
            usermobile:$("#usermobile").val(),
            userpass:$("#userpass").val(),
         },
         cache: false,
         success: function(res){
            alert(res)
            document.getElementById("username").value=""
            document.getElementById("usermail").value=""
            document.getElementById("userbdate").value=""
            document.getElementById("usermobile").value=""
            document.getElementById("userpass").value=""
         }
      })
  }
//   $.ajax({
//    url:'',
//    type:'POST',
//    data:{

//    },
//    cache: false,
//    success: function(res){
      
//    }
   
// })

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