
class DetailController  {

    constructor()   {
        this.episodes = new Episodes();

        // store
        this.store = {
            episodes: null,
        };
    }


    storeEpisodes(mangaID)    {
        return new Promise((resolve, reject) => {
            try {
                if ( mangaID && !isNaN(mangaID) && +mangaID )   {
                    mangaID = +mangaID;
                    let episodesResult = this.episodes.getData({
                        queryFilter: `manga_id eq ${mangaID}`,
                        queryOrderby: `created_at asc`,
                    });
                    if ( episodesResult && episodesResult.results && episodesResult.results.length )   {
                        this.store.episodes = episodesResult.results;
                        resolve( this.store.episodes );
                    } else  reject('no result');
                } else  {
                    reject('cannot detect the mangaID');
                }
            } catch (err) {
                reject(err);
            }
        });
    } // storeEpisodes() <-


    renderEpisodes(episodes)    {
        if ( episodes && episodes.length )   {
            let $wrapper = $('.detail-eps-filter');
            $wrapper.html('');

            $.each(episodes, (index, value) => {
                let epNumber = index + 1;

                let $episode = $(
                    `<li data-index="${ epNumber }">
                        <div>
                            <div>
                                <h4>Episode ${ epNumber } - ${ value.name }</h4>
                                <span>${ timeSince(new Date(value.created_at)) } ago</span>
                            </div>
                            <div>
                                <a href="reading.html?id=${ value.id }">Read</a>
                            </div>
                        </div>
                    </li>`
                );

                $episode.appendTo( $wrapper );
            });
        } else  return false;
    } // renderEpisodes() <-


    submitFeedback(feedback)    {
        console.log( 'submitFeedback() -> feedback -', feedback );
    } // submitFeedback() <-

}



$(document).ready(function()    {

    let detailController = new DetailController();

    // ? init
    (async function()     {
        let idParam = getURLparam('id');
        await detailController.storeEpisodes( idParam ).then(episodes => {
            detailController.renderEpisodes(episodes);
        }).catch(err => {
            console.log( err );
        });
    }());


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