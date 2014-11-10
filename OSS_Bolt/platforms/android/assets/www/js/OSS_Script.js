var doProceed = false;
var imageURI;
var imagePath;
var isAuthenticated = false;
var photoPostURI;
var mainTransition = "slide";

var baseURL = "http://192.168.1.61/OSS.web";

//var baseURL = "http://118.139.182.155/OSS";

//var baseURL = "http://localhost:43069";

/* -----------------
    ---------------
    ---------------
    ---Section---
      Index.html
    ---------------
    ---------------
    ---------------*/

$(document).on("pageinit", "#splash", function () {
    $.mobile.showPageLoadingMsg();
});

// Get AJAX data for device back button pressed

function getAJAXData() {
    alert("AJAX");
    LoadUserActivitiesDetail();
    PopulateActivities();
}

// changePage functionalities with some AJAX calls

function loadActivitiesPage() {
    $.mobile.showPageLoadingMsg();
    $.mobile.changePage("activities.html", { transition: mainTransition });
    $("#activities").hide();
    setTimeout(function () {
        LoadUserActivitiesDetail();
    }, 1000);
    
}

function registerEventListners() {
    var btnLoadAct1 = document.getElementById("linkContact");
    btnLoadAct1.addEventListener("click", loadContactPage, false);
    var btnLoadAct2 = document.getElementById("linkLog");
    btnLoadAct2.addEventListener("click", loadLogPage, false);
    var btnLoadAct3 = document.getElementById("linkActivity");
    btnLoadAct3.addEventListener("click", loadActivitiesPage, false);
}

function loadContactPage() {
    $.mobile.showPageLoadingMsg();
    $.mobile.changePage("contact.html", { transition: mainTransition });
    setTimeout(function () {
        $("#contactPageTabs").css("display", "block");
    }, 1000);

}

function loadLogPage() {
    $.mobile.showPageLoadingMsg();
    $.mobile.changePage("activityLog.html", { transition: mainTransition });
    $("#date").val("");
    $("#pageActivityLog").hide();
    setTimeout(function () {
        PopulateActivities();
    }, 1000);

}

function loadHomePage() {
    $.mobile.changePage("index.html#container", { transition: mainTransition, reverse: true });
} 

// check if user is already logged in

$(document).on("pagebeforeshow", "#loginPage", function () {
    
    if (localStorage.getItem("Email") != "" || localStorage.getItem("Email") != null) {

        $.ajax({
            url: baseURL + "/Api/Access?email=" + localStorage.getItem("Email") + "&password=" + localStorage.getItem("Password"),
            dataType: "json",
            type: 'Get',
            success: function (data) {
                if (data.IsAuthenticated) {
                    setTimeout(function () {
                        isAuthenticated = true;
                        $("#loginPage").css("display", "none");
                        $('#splash').fadeOut('500');
                        $.mobile.changePage("#container", { transition: mainTransition });
                    }, 1000);
                } else {
                    $('#splash').fadeOut('500');
                    $("#loginPage").css("display", "block");
                }
            },
            error: function () {
                setTimeout(function () {
                    $$('#splash').fadeOut('500');
                    isAuthenticated = false;
                    $("#loginPage").css("display", "block");
                    alert("Error in network");
                }, 1000);
            }
        });
    }
    if (localStorage.getItem("Email") == "" || localStorage.getItem("Email") == null) {
        isAuthenticated = false;
        setTimeout(function () {
            $('#splash').fadeOut('500');
            $("#loginPage").css("display", "block");
        }, 1000);
    }
});

function showSpinner() {
    $.mobile.showPageLoadingMsg();
}

// Cleaer Local Storage

function clearLocalStorage() {
    window.localStorage.clear();
    $('#result').empty();
    $("#loginPage").css("display", "block");
    window.location.hash = 'loginPage';
    $.mobile.initializePage();
}

