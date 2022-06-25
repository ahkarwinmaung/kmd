
class DetailController  {

    constructor()   {
        // libs
        this.libs = {
            mangas: new Mangas(),
            genres: new Genres(),
            episodes: new Episodes(),
            feedbacks: new Feedbacks(),
            users: new Users(),
        };

        // store
        this.store = {
            mangaData: null,
            genreData: null,
            episodes: null,
            feedbacks: null,
            feedbacksUsers: null,
        };
    }


    storeMangaData(id)    {
        return new Promise((resolve, reject) => {
            try {
                let mangaResult = this.libs.mangas.getData({
                    queryFilter: `(id eq ${id}) and (publish_status eq 'true')`,
                    queryLimit: 1,
                });
                console.log( 'storeMangaData() -> mangaResult -', mangaResult );

                if ( mangaResult && mangaResult.results )   {
                    if ( mangaResult.results.length )   {
                        this.store.mangaData = mangaResult.results[0];
                        resolve( this.store.mangaData );
                    }
                }

                resolve(null);
            } catch (err) {
                reject(err);
            }
        });
    } // storeMangaData() <-


    renderDetails()   {
        return new Promise((resolve, reject) => {
            try {
                let mangaData = this.store.mangaData;
                // console.log( 'renderDetails() -> mangaData -', mangaData );

                if ( mangaData )   {
                    // ? page title & title
                    if ( mangaData.name )   {
                        $('title').text(function()     {
                            return $(this).text().replaceAll('{{}}', mangaData.name);
                        });
                        $('.detail-header-title').html( mangaData.name );
                    }
                    else    $('.detail-header-title').hide();

                    // ? thumbnail
                    if ( mangaData.thumbnail )   {
                        $('.detail-item-left').html(
                            `<img class="detail-item-image" data-src="${ mangaData.thumbnail }" title="${ mangaData.name || '' }" alt="${ mangaData.name || '' }" uk-img>`
                        );
                    } else  $('.detail-item-left').hide();

                    // ? details
                    // store genreData for details -> genre name
                    let genreID = mangaData.genre_id;
                    if ( genreID && !isNaN(genreID) )   {
                        let genreResult = this.libs.genres.getAnItem( genreID );
                        console.log( 'renderDetails() -> genreResult -', genreResult );
                        if ( genreResult && genreResult.results && genreResult.results.length )   {
                            this.store.genreData = genreResult.results[0];
                        }
                    }
                    // render details
                    $('.detail-item-right > ul').html(`
                        ${
                            mangaData.author_name
                            ?
                                `<li>
                                    <span>Author</span>
                                    <span>${ mangaData.author_name }</span>
                                </li>`
                            : ''
                        }
                        ${
                            this.store.genreData && this.store.genreData.name
                            ?
                                `<li>
                                    <span>Genre</span>
                                    <span>${ this.store.genreData.name }</span>
                                </li>`
                            : ''
                        }
                        ${
                            mangaData.release_date
                            ?
                                `<li>
                                    <span>Release</span>
                                    <span>${ moment( mangaData.release_date ).format('D MMMM YYYY') }</span>
                                </li>`
                            : ''
                        }
                    `);

                    // ? description
                    $('.detail-desc-body').html( mangaData.description );

                    // ? episodes
                    // store episodes data
                    let episodesResult = this.libs.episodes.getData({
                        queryFilter: `manga_id eq ${mangaData.id}`,
                        queryOrderby: `created_at asc`,
                        // queryOrderby: `created_at ${ $('.detail-eps-sorting').is('.desc') ? 'desc' : 'asc' }`, // if need to sort by query
                    });
                    console.log( 'renderDetails() -> episodesResult -', episodesResult );
                    if ( episodesResult && episodesResult.results )   this.store.episodes = episodesResult.results;
                    // render episodes
                    this.renderEpisodes( this.store.episodes );

                    // ? feedbacks
                    // store feedbacks data
                    let feedbacksResult = this.libs.feedbacks.getData({
                        queryFilter: `manga_id eq ${mangaData.id}`,
                        queryOrderby: `created_at desc`,
                    });
                    console.log( 'renderDetails() -> feedbacksResult -', feedbacksResult );
                    if ( feedbacksResult && feedbacksResult.results && feedbacksResult.results.length )   this.store.feedbacks = feedbacksResult.results;
                    // render feedbacks
                    this.renderFeedbacks( this.store.feedbacks );
                } else  { // no manga data
                    this.noResult();
                }

                resolve(null);
            } catch (err) {
                reject(err);
            }
        });
    } // renderDetails() <-


