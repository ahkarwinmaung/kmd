
class Components    {

    constructor()   {
        this.COMPONENTS_DIR = `public/ahkar/components/`;
        this.COMPONENTS = {
            header: 'header.html',
            footer: 'footer.html',
            login_modal: 'login-modal.html',
        };
    }



    bindHeader(callBack)    {
        let $target = $('#header-component');
        if ( $target && $target.length )   {
            $.get(`${this.COMPONENTS_DIR}${this.COMPONENTS.header}`, header => {
                $target.after(header);
                $target.remove();
        
                if ( typeof callBack === 'function' ) callBack();
            }, 'html');
        }

        return this;
    } // bindHeader() <-


    bindFooter(callBack)    {
        let $target = $('#footer-component');
        if ( $target && $target.length )   {
            $.get(`${this.COMPONENTS_DIR}${this.COMPONENTS.footer}`, footer => {
                $target.after(footer);
                $target.remove();
    
                if ( typeof callBack === 'function' ) callBack();
            }, 'html');
        }

        return this;
    } // bindFooter() <-


    bindLoginModal(callBack)    {
        let $target = $('#login_modal-component');
        if ( $target && $target.length )   {
            $.get(`${this.COMPONENTS_DIR}${this.COMPONENTS.login_modal}`, login_modal => {
                $target.after(login_modal);
                $target.remove();
    
                if ( typeof callBack === 'function' ) callBack();
            }, 'html');
        }

        return this;
    } // bindLoginModal() <-

}





var components = new Components();



$(document).ready(function()    {

    components.bindHeader().bindFooter().bindLoginModal();

});