
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
            loginUser: null,
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
                    queryFilter: `(id eq ${id}) and (publish_status eq 1)`,
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
                    if ( mangaData.thumbnail_path )   {
                        $('.detail-item-left').html(
                            `<img class="detail-item-image" data-src="${ mangaData.thumbnail_path }" title="${ mangaData.name || '' }" alt="${ mangaData.name || '' }" uk-img>`
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
                                    <span>${ mangaData.release_date }</span>
                                </li>`
                            : ''
                        }
                    `);

                    // ? description
                    $('.detail-desc-body').html(_ => {
                        let description = mangaData.description || '';
                        if ( description && description.length > 250 )    {
                            let moreLess = 
                                `<p class="less-content">
                                    ${ description.substring(0, 250) } ...
                                    <button class="show-more">More</button>
                                </p>
                                <p class="more-content">
                                    ${ description }
                                    <button class="show-less">Less</button>
                                </p>`
                            return moreLess;
                        }

                        return description;
                    });

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
                        queryOrderby: `created_at asc`,
                    });
                    console.log( 'renderDetails() -> feedbacksResult -', feedbacksResult );
                    if ( feedbacksResult && feedbacksResult.results && feedbacksResult.results.length )   this.store.feedbacks = feedbacksResult.results;
                    // render feedbacks
                    this.renderFeedbacks( this.store.feedbacks );
                    // ? new feedback
                    if ( this.store.loginUser )   $('.detail-feedback-post').show();
                    else    $('.detail-feedback-not-user').show();
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
                                <h4>${ value.name }</h4>
                                <span class="time-since" data-time="${ value.created_at }">${ timeSince(new Date(value.created_at)) } ago</span>
                            </div>
                            <div>
                                ${
                                    this.store.loginUser || !index
                                    ?
                                        `<a href="read.php?id=${ value.id }">
                                            <span>Read</span>
                                            <span uk-icon="chevron-right"></span>
                                        </a>`
                                    :
                                        `<button class="show-login-modal">
                                            <span>Login</span>
                                            <span uk-icon="sign-in"></span>
                                        </button>`
                                }
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


    renderFeedbacks(feedbacks)   {
        let $wrapper = $('.detail-feedback-list');
        $wrapper.html('');

        if ( feedbacks && feedbacks.length )   {
            // comment count to title
            $('.detail-feedback-header .card-title').html(function()    {
                return $(this).html() + `<span>(${feedbacks.length})</span>`;
            });

            // get users data
            let userIDs = feedbacks.map(f => f.user_id);
            if ( this.store.loginUser && this.store.loginUser.id && !userIDs.includes(this.store.loginUser.id) )     userIDs.push( this.store.loginUser.id ); // store login user's data for the purpose of new comment
            this.store.feedbacksUsers =  this.libs.users.getByIDs( userIDs );
            console.log( 'renderFeedbacks() -> feedbackUsers -', this.store.feedbacksUsers );

            // render
            $.each(feedbacks, (index, value) => {
                let isOwner = this.store.loginUser && this.store.loginUser.id === value.user_id;
                let feedbackUserData = [...this.store.feedbacksUsers].find(fu => fu.id === value.user_id);

                let childFeedbacks = [...this.store.feedbacks].filter(f => f.parent_id === value.id);

                let $feedback = $(
                    `<li data-id="${ value.id }">
                        <div class="detail-feedback-legend" data-id="${ value.id }">
                            ${
                                feedbackUserData
                                ?
                                    `<div class="detail-feedback-legend-title">
                                        ${
                                            isOwner
                                            ? `<div>`
                                            : `<a href="mailto:${ feedbackUserData.email }" target="_blank">`
                                        }
                                        <div data-src="${ !isEmpty(feedbackUserData.image) ? feedbackUserData.image : 'public/ahkar/images/default-profile.png' }" uk-img></div>
                                        <span>${ feedbackUserData.name }${ isOwner ? ' (You)' : '' }</span>
                                        ${
                                            isOwner
                                            ? `</div>`
                                            : `</a>`
                                        }
                                    </div>`
                                : ''
                            }
                            <div class="detail-feedback-legend-inner parent-legend-inner" data-id="${ value.id }">
                                <p class="detail-feedback-content" data-id="${ value.id }">
                                    ${ value.description || '' }
                                </p>
                                <div class="detail-feedback-footer">
                                    <span class="detail-feedback-time time-since-single" data-time="${ value.created_at }" data-id="${ value.id }">${ timeSinceSingle(new Date(value.created_at)) }</span>
                                    ${
                                        new Date(value.updated_at) > new Date(value.created_at)
                                        ?
                                            `<span class="detail-feedback-is-edited" data-id="${ value.id }">Edited</span>`
                                        : ''
                                    }
                                    ${ this.store.loginUser ? `<button class="detail-feedback-reply" data-id="${ value.id }" data-owner-id="${ value.user_id }">Reply</button>` : '' }
                                    ${
                                        isOwner
                                        ?
                                            `<button class="detail-feedback-edit" data-id="${ value.id }">
                                                Edit
                                            </button>`
                                        : ''
                                    }
                                </div>
                                ${ // bind replies
                                    childFeedbacks && childFeedbacks.length
                                    ?
                                        `<ul class="detail-feedback-child" data-id="${ value.id }">
                                            ${
                                                childFeedbacks.map((childValue, childIndex) => {
                                                    let isChildOwner = this.store.loginUser && this.store.loginUser.id === childValue.user_id;
                                                    let feedbackChildUserData = [...this.store.feedbacksUsers].find(fu => fu.id === childValue.user_id);

                                                    let mentionedDescription = this.getMentionedText( childValue.description );

                                                    let child = 
                                                        `<li data-id="${ childValue.id }">
                                                            <div class="detail-feedback-legend" data-id="${ childValue.id }">
                                                                ${
                                                                    feedbackChildUserData
                                                                    ?
                                                                        `<div class="detail-feedback-legend-title">
                                                                            ${
                                                                                isChildOwner
                                                                                ? `<div>`
                                                                                : `<a href="mailto:${ feedbackChildUserData.email }" target="_blank">`
                                                                            }
                                                                            <div data-src="${ !isEmpty(feedbackChildUserData.image) ? feedbackChildUserData.image : 'public/ahkar/images/default-profile.png' }" uk-img></div>
                                                                            <span>${ feedbackChildUserData.name }${ isChildOwner ? ' (You)' : '' }</span>
                                                                            ${
                                                                                isChildOwner
                                                                                ? `</div>`
                                                                                : `</a>`
                                                                            }
                                                                        </div>`
                                                                    : ''
                                                                }
                                                                <div class="detail-feedback-legend-inner" data-id="${ value.id }">
                                                                    <p class="detail-feedback-content" data-id="${ childValue.id }">
                                                                        ${ mentionedDescription || '' }
                                                                    </p>
                                                                    <div class="detail-feedback-footer">
                                                                        <span class="detail-feedback-time time-since-single" data-time="${ childValue.created_at }" data-id="${ childValue.id }">${ timeSinceSingle(new Date(childValue.created_at)) }</span>
                                                                        ${
                                                                            new Date(childValue.updated_at) > new Date(childValue.created_at)
                                                                            ?
                                                                                `<span class="detail-feedback-is-edited" data-id="${ childValue.id }">Edited</span>`
                                                                            : ''
                                                                        }
                                                                        ${ this.store.loginUser ? `<button class="detail-feedback-reply" data-id="${ value.id }" data-owner-id="${ childValue.user_id }">Reply</button>` : '' }
                                                                        ${
                                                                            isChildOwner
                                                                            ?
                                                                                `<button class="detail-feedback-edit" data-id="${ childValue.id }">
                                                                                    Edit
                                                                                </button>`
                                                                            : ''
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>`;
                                                    return child;
                                                }).join('')
                                            }
                                        </ul>`
                                    : ''
                                }
                            </div>
                        </div>
                    </li>`
                );

                // bind if not a child
                if ( !value.parent_id || value.parent_id == 99999 )   $feedback.appendTo( $wrapper );
            });

            $wrapper.show();
        } else  { // without feedbacks
            $('.detail-feedback-no-result').show();
        }
    } // renderFeedbacks() <-


    getMentionedText(str)  {
        let matches = str.match(/\{{(.*?)\}}/);
        if ( matches )     {
            let owner_id = matches[1];
            let ownderData = [...this.store.feedbacksUsers].find(f => f.id === +owner_id);

            let isOwner = this.store.loginUser && ownderData.id === this.store.loginUser.id;

            return str.replace(
                /\{{(.*?)\}}/, 
                `<span class="detail-feedback-content-mention ${isOwner ? 'mentioned-me' : ''}" data-name="${ ownderData.name }">
                    Replied to: <span>${ isOwner ? 'You' : ownderData.name }</span>
                </span> `
            );
        }

        return str;
    } // getMentionedText () <-


    feedbackEdit(id)     {
        if ( !id )   return false;

        let $feedbackContent = $(`.detail-feedback-content[data-id="${id}"]`);
        if ( $feedbackContent && $feedbackContent.length )   { // prevent error
            if ( !$(`.detail-feedback-edit-wrap[data-id="${id}"]`).length )   { // prevent duplicate
                let feedbackData = [...this.store.feedbacks].find(f => f.id === id);

                let isReply = feedbackData.parent_id && true || false;

                let description = feedbackData.description;
                let modifiedDescription = isReply ? description.replace( /\{{(.*?)\}}/, '' ) : description;

                $feedbackContent.hide().after(
                    `<div class="detail-feedback-edit-wrap" data-id="${ id }">
                        <textarea maxlength="500">${ modifiedDescription }</textarea>
                        <div>
                            <button class="detail-feedback-edit-save" data-id="${ id }">Save</button>
                            <button class="detail-feedback-edit-cancel" data-id="${ id }">Cancel</button>
                        </div>
                    </div>`
                );
            }

            let $editInput = $(`.detail-feedback-edit-wrap[data-id="${id}"]`).find('textarea');
            let $editVal = $editInput.val();
            $editInput.focus().val('').val($editVal);
        }
    } // feedbackEdit() <-


    feedbackEditSave(id)    {
        if ( !id )   return false;

        let $editInput = $(`.detail-feedback-edit-wrap[data-id="${id}"]`).find('textarea');
        if ( $editInput && $editInput.val() && $editInput.val().trim() )   {
            let feedbackData = [...this.store.feedbacks].find(f => f.id === id);

            let isReply = feedbackData.parent_id && true || false;

            let newDescription = replaceHTML($editInput.val().trim());
            let newUpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

            if ( isReply )  { // add mention
                let matches = feedbackData.description.match(/\{{(.*?)\}}/);
                if ( matches )  {
                    let match = matches[1];
                    newDescription = `{{${match}}}` + newDescription;
                }
            }

            let editUpdateResult = this.libs.feedbacks.updateItem(id, [
                [ 'description', newDescription ],
                [ 'updated_at', newUpdatedAt ],
            ]);
            console.log( 'feedbackEditSave() -> editUpdateResult -', editUpdateResult );

            if ( editUpdateResult && !isNaN(editUpdateResult) && +editUpdateResult )   { // success
                // update store
                let updateIndex = [...this.store.feedbacks].findIndex(f => f.id === +editUpdateResult);
                this.store.feedbacks[updateIndex].description = newDescription;
                this.store.feedbacks[updateIndex].updated_at = newUpdatedAt;

                // ? update UI
                let $feedbackContent = $(`.detail-feedback-content[data-id="${id}"]`);
                if ( $feedbackContent && $feedbackContent.length )  $feedbackContent.html( this.getMentionedText(newDescription) ).show();

                let $editWrap = $(`.detail-feedback-edit-wrap[data-id="${id}"]`);
                if ( $editWrap && $editWrap.length )  $editWrap.remove();

                let $isEdited = $(`.detail-feedback-is-edited[data-id="${id}"]`);
                if ( !$isEdited || !$isEdited.length )   {
                    let $time = $(`.detail-feedback-time[data-id="${id}"]`);
                    if ( $time && $time.length )    $time.after(`<span class="detail-feedback-is-edited" data-id="${ id }">Edited</span>`);
                }

                this.highlightFeedbackLegend(id);
            }
        } else  { // no val -> just focus
            let $editInput = $(`.detail-feedback-edit-wrap[data-id="${id}"]`).find('textarea');
            let $editVal = $editInput.val();
            $editInput.focus().val('').val($editVal);
        }
    } // feedbackEditSave() <-


    feedbackEditCancel(id)    {
        if ( !id )   return false;

        let $feedbackContent = $(`.detail-feedback-content[data-id="${id}"]`);
        if ( $feedbackContent && $feedbackContent.length )  $feedbackContent.show();
        
        let $editWrap = $(`.detail-feedback-edit-wrap[data-id="${id}"]`);
        if ( $editWrap && $editWrap.length )  $editWrap.remove();
    } // feedbackEditCancel() <-


    feedbackReply(id, owner_id)     {
        if ( !id || !owner_id )   return false;

        if ( !this.store.feedbacksUsers )   this.store.feedbacksUsers = [ this.store.loginUser ]; // prevent error for reply first comment
        let ownderData = [...this.store.feedbacksUsers].find(f => f.id === owner_id);

        let isReplySelf = owner_id === this.store.loginUser.id;

        let $parentLegendInner = $(`.detail-feedback-legend-inner.parent-legend-inner[data-id="${id}"]`);
        if ( $parentLegendInner && $parentLegendInner.length && $parentLegendInner.length === 1 )    { // prevent error
            if ( !$(`.detail-feedback-reply-wrap[data-id="${id}"]`).length )   { // prevent duplicate
                $parentLegendInner.append(
                    `<div class="detail-feedback-reply-wrap" data-id="${ id }">
                        <label><span>Reply To:</span> <span class="detail-feedback-reply-owner-name" data-id="${ id }" data-owner-id="${ owner_id }">${ isReplySelf ? 'yourself' : ownderData.name }</span></label>
                        <textarea maxlength="500"></textarea>
                        <div>
                            <button class="detail-feedback-reply-save" data-id="${ id }" data-owner-id="${ owner_id }">Reply</button>
                            <button class="detail-feedback-reply-cancel" data-id="${ id }">Cancel</button>
                        </div>
                    </div>`
                );
            } else  { // if already exist -> update owner
                $(`.detail-feedback-reply-wrap[data-id="${id}"]`).find('.detail-feedback-reply-owner-name').attr('data-owner-id', owner_id).text( isReplySelf ? 'yourself' : ownderData.name );
            }

            let $replyInput = $(`.detail-feedback-reply-wrap[data-id="${id}"]`).find('textarea');
            let $replyVal = $replyInput.val();
            $replyInput.focus().val('').val($replyVal);
        }
    } // feedbackReply() <-


    feedbackReplySave(id)     {
        if ( !id )   return false;

        let $replyInput = $(`.detail-feedback-reply-wrap[data-id="${id}"]`).find('textarea');
        if ( $replyInput && $replyInput.val() && $replyInput.val().trim() )    {
            let newDescription = replaceHTML($replyInput.val().trim());

            let owner_id = null;
            let $ownerName = $(`.detail-feedback-reply-owner-name[data-id="${id}"]`);
            if ( $ownerName && $ownerName.length && +$ownerName.data('owner-id') )  owner_id = +$ownerName.data('owner-id');

            if ( owner_id )     newDescription = `{{${owner_id}}}${newDescription}`;

            let addFeedbackResult = this.libs.feedbacks.addNew([
                [ 'description', newDescription ],
                [ 'user_id', this.store.loginUser.id ],
                [ 'manga_id', this.store.mangaData.id ],
                [ 'parent_id', id ],
            ]);
            console.log( 'feedbackReplySave() -> addFeedbackResult -', addFeedbackResult );

            if ( addFeedbackResult && addFeedbackResult.status === 'success' && addFeedbackResult.Id )   { // success
                let newFeedbackResult = this.libs.feedbacks.getAnItem( addFeedbackResult.Id ); // get newly added feedback
                console.log( 'feedbackReplySave() -> newFeedbackResult -', newFeedbackResult );

                if ( newFeedbackResult && newFeedbackResult.results && newFeedbackResult.results.length )   {
                    this.renderNewFeedback( newFeedbackResult.results[0], true, id );
                    // push newly added feedback to store
                    this.store.feedbacks.push( newFeedbackResult.results[0] );
                }
            }
        }
    } // feedbackReplySave() <-


    feedbackReplyCancel(id)    {
        if ( !id )   return false;

        let $replyWrap = $(`.detail-feedback-reply-wrap[data-id="${id}"]`);
        if ( $replyWrap && $replyWrap.length )  $replyWrap.remove();
    } // feedbackReplyCancel() <-


    submitFeedback(feedback)    {
        if ( !feedback || !this.store.loginUser )    return false;

        let addFeedbackResult = this.libs.feedbacks.addNew([
            [ 'description', replaceHTML(feedback.trim()) ],
            [ 'user_id', this.store.loginUser.id ],
            [ 'manga_id', this.store.mangaData.id ],
            [ 'parent_id', 99999 ],
        ]);
        console.log( 'submitFeedback() -> addFeedbackResult -', addFeedbackResult );
        
        if ( addFeedbackResult && addFeedbackResult.status === 'success' && addFeedbackResult.Id )   { // success
            let newFeedbackResult = this.libs.feedbacks.getAnItem( addFeedbackResult.Id ); // get newly added feedback
            console.log( 'submitFeedback() -> newFeedbackResult -', newFeedbackResult );

            if ( newFeedbackResult && newFeedbackResult.results && newFeedbackResult.results.length )   {
                this.renderNewFeedback( newFeedbackResult.results[0] );
                // push newly added feedback to store
                if ( this.store.feedbacks ) this.store.feedbacks.push( newFeedbackResult.results[0] );
                else    { // if the first feedback
                    this.store.feedbacks = [ newFeedbackResult.results[0] ];
                    $('.detail-feedback-no-result').hide();
                    $('.detail-feedback-list').show();
                }
            }
        }
    } // submitFeedback() <-


    renderNewFeedback(value, isChild = false, parentID = null)     {
        if ( !value )   return false;
        if ( isChild && !parentID )     return false;

        let feedbackUserData = this.store.loginUser;

        let mentionedDescription = isChild ? this.getMentionedText( value.description ) : value.description;

        let $newFeedback = $(
            `<li data-id="${ value.id }">
                <div class="detail-feedback-legend" data-id="${ value.id }">
                    ${
                        feedbackUserData
                        ?
                            `<div class="detail-feedback-legend-title">
                                <div>
                                    <div data-src="${ !isEmpty(feedbackUserData.image) ? feedbackUserData.image : 'public/ahkar/images/default-profile.png' }" uk-img></div>
                                    <span>${ feedbackUserData.name } (You)</span>
                                </div>
                            </div>`
                        : ''
                    }
                    <div class="detail-feedback-legend-inner ${ !isChild ? 'parent-legend-inner' : '' }" data-id="${ value.id }">
                        <p class="detail-feedback-content" data-id="${ value.id }">
                            ${ mentionedDescription || '' }
                        </p>
                        <div class="detail-feedback-footer">
                            <span class="detail-feedback-time time-since-single" data-time="${ value.created_at }" data-id="${ value.id }">${ timeSinceSingle(new Date(value.created_at)) }</span>
                            ${ this.store.loginUser ? `<button class="detail-feedback-reply" data-id="${ isChild ? parentID : value.id }" data-owner-id="${ value.user_id }">Reply</button>` : '' }
                            <button class="detail-feedback-edit" data-id="${ value.id }">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </li>`
        );

        // update UI
        if ( isChild )   { // if is a reply
            let $childWrap = $(`.detail-feedback-child[data-id="${ parentID }"]`);
            if ( !$childWrap || !$childWrap.length )   { // search for the child list and if not -> create and append
                $childWrap = $(`<ul class="detail-feedback-child" data-id="${ parentID }"></ul>`);
                let $parentLegend = $(`.detail-feedback-legend[data-id="${ parentID }"]`);
                if ( $parentLegend && $parentLegend.length )   $parentLegend.find('.detail-feedback-legend-inner').append( $childWrap ); // append to parent legend inner
            }
            $childWrap.append( $newFeedback );
            // remove reply section
            let $replyWrap = $(`.detail-feedback-reply-wrap[data-id="${parentID}"]`);
            if ( $replyWrap && $replyWrap.length )  $replyWrap.remove();
        } else  {
            $newFeedback.appendTo('.detail-feedback-list');
            $('#detail-feedback-input').val('');
        }
        this.highlightFeedbackLegend( value.id );
    } // renderNewFeedback() <-


    async highlightFeedbackLegend(id)     {
        if ( !id )  return false;

        let $legend = $(`.detail-feedback-legend[data-id="${id}"]`);
        if ( $legend && $legend.length )   {
            $legend.addClass('highlight-legend');
            await ahkar.wait(600);
            $legend.removeClass('highlight-legend');
        }
    } // highlightFeedbackLegend() <-


    noResult()  {
        $('title').text(function()     {
            return $(this).text().replaceAll('{{}}', 'Page not found');
        });
        $('.detail-wrap').hide(); // hide all section
        $('.detail-no-result').show(); // show no result section
    } // noResult() <-

}