    renderEpisodes(episodes)    {
        let $wrapper = $('.detail-eps-filter');
        $wrapper.html('');

        if ( episodes && episodes.length )   {
            if ( episodes.length === 1 )    $('.detail-eps-sorting').hide(); // hide sorting button while only 1 episode

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
                                <a href="read.html?id=${ value.id }">
                                    <span>Read</span>
                                    <span uk-icon="chevron-right"></span>
                                </a>
                            </div>
                        </div>
                    </li>`
                );

                $episode.appendTo( $wrapper );
            });
        } else { // without episode
            $('.detail-eps').hide(); // hide the episodes section
        };
    } // renderEpisodes() <-


    noResult()  {
        $('.detail-wrap').hide(); // hide all section
        $('.detail-no-result').show(); // show no result section
    } // noResult() <-


    renderFeedbacks(feedbacks)   {
        let $wrapper = $('.detail-feedback-list');
        $wrapper.html('');

        if ( feedbacks && feedbacks.length )   {
            // get users data
            let userIDs = feedbacks.map(f => f.user_id);
            this.store.feedbacksUsers =  this.libs.users.getByIDs( userIDs );
            console.log( 'renderFeedbacks() -> feedbackUsers -', this.store.feedbacksUsers );

            // render
            $.each(feedbacks, (index, value) => {
                let feedbackUserData = [...this.store.feedbacksUsers].find(fu => fu.id === value.user_id);

                let $feedback = $(
                    `<li data-id="${ value.id }">
                        ${
                            feedbackUserData
                            ?
                                `<div>
                                    <a href="mailto:${ feedbackUserData.email }" target="_blank">
                                        <div data-src="${ !isEmpty(feedbackUserData.image) ? feedbackUserData.image : 'public/ahkar/images/default-profile.png' }" uk-img></div>
                                        <span>${ feedbackUserData.name }</span>
                                    </a>
                                </div>`
                            : ''
                        }
                        <p>
                            ${ value.description || '' }
                        </p>
                        <span>${ timeSince(new Date(value.created_at)) } ago</span>
                    </li>`
                );

                $feedback.appendTo( $wrapper );
            });
        } else  { // without feedbacks
            $wrapper.hide(); // hide the feedbacks list
        }
    } // renderFeedbacks() <-


    submitFeedback(feedback)    {
        console.log( 'submitFeedback() -> feedback -', feedback );
    } // submitFeedback() <-

}





$(document).ready(function()    {

    // bind components
    let components = new Components();
    components.bindHeader();
    components.bindFooter();


    // controller
    let detailController = new DetailController();

    // ? init
    (async function()     {
        let idParam = getURLparam('id');

        if ( idParam && !isNaN(idParam) && +idParam )   {
            await detailController.storeMangaData( +idParam );
            await detailController.renderDetails();
        } else  detailController.noResult(); // incorrect id url param
    }());


    // ? eps sorting
    // click
    $(document).on('click', '.detail-eps-sorting', function()  {
        if ( $(this).is('.asc') )   {
            $('.detail-eps-filter-controls .desc').click();
            addParam('eps-sortby', 'desc');
        } else    {
            $('.detail-eps-filter-controls .asc').click();
            removeParam('eps-sortby');
        }
        $(this).toggleClass('asc desc');
    });
    // init by urlParam
    let epsSortParam = getURLparam('eps-sortby');
    if ( epsSortParam && epsSortParam === 'desc' )  $('.detail-eps-sorting').click();


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