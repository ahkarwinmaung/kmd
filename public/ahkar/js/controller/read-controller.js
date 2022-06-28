
class ReadController  {

    constructor()   {
        // libs
        this.libs = {
            episodes: new Episodes(),
            mangaimages: new MangaImages(),
            mangas: new Mangas(),
            users: new Users(),
        };

        // store
        this.store = {
            loginUser: null,
            episodeData: null,
            imagesData: null,
            allMangas: null,
        };
    }



    storeMangaImages(episode_id)  {
        return new Promise((resolve, reject) => {
            try {
                let imagesResult = this.libs.mangaimages.getData({
                    queryFilter: `(episode_id eq ${episode_id})`,
                    queryOrderby: `created_at asc`,
                });
                console.log( 'storeMangaImages() -> imagesResult -', imagesResult );

                if ( imagesResult && imagesResult.results )   {
                    if ( imagesResult.results.length )   {
                        this.store.imagesData = imagesResult.results;
                        resolve( this.store.imagesData );
                    }
                }

                resolve(null);
            } catch (err) {
                reject(err);
            }
        });
    } // storeMangaImages() <-


    renderEpisodeData(id)     {
        return new Promise((resolve, reject) => {
            try {
                let episodeResult = this.libs.episodes.getAnItem( id );
                console.log( 'renderEpisodeData() -> episodeResult -', episodeResult );

                if ( episodeResult && episodeResult.results )   {
                    if ( episodeResult.results.length )   {
                        this.store.episodeData = episodeResult.results[0];
                        let episodeData = this.store.episodeData;

                        // ? back button url
                        $('.read-header-back').attr('href', `detail.php?id=${ episodeData.manga_id }`);

                        // ? page title & title
                        if ( episodeData.name )   {
                            $('title').text(function()     {
                                return $(this).text().replaceAll('{{}}', episodeData.name);
                            });
                            $('.read-header-title').html( episodeData.name );
                        }
                        else    $('.read-header-title').hide();

                        resolve( episodeData );
                    }
                }

                resolve( null );
            } catch (err) {
                reject(err);
            }
        });
    } // renderEpisodeData() <-


    renderListing()     {
        return new Promise(async (resolve, reject) => {
            try {
                let imagesData = this.store.imagesData;
                console.log( 'renderListing() -> imagesData -', imagesData );

                if ( imagesData && imagesData.length )   {
                    let $wrapper = $('.read-swiper .swiper-wrapper');
                    $wrapper.html('');

                    // ? render list
                    $.each(imagesData, (index, value) => {
                        let $slide = $(
                            `<div class="swiper-slide" data-index="${ index }" data-id="${ value.id }">
                                <img data-src="${ value.image_path }" class="swiper-lazy">
                                <div class="swiper-lazy-preloader swiper-lazy-preloader-black"></div>
                            </div>`
                        );

                        $slide.appendTo( $wrapper );
                    });

                    $('.read-header-right').show();
                } else  { // no manga images data
                    // this.noResult();
                    $('title').text(function()     {
                        return $(this).text().replaceAll('{{}}', 'No page');
                    });
                }

                await this.readMore( imagesData && imagesData.length );

                resolve( imagesData );
            } catch (err) {
                reject(err);
            }
        });
    } // renderListing() <-


    readMore(hasResult)  {
        return new Promise((resolve, reject) => {
            try {
                // ? render more
                let allMangas = this.libs.mangas.getData({
                    queryFilter: `publish_status eq 1`,
                });
                console.log( 'renderListing() -> allMangas -', allMangas );
                
                if ( allMangas && allMangas.results && allMangas.results.length )   {
                    this.store.allMangas = allMangas.results;
                    
                    let shuffledMangas = shuffle( [...this.store.allMangas] );
                    // console.log( 'renderListing() -> shuffledMangas -', shuffledMangas );

                    let readMoreMangas = shuffledMangas.slice(0, 3);
                    // console.log( 'renderListing() -> readMoreMangas -', readMoreMangas );

                    let $wrapper = $('.read-swiper .swiper-wrapper');
                    let $footerSlide = $(
                        `<div class="swiper-slide read-more">
                            <div>
                                ${ !hasResult ? `<p class="read-more-no-result">There's no page</p>` : '' }
                                <h2 class="read-more-title">Read more on Manga<h2>
                                <div class="read-more-grid uk-child-width-1-1 uk-child-width-1-3@s uk-grid" uk-grid>
                                    ${
                                        readMoreMangas.map(value => {
                                            let gridItem =
                                                `<div class="read-more-items" data-id="${ value.id }">
                                                    <a class="read-more-links" href="detail.php?id=${ value.id }">
                                                        <div class="read-more-thumbnail" data-src="${ value.thumbnail }" uk-img></div>
                                                        <h4>${ value.name }</h4>
                                                        <h5>${ value.author_name }</h5>
                                                    </a>
                                                </div>`
                                            return gridItem;
                                        }).join('')
                                    }
                                </div>
                            </div>
                        </div>`
                    );
                    $footerSlide.appendTo( $wrapper );

                    resolve( readMoreMangas );
                }

                resolve( null );
            } catch (err) {
                reject(err);
            }
        });
    } // readMore() <-


    noResult()  {
        $('title').text(function()     {
            return $(this).text().replaceAll('{{}}', 'Page not found');
        });
        $('.read-wrap').hide(); // hide all section
        $('.read-no-result').show(); // show no result section
    } // noResult() <-

}





$(document).ready(function()    {

    let readController = new ReadController();

    // ? init
    (async function()     {
        let idParam = getURLparam('id');

        if ( idParam && !isNaN(idParam) && +idParam )   {
            readController.store.loginUser = await getLoginUser();
            await readController.storeMangaImages( +idParam );
            await readController.renderEpisodeData( +idParam );
            await readController.renderListing();

            // after render
            let readSwiper = new Swiper('.read-swiper', {
                spaceBetween: 20,
                lazy: true,
                direction: 'vertical',
                mousewheel: true,
                keyboard: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                on: {
                    init: function()    {
                        let pageParam = getURLparam('page');
                        if ( pageParam && !isNaN(pageParam) && +pageParam )   this.slideTo(+pageParam - 1, 300, true);
                    },
                    slideChangeTransitionEnd: function()    {
                        let activeIndex = this.activeIndex;
                        $('.read-header-right').find('span').html( activeIndex + 1 );

                        if ( activeIndex )     {
                            $('.swiper-totop').fadeIn(300).bind('click', _ =>    {
                                this.slideTo(0, 300, true);
                            });
                            addParam('page', activeIndex + 1 );
                        } else    {
                            $('.swiper-totop').fadeOut(300);
                            removeParam('page');
                        }
                    },
                }
            });
        } else  readController.noResult(); // incorrect id url param
    }());

});