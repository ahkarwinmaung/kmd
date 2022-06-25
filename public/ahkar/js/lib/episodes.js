class Episodes {

    constructor() {
        this.spDbLib = new sprLibPhp();

        this.listName = 'episodes';
    }


    getData(options) {
        let returnData;

        this.spDbLib.items(this.listName,
            options,
            function(data) {
                // update display
                returnData = data;
            },
            function(data) {
                // show error
                returnData = 'error';
            }
        );

        return returnData;
    } // getData() <-


    addNew(fieldValues) {
        let returnData;

        this.spDbLib.create(this.listName,
            fieldValues,
            function(data) {
                // update display
                if (typeof data == 'string' && data.includes("Error")) {
                    returnData = "Error";
                } else {
                    returnData = data;
                }
            },
            function(data) {
                // show error
                returnData = "error";
            }
        );

        return returnData;
    } // addNew() <-


    updateItem(id, fieldValues) {
        let returnData;

        this.spDbLib.update(this.listName, id, fieldValues,
            function(data) {
                // update display
                if (typeof data == 'string' && data.includes("Error")) {
                    returnData = "Error";
                } else {
                    returnData = data;
                }
            },
            function(data) {
                // show error
                returnData = "error";
            }
        );

        return returnData;
    } // updateItem() <-


    getAnItem(id) {
        if (!id) return false;

        return this.getData({
            queryFilter: `id eq ${id}`,
            queryLimit: 1,
        });
    } // getAnItem() <-

}