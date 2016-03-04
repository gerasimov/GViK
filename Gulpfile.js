/*
 
 
 */

var gulp = require( 'gulp' )
var runSequence = require( 'run-sequence' );
var webpack = require( 'webpack-stream' );
var path = require( 'path' );

gulp.task( 'dev-js', function() {

} );

gulp.task( 'dev-css', function() {

} );


gulp.task( 'default', function() {
	runSequence( [ 'dev-js', 'dev-css' ] );
} );