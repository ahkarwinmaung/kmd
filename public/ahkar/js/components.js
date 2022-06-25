
class Components    {

    constructor(isAdmin = false)   {
        this.COMPONENTS_DIR = `${isAdmin ? '../' : ''}public/ahkar/components/`;
        this.COMPONENTS = {
            header: 'header.html',
            footer: 'footer.html',
        };
    }


    bindHeader(callBack)    {
        $.get(`${this.COMPONENTS_DIR}${this.COMPONENTS.header}`, header => {
            $('body').prepend( header );
    
            if ( typeof callBack === 'function' ) callBack();
        }, 'html');
    } // bindHeader() <-


    bindFooter(callBack)    {
        $.get(`${this.COMPONENTS_DIR}${this.COMPONENTS.footer}`, footer => {
            $('body').append( footer );

            if ( typeof callBack === 'function' ) callBack();
        }, 'html');
    } // bindFooter() <-

}