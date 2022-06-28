<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{}} | Read | Manga</title>

    <link rel="stylesheet" href="public/ahkar/css/vendor/swiper.min.css">
    <link rel="stylesheet" href="public/ahkar/css/vendor/uikit.min.css">

    <link rel="stylesheet" href="public/ahkar/css/ahkar.css">

    <script src="public/ahkar/js/vendor/jquery-3.4.1.min.js"></script>
    <script src="public/ahkar/js/vendor/moment.min.js"></script>

    <script src="public/ahkar/js/vendor/swiper.min.js"></script>
    <script src="public/ahkar/js/vendor/uikit.min.js"></script>
    <script src="public/ahkar/js/vendor/uikit-icons.min.js"></script>

</head>
<body class="read">



    <!-- Body content -> -->
    <section class="body-content">
        <div class="uk-container main-container">

            <div class="read-wrap">

                <!-- Header -->
                <div class="read-header">
                    <div class="read-header-left">
                        <a class="read-header-back default-button" href="#">
                            <span uk-icon="icon: arrow-left; ratio: 1.5;"></span>
                        </a>
    
                        <h1 class="read-header-title">
                            <!-- js -->
                        </h1>
                    </div>

                    <div class="read-header-right">
                        Page <span>1</span>
                    </div>
                </div>

                <!-- List -->
                <div class="read-list">
                    <div class="swiper read-swiper">
                        <div class="swiper-wrapper">
                            <!-- js -->
                        </div>
                        <div class="swiper-pagination"></div>
                        <button class="swiper-totop">
                            <span uk-icon="chevron-up"></span>
                        </button>
                    </div>
                </div>

            </div>


            <!-- no result -->
            <div class="not-found read-no-result card-box">
                <img src="public/ahkar/images/404.png" alt="404">
                <h1>The Manga you looking is not found.</h1>
                <a href="index.php">Back to Homepage</a>
            </div>

        </div>
    </section>
    <!-- Body content <- -->





    <script src="public/ahkar/js/components.js"></script>

    <script src="public/ahkar/js/base/common.js"></script>
    <script src="public/ahkar/js/base/config.js"></script>
    <script src="public/ahkar/js/base/sprestlib-php.js"></script>

    <script src="public/ahkar/js/lib/users.js"></script>
    <script src="public/ahkar/js/lib/episodes.js"></script>
    <script src="public/ahkar/js/lib/mangaimages.js"></script>
    <script src="public/ahkar/js/lib/mangas.js"></script>

    <script src="public/ahkar/js/controller/common-controller.js"></script>
    <script src="public/ahkar/js/controller/read-controller.js"></script>


</body>
</html>