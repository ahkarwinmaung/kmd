class sprLibPhp {

	constructor() {
		this.dbPath = `public/ahkar/js/base/sql/db.php`;
		this.env = config.env;
		this.baseSpUrl = config.baseSpUrl;
		this.baseUrl = config.baseUrl;
		this.workingDir = config.workingDir;
		this.sitesDir = config.sitesDir;
	}


	/**
	 * Select list items
	 * 
	 * @param list Name of the list
	 * @param options Refer to https://gitbrent.github.io/SpRestLib/docs/api-list.html#get-item
	 * 		and https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/use-odata-query-operations-in-sharepoint-rest-requests?redirectedfrom=MSDN#odata-query-operators-supported-in-the-sharepoint-rest-service for queryFilter
	 * @returns {Array} Refer to https://gitbrent.github.io/SpRestLib/docs/api-list.html#get-item
	 * @author Derick
	 */

	items(listTable, options, successCallback, failureCallback) {
		$.ajax({
				url: `${this.baseUrl+this.workingDir}${this.dbPath}`,
				crossDomain: true,
				method: "POST",
				data: {
					method: 'select',
					table: listTable,
					options: options
				},
				//dataType: 'html',
				async: false
			})
			.done(function(data){
				// console.log( data );
				successCallback(JSON.parse(data));
			})
			.fail(failureCallback);
	} // items() <-
	
	
	itemsCAML(listTable, options, successCallback, failureCallback) {
		$.ajax({
			url: `${this.baseUrl+this.workingDir}${this.dbPath}`,
			crossDomain: true,
			method: "POST",
			data: {
				method: 'select',
				table: listTable,
				options: options
			},
			//dataType: 'html',
			async: false
		})
		.done(function(data){
			
			successCallback(JSON.parse(data));
		})
		.fail(failureCallback);
	} // itemsCAML() <-


	create(listTable, fieldValues, successCallback, failureCallback, asyncFunc = false) {
		$.ajax({
			url: `${this.baseUrl+this.workingDir}${this.dbPath}`,
			crossDomain: true,
			method: "POST",
			data: {
				method: 'insert',
				table: listTable,
				fields: fieldValues
			},
			//dataType: 'html',
			async: asyncFunc
		})
		.done(function(data){
			console.log(data)
			successCallback(JSON.parse(data));
		})
		.fail(failureCallback);
	} // create() <-
	

	createHtml(listTable, fieldValues, successCallback, failureCallback, asyncFunc = false) {
		this.create(listTable, fieldValues, successCallback, failureCallback);
	} // createHtml() <-


	update(listTable, rowId, fieldValues, successCallback, failureCallback, asyncFunc = false) {
		$.ajax({
				url: `${this.baseUrl+this.workingDir}${this.dbPath}`,
				crossDomain: true,
				method: "POST",
				data: {
					method: 'update',
					table: listTable,
					id: rowId,
					fields: fieldValues
				},
				//dataType: 'html',
				async: asyncFunc
			})
			.done(function(data){
				successCallback(JSON.parse(data));
			})
			.fail(failureCallback);
	} // update() <-


	updateHtml(listTable, rowId, fieldValues, successCallback, failureCallback, asyncFunc = false) {
		this.updateHtml(listTable, rowId, fieldValues, successCallback, failureCallback);
	} // updateHtml() <-


	uploadImage(listTable, rowId, selectedfile,successCallback,failureCallback) {
		let baseUrl = this.baseUrl;
		var form_data = new FormData();
		form_data.append('file', selectedfile);
		form_data.append('method', 'uploadImage');
		form_data.append('table', listTable);
		form_data.append('id', rowId);
		form_data.append('dir', this.sitesDir);


		$.ajax({
				url: `${this.baseUrl+this.workingDir}${this.dbPath}`,
				crossDomain: true,
				dataType: 'text',
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				type: 'POST',
				async: false,
			})
			.done(function(data){
				console.log( data );
				
				var rdatax = JSON.parse(data);
				if (rdatax.status == 'success') {
					//returnData = {'status':rdatax.status,'image_url':baseUrl+'images/newsocialwalldir/'+rdatax.image_name};
					// successCallback({'status':rdatax.status,'image_url':baseUrl+'images/newsocialwalldir/'+rdatax.image_name});
					successCallback({
						status: rdatax.status,
						image_url: `${baseUrl}/Lists/${listTable}/Attachments/${rowId}/${rdatax.image_name}`,
					});
					// successCallback({'status':rdatax.status,'image_url':baseUrl+'/Lists/'+listTable+'/Attachments/'+rdatax.image_name});
				} else {
					//returnData = 'error';
					failureCallback({'status':'error'});
				}
			})
			.fail(function(e){
				//returnData = 'error';	
				console.log( e );
				failureCallback({'status':'error'});	
			});
	} // uploadImage() <-
	
}