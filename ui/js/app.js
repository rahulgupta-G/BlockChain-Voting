function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
]

const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
]


var endDate = new Date("Nov 19, 2020 01:51:00").getTime();

var timer = setInterval(function() {

    let now = new Date().getTime();
    let t = endDate - now;
   
    if (t >= 0) {
        document.getElementById("hlo").style.display = "none";
        let days = Math.floor(t / (1000 * 60 * 60 * 24));
        let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        let secs = Math.floor((t % (1000 * 60)) / 1000);
   
        document.getElementById("timer-days").innerHTML = days +
        "<span>_DAY(S)</span>";
   
        document.getElementById("timer-hours").innerHTML = ("0"+hours).slice(-2) +
        "<span>_HR(S)</span>";
   
        document.getElementById("timer-mins").innerHTML = ("0"+mins).slice(-2) +
        "<span>_MIN(S)</span>";
   
        document.getElementById("timer-secs").innerHTML = ("0"+secs).slice(-2) +
        "<span>_SEC(S)</span>";
   
    } else {
        document.getElementById("heloo").style.display = "none";
        document.getElementById("myBody").style.display = "none";
        document.getElementById("hlo").style.display = "inline";
    }
   
}, 1000);


function validate(aadharNumber) {
 let c = 0;
 let invertedArray = aadharNumber.split('').map(Number).reverse();

  invertedArray.forEach((val, i) => {
    c = d[c][p[(i % 8)][val]];
  })
  if(c === 0) {
    if(localStorage.getItem(aadharNumber) === "1") {
      console.log("Already Voted!")
      alert("Already Voted");
      return false;
    }
    else {
      localStorage.setItem(aadharNumber, "1");
      return true;
    }
  };
  if(!(c === 0)) {
    alert("Invalid Aadhaar Number");
    return false;
  }
  return true;
}

$('#verify_otp_model').hide()
$('#errorbox').hide()

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('getotp', {
  'size': 'invisible',
  'callback': function(response) {
  }
});

  recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId;
  });

  var aadhaar_no_phone_no = {
  "738253790005" : "8295639913",
  "462434191223" : "9729864075",
  "631926254012" : "8295639913"
  }

  async function onSignInSubmit() {
    window.signingIn = true;
    $('#errorbox').hide();
   console.log($('#aadhaar_no').val())

   const aadhaar_Number = $('#aadhaar_no').val();

   if(validate($('#aadhaar_no').val()))
   {
      var phoneNumber = "+91" + aadhaar_no_phone_no[$('#aadhaar_no').val()];
      var d = new Date();
      d.setTime(d.getTime() + (1*24*60*60*1000));      
      var expires = "expires="+ d.toUTCString();
      document.cookie = 'aadhaar' + "=" + $('#aadhaar_no').val() + ";" + expires + ";path=/";

    $('#verifyc').text('Enter verification code send to '+phoneNumber)
     var appVerifier = window.recaptchaVerifier;
     firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
          .then(function (confirmationResult) {
            window.confirmationResult = confirmationResult;
            window.signingIn = false;
            $('#enter_aadhaarno').hide()
            $('#verify_otp_model').show()
            console.log('otp');
           
          }).catch(function (error) {
             window.alert('error\n\n'+error);
             window.signingIn = false;
            $('.verification-code-form').hide()
          });
    }
}

$(verifyotp).click(function(){
var code = $('#verify_otp').val()
      confirmationResult.confirm(code).then(function (result) {
        var user = result.user;
        window.verifyingCode = false;
        console.log(user.uid);
        var d = new Date();
    d.setTime(d.getTime() + (1*24*60*60*1000));      
    var expires = "expires="+ d.toUTCString();
    document.cookie = 'show' + "=" + user.uid + ";" + expires + ";path=/";
    window.location = '/info'

      }).catch(function (error) {
        console.error('Error while checking the verification code', error);
        window.alert('Error while checking the verification code:\n\n'
           + error.code + '\n\n' + error.message);
        window.verifyingCode = false;
        $('#errorbox').show()
        $('#error').text('Enter valid OTP')
      });
});


$(getotp).click(function(){
if ($('#aadhaar_no').val()=="") {
$('#errorbox').show()
$('#error').text('Please Enter Aadhaar No')
    }
    else{
      onSignInSubmit();
      $('#errorbox').hide()
    }

});
