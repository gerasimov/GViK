var

	gulp = require('gulp'),
	gutil = require('gulp-util'),
	watch = require('gulp-watch'),
	csscomb = require('gulp-csscomb'),
	csso = require('gulp-csso'),
	stylus = require('gulp-stylus'),
	conact = require('gulp-concat'),
	jshint = require('gulp-jshint'),
	changed = require('gulp-changed'),
	plumber = require('gulp-plumber');



var paths = {
	js: [
		'js/**/*.js',
		'engine/**/*.js',
		'system/**/*.js',
		'options/**/*.js'
	],

	css: [
		'system/**/*.css',
		'options/**/*.css'
	]
};

gulp.task('js', function() {
	gulp.src(paths.js)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
	gulp.watch(paths.js, ['js']);
});

gulp.task('css', function() {
	gulp.src(paths.css)
		.pipe();
});

gulp.task('default', ['js', 'watch']);