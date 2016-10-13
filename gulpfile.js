'use strict';

var gulp = require('gulp');
var merge = require('merge-stream');
var argv = require('yargs').argv;
var $ = require('gulp-load-plugins')();

// Autoprefixer browser string
var browserString = ['> 5%', 'last 2 versions', 'Safari >= 8'];

var endFile = 'rolleiflex' + (argv.d ? '.declarative' : '');

gulp.task('build', function () {
  var files = [
    ['./src/build.styl', './dist/', endFile + '.css'],
    ['./page.styl', './', 'page.css']
  ];

  var tasks = files.map(function (e) {
    return gulp.src(e[0])
      .pipe($.plumber())
      .pipe($.stylus())
      .pipe($.autoprefixer(browserString))
      .pipe($.stripCssComments())
      .pipe($.rename(e[2]))
      .pipe($.size({
        showFiles: true
      }))
      .pipe($.size({
        gzip: true,
        showFiles: true
      }))
      .pipe(gulp.dest(e[1]));
  });

  return merge(tasks);
});

gulp.task('minify', ['build'], function () {
  return gulp.src(['./dist/' + endFile + '.css'])
    .pipe($.cssnano())
    .pipe($.rename(endFile + '.min.css'))
    .pipe($.size({
      showFiles: true
    }))
    .pipe($.size({
      gzip: true,
      showFiles: true
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch(['src/*.styl', 'page.styl'], ['build', 'minify']);
});

gulp.task('clean', function () {
  return gulp.src('./dist').pipe($.rimraf());
});

gulp.task('default', ['build', 'minify']);