$(document).ready(function()    {

    let detailController = new DetailController();

    // ? init
    (async function()     {
        let idParam = getURLparam('id');

        if ( idParam && !isNaN(idParam) && +idParam )   {
            detailController.store.loginUser = await getLoginUser();
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


    // ? feedback actions
    //* EDIT */
    // edit click
    $(document).on('click', '.detail-feedback-edit', function()     {
        let id = $(this).data('id');
        if ( id && !isNaN(id) && +id )   detailController.feedbackEdit(+id);
    });
    // edit keyup
    $(document).on('keyup', '.detail-feedback-edit-wrap textarea', function()     {
        let $editSave = $('.detail-feedback-edit-save');
        if ( $(this).val().trim() )   $editSave.removeClass('save-disabled');
        else    $editSave.addClass('save-disabled');
    });
    // edit save
    $(document).on('click', '.detail-feedback-edit-save:not(.save-disabled)', function()     {
        let id = $(this).data('id');
        if ( id && !isNaN(id) && +id )   detailController.feedbackEditSave(+id);
    });
    // edit cancel
    $(document).on('click', '.detail-feedback-edit-cancel', function()     {
        let id = $(this).data('id');
        if ( id && !isNaN(id) && +id )   detailController.feedbackEditCancel(+id);
    });

    //* REPLY */
    // reply click
    $(document).on('click', '.detail-feedback-reply', function()     {
        let id = $(this).data('id');
        let owner_id = $(this).data('owner-id');
        if ( (id && !isNaN(id) && +id) && (owner_id && !isNaN(owner_id) && +owner_id) )   detailController.feedbackReply(+id, +owner_id);
    });
    // reply keyup
    $(document).on('keyup', '.detail-feedback-reply-wrap textarea', function()     {
        let $replySave = $('.detail-feedback-reply-save');
        if ( $(this).val().trim() )   $replySave.removeClass('save-disabled');
        else    $replySave.addClass('save-disabled');
    });
    // reply save
    $(document).on('click', '.detail-feedback-reply-save:not(.save-disabled)', function()     {
        let id = $(this).data('id');
        if ( id && !isNaN(id) && +id )   detailController.feedbackReplySave(+id);
    });
    // reply cancel
    $(document).on('click', '.detail-feedback-reply-cancel', function()     {
        let id = $(this).data('id');
        if ( id && !isNaN(id) && +id )   detailController.feedbackReplyCancel(+id);
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