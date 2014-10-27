var doProceed = false;
var imageURI;

var baseURL = "http://118.139.182.155/OSS";

//var baseURL = "http://localhost:43069/";
    
$(document).on("pagebeforeshow", "#loginPage", function () {
    $.mobile.hidePageLoadingMsg();
    if (localStorage.getItem("Email") != "" || localStorage.getItem("Email") != null) {

        $.ajax({
            url: baseURL + "/Api/Access?email=" + localStorage.getItem("Email") + "&password=" + localStorage.getItem("Password"),
            dataType: "json",
            type: 'Get',
            success: function (data) {
                if (data.IsAuthenticated) {
                    window.location.hash = 'container';
                    $.mobile.initializePage();
                    //alert("Already Authenticated");
                } else {
                    //alert("Invalid Credentials");
                    window.location.hash = 'loginPage';
                    $.mobile.initializePage();
                }
            },
            error: function () {
                alert("Some Error Occured");
            }
        });

    }
    if (localStorage.getItem("Email") == "" || localStorage.getItem("Email") == null) {
        //alert("Invalid Credentials");
        window.location.hash = 'loginPage';
        $.mobile.initializePage();
    }
});

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function showSpinner() {
    $.mobile.showPageLoadingMsg();
}
function clearLocalStorage() {
    window.localStorage.clear();
    $('#result').empty();
    window.location.hash = 'loginPage';
    $.mobile.initializePage();
}

function authenticateUser() {
    $.mobile.showPageLoadingMsg();
    var emailaddress = $('#email').val();
    var password = $('#password').val();
    if (emailaddress.length == 0 || password.length == 0) {
        $.mobile.hidePageLoadingMsg();
        alert("All fields are mendatory");
        return;
    }
    if (!isValidEmailAddress(emailaddress)) {
        $.mobile.hidePageLoadingMsg();
        doProceed = false;
        alert("Enter correct email address");
        return;
    }
    //ShowBusyIndicator();
        $.ajax({
            url: baseURL + "/Api/Access?email=" + $('#email').val() + "&password=" + $('#password').val(),
            dataType: "json",
            type: 'Get',
            // data: phoneNum,
            success: function(data) {
                if (data.IsAuthenticated) {
                    localStorage.setItem("Email", data.Email);
                    localStorage.setItem("Password", $('#password').val());
                    localStorage.setItem("OrgId", data.OrgId);
                    localStorage.setItem("UserId", data.UserId);
                    $.mobile.hidePageLoadingMsg();
                    $.mobile.changePage("#container", { transition: "none" });
                    //ValidateHideBusyIndicator();
                } else {
                    $.mobile.hidePageLoadingMsg();
                    alert("Invalid Credentials");
                    //ValidateHideBusyIndicator();
                }
            },
            error: function () {
                $.mobile.hidePageLoadingMsg();
                alert("Some Error Occured");
                //ValidateHideBusyIndicator();
            }
        });
}
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}
//function validateUserActivity() {
//    var performDate = $('#email').val();
//    var activityId = $('#password').val();
//    var isFbPost = $('#email').val();
//    var activityComment = $('#password').val();
//    if (performDate != "" & activityId != 0) {
        
//    }
//}
//function setImageSrcNone() {
//    $("#largeImage").attr("src", '');
//}
//function saveUserActivity() {
//    var performDate = $('#email').val();
//    var activityId = $('#password').val();
//    var isFbPost = $('#email').val();
//    var activityComment = $('#password').val();
//    $.ajax({
//        url: baseURL + "/Api/Access?email=" + $('#email').val() + "&password=" + $('#password').val(),
//        dataType: "json",
//        type: 'Get',
//        // data: phoneNum,
//        success: function (data) {
//            if (data.IsAuthenticated) {
//                window.localStorage.setItem("Email", data.Email);
//                window.localStorage.setItem("Password", $('#password').val());
//                window.localStorage.setItem("OrgId", data.OrgId);
//                window.localStorage.setItem("UserId", data.UserId);
//                $.mobile.changePage("#activityPage", { transition: "none" });
//            } else {
//                alert("Invalid Credentials");
//            }
//        },
//        error: function () {
//            alert("Some Error Occured");
//        }
//    });
//}

function DisplayUserActivities() {
    
    //we have searchResult and now convert it in list item form.
    $("#result").empty();
    $.each(userActivitiesList.data, function (itemIndex, result) {
        $('#result').append(
            '<li>' + '<p class="ui-li-aside ui-li-desc">' + result.Date + '</p>' +
                '<p class="title">' +
                    '<h2>' + result.Name + '</h2></p>' +
                    '<p class="key"><strong>Points: ' + result.FbPointsFormatted + '</strong></p>' +
                '</li> ' );
    });
    $.mobile.hidePageLoadingMsg();
    $("#activities").show();
}
function LoadUserActivitiesDetail() {
    $("#activities").hide();
    $.mobile.showPageLoadingMsg();
    setTimeout(function () {
        $.ajax({
            url: baseURL + "/Api/UserActivity?UserId=" + localStorage.getItem("UserId") + "&UserEmail=" + localStorage.getItem("Email"),
            dataType: "json",
            type: 'Get',
            async: false,
            // data: phoneNum,
            success: function (data) {
                if (data.recordsTotal > 0) {

                    userActivitiesList = data;
                    DisplayUserActivities();

                }
            }
        });
    }, 1000);
}

