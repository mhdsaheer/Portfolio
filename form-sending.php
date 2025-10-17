<?php
$my_email = "muhammedsaheerk6@gmail.com";
$continue = "muhammedsaheerk6@gmail.com";
$errors = array();
// Remove $_COOKIE elements from $_REQUEST.
if(count($_COOKIE)){foreach(array_keys($_COOKIE) as $value){unset($_REQUEST[$value]);}}
// Check all fields for an email header.
function recursive_array_check_header($element_value)
{
global $set;
if(!is_array($element_value)){if(preg_match("/(%0A|%0D|\n+|\r+)(content-type:|to:|cc:|bcc:)/i",$element_value)){$set = 1;}}
else
{
foreach($element_value as $value){if($set){break;} recursive_array_check_header($value);}
}
}
recursive_array_check_header($_REQUEST);
if($set){$errors[] = "You cannot send an email header";}
unset($set);
// Validate email field.
if(isset($_REQUEST['email']) && !empty($_REQUEST['email']))
{
if(preg_match("/(%0A|%0D|\n+|\r+|:)/i",$_REQUEST['email'])){$errors[] = "Email address may not contain a new line or a colon";}
$_REQUEST['email'] = trim($_REQUEST['email']);
if(substr_count($_REQUEST['email'],"@") != 1 || stristr($_REQUEST['email']," ")){$errors[] = "Email address is invalid";}else{$exploded_email = explode("@",$_REQUEST['email']);if(empty($exploded_email[0]) || strlen($exploded_email[0]) > 64 || empty($exploded_email[1])){$errors[] = "Email address is invalid";}else{if(substr_count($exploded_email[1],".") == 0){$errors[] = "Email address is invalid";}else{$exploded_domain = explode(".",$exploded_email[1]);if(in_array("",$exploded_domain)){$errors[] = "Email address is invalid";}else{foreach($exploded_domain as $value){if(strlen($value) > 63 || !preg_match('/^[a-z0-9-]+$/i',$value)){$errors[] = "Email address is invalid"; break;}}}}}}
}
// Check referrer is from same site.
if(!(isset($_SERVER['HTTP_REFERER']) && !empty($_SERVER['HTTP_REFERER']) && stristr($_SERVER['HTTP_REFERER'],$_SERVER['HTTP_HOST']))){$errors[] = "You must enable referrer logging to use the form";}
// Check for a blank form.
function recursive_array_check_blank($element_value)
{
global $set;
if(!is_array($element_value)){if(!empty($element_value)){$set = 1;}}
else
{
foreach($element_value as $value){if($set){break;} recursive_array_check_blank($value);}
}
}
recursive_array_check_blank($_REQUEST);
if(!$set){$errors[] = "You cannot send a blank form";}
unset($set);
// Display any errors and exit if errors exist.
if(count($errors)){foreach($errors as $value){print "$value<br>";} exit;}
if(!defined("PHP_EOL")){define("PHP_EOL", strtoupper(substr(PHP_OS,0,3) == "WIN") ? "\r\n" : "\n");}
// Build message.
function build_message($request_input){if(!isset($message_output)){$message_output ="";}if(!is_array($request_input)){$message_output = $request_input;}else{foreach($request_input as $key => $value){if(!empty($value)){if(!is_numeric($key)){$message_output .= str_replace("_"," ",ucfirst($key)).": ".build_message($value).PHP_EOL.PHP_EOL;}else{$message_output .= build_message($value).", ";}}}}return rtrim($message_output,", ");}
$message = build_message($_REQUEST);
$message = $message . PHP_EOL.PHP_EOL."-- ".PHP_EOL."";
$message = stripslashes($message);
$subject = "SAHEER | PORTFOLIO MAIL";
$headers = "From: " . $_REQUEST['Name'];
mail($my_email,$subject,$message,$headers);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FORM SENDING | SAHEER PORTFOLIO</title>
<link rel="icon" type="image/x-icon" href="images/favicon.svg">
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
    rel="stylesheet">
