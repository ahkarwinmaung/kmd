'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

sass.compiler = require('node-sass');

gulp.task('sass', function() {
    return gulp.src('./sass/*.sass')
        .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('ahkar.css'))
        .pipe(gulp.dest('./public/css/ahkar'));
});

gulp.task('sass:watch', function() {
    gulp.watch('./sass/*.sass', ['sass']);
});

gulp.task('default', ['sass:watch']);