function PopulateActivities() {
    var activities = 0;
    $.ajax({
        url: baseURL + "/Api/Activity?userId="+ window.localStorage.getItem("UserId"),
        dataType: "json",
        //data: { term: request.term },
        success: function (data) {
            
            activities = $.map(data, function (item) {
                return {
                    label: item.Name,
                    value: item.Id
                };
            });
            $('#select-choice-1').empty();
            var seloption = "<option value='none'>---Select---</option>";
            $.each(activities, function (i) {
                seloption += '<option value="' + activities[i].value + '">' + activities[i].label + '</option>';
            });
            $('#select-choice-1').append(seloption);
            $("#select-choice-1").prop("selectedIndex", 0);
        }
    });
}

function IsFBPost() {
    if ($("#chkbFB").is(":checked")) {
        $("#panelFBPost").show();
    } else {
        $("#panelFBPost").hide();
    }
}


//$(document).on("pageshow", "#activityPage", function () {
//    ShowBusyIndicator();
//    LoadUserActivities();
//});

////$(document).on("pagebeforeshow", "#loginPage", function () {
    
////});

function logoutUser() {
    window.localStorage.clear();
    $('#result').empty();
    window.location.hash = 'loginPage';
    $.mobile.initializePage();
}
//function closeApp() {
//    navigator.app.exitApp();
//}
//function loadLogActivity() {
//    window.location.hash = 'activityLog';
//    $.mobile.initializePage();
//}
//function loadLogActivityULEmpty() {
//    $('#result').empty();
//    loadLogActivity();
//}


// Camera

var pictureSource;   // picture source
var destinationType; // sets the format of returned value



// device APIs are available
//
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64-encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: destinationType.DATA_URL
    });
}

// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL
    });
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
}

// Called if something bad happens.
//
function onFail(message) {
    console.log(message);
    alert('Failed because: ' + message);
}

function saveActivityLog() {
    
    if ($("#chkbFB").is(":checked")) {
        if (validateActivityLogFb()) {
            //saveActivityLogFb();
        }
    } else {
        if (validateActivityLogNoFb()) {
            saveActivityLogNoFb();
        }
    }
}

function validateActivityLogFb() {
    imageURI = document.getElementById('largeImage').getAttribute("src");
    if ($("#select-choice-1").val() == "none" || $('#comment').val() == '' || $("#date").val() == "") {
        alert("All fields are mendatory");
        return false;
    }
    // Validate date <= today
    
    if (!imageURI) {
        alert('Please select an image first.');
        return false;
    }
    return true;
}

function validateActivityLogNoFb() {
    if ($("#select-choice-1").val() == "none" || $("#date").val() == "") {
        alert("Please select Date and Activity");
        return false;
    }
    // Validate date <= today
    var ctlDate = Date.parse($("#date").val());
    var dt = new Date();
    //var currDate = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();;
    if (ctlDate > Date.parse(dt)) {
        alert("Select a correct date");
        return false;
    }
    return true;
}

//function saveActivityLogFb() {
//    //"ActivityId": $("#select-choice-1").val(),       "Date": $("#date").val(),"UploadImage": imageURI,"IsFbPost": $("#chkbFB").val()
//    var isFbPost = $("#chkbFB").is(':checked');
    
//    var actLogData = {
//        "ActivityId":22, 
//        "UserId": window.localStorage.getItem("UserId"),
//        "Comment": $('#comment').val(),
//        "IsFbPost":isFbPost
        
//    };


//    $.ajax({
//        type: "POST",
//        url: baseURL + '/Api/UserActivity',
//        data: JSON.stringify(actLogData),
           
//        success: saveSuccess,
//        dataType: 'json'
//    });

//    ////selected photo URI is in the src attribute (we set this on getPhoto)
//    //var imageURI = document.getElementById('largeImage').getAttribute("src");
//    //if (!imageURI) {
//    //    alert('Please select an image first.');
//    //    return;
//    //}

//    ////set upload options
//    //var ft = new FileTransfer();
//    //var options = new FileUploadOptions();
//    //options.fileKey = "file";
//    //options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
//    //options.mimeType = "image/jpeg";

//    //options.params = {
//    //    performDate: $("#date").val(), //document.getElementById("firstname").value,
//    //    activity: $("#select-choice-1").val(),
//    //    isFbPost: $("#chkbFB").val(),
//    //    activityComments: $("#comment").val()
//    //};

//    //alert("Uploading Image");
//    //ft.upload(imageURI, encodeURI("http://some.server.com/upload.php"), win, fail, options);
//}

function saveActivityLogNoFb() {

    var isFbPost = $("#chkbFB").is(':checked');
    var actLogData = {
        "ActivityId": $("#select-choice-1").val(),
        "UserId": window.localStorage.getItem("UserId"),
        "Date": $("#date").val(),
        "IsFbPost": isFbPost
    };

    $.ajax({
        type: "POST",
        url: baseURL + '/Api/UserActivity',
        async: true,
        cache: false,
        data: actLogData,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //When sending data to the server
        dataType: 'json',  //The type of data that you're expecting back from the server.
        success: saveSuccess
         
    });
}

function saveSuccess(data) {
    if (data) {
        alert("Success");
    } else {
        alert("Fail");
    }
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    //alert("Response =" + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}