<style>
.form-container {width: 324px; text-align: center; color: #ffff; padding: 50px 0px; margin: auto;display:block; }
.form-container a { font-weight: 400; font-size: 15px; color: #FFF; background-color: #000; margin-top: 0px; padding: 15px 0px; text-decoration: none; border-radius: 30px;width:200px;margin:auto;display:block; }

svg {
  width: 70px;
  display: block;
  margin: 40px auto 0;
  margin-bottom:20px;
  
}

.path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
  &.circle {
    -webkit-animation: dash .9s ease-in-out;
    animation: dash .9s ease-in-out;
  }
  &.line {
    stroke-dashoffset: 1000;
    -webkit-animation: dash .9s .35s ease-in-out forwards;
    animation: dash .9s .35s ease-in-out forwards;
  }
  &.check {
    stroke-dashoffset: -100;
    -webkit-animation: dash-check .9s .35s ease-in-out forwards;
    animation: dash-check .9s .35s ease-in-out forwards;
  }
}

p {
  text-align: center;
  margin: 20px 0 60px;
  font-size: 1.25em;
  &.success {
    color: #73AF55;
  }
  &.error {
    color: #D06079;
  }
}


@-webkit-keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@-webkit-keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}

@keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}
.button {
  position: relative;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  padding-block: 10px;
  padding-inline: 1.25rem;
text-align:center;
  margin-top:0px;
  background-color: #77706A;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffff;
  outline: none;
  overflow: hidden;
  font-size: 15px;
}

.button:hover {
  transform: scale(1.05);

  color: #fff;
}

.button:hover::before {
  color: #fff;
}
/* .path{

  stroke-dasharray: 3000;
  stroke-dashoffset: 3000; 
  fill:none;
  stroke: #000;
  animation: dash 15s infinite linear forwards;
  -webkit-animation:  dash 15s infinite linear forwards;
} */


@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

@-webkit-keyframes dash {
    to {
        stroke-dashoffset: 0;
    }
}

#Logo {
  width: 40%;
  height: 40%;
  position: absolute;
  top: 65%;
  right: 70;
/*   bottom: 0; */
  left: 0;
  margin: auto;
  display: block;
  fill: #aa7f3d;
  fill: url("#MyGradient");
  stroke: #EEBE7B;
  stroke-miterlimit: 5;
}

.Animate-Draw {
  fill-opacity: 0;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
  animation-iteration: 1;
  animation-name: DrawLine, FadeStroke, FillIn;
  animation-duration: 4s, 1s, 1s;
  animation-delay: 0s, 3.5s, 3.5s;
}

/* #Draw-Text {
  animation-delay: 1s, 3.5s, 3.5s;
  animation-duration: 3.5s, 1s, 1s;
  stroke-dashArray: 2000;
  stroke-dashoffset: 2000;
} */


#Draw-Mark {
  animation-delay: 1s, 3.5s, 3.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dashArray: 2000;
  stroke-dashoffset: 2000;
}
#Draw-T{
  animation-delay: 2s, 3.5s, 3.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000; 
}
#Draw-K{
  animation-delay: 3s,  3.5s, 3.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000; 
}




#Draw-hLine{
  stroke: transparent;
  border-color: transparent;
  fill-opacity: 0;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
  animation-iteration: 1;
  animation-name:  FillIn;
  animation-duration:   1s;
  animation-delay:  3.5s;
  animation-delay:   4.5s;
  animation-duration:  1s;
/*   stroke-dasharray: 2000;
  stroke-dashoffset: 2000;  */
}



/* MARK is hank */



#Draw-TLine{
  animation-delay: 3s, 3.5s, 3.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000; 
  z-index: 2;
}

#Draw-you{
  animation-delay: 4s, 4.5s, 4.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000; 
}
#Draw-Frame {
  animation-delay: 4s, 4.5s, 4.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dashArray: 2000;
  stroke-dashoffset: 2000;

}

#Draw-exclamation1 {
  animation-delay: 5s, 5.5s, 5.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dashArray: 2000;
  stroke-dashoffset: 2000;
}

#Draw-exclamation1Dot {
  animation-delay: 6s, 6.5s, 6.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dashArray: 2000;
  stroke-dashoffset: 2000;
}

