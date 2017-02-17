///////////////////////////////////////////////
// Gulp Configuration
// =========================

// ---
// Directories
///////////////////////////////////////////////

// --- Base Directories

var baseDirectory = {
    source: '_source',
    development: '_development',
    production: '_production'
};

// --- Development Directories

var developmentDirectory = {
    css: 'css',
    views: 'views',
    assets: 'assets',
    js: 'js'
};

// --- Production Directories

var productionDirectory = {
    css: 'css',
    views: 'views',
    assets: 'assets',
    js: 'js'
};

// --- Source Directory

var sourceDirectory = {
    assets: 'assets',
    theme: 'theme',
    js: 'js'
};

// --- Theme Directories

var themeDirectory = {
    sass: 'sass',
    vendors: 'vendors'
};

var sassDirectory = {
    views: 'views'
};

// --- JavaScript Directories

var jsDirectory = {
    views: 'views'
};

// --- Assets Directories

var assetsDirectory = {
    global: 'global',
    views: 'views',
    fonts: 'fonts'
};

// ---
// Gulp Modules
///////////////////////////////////////////////

const GULP = require('gulp');

// --- CSS

const SASS = require('gulp-sass');
const MINCSS = require('gulp-clean-css');
const PREFIXCSS = require('gulp-autoprefixer');

// --- JavaScript

const JSUGLIFY = require('gulp-uglify');
const JSCONCAT = require('gulp-concat');

// --- Assets

const IMAGEMIN = require('gulp-imagemin');

// --- Other

const WATCH = require('gulp-watch');
const RENAME = require('gulp-rename');

// ---
// Main Tasks
///////////////////////////////////////////////

// --- Development

GULP.task('dev', function() {
    GULP.watch(baseDirectory.theme + '/' + themeDirectory.sass + '/**/*.sass', ['dev-sass']);
    GULP.watch(baseDirectory.js + '/' + jsDirectory.views + '/**/*.js', ['dev-js']);
    GULP.watch([baseDirectory.assets + '/**/*', '!' + baseDirectory.assets + '/' + assetsDirectory.fonts + '**/*'], ['dev-imagemin']);
});

// --- Production

GULP.task('prod', ['prod-sass', 'prod-js', 'prod-imagemin']);

// ---
// Sub Tasks
///////////////////////////////////////////////

// --- Development - SASS

GULP.task('dev-sass', function() {
    
    // Global
    
    GULP.src(
            [
                baseDirectory.source + '/' + sourceDirectory.theme + '/' + themeDirectory.sass + '/**/*.sass',
                '!' + baseDirectory.source + '/' + sourceDirectory.theme + '/' + themeDirectory.sass + '/' + sassDirectory.views + '/**/*.sass'
            ]
        )
        .pipe(SASS.sync().on('error', SASS.logError))
        .pipe(PREFIXCSS())
        .pipe(GULP.dest(baseDirectory.development + '/' + developmentDirectory.css));

    // Views

    GULP.src(baseDirectory.source + '/' + sourceDirectory.theme + '/' + themeDirectory.sass + '/' + sassDirectory.views + '/**/*.sass')
        .pipe(SASS.sync().on('error', SASS.logError))
        .pipe(PREFIXCSS())
        .pipe(GULP.dest(baseDirectory.development + '/' + developmentDirectory.views));
});

// --- Production - SASS

GULP.task('prod-sass', function() {

    // Global

    GULP.src(
            [
                baseDirectory.source + '/' + sourceDirectory.theme + '/' + themeDirectory.sass + '/**/*.sass',
                '!' + baseDirectory.source + '/' + sourceDirectory.theme + '/' + themeDirectory.sass + '/' + sassDirectory.views + '/**/*.sass'
            ]
        )
        .pipe(SASS.sync().on('error', SASS.logError))
        .pipe(PREFIXCSS())
        .pipe(MINCSS({ debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(RENAME({ suffix: '.min' }))
        .pipe(GULP.dest(baseDirectory.production + '/' + productionDirectory.css));

    // Views

    GULP.src(baseDirectory.source + '/' + sourceDirectory.theme + '/' + themeDirectory.sass + '/' + sassDirectory.views + '/**/*.sass')
        .pipe(SASS.sync().on('error', SASS.logError))
        .pipe(PREFIXCSS())
        .pipe(MINCSS({ debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(RENAME({ suffix: '.min' }))
        .pipe(GULP.dest(baseDirectory.production + '/' + productionDirectory.views));
});

// --- Development - JavaScript

GULP.task('dev-js', function() {
    GULP.src(
            [
                baseDirectory.source + '/' + sourceDirectory.js + '/**/*.js',
                '!' + baseDirectory.source + '/' + sourceDirectory.js + '/' + jsDirectory.views + '/**/*.js'
            ]
        )
        .pipe(GULP.dest(baseDirectory.development + '/' + developmentDirectory.js));

    GULP.src(baseDirectory.source + '/' + sourceDirectory.js + '/' + jsDirectory.views + '/**/*.js')
        .pipe(GULP.dest(baseDirectory.development + '/' + developmentDirectory.views))
});

// --- Production - JavaScript

GULP.task('prod-js', function() {
    GULP.src(
            [
                baseDirectory.source + '/' + sourceDirectory.js + '/**/*.js',
                '!' + baseDirectory.source + '/' + sourceDirectory.js + '/' + jsDirectory.views + '/**/*.js'
            ]
        )
        .pipe(JSCONCAT('*.js'))
        .pipe(JSUGLIFY())
        .pipe(RENAME('master.min.js'))
        .pipe(GULP.dest(baseDirectory.production + '/' + productionDirectory.js));

    GULP.src(baseDirectory.source + '/' + sourceDirectory.js + '/' + jsDirectory.views + '/**/*.js')
        .pipe(JSUGLIFY())
        .pipe(RENAME({ suffix: '.min' }))
        .pipe(GULP.dest(baseDirectory.production + '/' + productionDirectory.views));
});

// --- Development - Images

GULP.task('dev-imagemin', function() {

    // Global

    GULP.src(baseDirectory.source + '/' + sourceDirectory.assets + '/' + assetsDirectory.global + '/**/*')
        .pipe(IMAGEMIN())
        .pipe(GULP.dest(baseDirectory.development + '/' + developmentDirectory.assets + '/' + assetsDirectory.global));

    // Views

    GULP.src(baseDirectory.source + '/' + sourceDirectory.assets + '/' + assetsDirectory.views + '/**/*')
        .pipe(IMAGEMIN())
        .pipe(GULP.dest(baseDirectory.development + '/' + developmentDirectory.views));
});

// --- Production - Images

GULP.task('prod-imagemin', function() {

    // Global

    GULP.src(baseDirectory.source + '/' + sourceDirectory.assets + '/' + assetsDirectory.global + '/**/*')
        .pipe(IMAGEMIN())
        .pipe(GULP.dest(baseDirectory.production + '/' + productionDirectory.assets + '/' + assetsDirectory.global));

    // Views
    
    GULP.src(baseDirectory.source + '/' + sourceDirectory.assets + '/' + assetsDirectory.views + '/**/*')
        .pipe(IMAGEMIN())
        .pipe(GULP.dest(baseDirectory.production + '/' + productionDirectory.views));
});