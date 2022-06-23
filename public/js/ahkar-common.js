
// sprLib.options({baseUrl:'/sites/sgibgfirst/SitePages/initiatives'}); 
//sprLib.options({baseUrl:'/'}); 

var alertFallback = false;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

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

var updateWidth;
(function($) { 		
	$(document).ready(function() {	
		var updateWidthTmr;
		updateWidth = function(){
			updateWidthTmr = setTimeout(function(){
				clearTimeout(updateWidthTmr);
				var windowW = $(window).width();
									
				var baseW = 1310;
				var baseH = 500;	
				var maxH = 500;
				var minH = 450;
				
				var thisH = ($(window).width() * baseH) / baseW;
				
				if( $(window).width() < 480){ var minH = 320; }
				if( thisH > maxH){ thisH = maxH; }
				if( thisH < minH){ thisH = minH; }
				$('#mainBanner .img-box').css('height',thisH+'px');
				//$('.full-width-page #page-head h1').css('margin-top', ((thisH- $('.full-width-page #page-head h1').height() )/2)+'px' );
				
				
				
			}, 500);
		}
		
		updateWidth();
		
		setTimeout(function(){
			updateWidth();
		},800);
		$(window).resize(function() {	
				updateWidth();
		});
		
	});
})(jQuery)



// AK
function DMYtoYMD(str, splitBy = '-') 	{ // DD-MM-YYYY to YYYY-MM-DD
	let a = str.split(splitBy);
	let YMD = `${a[2]}${splitBy}${a[1]}${splitBy}${a[0]}`;
	return YMD;
}
function addParam(name = null, value = null)  {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const PARAMS = Object.fromEntries(urlSearchParams.entries());
	let newParams = {...PARAMS};
	newParams[name] = value; // add param
	let pushParam = `?`;
	for (const [i, [k, v]] of Object.entries(Object.entries(newParams)))    {
		pushParam += `${i > 0 ? '&' : ''}${k}=${encodeURIComponent(v)}`;
	}
	window.history.replaceState( null, null, pushParam );
}
function removeParam(name)   {
	Object.size = function(obj) {
		let size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};
	const urlSearchParams = new URLSearchParams(window.location.search);
	const PARAMS = Object.fromEntries(urlSearchParams.entries());
	if ( name && PARAMS[name] )   {
		let newParams = {...PARAMS};
		delete newParams[name]; // remove param
		let pushParam = ``;
		if ( Object.size(newParams) )   {
			pushParam = `?`;
			for (const [i, [k, v]] of Object.entries(Object.entries(newParams)))    {
				pushParam += `${i > 0 ? '&' : ''}${k}=${encodeURIComponent(v)}`;
			}
			window.history.replaceState( null, null, pushParam );
		} else 	{
			window.history.replaceState(null, null, window.location.pathname);
		}
	}
}
function getURLparam(param) 	{
	const urlSearchParams = new URLSearchParams(window.location.search);
	return urlSearchParams.get(param);
}
function timeSince(date) {

	var seconds = Math.floor((new Date() - date) / 1000);
  
	var interval = seconds / 31536000;
  
	if (interval > 1) {
	  return Math.floor(interval) + " years";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
	  return Math.floor(interval) + " months";
	}
	interval = seconds / 86400;
	if (interval > 1) {
	  return Math.floor(interval) + " days";
	}
	interval = seconds / 3600;
	if (interval > 1) {
	  return Math.floor(interval) + " hours";
	}
	interval = seconds / 60;
	if (interval > 1) {
	  return Math.floor(interval) + " minutes";
	}
	return Math.floor(seconds) + " seconds";
}



// add-on
$(document).ready(function() 	{

	// add ajax loading
	$(
		`<div id="ajax-loading">
			<div class="ajax-loading-bg">
				<div class="spinner">
					<div class="double-bounce1"></div>
					<div class="double-bounce2"></div>
				</div>
			</div>
		</div>`
	).prependTo('body');

});