#Draw-exclamation2 {
  animation-delay: 5s, 5.5s, 5.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dashArray: 2000;
  stroke-dashoffset: 2000;
}

#Draw-exclamation2Dot {
  animation-delay: 6s, 6.5s, 6.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dashArray: 2000;
  stroke-dashoffset: 2000;
}

#Draw-exclamation3 {
  animation-delay: 5s, 5.5s, 5.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dashArray: 2000;
  stroke-dashoffset: 2000;
}

#Draw-exclamation3Dot {
  animation-delay: 6s, 6.5s, 6.5s;
  animation-duration: 2s, 1s, 1s;
  stroke-dashArray: 2000;
  stroke-dashoffset: 2000;
}






@keyframes DrawLine {
  to {
    stroke-dashOffset: 0;
  }
}
@keyframes FadeStroke {
  to {
    stroke-opacity: 0;
  }
}
@keyframes FillIn {
  from {
    fill-opacity: 0;
  }
  to {
    fill-opacity: 1;
  }
}



</style>
</head>
<body>
<div class="form-container">
  <div class="wrapper"> 
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
  <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
  <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
</svg>
<svg id="Logo-Defs" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> 
  <defs>
    <linearGradient id="MyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="5%"  stop-color="#F7D696"/>
      <stop offset="50%" stop-color="#EEBE7B" />
      <stop offset="95%" stop-color="#CEA058"/>
    </linearGradient>
  
    <g id="Logo-Group">
