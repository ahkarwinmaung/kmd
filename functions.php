
<?php



function getComponent($filename)   {
    $path = "components/$filename.php";
    if ( file_exists($path) )   return require_once($path);
}