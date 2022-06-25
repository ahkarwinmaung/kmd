<?php

// parse_str('method=select&table=steps&options%5BqueryLimit%5D=100', $_POST);
// print_r($_POST);

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

$db = array(
	'name' => 'manga',
	'user' => 'root',
	'pass' => 'root',
);

$mysqli = new mysqli("localhost", $db['user'], $db['pass'], $db['name']);

$mysqli->set_charset("utf8");

// Check connection
if ($mysqli -> connect_errno) {
  echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
  exit();
}


function debug_logger( $filename, $data ){
	$file = getcwd( ). '/logs/' . $filename . '_debug.log';
	date_default_timezone_set( 'Asia/Singapore' );
	$currentTimestamp = date( 'Y-m-d H:i:s' );
	if ( ! file_exists( $file ) ):
		$fp = fopen( $file, "wb" );
		fwrite( $fp, '[' . $currentTimestamp . ']' . ': ' . print_r( $data, true ) . "\n" );
		fclose( $fp );
	else:
		file_put_contents( $file, '[' . $currentTimestamp . ']' . ': ' . print_r( $data, true ) . "\n", FILE_APPEND | LOCK_EX );
	endif;
}

if( !empty($_POST['method'])  ){

	switch($_POST['method']):
		case "select":
			$returnResult = array();
			if( !empty($_POST['table']) ){
			
				if(!empty($_POST['options'])){
					$options = $_POST['options'];
					
					$fields = '*';
					if(!empty($options['listCols'])){
						$fields = '';
						foreach($options['listCols'] as $i => $field){
							if($i >0){
								$fields .= ','.$field;
							}else{
								$fields = $field;
							}
						}
					}
					$queryFilterMatches = '';
					$query = '';
					if(!empty($options['queryFilter'])){
						// TODO need rewrite to be more robust													
						$qFilter = $options['queryFilter'];
						$pSubsstringof = '/substringof\([^)]*\)/';
						preg_match($pSubsstringof, $qFilter,$queryFilterMatches, PREG_OFFSET_CAPTURE, 3);
						// print_r($queryFilterMatches);								
						// dericknwq - Handle integers
						$options['queryFilter'] = preg_replace('/eq (\d+)/', '= $1', $options['queryFilter']);
						
						$sprOperators = array(" eq '"," ne '"," gt '"," ge '"," lt '"," le '","le datetime'","ge datetime'");
						$sqlOperators = array(" = '"," != '"," > '"," >= '"," < '"," <= '"," <= '"," >= '");						
						$options['queryFilter'] = str_replace($sprOperators,$sqlOperators,$options['queryFilter']);
																			
						//for the email 
						$options['queryFilter'] = urldecode($options['queryFilter']);
						
						if(!empty($queryFilterMatches)){
							
							$fieldColumnEx = explode(",",$queryFilterMatches[0][0]);
							$fieldColumn = substr($fieldColumnEx[1], 0, -1);
							
							$fieldColumnValEx = explode("substringof('",$queryFilterMatches[0][0]);
							$fieldColumnValEx2 = explode("',",$fieldColumnValEx[1]);
							$fieldColumnVal = $fieldColumnValEx2[0];
							
							$queryLike = "(".$fieldColumn." like '%".$fieldColumnVal."%')";	
							
							$options['queryFilter'] = preg_replace('/substringof\([^)]*\)/',' '.$queryLike.' ' , $options['queryFilter']);
							
						}						
						$query = ' WHERE '.$options['queryFilter'];
					}
					
					$queryOrderby = '';
					if(!empty($options['queryOrderby'])){
						$queryOrderby = ' ORDER BY '.$options['queryOrderby'];
					}
					
					if(empty($options['queryLimit'])){
						$options['queryLimit'] = 5000;
					}
					$queryLimit = '';
					$queryLimitPaging = '';
					if(!empty($options['queryLimit'])){
						$queryLimit = ' LIMIT '.$options['queryLimit'];
						$queryLimitPaging = $queryLimit;
						
						if(!empty($options['next'])){
							$queryLimitPaging = ' LIMIT '.(($options['next']-1)*$options['queryLimit']).','.$options['queryLimit'];
						}
						
					}
					$sql = 'SELECT '.$fields.' FROM `'.$_POST['table'].'` '.$query.$queryOrderby.$queryLimitPaging;
					
					$result = $mysqli->query($sql);
					
					$mysqli->options(MYSQLI_OPT_INT_AND_FLOAT_NATIVE, TRUE);
					$data = array();
					while($row = mysqli_fetch_assoc($result)) { 
						$data[]= $row; 
					}

					$returnResult['results'] = $data;
					//print_r(json_encode($data));
					//print_r($data);
					//$mysqli->close();
					
					$totalRow = 0;
					$sqlCount = 'SELECT COUNT(*) as total FROM `'.$_POST['table'].'` '.$query.$queryOrderby.$queryLimit;
					$queryCount = $mysqli->query($sqlCount);
					$mysqli->options(MYSQLI_OPT_INT_AND_FLOAT_NATIVE, TRUE);
					$rowCount = mysqli_fetch_assoc($queryCount);
					
					if(!empty($rowCount['total'] )){
						$totalPages = ceil($rowCount['total'] / $options['queryLimit']);

						//$returnResult = $data;
						$currentpage = 1;					
						if(!empty($options['next'])){
							$currentpage = $options['next'];						
						}
						$nextpage = $currentpage+1;
						if($nextpage <= $totalPages){
							$returnResult['next'] = $nextpage;
						}
					}
					
					
					$mysqli->close();
					$returnResult['queryLimit'] = $options['queryLimit'];
					$returnResult['sqlCount'] = $sqlCount;
					
					$returnResult['sql'] = $sql;
					$returnResult['substring_matches'] = $queryFilterMatches;
					
					
				}

				
			}
			//$returnResult['_POST'] = $_POST;
			echo json_encode($returnResult);
			//echo json_encode($returnResult, JSON_NUMERIC_CHECK);
			// echo json_last_error();
			break;
			
		case 'insert':
			
			$returnResult = array();
			if( !empty($_POST['table']) && !empty($_POST['fields']) ){
				$fieldSet = '';
				foreach($_POST['fields'] as $fieldsPairs){
					if( $_POST['table']== 'Events'  && ( $fieldsPairs[0] == 'Title' || $fieldsPairs[0]=='ShortDescription' || $fieldsPairs[0]=='Programme_x0020_Details') ){
						$fieldSet .= ' '.$fieldsPairs[0].'="'.htmlentities($fieldsPairs[1], ENT_QUOTES, "UTF-8").'", ';
					}elseif( $_POST['table']== 'Notifications'  && ( $fieldsPairs[0] == 'EmailContent' || $fieldsPairs[0]=='EmailSubject' ) ){
						$fieldSet .= ' '.$fieldsPairs[0].'="'.htmlentities($fieldsPairs[1], ENT_QUOTES, "UTF-8").'", ';					
					}elseif( $_POST['table']== 'Registrants'  && ( $fieldsPairs[0] == 'Form_x0020_Content') ){
						$fieldSet .= ' '.$fieldsPairs[0].'="'.htmlentities($fieldsPairs[1], ENT_QUOTES, "UTF-8").'", ';					
					}elseif( $_POST['table']== 'Individual Volunteers'  && ( $fieldsPairs[0] == 'Description') ){
						$fieldSet .= ' '.$fieldsPairs[0].'="'.htmlentities($fieldsPairs[1], ENT_QUOTES, "UTF-8").'", ';					
					}else{
						$fieldSet .= ' '.$fieldsPairs[0].'="'.(!empty($fieldsPairs[1])?$fieldsPairs[1] :'').'", ';
					}
				
					
				}
				$fieldSet = ' '.substr($fieldSet, 0, -2);

				$sql = 'INSERT INTO `'.$_POST['table'].'` SET '.$fieldSet;
				// var_dump($sql); die();

				if ($mysqli->query($sql) === TRUE) {
				  $returnResult['status'] = 'success';
				  $returnResult['Id'] = $mysqli->insert_id;
				} else {
				  $returnResult['status'] = 'error';
				  $returnResult['error'] = "error: " . $sql . "<br>" . $mysqli->error;
				  //$returnResult = "error";
				}
				$returnResult['sql'] = $sql;
			}
			//$returnResult['_POST'] = $_POST;
			// var_dump(json_encode($returnResult)); die();
			echo json_encode($returnResult);
			break;
		case 'update';
			
			$returnResult = array();
			if( !empty($_POST['table']) && !empty($_POST['id']) && !empty($_POST['fields']) ){
				
				$fieldSet = '';
				foreach($_POST['fields'] as $fieldsPairs){
					if( $_POST['table']== 'Events'  && ( $fieldsPairs[0] == 'Title' || $fieldsPairs[0]=='ShortDescription' || $fieldsPairs[0]=='Programme_x0020_Details') ){
						$fieldSet .= ' '.$fieldsPairs[0].'="'.htmlentities($fieldsPairs[1], ENT_QUOTES, "UTF-8").'", ';
					}elseif( $_POST['table']== 'Notifications'  && ( $fieldsPairs[0] == 'EmailContent' || $fieldsPairs[0]=='EmailSubject' ) ){
						$fieldSet .= ' '.$fieldsPairs[0].'="'.htmlentities($fieldsPairs[1], ENT_QUOTES, "UTF-8").'", ';					
					}elseif( $_POST['table']== 'Registrants'  && ( $fieldsPairs[0] == 'Form_x0020_Content') ){
						$fieldSet .= ' '.$fieldsPairs[0].'="'.htmlentities($fieldsPairs[1], ENT_QUOTES, "UTF-8").'", ';					
					}elseif( $_POST['table']== 'Individual Volunteers'  && ( $fieldsPairs[0] == 'Description') ){
						$fieldSet .= ' '.$fieldsPairs[0].'="'.htmlentities($fieldsPairs[1], ENT_QUOTES, "UTF-8").'", ';					
					}else{
						$fieldSet .= ' '.$fieldsPairs[0].'="'.(!empty($fieldsPairs[1])?$fieldsPairs[1] :'').'", ';
					}				
				}
				$fieldSet = ' '.substr($fieldSet, 0, -2);
				$sql = 'UPDATE `'.$_POST['table'].'` SET '.$fieldSet.' WHERE Id ='.$_POST['id'];
				// var_dump($sql); die();

				if ($mysqli->query($sql) === TRUE) {
				  $returnResult = $_POST['id'];
				} else {
				  $returnResult = "Error: " . $sql . "<br>" . $mysqli->error;
				}
				//$returnResult['sql'] = $sql;
			}
			//$returnResult['_POST'] = $_POST;
				debug_logger( 'dbUpdate',$_POST ); 
			echo json_encode($returnResult);
			
			break;
		case 'uploadImage';
			
			$returnResult = array();
			if( !empty($_POST['table']) && !empty($_POST['id']) && !empty($_FILES['file']['tmp_name']) && !empty($_POST['dir']) ){
				$filename = $_POST['id'];
				//$imgDir = '../../images/socialwall/';
				//$imgDir = '../../images/newsocialwalldir/';
				
				$imgDir = $_POST['dir'].'/Lists/'.$_POST['table'].'/Attachments/'.$_POST['id'].'/';
				
				$serverDir = '/home/dbs/public_html';
				
				if (!file_exists($serverDir.$_POST['dir'].'/Lists/')) {
					mkdir($serverDir.$_POST['dir'].'/Lists/', 0777, true);
				}
				if (!file_exists($serverDir.$_POST['dir'].'/Lists/'.$_POST['table'])) {
					mkdir($serverDir.$_POST['dir'].'/Lists/'.$_POST['table'], 0777, true);
				}
				if (!file_exists($serverDir.$_POST['dir'].'/Lists/'.$_POST['table'].'/Attachments/')) {
					mkdir($serverDir.$_POST['dir'].'/Lists/'.$_POST['table'].'/Attachments/', 0777, true);
				}
				if (!file_exists($serverDir.$imgDir)) {
					mkdir($serverDir.$imgDir, 0777, true);
				}
				$returnResult['imgDir'] = $imgDir;
				if($_FILES['file']['type'] == 'image/png'){
					$filename .= '.png';
				}
				if( ($_FILES['file']['type'] == 'image/jpg') ||  ($_FILES['file']['type'] == 'image/jpeg') ){
					$filename .= '.jpg';
				}
				if( ($_FILES['file']['type'] == 'video/mp4') ){
					$filename .= '.mp4';
				}
				
				if ( 0 < $_FILES['file']['error'] ) { 
					$returnResult = 'Error: ' . $_FILES['file']['error'];
				}
				else {
					move_uploaded_file($_FILES['file']['tmp_name'], $serverDir.$imgDir.$filename);
				}
				
				$sql = 'UPDATE `'.$_POST['table'].'` SET image="'. $filename.'",imageUrl="'. $imgDir.$filename.'" WHERE Id = '.$_POST['id'];
				// var_dump($sql); die();

				if ($mysqli->query($sql) === TRUE) {
				  $returnResult = array('status'=>'success','image_name'=>$filename);
				} else {
				   $returnResult = "Error: " . $sql . "<br>" . $mysqli->error;
				}
			}
			//$returnResult['_POST'] = $_POST;
			echo json_encode($returnResult);
			//print_r($_POST);
			//print_r($_FILES);
			break;
		case 'getImage';
			
			$returnResult = array();
			if( !empty($_POST['table']) && !empty($_POST['id']) ){
			
				$sql = 'SELECT image FROM '.$_POST['table'].' WHERE Id='.$_POST['id'].' LIMIT 1';
				
				$result = $mysqli->query($sql);
				$data = array();
				while($row=mysqli_fetch_assoc($result)) { 
					$data[]=$row; 
				}
				$mysqli->close();
				$returnResult = $data;
			
				//$returnResult['sql'] = $sql;
			}
			echo json_encode($returnResult);
			break;
		default:
			//do something here
			break;
	endswitch;
}