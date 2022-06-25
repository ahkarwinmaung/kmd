
class CommonController    {

    constructor()   {
        // libs
        this.libs = {
            users: new Users(),
        }
        
        this.LOGIN_COOKIE = 'loginID',

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
        eraseCookie('loginID');
    } // logout() <-


    showLoginModal()    {
        if ( $('#login-modal.uk-modal').length )   UIkit.modal('#login-modal').show();
    } // showLoginModal() <-

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
                createCookie(globalCommonController.LOGIN_COOKIE, loginUser.id);
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