// Login User

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
        $.ajax({
            url: baseURL + "/Api/Access?email=" + $('#email').val() + "&password=" + $('#password').val(),
            dataType: "json",
            type: 'Get',
            success: function (data) {
                $('#splash').fadeOut('500');
                if (data.IsAuthenticated) {
                    isAuthenticated = true;
                    localStorage.setItem("Email", data.Email);
                    localStorage.setItem("Password", $('#password').val());
                    localStorage.setItem("OrgId", data.OrgId);
                    localStorage.setItem("UserId", data.UserId);
                    $.mobile.hidePageLoadingMsg();
                    $("#loginPage").css("display", "none");
                    $.mobile.changePage("#container", { transition: mainTransition });
                } else {
                    isAuthenticated = false;
                    $.mobile.hidePageLoadingMsg();
                    alert("Invalid Credentials");
                }
            },
            error: function () {
                isAuthenticated = false;
                $.mobile.hidePageLoadingMsg();
                $('#splash').fadeOut('500');
                $("#loginPage").css("display", "block");
                alert("Error in network");
            }
        });
}

// Check if Email is valid

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}

// Logout User

function logoutUser() {
    window.localStorage.clear();
    $('#result').empty();
    window.location.hash = 'loginPage';
    $.mobile.initializePage();
}

/* -----------------
    ---------------
    ---------------
    ---Section---
     activities.html
    ---------------
    ---------------
    ---------------*/

// load complete user activites with Activity Date, Name and Points by AJAX call

function LoadUserActivitiesDetail() {
    $.mobile.showPageLoadingMsg();
    setTimeout(function () {
        $.ajax({
            url: baseURL + "/Api/UserActivity?UserId=" + localStorage.getItem("UserId") + "&UserEmail=" + localStorage.getItem("Email"),
            dataType: "json",
            type: 'Get',
            async: false,
            success: function (data) {
                if (data.recordsTotal > 0) {
                    userActivitiesList = data;
                    DisplayUserActivities();
                    
                }
                $.mobile.hidePageLoadingMsg();
                $("#activities").show();
            }
        });
    }, 100);
}

// append user activities to list

function DisplayUserActivities() {
    //we have searchResult and now convert it in list item form.
    $("#result").empty();
    $.each(userActivitiesList.data, function (itemIndex, result) {
        //if (result.FbPost.indexOf("Post") > -1) {
        //    fbButton = "<button onclick=(win(" + result.ActivityId +"))><img src='img/facebook.png'/></button>";
            $('#result').append(
            '<li>' + '<p class="ui-li-aside ui-li-desc">' + result.Date + '</p>' + result.FbPost +
                '<p class="title">' +
                    '<h2>' + result.Name + '</h2></p>' +
                    '<p class="key"><strong>Points: ' + result.FbPointsFormatted + '</strong></p>' +
                '</li> ');
            $("ul.abc a").addClass("blue li-left");
        //} else {
        //    $('#result').append(
        //    '<li>' + '<p class="ui-li-aside ui-li-desc">' + result.Date + '</p>' + result.FbPost +
        //        '<p class="title">' +
        //            '<h2>' + result.Name + '</h2></p>' +
        //            '<p class="key"><strong>Points: ' + result.FbPointsFormatted + '</strong></p>' +
        //        '</li> ');
        //    $("ul.abc a").addClass("blue li-left");
        //}
        
    });
    $.mobile.hidePageLoadingMsg();
    
}

/* -----------------
    ---------------
    ---------------
    ---Section---
    activityLog.html
    ---------------
    ---------------
    ---------------*/

// Load user activities for dropdown

function PopulateActivities() {
    $.mobile.showPageLoadingMsg();
    var activities = 0;
    $.ajax({
        url: baseURL + "/Api/Activity?userId="+ window.localStorage.getItem("UserId"),
        dataType: "json",
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
            $("#pageActivityLog").show();
            $.mobile.hidePageLoadingMsg();
        }
    });
}

// hide/show panelFBPost for IS Fb Post checkbox

function IsFBPost() {
    if ($("#chkbFB").is(":checked")) {
        $("#panelFBPost").show();
    } else {
        $("#panelFBPost").hide();
    }
}

 // Checks it
$('#myCheckbox').attr('checked', false);

////Post on Facebook checkbox
function CheckFb() {
    if ($("#pageActivityLog option:selected:contains('Fb')").length > 0) {
        $("input[name=chkbFB]").attr('disabled', false);
        $('input[name=chkbFB]').attr('checked', true).checkboxradio("refresh");
        $("#panelFBPost").show();
    } else {
        $("#panelFBPost").hide();
        $('input[name=chkbFB]').attr('checked', false).checkboxradio("refresh");
        $("input[name=chkbFB]").attr('disabled', true);
    }
}


