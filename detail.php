<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{}} | Manga</title>

    <link rel="stylesheet" href="public/ahkar/css/vendor/uikit.min.css">

    <link rel="stylesheet" href="public/ahkar/css/ahkar.css">

    <script src="public/ahkar/js/vendor/jquery-3.4.1.min.js"></script>
    <script src="public/ahkar/js/vendor/moment.min.js"></script>

    <script src="public/ahkar/js/vendor/uikit.min.js"></script>
    <script src="public/ahkar/js/vendor/uikit-icons.min.js"></script>

</head>
<body class="detail">


    <!-- Header -> -->
    <div id="header-component"></div>
    <!-- Header <- -->



    <!-- Body content -> -->
    <section class="body-content">
        <div class="uk-container main-container">

            <div class="detail-wrap">

                <!-- Header -->
                <div class="detail-header card-box">
                    <a class="detail-header-back default-button" href="index.php">
                        <span uk-icon="icon: arrow-left; ratio: 1.5;"></span>
                    </a>

                    <h1 class="detail-header-title">
                        <!-- js -->
                    </h1>
                </div>


                <!-- Item -->
                <div class="detail-item">
                    <div class="detail-item-left card-box">
                        <!-- js -->
                    </div>

                    <div class="detail-item-right card-box">
                        <ul>
                            <!-- js -->
                        </ul>
                    </div>
                </div>


                <!-- Description -->
                <div id="description" class="detail-desc card-box">
                    <div class="detail-desc-header">
                        <a href="#description" class="section-anchors">
                            <span uk-icon="icon: bolt; ratio: 1.2;"></span>
                            <h3 class="card-title">Description</h3>
                        </a>
                    </div>

                    <div class="detail-desc-body less-more-content">
                        <!-- js -->
                    </div>
                </div>

                
                <!-- Episodes -->
                <div id="latest-manga-release" class="detail-eps card-box" uk-filter="target: .detail-eps-filter;">
                    <div class="detail-eps-header">
                        <a href="#latest-manga-release" class="section-anchors">
                            <span uk-icon="icon: file-text; ratio: 1.2;"></span>
                            <h3 class="card-title">Latest Manga Release</h3>
                        </a>
                        <button class="detail-eps-sorting default-button asc">
                            <span class="sorting-icon" uk-icon="icon: triangle-down; ratio: 1.3;"></span>
                            <span class="sorting-text-static">SC</span>
                            <span class="sorting-text asc">A<span>SC</span></span>
                            <span class="sorting-text desc">DE<span>SC</span></span>
                        </button>
                        <!-- hidden controls -->
                        <ul class="detail-eps-filter-controls">
                            <li class="asc uk-active" uk-filter-control="sort: data-index;"><a href="#">Ascending</a></li>
                            <li class="desc" uk-filter-control="sort: data-index; order: desc;"><a href="#">Descending</a></li>
                        </ul>
                    </div>

                    <div class="detail-eps-list">
                        <ul class="detail-eps-filter uk-grid-small uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
                            <!-- js -->
                        </ul>
                    </div>
                </div>


                <!-- Feedbacks -->
                <div id="comments" class="detail-feedback card-box">
                    <div class="detail-feedback-header">
                        <a href="#comments" class="section-anchors">
                            <span uk-icon="icon: comments; ratio: 1.2;"></span>
                            <h3 class="card-title">Comments</h3>
                        </a>
                    </div>

                    <ul class="detail-feedback-list">
                        <!-- js -->
                    </ul>

                    <div class="detail-feedback-no-result">
                        There's no comment right now
                    </div>

                    <div class="detail-feedback-post">
                        <form class="detail-feedback-form">
                            <label for="detail-feedback-input">Leave your comment here</label>
                            <div>
                                <textarea id="detail-feedback-input" maxlength="500" placeholder="Lorem ipsum dolor sit, amet consectetur adipisicing elit ..."></textarea>
                                <div class="feedback-error-message">Enter your comment</div>
                            </div>
                            <button type="submit">Submit</button>
                        </form>

                    </div>

                    <div class="detail-feedback-not-user">
                        <p>
                            You can also comment after <button class="show-login-modal">Login</button>.
                        </p>
                    </div>
                </div>

            </div>


            <!-- no result -->
            <div class="not-found detail-no-result card-box">
                <img src="public/ahkar/images/404.png" alt="404">
                <h1>The Manga you looking is not found.</h1>
                <a href="index.php">Back to Homepage</a>
            </div>

        </div>
    </section>
    <!-- Body content <- -->
    


    <!-- Login Modal -> -->
    <div id="login_modal-component"></div>
    <!-- Login Modal <- -->


    <!-- Footer -> -->
    <div id="footer-component"></div>
    <!-- Footer <- -->





    <script src="public/ahkar/js/components.js"></script>

    <script src="public/ahkar/js/base/common.js"></script>
    <script src="public/ahkar/js/base/config.js"></script>
    <script src="public/ahkar/js/base/sprestlib-php.js"></script>

    <script src="public/ahkar/js/lib/users.js"></script>
    <script src="public/ahkar/js/lib/mangas.js"></script>
    <script src="public/ahkar/js/lib/genres.js"></script>
    <script src="public/ahkar/js/lib/episodes.js"></script>
    <script src="public/ahkar/js/lib/feedbacks.js"></script>

    <script src="public/ahkar/js/controller/common-controller.js"></script>
    <script src="public/ahkar/js/controller/detail-controller.js"></script>


</body>
</html>