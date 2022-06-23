/**
Config vars here
**/



var config = {
	env: 'staging',
	baseSpUrl: '/kmd',
	workingDir: '/',
	spTimeDiff: 60000,
	sitesDir: '/kmd',
	urlParameters: '',
	year: '2022',
	backdoor: true
};

config = Object.assign({
	baseUrl:location.origin+config.baseSpUrl,
	homeURL:location.origin+config.baseSpUrl+config.workingDir,
}, config);



class Clickr  {
	constructor()   {
		// this.flag = true; // live
	}
	log(...v)   {
		if ( this.flag ) 	{
			if ( config.env !== 'live' )   console.log( ...v );
			// if ( config.env !== 'live' )   console.log( ...v, new Error() ); // to see line number of caller func
		} else 	{
			console.log( ...v );
			// console.log( ...v, new Error() ); // to see line number of caller func
		}
	}
	wait(ms) 	{
		return new Promise((resolve, reject) => {
			try {
				setTimeout(_ => {
					resolve(ms);
				}, ms);
			} catch(err) 	{
				reject(err);
			}
		});
	}
}
var clickr = new Clickr();



clickr.log('config -', config);
/******************************************************/

var alertFallback = false;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
if (typeof console === "undefined" || typeof clickr.log === "undefined") {
  console = {};
  if (alertFallback) {
	clickr.log = function(msg) {
	  alert(msg);
	};
  } else {
	clickr.log = function() {};
  }
}	
var isEmpty = function(obj) {
	if (obj == null) return true;
	if (obj.length > 0)    return false;
	if (obj.length === 0)  return true;
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}
	return true;
};

var combine = function(a,b,c) {
	return processArrays([].slice.call(arguments), "", []);

	function processArrays(arrays, str, res) {
		for (var i = 0; i < arrays[0].length; i++) {
			if (arrays.length > 1) {
				processArrays(arrays.slice(1), str + arrays[0][i], res);
			} else {
				res.push(str + arrays[0][i]);
			}
		}
		return res;
	}
}
function getDateISOFormat(date,secondsOffset){
	var tzoffset = date.getTimezoneOffset() * secondsOffset; //offset in seconds
	var localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);
	var returnVal = (new Date(localISOTime)).toISOString().slice(0, -5)+'Z';
	
	if(config.env == 'live'){
		localISOTime = (new Date(date - tzoffset)).toISOString();
		returnVal = (new Date(date - tzoffset)).toISOString().slice(0, -5)+'Z';
	}
	return returnVal;
}
/*Copyright Year*/
var dateNow = new Date();
if($('#copyrightYear').length > 0){
	$('#copyrightYear').text(dateNow.getFullYear());
}

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
	.replace(/\s+/g, '-') // Replace spaces with -
	//.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
	.replace(/&/g, '-and-') // Replace & with 'and'
	.replace(/[^\w\-]+/g, '') // Remove all non-word characters
	.replace(/\-\-+/g, '-') // Replace multiple - with single -
	.replace(/^-+/, '') // Trim - from start of text
	.replace(/-+$/, '') // Trim - from end of text
}

function slugifyId(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
	.replace(/\s+/g, '_') // Replace spaces with -
	//.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
	.replace(/&/g, '-and-') // Replace & with 'and'
	.replace(/[^\w\-]+/g, '') // Remove all non-word characters
	.replace(/\-\-+/g, '_') // Replace multiple - with single -
	.replace(/^-+/, '') // Trim - from start of text
	.replace(/-+$/, '') // Trim - from end of text
}

function timeZeros(dt){ 
  return (dt < 10 ? '0' : '') + dt;
}

function formatAMPM(date){
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = hours + ':' + minutes + ' '+ ampm;
	return strTime;
	}

function getQueryString() {
  var key = false, res = {}, itm = null;
  // get the query string without the ?
  var qs = location.search.substring(1);
  // check for the key as an argument
  if (arguments.length > 0 && arguments[0].length > 1)
	key = arguments[0];
  // make a regex pattern to grab key/value
  var pattern = /([^&=]+)=([^&]*)/g;
  // loop the items in the query string, either
  // find a match to the argument, or build an object
  // with key/value pairs
  while (itm = pattern.exec(qs)) {
	if (key !== false && decodeURIComponent(itm[1]) === key)
	  return decodeURIComponent(itm[2]);
	else if (key === false)
	  res[decodeURIComponent(itm[1])] = decodeURIComponent(itm[2]);
  }
  return key === false ? res : null;
}

function convertToCSV(objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	var str = '';
	for (var i = 0; i < array.length; i++) {
		var line = '';
		for (var index in array[i]) {
			if (line != '') line += ','
			line += array[i][index];
		}
		str += line + '\r\n';
	}
	return str;
}


function exportCSVFile(headers, items, fileTitle) {
	if (headers) {
		items.unshift(headers);
	}
	clickr.log(fileTitle);
	// Convert Object to JSON
	var jsonObject = JSON.stringify(items);
	var csv = this.convertToCSV(jsonObject);
	var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
	var blob = new Blob(["\uFEFF"+csv], { type: 'text/csv; charset=UTF-8;' });
	if (navigator.msSaveBlob) { // IE 10+
		navigator.msSaveBlob(blob, exportedFilenmae);
	} else {
		var link = document.createElement("a");
		if (link.download !== undefined) { // feature detection
			// Browsers that support HTML5 download attribute
			var url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", exportedFilenmae);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}

function nl2br (str, is_xhtml) {
	if (typeof str === 'undefined' || str === null) {
		return '';
	}
	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function RemoveLastDirectoryPartOf(the_url){
	var the_arr = the_url.split('/');
	the_arr.pop();
	return( the_arr.join('/') );
}

function csvJSON(csv){
  var lines=csv.split("\n");
  var result = [];
  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step 
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  var headers=lines[0].split(",");
  for(var i=1;i<lines.length;i++){
	  var obj = {};
	  var currentline=lines[i].split(",");
	  for(var j=0;j<headers.length;j++){
		  obj[slugifyId(headers[j])] = currentline[j];
	  }
	  result.push(obj);
  }
  return result; //JavaScript object
  //return JSON.stringify(result); //JSON
} 

function isInt(value) {
  return !isNaN(value) && 
		 parseInt(Number(value)) == value && 
		 !isNaN(parseInt(value, 10));
}

function msieversion() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	var trident = ua.indexOf('Trident/');
	var edge = ua.indexOf('Edge/');
	if (msie > 0) {
		// IE 10 or older => return version number
		 clickr.log(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
		return true;
	}else{
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			clickr.log(parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10));
			return true;
		}else{
			clickr.log('otherbrowser');
			return false;
		}
	}
}
function calculateHours(date1,date2){
	var Difference_In_Time = date2.getTime() - date1.getTime(); 
	var Difference_In_Hrs = Difference_In_Time / (1000 * 3600); 
	
	return Difference_In_Hrs.toFixed(2);
}
var scrollToJump = function( eleid, offset ){
				var pos = $(eleid).position();
				$('html, body').animate({
					scrollTop: (pos.top + offset)
				}, 800);
			};

function linkIsInternal (link) {  
  var base_url = config.homeURL;
  
  var isInternal = false;
  if(link.indexOf(base_url) >= 0){
	isInternal = true;
  }
  if(link.indexOf(base_cdn) >= 0){
	isInternal = true;
  }
	
  return isInternal;
}


function isInt(value){
	if(isNaN(value)){
		return false;
	}
	var x = parseFloat(value);
	return (x|0) === x;
}