<g id="Logo-Text">
		<path  id="K" class="Text" d="M373.115,196.66c9.264,27.287,33.894,46.59,63.287,44.628c14.542-0.967,28.646-7.142,39.46-16.837
			c12.772-11.458,20.197-27.571,23.954-44.064c1.99-8.712,2.829-17.66,3.086-26.579c0.12-4.069-11.342-1.143-11.446,2.182
			c-0.839,29.825-11.665,71.843-45.862,78.717c-28.014,5.634-52.564-16.706-61.024-41.631
			C383.402,189.639,371.98,193.327,373.115,196.66L373.115,196.66z"/>

		<path id="T" class="Text" d="M18.644,136.223c-4.848,16.33-6.842,34.653,0.62,50.523c6.226,13.256,18.599,21.892,32.179,26.44
			c16.981,5.691,35.58,5.299,53.08,2.737c21.296-3.101,42.089-10.586,61.132-20.481c38.781-20.162,70.216-52.597,103.322-80.591
			c31.919-27.003,66.56-55.841,106.843-69.205c17.572-5.831,36.243-7.29,54.047-1.603c21.58,6.886,38.413,23.391,51.406,41.354
			c2.505,3.456,16.385-1.687,13.3-5.962c-12.536-17.324-28.194-32.307-48.201-40.524c-17.152-7.045-36.207-7.482-54.243-4.18
			C350.299,42.38,313.333,68.8,280.666,94.601c-17.644,13.931-34.588,28.714-51.565,43.449
			c-15.673,13.612-31.196,27.831-48.216,39.768c-30.78,21.593-72.626,38.601-110.815,30.348
			c-14.315-3.086-27.939-10.594-35.324-23.643c-8.82-15.59-6.666-34.517-1.779-50.965C34.25,129.245,19.979,131.751,18.644,136.223
			L18.644,136.223z"/>

      
	<path id="Mark" class="Text" d="M407.624,150.934c-11.898,6.55-21.633,14.875-27.971,26.892c2.026-17.94,4.651-35.816,7.769-53.524
		c0.943-5.383-10.762-3.221-11.646,1.543c-3.441,18.563-6.861,37.138-11.01,55.554c-3.708,16.541-7.153,34.984-15.79,49.823
		c-1.17-6.639,1.407-14.731,2.706-21.173c1.658-8.225,3.6-16.477,4.096-24.878c0.283-4.88,0.052-11.47-4.708-14.279
		c-10.534-6.206-19.97,9.763-23.543,16.932c-1.986,4.001-3.736,8.133-5.307,12.345c0.183-4.704,0.395-9.407,0.627-14.099
		c0.048-0.772,0.104-1.535,0.156-2.294c0.132-2.202,0.251-4.412,0.3-6.618c0.124-5.671-11.402-3.249-11.645,1.551
		c-0.22,4.216-0.432,8.444-0.64,12.692c-0.823,11.054-2.318,22.112-4.224,32.959c-1.306,7.393-2.785,15.006-5.907,21.884
		c-0.719,1.587-1.227,2.422-1.934,3.141c-1.075-2.738-1.267-5.975-1.458-8.796c-1.319-20.162,1.327-40.855,3.313-60.877
		c-3.209,0.524-10.391,5.007-12.648,6.83c-5.851,4.831-10.946,10.115-15.33,15.841c-4.264,5.38-7.924,11.174-10.63,17.449
		c-3.317,6.981-5.911,14.415-7.821,22.292c-0.935,3.833-1.662,7.729-2.446,11.617c0.052-3.208,0.144-6.402,0.156-9.535
		c0.029-9.959,0.068-19.938-0.807-29.857c-0.431-4.876-0.679-10.683-3.884-14.699c-2.889-3.621-8.713-3.101-12.293-0.955
		c-9.079,5.443-11.821,18.631-13.895,28.106c-0.811,3.701-1.475,7.433-2.027,11.19c-0.06-1.091-0.132-2.193-0.183-3.289
		c0.427-6.263,0.763-12.525,1.066-18.791c1.12-23.087,0.543-46.218,1.595-69.282c0.259-5.663-11.266-3.245-11.642,1.543
		c-2.274,29.102-3.997,58.499-2.649,87.729c0,0,1.539,25.713,6.162,46.773c0.951,4.328,2.522,7.569,4.236,11.15
		c1.938,4.069,11.805,2.082,11.553-2.554c-1.303-23.511-1.171-47.872,4.664-70.832c1.008-3.965,2.514-8.716,4.436-12.369
		c1.906,5.598,1.619,12.42,1.827,18.047c0.359,10.02,0.156,20.058,0.179,30.078c0.025,6.194-0.663,13.731,1.487,19.662
		c2.374,6.566,11.329,2.897,14.171-1.311c2.87-4.236,4.648-9.155,5.967-14.283c0.331,0.48,0.692,0.927,1.075,1.363
		c3.393,3.888,9.387,2.674,13.536,0.904c5.199-2.214,8.128-7.853,10.07-12.992c1.103,5.395,3.705,10.303,10.507,9.087
		c6.463-1.147,10.687-5.267,13.62-10.41c0.036,0.519,0.06,1.047,0.096,1.567c0.44,5.787,11.034,3.173,11.65-1.543
		c2.945-22.268,7.373-46.834,19.458-66.228c0.471-0.743,1.015-1.487,1.566-2.178c1.927,5.466-0.024,12.98-0.939,18.219
		c-1.463,8.481-3.533,16.833-4.8,25.349c-0.695,4.648-2.106,12.549,1.923,16.186c4.948,4.452,12.301,1.219,16.401-2.658
		c3.901-3.672,6.219-9.344,8.14-14.398c-0.247,4.364-0.455,8.736-0.611,13.092c-0.011,0.068-0.024,0.132-0.04,0.196
		c-1.162,5.663,10.635,3.789,11.694-1.371c3.636-17.596,6.534-36.088,13.855-52.629c4.924-11.114,13.284-18.495,23.787-24.27
		C419.976,153.727,413.366,147.769,407.624,150.934z M278.72,238.542c-1.259,5.515-2.653,11.925-5.994,16.637
		c-0.016-0.028-0.032-0.04-0.044-0.064c-4.392-6.294-4.136-16.525-2.833-23.974c0.711-4.124,1.981-8.064,3.66-11.841
		c2.626-5.339,5.763-10.363,9.428-15.058c0.879-1.091,1.774-2.166,2.713-3.221C283.556,213.573,281.562,226.142,278.72,238.542z"/>

<!-- 		<path id="hLine" class="Text" d="M228.782,138.329c-9.711,8.44-19.379,17.108-29.374,25.312c0.647,3.05,1.123,6.087,1.651,9.108
			c9.779-7.357,19.218-15.246,28.498-23.319C229.305,145.754,229.065,142.062,228.782,138.329z"/> -->

