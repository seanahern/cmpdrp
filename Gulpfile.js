var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    minify = require('gulp-minify'),
    sass = require('gulp-sass');

gulp.task('sass', function() {
  gulp.src('src/css/cmpdrp.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', gutil.log))
    .pipe(cleanCSS().on('error'), gutil.log)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
  gulp.src('src/js/cmpdrp.js')
    .pipe(minify().on('error', gutil.log))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
  gulp.watch('src/css/cmpdrp.scss', ['sass']);
  gulp.watch('src/js/cmpdrp.js', ['js']);
});
