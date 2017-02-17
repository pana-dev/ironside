///////////////////////////////////////////////
// NODE MODULES
// =========================

// GULP
const GULP = require('gulp');

// CSS
const SASS = require('gulp-sass');
const MINCSS = require('gulp-clean-css');
const PREFIXCSS = require('gulp-autoprefixer');

// JAVASCRIPT
const JSUGLIFY = require('gulp-uglify');
const JSCONCAT = require('gulp-concat');

// OTHER
const WATCH = require('gulp-watch');
const RENAME = require('gulp-rename');

// Main Tasks
///////////////////////////////////////////////

GULP.task('dev', function() {
    GULP.watch('source/sass/**/*.sass', ['sass-dev']);
    GULP.watch('source/js/**/*.js', ['js-dev']);
    GULP.watch('source/assets/**/*', ['imagemin']);
});

GULP.task('prod', function() {
    GULP.watch('source/sass/**/*.sass', ['sass-prod']);
    GULP.watch('source/js/**/*.js', ['js-prod']);
    GULP.watch('source/assets/**/*', ['imagemin-prod']);
});

// SASS & CSS
///////////////////////////////////////////////

GULP.task('sass-dev', function() {
    GULP.src('source/sass/**/*.sass')
        .pipe(SASS.sync().on('error', SASS.logError))
        .pipe(PREFIXCSS())
        .pipe(GULP.dest('source/css'));
});

GULP.task('sass-prod', function() {
    GULP.src(['source/sass/**/*.sass', '!source/sass/views/**/*.sass'])
        .pipe(SASS.sync().on('error', SASS.logError))
        .pipe(PREFIXCSS())
        .pipe(MINCSS({ debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(RENAME({ suffix: '.min' }))
        .pipe(GULP.dest('dist/css'))
        .pipe(GULP.dest('html/css'));

    GULP.src('source/sass/views/**/*.sass')
        .pipe(SASS.sync().on('error', SASS.logError))
        .pipe(PREFIXCSS())
        .pipe(MINCSS({ debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(RENAME({ suffix: '.min' }))
        .pipe(GULP.dest('dist/views'))
        .pipe(GULP.dest('html/views'));
});

// JavaScript
///////////////////////////////////////////////

GULP.task('js-dev', function() {
    GULP.src(['source/pre/js/**/*.js'])
        .pipe(JSCONCAT('app.min.js'))
        .pipe(GULP.dest('source/post/js'))
        .pipe(GULP.dest('source/_dev/js'));
});

GULP.task('js-prod', function() {
    GULP.src(['source/js/**/*.js'])
        .pipe(JSCONCAT('*.js'))
        .pipe(JSUGLIFY())
        .pipe(RENAME('app.min.js'))
        .pipe(GULP.dest('source/_prod/js'))
        .pipe(GULP.dest('html/js'));
});

// Images
///////////////////////////////////////////////

GULP.task('imagemin', function() {
    GULP.src('source/pre/assets/images/**/*')
        .pipe(IMAGEMIN())
        .pipe(GULP.dest('source/_dev/assets/'))
        .pipe(GULP.dest('html/assets/images/'));
});

GULP.task('imagemin-prod', function() {
    GULP.src('source/pre/assets/images/**/*')
        .pipe(IMAGEMIN())
        .pipe(GULP.dest('source/_prod/assets/'))
        .pipe(GULP.dest('html/assets/images/'));
});