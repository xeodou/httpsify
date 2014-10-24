'use strict';

var gulp = require('gulp')
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
});

gulp.task('default', ['sass']);
