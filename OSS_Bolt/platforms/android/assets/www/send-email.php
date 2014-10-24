<?php
    if($_POST){
        $to = 'your.email@domain.com'; /*Put Your Email Address Here*/
        $subject = "You have been contacted from Mobile Website.";
        $from_name = $_POST['contactName'];
        $from_email = $_POST['contactEmail'];
        $from_phone = $_POST['contactPhone'];
        $message = "<b> Name: " . $from_name . "<br/> Email: " . $from_email . " <br/> Phone: " .  $from_phone . "<br/></b><br/>----------------------------------------------- <br/><br/> " . $_POST['contactMessage'];
        
        $header = "From: $from_name <$from_email-->";
        mail($to, $subject, $message, $header);
        echo "1"; //should echo 0 if there is any error in above mail function. This is not included in demo version
    }
?>