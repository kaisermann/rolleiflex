'use strict';

var gulp = require('gulp');
var merge = require('merge-stream');
var $ = require('gulp-load-plugins')();

// Autoprefixer browser string
var browserString = 'last 2 versions';

gulp.task('build', function() 
{
	var files = [['./src/build.styl','./dist/', 'rolleiflex.css'], ['./page.styl','./','page.css']];

	var tasks = files.map(function(e)
	{
        return gulp.src(e[0])
			.pipe($.stylus())
			.pipe($.autoprefixer(browserString))
			.pipe($.rename(e[2]))
			.pipe(gulp.dest(e[1]));
    });

    return merge(tasks);
});

gulp.task('minify', ['build'], function()
{
	return gulp.src(['./dist/rolleiflex.css'])
	.pipe($.cssnano())
	.pipe($.rename('rolleiflex.min.css'))
	.pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() 
{
	gulp.watch(['src/*.styl','page.styl'], ['build', 'minify']);
});

gulp.task('clean', function()
{
	return gulp.src('./dist').pipe($.rimraf());
});

gulp.task('default', ['build', 'minify']);