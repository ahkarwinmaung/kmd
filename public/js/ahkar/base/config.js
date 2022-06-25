
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

console.log('config -', config);



class AhKar  {
	constructor()   {
		//
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
	} // wait() <-

	showAjaxLoading() 	{
		$('#ajax-loading').fadeIn('fast');
	} // showAjaxLoading() <-
	hideAjaxLoading() 	{
		$('#ajax-loading').fadeOut('fast');
	} // hideAjaxLoading() <-

	ajaxLoading(func, hidden) 	{
		$('#ajax-loading').fadeIn('fast', async () => {
			await this.wait(100); // prevent lagging
			if ( typeof func === 'function' )  func();
			$('#ajax-loading').fadeOut('fast', () => {
				if ( typeof hidden === 'function' ) 	hidden();
			});
		});
	} // ajaxLoading() <-
}
var ahkar = new AhKar();



/******************************************************/
if (typeof console === "undefined" || typeof console.log === "undefined") {
  console = {};
  if (alertFallback) {
	console.log = function(msg) {
	  alert(msg);
	};
  } else {
	console.log = function() {};
  }
}