var doProceed = false;
var imageURI;
var imagePath;
var baseURL = "http://118.139.182.155/OSS";

//var baseURL = "http://192.168.0.110/OSS.web";

//var baseURL = "http://localhost:43069";

/* -----------------
    ---------------
    ---------------
    ---Section---
      Index.html
    ---------------
    ---------------
    ---------------*/

$(document).on("pageinit", "#loginPage", function () {
    setTimeout(function () {
        $.mobile.hidePageLoadingMsg();
    }, 2000);
    
});

// changePage functionalities with some AJAX calls

function loadActivitiesPage() {
    $.mobile.changePage("activities.html", { transition: "slide" });
    setTimeout(function () {
        registerEventListners();
        LoadUserActivitiesDetail();
    }, 1000);
    
}

function registerEventListners() {
    var btnLoadAct = document.getElementById("linkContact");
    btnLoadAct.addEventListener("click", loadContactPage, false);
    var btnLoadAct = document.getElementById("linkLog");
    btnLoadAct.addEventListener("click", loadLogPage, false);
    var btnLoadAct = document.getElementById("linkActivity");
    btnLoadAct.addEventListener("click", loadActivitiesPage, false);
}

function loadContactPage() {
    $.mobile.changePage("contact.html", { transition: "slide" });
    setTimeout(function () {
        registerEventListners();
    }, 500);

}

function loadLogPage() {
    $.mobile.changePage("activityLog.html", { transition: "slide" });
    setTimeout(function () {
        PopulateActivities();
    }, 500);

}

function loadHomePage() {
    $.mobile.changePage("index.html#container", { transition: "slide", reverse: true });
} 

// check if user is already logged in

$(document).on("pagebeforeshow", "#loginPage", function () {
    
    if (localStorage.getItem("Email") != "" || localStorage.getItem("Email") != null) {

        $.ajax({
            url: baseURL + "/Api/Access?email=" + localStorage.getItem("Email") + "&password=" + localStorage.getItem("Password"),
            dataType: "json",
            type: 'Get',
            success: function (data) {
                $('#splash').fadeOut('1000');
                if (data.IsAuthenticated) {
                    $("#loginPage").css("display", "none");
                    window.location.hash = 'container';
                    $.mobile.initializePage();
                } else {
                    $("#loginPage").css("display", "block");
                    window.location.hash = 'loginPage';
                    $.mobile.initializePage();
                }
            },
            error: function () {
                $('#splash').fadeOut('1000');
                $("#loginPage").css("display", "block");
                alert("Error in network");
            }
        });

    }
    if (localStorage.getItem("Email") == "" || localStorage.getItem("Email") == null) {
        $('#splash').fadeOut('1000');
        $("#loginPage").css("display", "block");
        window.location.hash = 'loginPage';
        $.mobile.initializePage();
    }
});

//$('#splash').live('pagebeforeshow', function (event) {
//    $.mobile.showPageLoadingMsg();
//        setTimeout(function () {
//            $.mobile.hidePageLoadingMsg();
//        }, 1000);
//});

//$(document).on("pagebeforeshow", "#splash", function (event) {
//    $.mobile.showPageLoadingMsg();
//    setTimeout(function () {
//        $.mobile.hidePageLoadingMsg();
//    }, 1000);
//});

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
                $('#splash').fadeOut('1000');
                if (data.IsAuthenticated) {
                    localStorage.setItem("Email", data.Email);
                    localStorage.setItem("Password", $('#password').val());
                    localStorage.setItem("OrgId", data.OrgId);
                    localStorage.setItem("UserId", data.UserId);
                    $.mobile.hidePageLoadingMsg();
                    $("#loginPage").css("display", "none");
                    $.mobile.changePage("#container", { transition: "slide" });
                } else {
                    $.mobile.hidePageLoadingMsg();
                    alert("Invalid Credentials");
                }
            },
            error: function () {
                $.mobile.hidePageLoadingMsg();
                $('#splash').fadeOut('1000');
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
    $("#activities").hide();
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
            }
        });
    }, 1000);
}

// append user activities to list

function DisplayUserActivities() {
    //we have searchResult and now convert it in list item form.
    $("#result").empty();
    $.each(userActivitiesList.data, function (itemIndex, result) {
        $('#result').append(
            '<li>' + '<p class="ui-li-aside ui-li-desc">' + result.Date + '</p>' +
                '<p class="title">' +
                    '<h2>' + result.Name + '</h2></p>' +
                    '<p class="key"><strong>Points: ' + result.FbPointsFormatted + '</strong></p>' +
                '</li> ');
    });
    $.mobile.hidePageLoadingMsg();
    $("#activities").show();
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
            setTimeout(function () {
                $("#pageActivityLog").show();
                $.mobile.hidePageLoadingMsg();
            }, 500);
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
    
    largeImage.src = "data:image/jpeg;base64," + imageData;
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
}

// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: destinationType.DATA_URL,
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

function saveActivityLogFb() {
    var isFbPost = $("#chkbFB").is(':checked');
    var actLogData = {
        "ActivityId": $("#select-choice-1").val(),
        "UserId": window.localStorage.getItem("UserId"),
        "Date": $("#date").val(),
        "Comment": $('#comment').val(),
        "IsFbPost": isFbPost,
        "ImagePath": "/img/",
        "ImageName": "ABC"
        //"UploadImage": 
};
    
    $.ajax({
        type: "POST",
        url: baseURL + '/Api/UserActivity',
        async: true,
        cache: false,
        data: "ABC",
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //When sending data to the server
        dataType: 'json',  //The type of data that you're expecting back from the server.
        success: saveSuccess
    });

    ////selected photo URI is in the src attribute (we set this on getPhoto)
    //var imageURI = document.getElementById('largeImage').getAttribute("src");
    //if (!imageURI) {
    //    alert('Please select an image first.');
    //    return;
    //}

    ////set upload options
    //var ft = new FileTransfer();
    //var options = new FileUploadOptions();
    //options.fileKey = "file";
    //options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    //options.mimeType = "image/jpeg";

    //options.params = {
    //    performDate: $("#date").val(), //document.getElementById("firstname").value,
    //    activity: $("#select-choice-1").val(),
    //    isFbPost: $("#chkbFB").val(),
    //    activityComments: $("#comment").val()
    //};

    //alert("Uploading Image");
    //ft.upload(imageURI, encodeURI("http://some.server.com/upload.php"), win, fail, options);
}

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
    alert("Response =" + r.response);
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
}