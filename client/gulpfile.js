'use strict';

var gulp = require('gulp')
  , browserify = require('gulp-browserify')
  , $ = require('gulp-load-plugins')()    // Load plugins
  , path = require('path')
  , sass = require('gulp-sass')

var root = path.resolve(__dirname)

// Sass
gulp.task('sass', function() {
  return gulp.src(root + '/style.scss')
    .pipe(sass({
        includePaths: require('eggshell').includePaths
    }))
    .pipe(gulp.dest(root))
    .pipe($.size());
});

gulp.task('default', ['sass']);
