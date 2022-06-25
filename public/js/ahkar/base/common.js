
var alertFallback = false;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function isEmpty(obj) 	{
	if (obj == null) return true;
	if (obj.length > 0)    return false;
	if (obj.length === 0)  return true;
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}
	return true;
}

function isInt(value){
	if(isNaN(value)){
		return false;
	}
	var x = parseFloat(value);
	return (x|0) === x;
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