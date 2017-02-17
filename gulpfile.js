///////////////////////////////////////////////
// Gulp Configuration
// =========================

// ---
// Directories
///////////////////////////////////////////////

// --- Base Directories

var baseDirectory = {
    theme: 'theme',
    js: 'js',
    assets: 'assets',
    development: 'html',
    production: 'production'
};

// --- Theme Directories

var themeDirectory = {
    sass: 'sass',
    css: 'css',
    views: 'views'
};

// --- JavaScript Directories

var jsDirectory = {
    views: 'views'
}

// --- Assets Directories

var assetsDirectory = {
    global: 'global',
    views: 'views',
    fonts: 'fonts'
}

// --- Development Directories

var developmentDirectory = {
    css: 'css',
    views: 'views',
    assets: 'assets',
    js: 'js'
};

var productionDirectory = {
    css: 'css',
    views: 'views',
    assets: 'assets',
    js: 'js'
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

// --- Other

const WATCH = require('gulp-watch');
const RENAME = require('gulp-rename');

// ---
// Main Tasks
///////////////////////////////////////////////

// --- Development

GULP.task('dev', function() {
    GULP.watch(baseDirectory.theme + '/' + themeDirectory.sass + '/**/*.sass', ['sass-dev']);
    GULP.watch(baseDirectory.js + '/' + jsDirectory.views + '/**/*.js', ['js-dev']);
    GULP.watch([baseDirectory.assets + '/**/*', '!' + baseDirectory.assets + '/' + assetsDirectory.fonts + '**/*'], ['imagemin']);
});

// --- Production

GULP.task('prod', function() {
    GULP.watch(baseDirectory.theme + '/' + themeDirectory.sass + '/**/*.sass', ['sass-prod']);
    GULP.watch(baseDirectory.js + '/' + jsDirectory.views + '/**/*.js', ['js-prod']);
    GULP.watch([baseDirectory.assets + '/**/*', '!' + baseDirectory.assets + '/' + assetsDirectory.fonts + '**/*'], ['imagemin-prod']);
});

// ---
// Sub Tasks
///////////////////////////////////////////////

// --- Development - SASS

GULP.task('sass-dev', function() {
    GULP.src('source/sass/**/*.sass')
        .pipe(SASS.sync().on('error', SASS.logError))
        .pipe(PREFIXCSS())
        .pipe(GULP.dest('source/css'));
});

// --- Production - SASS

GULP.task('sass-prod', function() {
    GULP.src([baseDirectory.theme + '/' + themeDirectory.sass + '/**/*.sass', '!' +
            baseDirectory.theme + '/' + themeDirectory.sass + '/' + themeDirectory.views + '/**/*.sass'
        ])
        .pipe(SASS.sync().on('error', SASS.logError))
        .pipe(PREFIXCSS())
        .pipe(MINCSS({ debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(RENAME({ suffix: '.min' }))
        .pipe(GULP.dest(baseDirectory.production + '/' + productionDirectory.css));

    GULP.src(baseDirectory.theme + '/' + themeDirectory.sass + '/' + themeDirectory.views + '/**/*.sass')
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

GULP.task('js-dev', function() {
    GULP.src([baseDirectory.js + '/**/*.js', '!' + baseDirectory.js + '/' + jsDirectory.views + '**/*.js'])
        .pipe(GULP.dest(baseDirectory.development + '/' + developmentDirectory.js));

    GULP.src(baseDirectory.js + '/' + jsDirectory.views + '/**/*.js')
        .pipe(GULP.dest(baseDirectory.development + '/' + developmentDirectory.views))
});

// --- Production - JavaScript
GULP.task('js-prod', function() {
    GULP.src(['source/js/**/*.js'])
        .pipe(JSCONCAT('*.js'))
        .pipe(JSUGLIFY())
        .pipe(RENAME('app.min.js'))
        .pipe(GULP.dest('source/_prod/js'))
        .pipe(GULP.dest('html/js'));
});

// --- Development - Images

GULP.task('imagemin', function() {
    GULP.src('source/pre/assets/images/**/*')
        .pipe(IMAGEMIN())
        .pipe(GULP.dest('source/_dev/assets/'))
        .pipe(GULP.dest('html/assets/images/'));
});

// --- Production - Images

GULP.task('imagemin-prod', function() {
    GULP.src('source/pre/assets/images/**/*')
        .pipe(IMAGEMIN())
        .pipe(GULP.dest('source/_prod/assets/'))
        .pipe(GULP.dest('html/assets/images/'));
});