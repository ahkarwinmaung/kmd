
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
        $.get(`${this.COMPONENTS_DIR}${this.COMPONENTS.header}`, header => {
            let $target = $('#header-component');
            $target.after(header);
            $target.remove();
    
            if ( typeof callBack === 'function' ) callBack();
        }, 'html');

        return this;
    } // bindHeader() <-


    bindFooter(callBack)    {
        $.get(`${this.COMPONENTS_DIR}${this.COMPONENTS.footer}`, footer => {
            let $target = $('#footer-component');
            $target.after(footer);
            $target.remove();

            if ( typeof callBack === 'function' ) callBack();
        }, 'html');

        return this;
    } // bindFooter() <-


    bindLoginModal(callBack)    {
        $.get(`${this.COMPONENTS_DIR}${this.COMPONENTS.login_modal}`, login_modal => {
            let $target = $('#login_modal-component');
            $target.after(login_modal);
            $target.remove();

            if ( typeof callBack === 'function' ) callBack();
        }, 'html');

        return this;
    } // bindLoginModal() <-

}





var components = new Components();



$(document).ready(function()    {

    components.bindHeader().bindFooter().bindLoginModal();

});