// Camera

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    
    //largeImage.src = "data:image/jpeg;base64," + imageData;
    largeImage.src = imageData;
    $("#largeImage").show();
    photoPostURI = imageData;
    //$('#image').val("data:image/jpeg;base64," + imageData);
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
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
    $("#largeImage").show();
    photoPostURI = imageURI;
}

// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 20,
        destinationType: destinationType.FILE_URI,
        correctOrientation: true
    });
    
}

// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 20, allowEdit: true,
        destinationType: destinationType.FILE_URI,
        correctOrientation: true
    });
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source,
        correctOrientation: true
    });
}

// Called if something bad happens.
//
function onFail(message) {
    console.log(message);
    alert('Failed because: ' + message);
}

// Save activity log for activityLog.html

function saveActivityLog() {
    
    if ($("#chkbFB").is(":checked")) {
        if (validateActivityLogFb()) {
            saveActivityLogFb();
        }
    } else {
        if (validateActivityLogNoFb()) {
            saveActivityLogNoFb();
        }
    }
}

function validateActivityLogFb() {
    imagePath = document.getElementById('largeImage').getAttribute("src");
    if ($("#select-choice-1").val() == "none" || $('#comment').val() == '' || $("#date").val() == "") {
        alert("All fields are mendatory");
        return false;
    }
    // Validate date <= today
    var ctlDate = Date.parse($("#date").val());
    var dt = new Date();
    if (ctlDate > Date.parse(dt)) {
        alert("Select a correct date");
        return false;
    }
    if (!imagePath) {
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
    if (ctlDate > Date.parse(dt)) {
        alert("Select a correct date");
        return false;
    }
    return true;
}

//NADIR changes start
//function win(r) {
//    console.log("Code = " + r.responseCode);
//    console.log("Response = " + r.response);
//    console.log("Sent = " + r.bytesSent);
//}
$(document).on("pageshow", "#container", function () {
    $.mobile.hidePageLoadingMsg();
});
function saveActivityLogFb() {

    ////set upload options

    //win('123');
    //return;
    var ft = new FileTransfer();

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = photoPostURI.substr(photoPostURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    var params = {};
    params.UserEmail = window.localStorage.getItem("Email");
    params.UserId = window.localStorage.getItem("UserId");
    params.Date = $("#date").val();
    params.ActivityId = $("#select-choice-1").val();
    params.IsFBPost = "True";
    params.Comment = $("#comment").val();
    options.params = params;
    $.mobile.showPageLoadingMsg();
    ft.upload(photoPostURI, encodeURI(baseURL + "/Api/UserActivity"), win, fail, options);


}

function saveActivityLogNoFb() {
    var isFbPost = $("#chkbFB").is(':checked');
    var actLogData = {
        "ActivityId": $("#select-choice-1").val(),
        "UserId": window.localStorage.getItem("UserId"),
        "Date": $("#date").val(),
        "IsFbPost": isFbPost
    };
    $.mobile.showPageLoadingMsg();
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

var AppId = "845529275457582";
var HostUrl = baseURL;
var RedirectUrl = "/Activity/UserActivityFbMobile?activityId=";

function saveSuccess(data) {

    if (data) {
        $.mobile.changePage("index.html#container", { transition: "slide" });
    } else {
        alert("There is some problem.");
    }
}

function win(r) {
    var useremail = localStorage.getItem("Email");
    useremail = useremail.replace('@', '00000');
    userActivityId = r.response;
    var FBLink = "https://graph.facebook.com/oauth/authorize?client_id=" + AppId + "&redirect_uri=" + HostUrl + RedirectUrl + userActivityId + "_" + useremail + "&scope=publish_actions";
    //alert(FBLink);
    var ref = window.open(FBLink, "_blank");
    ref.addEventListener('loadstop', function (event) {
        if (event.url.match("/Activity/CloseUserActivityFbMobile")) {
            ref.close();
            $.mobile.changePage("index.html#container", { transition: "slide" });
        }
    });

    return true;
}
//NADIR code end
function fail(error) {
    alert("An error has occurred: Code = " + error.code);
}