<path id="Frame" class="Text" d="M538.23,236.201c-1.759,0.751-6.69,2.809-7.026,5.143c-1.863,12.712-6.13,24.917-13.468,35.512
	c-6.706,9.687-15.866,17.528-25.466,23.342c-4.755,2.874-10.123,5.455-15.849,7.853c-6.23,2.598-12.657,4.74-19.15,6.682
	c-14.427,4.308-29.278,7.206-44.124,9.643c-32.147,5.259-64.682,7.777-97.053,11.242c-30.704,3.284-61.708,7.041-91.265,16.361
	c-17.029,5.371-34.349,12.764-48.213,24.25c-6.142,5.083-14.047,13.004-12.464,21.836c1.418,7.913,11.454,9.952,18.04,10.43
	c7.545,0.56,15.234-0.951,22.592-2.389c10.542-2.054,20.833-5.196,30.816-9.136c26.708-10.542,49.184-28.606,67.195-50.742
	c0.668-0.819,1.659-2.074,2.326-3.28c20.262-2.198,40.583-3.973,60.83-6.271c31.107-3.532,62.447-7.92,92.336-17.56
	c25.764-8.308,52.001-21.377,68.93-43.184c8.992-11.574,14.33-25.466,16.441-39.896C543.976,233.811,538.925,235.909,538.23,236.201
	z M291.169,350.078c-10.374,12.756-22.168,24.314-36.183,33.042c-16.101,10.006-35.348,15.89-54.143,17.896
	c-7.417,0.799-18.663,0.839-23.147-6.467c-4.213-6.873,2.477-14.763,7.325-19.095c11.434-10.214,27.963-15.506,42.509-19.534
	c13.888-3.844,28.115-6.398,42.35-8.524c8.648-1.295,17.32-2.405,26.008-3.409C294.01,346.209,292.232,348.779,291.169,350.078z"/>

<path class="Text" id="TLine" d="M429.396,249.253c-8.544-7.925-23.187-6.682-33.502-4.141c-22.383,5.527-41.462,20.873-56.556,37.71
	c-0.975,1.095-3.537,3.632-4.992,5.846c-21.317,1.963-42.653,3.725-63.85,6.822c-20.066,2.937-40.056,7.142-59.798,11.765
	c-9.288,2.174-18.583,4.548-27.647,7.59c0.308-6.131,0.444-12.27,0.499-18.404c0.476-50.726-0.327-101.468-0.911-152.186
	c-0.064-5.515-0.132-11.03-0.2-16.549c-0.064-4.784-12.82,0.352-12.765,4.712c0.539,42.345,0.972,84.695,1.143,127.041
	c0.084,19.997,0.668,40.208-0.507,60.23c-1.115,0.48-2.234,0.967-3.337,1.478c-9.471,4.372-18.411,10.487-24.018,19.438
	c-5.683,9.08-6.083,23.635,5.562,28.143c7.874,3.037,17.129-0.887,22.724-6.618c6.406-6.554,8.136-15.726,9.539-24.45
	c0.84-5.215,1.415-10.454,1.823-15.705c1.554-0.508,3.117-0.995,4.68-1.475c18.135-5.523,36.931-9.068,55.518-12.684
	c36.479-7.094,73.473-9.3,110.368-13.232c15.522-1.655,31.204-3.497,46.354-7.374c11.19-2.865,23.503-7.053,31.204-16.149
	C436.394,264.375,435.746,255.139,429.396,249.253z M169.448,330.979c-0.876,9.072-1.666,19.138-5.755,27.435
	c-0.471,0.959-1.127,2.006-1.918,2.774c-0.232,0.047-0.548,0.072-0.923,0.032c-3.101-0.376-5.635-2.614-7.265-5.139
	c-3.009-4.669-2.035-10.439-0.104-14.983c1.615-3.78,3.213-5.555,5.886-7.929c0.236-0.208,0.471-0.399,0.711-0.603
	c0.14-0.1,0.728-0.567,0.855-0.656c0.908-0.671,1.851-1.291,2.806-1.898c0.096-0.06,0.176-0.112,0.236-0.152
	c0.064-0.032,0.12-0.068,0.204-0.115c0.532-0.316,1.079-0.607,1.623-0.904c1.31-0.715,2.662-1.371,4.012-2.006
	C169.703,328.218,169.583,329.6,169.448,330.979z M420.863,270.213c-0.507,1.016-0.043,0.244-0.987,1.423
	c-0.064,0.079-0.272,0.3-0.427,0.463c-0.268,0.256-0.539,0.499-0.815,0.743c-0.032,0.025-0.052,0.04-0.08,0.064
	c-0.04,0.036-0.087,0.065-0.144,0.108c-0.419,0.312-0.855,0.596-1.295,0.883c-0.052,0.036-0.088,0.061-0.132,0.088
	c-0.048,0.028-0.083,0.047-0.14,0.083c-0.671,0.38-1.359,0.724-2.05,1.067c-0.115,0.056-0.731,0.34-0.991,0.46
	c-0.427,0.183-0.855,0.359-1.295,0.535c-1.247,0.499-2.518,0.943-3.796,1.378c-2.534,0.859-5.331,1.587-8.488,2.342
	c-7.002,1.67-14.128,2.87-21.253,3.88c-11.114,1.571-22.272,2.789-33.442,3.88c1.978-2.186,3.745-4.336,4.664-5.359
	c12.18-13.595,27.687-26.552,46.13-29.933c8.44-1.547,20.349-0.248,24.578,8.416C422.455,263.924,422.171,267.576,420.863,270.213z"
	/>

