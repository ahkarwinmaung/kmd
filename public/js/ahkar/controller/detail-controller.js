
class DetailController  {

    constructor()   {
        this.mangas = new Mangas();
        this.genres = new Genres();
        this.episodes = new Episodes();

        // store
        this.store = {
            mangaData: null,
            genreData: null,
            episodes: null,
        };
    }


    storeMangaData(id)    {
        return new Promise((resolve, reject) => {
            try {
                let mangaResult = this.mangas.getData({
                    queryFilter: `id eq ${id}`,
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


    bindDetails()   {
        return new Promise((resolve, reject) => {
            try {
                let mangaData = this.store.mangaData;
                // console.log( 'bindDetails() -> mangaData -', mangaData );
        
                if ( mangaData )   {
                    // ? title
                    if ( mangaData.name )   $('.detail-header-title').html( mangaData.name );
                    else    $('.detail-header-title').hide();

                    // ? thumbnail
                    if ( mangaData.thumbnail )   {
                        $('.detail-item-left').html(
                            `<img class="detail-item-image" src="${ mangaData.thumbnail }" title="${ mangaData.name || '' }" alt="${ mangaData.name || '' }">`
                        );
                    } else  $('.detail-item-left').hide();

                    // ? details
                    // store genreData for details -> genre name
                    let genreID = mangaData.genre_id;
                    if ( genreID && !isNaN(genreID) )   {
                        let genreResult = this.genres.getAnItem( genreID );
                        console.log( 'bindDetails() -> genreResult -', genreResult );
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
                    let episodesResult = this.episodes.getData({
                        queryFilter: `manga_id eq ${mangaData.id}`,
                        queryOrderby: `created_at asc`,
                        // queryOrderby: `created_at ${ $('.detail-eps-sorting').is('.desc') ? 'desc' : 'asc' }`, // dont't need to sort by query
                    });
                    console.log( 'bindDetails() -> episodesResult -', episodesResult );
                    if ( episodesResult && episodesResult.results )   {
                        this.store.episodes = episodesResult.results;
                    }
                    // render episodes
                    this.renderEpisodes( this.store.episodes );
                } else  { // no manga data
                    this.noResult();
                }

                resolve(null);
            } catch (err) {
                reject(err);
            }
        });
    } // bindDetails() <-


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
                                <a href="reading.html?id=${ value.id }">Read</a>
                            </div>
                        </div>
                    </li>`
                );

                $episode.appendTo( $wrapper );
            });
        } else { // withour episode
            $('.detail-eps').hide(); // hide the episodes section
        };
    } // renderEpisodes() <-


    noResult()  {
        $('.detail-wrap').hide(); // hide all section
        $('.detail-no-result').show(); // show no result section
    } // noResult() <-


    submitFeedback(feedback)    {
        console.log( 'submitFeedback() -> feedback -', feedback );
    } // submitFeedback() <-

}



$(document).ready(function()    {

    let detailController = new DetailController();

    // ? init
    (async function()     {
        let idParam = getURLparam('id');

        if ( idParam && !isNaN(idParam) && +idParam )   {
            await detailController.storeMangaData( +idParam );

            await detailController.bindDetails();
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