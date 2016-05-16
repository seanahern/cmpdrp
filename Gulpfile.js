var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass');

gulp.task('sass', function() {
  gulp.src('css/cmpdrp.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', gutil.log))
//  .pipe(cleanCSS().on('error'), gutil.log)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'));
});

gulp.task('default', function() {
  gulp.watch('css/cmpdrp.scss', ['sass']);
});