<path class="Text" id="you" d="M734.692,120.417c-2.39,8.828-5.939,17.584-11.678,24.785c-1.87,2.354-4.396,4.68-6.202,5.683
	c-0.136-0.012-0.24,0-0.12,0.024c-0.4-0.1-1.327-0.488-1.375-0.524c-6.802-3.952-7.745-15.142-8.352-21.988
	c-1.655-18.703,1.407-37.894,4.708-56.237c0.599-3.301-9.743-1.467-10.295,1.558c-3.637,20.162-8.105,40.324-15.106,59.61
	c-2.166,5.971-4.644,11.873-7.761,17.409c-0.831,1.475-1.774,2.877-2.806,4.224c-0.151-0.359-0.287-0.711-0.415-1.067
	c-1.495-4.092-1.527-8.772-1.527-13.068c-0.007-18.055,4.125-36.303,8.297-53.771c0.728-3.177-9.567-1.467-10.295,1.559
	c-2.31,10.127-6.506,19.802-12.069,28.558c-1.454,2.302-3.054,4.5-4.763,6.622c0.519-4.052,0.863-8.061,1.079-11.913
	c0.352-6.102,0.631-13.483-3.157-18.691c-2.901-3.984-9.352-2.845-13.18-1.195c-7.513,3.226-11.965,10.918-13.987,18.527
	c-0.072,0.24-0.128,0.503-0.183,0.751c-0.712,0.46-1.224,0.995-1.367,1.558c-3.581,13.816-8.361,27.359-13.036,40.863
	c-1.215-13.672-2.43-27.328-3.485-40.979c-0.232-2.906-0.448-5.803-0.671-8.712c-0.2-2.725-10.479-0.623-10.358,2.778
	c0.863,23.542-2.039,47.385-9.24,69.852c-2.086,6.543-4.565,13.261-8.201,19.139c-1.742-7.401-0.032-16.141,0.104-23.514
	c0.192-10.494-0.112-21.077-1.895-31.439c-2.446-14.351-9.351-28.435-25.569-29.114c-2.573-0.107-5.115,0.112-7.665,0.476
	c-1.823,0.264-5.268,1.139-5.979,3.185c-0.703,2.07,3.405,1.762,4.325,1.63c16.888-2.418,22.763,15.382,24.889,28.794
	c1.678,10.566,1.711,21.404,1.463,32.083c-0.16,7.234-1.855,15.798,0.591,22.847c1.639,4.736,7.242,4.204,11.079,2.546
	c4.851-2.107,7.617-6.482,10.07-10.946c4.948-9.004,8.32-19.023,10.735-29.27c0.44,5.139,0.871,10.275,1.295,15.414
	c-5.348,15.601-10.663,31.212-15.738,46.909c-6.954,21.521-14.163,43.401-13.956,66.28c0.104,12.32,3.461,30.049,18.927,30.268
	c11.557,0.16,19.175-5.95,22.364-16.617c4.109-13.807,3.741-29.253,3.605-43.504c-0.28-28.494-2.31-56.98-4.716-85.435
	c2.694-7.877,5.403-15.758,8.097-23.65c0.024-0.064,0.047-0.136,0.072-0.204c0.272,3.449,0.903,6.898,2.389,9.895
	c4.588,9.295,16.817,1.422,20.558-4.576c4.388-7.013,7.194-15.295,9.007-23.794c3.317-2.222,6.275-4.864,8.473-7.214
	c1.119-1.195,2.19-2.446,3.237-3.732c-0.991,7.317-1.567,14.666-1.503,22.003c0.064,6.966,0.632,18.248,10.326,16.757
	c10.327-1.587,15.235-12.101,19.055-20.646c1.391-3.113,2.677-6.274,3.876-9.475c0.064,0.62,0.104,1.247,0.176,1.87
	c0.815,7.558,2.789,18.487,10.886,21.652c7.937,3.105,17.112-2.238,22.531-7.716c7.041-7.134,11.334-17.125,14.147-26.584
	c0.2-0.695,0.392-1.391,0.592-2.094C745.81,115.797,735.523,117.352,734.692,120.417z M607.327,258.796
	c0.367,15.274,0.719,31.288-2.95,46.231c-0.983,4.012-2.39,8.256-5.355,11.254c-0.344,0.351-0.048,0.124-0.807,0.519
	c1.486-0.775-0.152,0-0.815,0.052c-2.478,0.192-4.66-1.003-6.49-2.566c-4.428-3.812-5.979-10.327-6.89-15.83
	c-1.463-8.84-0.767-17.991,0.456-26.812c2.877-20.813,10.367-41.019,16.945-60.88c0.991-2.982,1.998-5.962,2.997-8.936
	C605.8,220.798,606.88,239.79,607.327,258.796z M638.307,102.577c1.015-2.138,2.342-4.092,3.924-5.85
	c0.104-0.12,0.216-0.212,0.327-0.316c0.56,0.647,1.192,1.562,1.495,2.242c1.359,3.025,1.574,6.578,1.702,9.835
	c0.327,8.32-0.959,16.885-2.734,25.105c-4.78-0.584-7.329-10.343-7.809-13.8C634.382,113.927,635.805,107.877,638.307,102.577z
	 M635.182,157.184c-0.408,0.76-0.863,1.495-1.351,2.206c-0.551-1.083-0.879-2.378-1.166-3.489
	c-1.375-5.275-1.335-10.958-1.215-16.357c0.025-1.127,0.064-2.254,0.128-3.373c0.248,0.2,0.496,0.403,0.759,0.588
	c2.965,1.978,6.227,2.477,9.496,2.03C640.297,145.123,638.267,151.437,635.182,157.184z"/>

		<path id="exclamation1" class="Text" d="M766.311,35.235c-1.615,25.513-3.173,51.165-2.95,76.735c0.008,1.338,10.383-0.088,10.367-2.778
			c-0.232-25.569,1.327-51.222,2.942-76.731C776.742,31.35,766.495,32.409,766.311,35.235L766.311,35.235z"/>

		<path id="exclamation1Dot" class="Text" d="M764.361,125.885c-0.04,2.102-0.08,4.208-0.112,6.31c-0.016,0.807,1.454,1.195,1.974,1.283
			c1.271,0.212,2.614,0.044,3.844-0.288c1.831-0.487,4.508-1.554,4.548-3.768c0.032-2.106,0.064-4.213,0.104-6.314
			c0.016-0.803-1.454-1.191-1.966-1.278c-1.271-0.22-2.614-0.044-3.852,0.283C767.07,122.603,764.401,123.667,764.361,125.885
			L764.361,125.885z"/>

		<path id="exclamation2" class="Text" d="M793.798,27.745c-1.623,25.513-3.173,51.162-2.958,76.735c0.016,1.335,10.383-0.088,10.375-2.777
			c-0.232-25.573,1.327-51.222,2.942-76.735C804.229,23.865,793.966,24.915,793.798,27.745L793.798,27.745z"/>

		<path class="Text" id="exclamation2Dot" d="M791.84,118.391c-0.024,2.107-0.072,4.213-0.104,6.323c-0.008,0.8,1.454,1.183,1.966,1.271
			c1.279,0.219,2.622,0.043,3.852-0.284c1.831-0.492,4.5-1.554,4.54-3.765c0.048-2.11,0.072-4.216,0.112-6.318
			c0.016-0.808-1.454-1.195-1.966-1.283c-1.271-0.215-2.614-0.04-3.852,0.292C794.557,115.11,791.888,116.177,791.84,118.391
			L791.84,118.391z"/>

		<path class="Text" id="exclamation3" d="M821.277,20.256c-1.615,25.521-3.173,51.162-2.95,76.731c0.016,1.339,10.391-0.088,10.359-2.774
			c-0.216-25.573,1.334-51.213,2.949-76.735C831.716,16.376,821.461,17.427,821.277,20.256L821.277,20.256z"/>

		<path class="Text" id="exclamation3Dot" d="M819.335,110.902c-0.048,2.106-0.08,4.209-0.12,6.323c-0.016,0.803,1.455,1.183,1.967,1.27
			c1.27,0.22,2.622,0.052,3.852-0.279c1.838-0.496,4.507-1.563,4.547-3.769c0.032-2.106,0.08-4.216,0.112-6.323
			c0.008-0.803-1.454-1.191-1.974-1.278c-1.263-0.212-2.606-0.044-3.844,0.287C822.044,107.621,819.375,108.688,819.335,110.902
			L819.335,110.902z"/>
	</g>
