<?php
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
if ($lang === 'en') {
  include("index-en.php");
} else {
  include("index-zh.php");
} 
?>
