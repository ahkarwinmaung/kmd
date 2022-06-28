
class CommonController    {

    constructor()   {
        // libs
        this.libs = {
            users: new Users(),
        }
        
        this.LOGIN_COOKIE = 'LoginId',

        // store
        this.store = {
            loginUser: null,
        }
    }


    getLoginUser()  {
        return new Promise((resolve, reject) => {
            try {
                let loginID = readCookie(this.LOGIN_COOKIE);
        
                if ( loginID && !isNaN(loginID) && +loginID )   {
                    loginID = +loginID;
        
                    if ( this.store.loginUser && this.store.loginUser.id && loginID === this.store.loginUser.id )   return this.store.loginUser;
                    else    {
                        let loginUserResult = this.libs.users.getAnItem(loginID);
                        
                        if ( loginUserResult && loginUserResult.results && loginUserResult.results.length )     {
                            this.store.loginUser = loginUserResult.results[0];
                            console.log( 'getLoginUser() -> loginUser -', loginUserResult.results[0] );
                            resolve( this.store.loginUser );
                        }
                    }
                }

                resolve(null);
            } catch (err) {
                reject(err);
            }
        });
    } // getLoginUser() <-


    login(email, password)     {
        return new Promise((resolve, reject) => {
            try {
                if ( !email || !password )  reject('missing email or password');

                let emailResult = this.libs.users.getData({
                    queryFilter: `email eq '${email}'`,
                    queryOrderby: `created_at desc`,
                    queryLimit: 1,
                });
                // console.log( 'login() -> emailResult', emailResult );

                if ( emailResult && emailResult.results && emailResult.results.length )   {
                    emailResult = emailResult.results[0];
                    if ( password === emailResult.password )   resolve(emailResult);
                    else  reject('invalid password');
                } else  reject('invalid email');
            } catch (err) {
                reject(err);
            }
        });
    } // login() <-


    logout()    {
        if ( location.origin.includes('localhost:8888') )   { // ahkar
            eraseCookie(this.LOGIN_COOKIE);
            location.reload();
        } else  {
            location.href = `logout.php?from=${ location.href.split('/').pop() }`;
        }
    } // logout() <-


    showLoginModal()    {
        if ( location.origin.includes('localhost:8888') )   { // ahkar
            if ( $('#login-modal.uk-modal').length )   UIkit.modal('#login-modal').show();
        } else  {
            location.href = `login.php?from=${ location.href.split('/').pop() }`;
        }
    } // showLoginModal() <-


    refreshAllTimeSince()   {
        $('.time-since[data-time]').each(function()     {
            let date = $(this).attr('data-time');
            $(this).text( timeSince( new Date(date) ) );
        });

        $('.time-since-single[data-time]').each(function()     {
            let date = $(this).attr('data-time');
            $(this).text( timeSinceSingle( new Date(date) ) );
        });
    }

}





var globalCommonController = new CommonController();



async function getLoginUser()     {
    return await globalCommonController.getLoginUser();
}

async function login(email, password)  {
    return await globalCommonController.login(email, password);
}

function logout()   {
    globalCommonController.logout();
}



$(document).ready(function()    {

    setInterval(() => { // refresh every 1 minute
        globalCommonController.refreshAllTimeSince();
    }, 10000);


    // less - more
    $(document).on('click', '.less-more-content .show-more', function()  {
        let $wrapper = $('.less-more-content');
        $wrapper.find('.less-content').hide();
        $wrapper.find('.more-content').show();
    });
    $(document).on('click', '.less-more-content .show-less', function()  {
        let $wrapper = $('.less-more-content');
        $wrapper.find('.more-content').hide();
        $wrapper.find('.less-content').show();
    });


    // show login modal buttons click
    $(document).on('click', '.show-login-modal', function()  {
        globalCommonController.showLoginModal();
    });

    // login modal form submit
    $(document).on('submit', '.login-form', async function(e)     {
        e.preventDefault();

        let invalidCount = 0;

        $(this).find('.error-message').hide(); // hide all error messages
        
        // email
        let email = $('#login-email').val().trim();
        if ( !email )   {
            invalidCount++;
            $('.error-message[data-for="login-email"]').html('Enter an email').show();
        }
        // password
        let password = $('#login-password').val();
        if ( !password )     {
            invalidCount++;
            $('.error-message[data-for="login-password"]').html('Enter a password').show();
        }

        let isValid = !invalidCount;

        if ( isValid )  {
            await login(email, password).then(loginUser => {
                // console.log( 'login(success) -> loginUser -', loginUser );
                createCookie(globalCommonController.LOGIN_COOKIE, loginUser.id, 24 * 365);
                location.reload();
            }).catch(err => {
                // console.log( 'login(fail) -> err -', err );
                if ( err === 'invalid email' )   $('.error-message[data-for="login-email"]').html('Invalid email').show();
                if ( err === 'invalid password' )   $('.error-message[data-for="login-password"]').html('Invalid password').show();
            });
        }

        return false;
    });

});