</g>
  </defs>
</svg>

<svg id="Logo" class="Animate-Path" width="100%" height="100%" viewBox="0 0 612 792" xml:space="preserve">
<!--   <use id="Draw-Text" class="Animate-Draw" xlink:href="#Logo-Text" /> -->

  <use id="Draw-K" class="Animate-Draw" xlink:href="#K" />
  <use id="Draw-T" class="Animate-Draw" xlink:href="#T" />
  <use id="Draw-Mark" class="Animate-Draw" xlink:href="#Mark" />
  <use id="Draw-hLine" xlink:href="#hLine" />
 
  <use id="Draw-TLine" class="Animate-Draw" xlink:href="#TLine" />   
  <use id="Draw-you" class="Animate-Draw" xlink:href="#you" />
  <use id="Draw-exclamation1" class="Animate-Draw" xlink:href="#exclamation1" />
  <use id="Draw-exclamation1Dot" class="Animate-Draw" xlink:href="#exclamation1Dot" />
  <use id="Draw-exclamation2" class="Animate-Draw" xlink:href="#exclamation2" />
  <use id="Draw-exclamation2Dot" class="Animate-Draw" xlink:href="#exclamation2Dot" />
  <use id="Draw-exclamation3" class="Animate-Draw" xlink:href="#exclamation3" />
  <use id="Draw-exclamation3Dot" class="Animate-Draw" xlink:href="#exclamation3Dot" />
   <use id="Draw-Frame" class="Animate-Draw" xlink:href="#Frame" />
#
  <!--<use class="Animate-Fill" xlink:href="#Logo-Group" /> -->
</svg> 
  <h4 style="font-weight:500; margin-bottom:30px;color: #77706A;font-family: Poppins, sans-serif;margin-top:5px;">Your mail has been sent</h4>
  <a href="index.html" class="button" target="_self" style="color:#fff;background-color:#77706A;border-radius:5px;text-decoration:none;font-size:14px;font-weight:500;font-family: Montserrat, sans-serif;letter-spacing:1px;">BACK TO HOME</a> </div>
</body>
</html>