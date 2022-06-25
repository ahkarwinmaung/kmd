
class Components    {

    constructor()   {
        this.COMPONENTS_DIR = `public/ahkar/components/`;
        this.COMPONENTS = {
            header: 'header.html',
            footer: 'footer.html',
        };
    }



    bindHeader(callBack)    {
        $.get(`${this.COMPONENTS_DIR}${this.COMPONENTS.header}`, header => {
            $('#header-component').html( header );
    
            if ( typeof callBack === 'function' ) callBack();
        }, 'html');

        return this;
    } // bindHeader() <-


    bindFooter(callBack)    {
        $.get(`${this.COMPONENTS_DIR}${this.COMPONENTS.footer}`, footer => {
            $('#footer-component').html( footer );

            if ( typeof callBack === 'function' ) callBack();
        }, 'html');

        return this;
    } // bindFooter() <-

}





var components = new Components();



$(document).ready(function()    {

    components.bindHeader().bindFooter();

});