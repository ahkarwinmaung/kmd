
class DetailController  {

    constructor()   {

    }


    submitFeedback(feedback)    {
        console.log( 'submitFeedback() -> feedback -', feedback );
    } // submitFeedback() <-

}



$(document).ready(function()    {

    let detailController = new DetailController();


    // eps sorting click
    $(document).on('click', '.detail-eps-sorting', function()  {
        if ( $(this).is('.asc') )   $('.detail-eps-filter-controls .desc').click();
        else    $('.detail-eps-filter-controls .asc').click();
        $(this).toggleClass('asc desc');
    });


    // ? feedback form
    // type
    $(document).on('keyup', '.detail-feedback-form textarea', function()  {
        if ( $(this).val().trim() )   $('.feedback-error-message').slideUp('fast');
    });

    // submit
    $(document).on('submit', '.detail-feedback-form', function(e)     {
        e.preventDefault();

        let $feedback = $(this).find('textarea');
        let feedback = $feedback.val() && $feedback.val().trim();

        if ( feedback )   detailController.submitFeedback( feedback );
        else    $('.feedback-error-message').slideDown('fast');

        return false;
    });

});