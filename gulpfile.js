///////////////////////////////////////////////
// NODE MODULES
// =========================

// GULP
const	GULP = require('gulp');

// CSS
const	SASS = require('gulp-sass');
const	MINCSS = require('gulp-clean-css');
const	PREFIXCSS = require('gulp-autoprefixer');

// JAVASCRIPT
const	JSUGLIFY = require('gulp-uglify');
const	JSCONCAT = require('gulp-concat');

// OTHER
const	WATCH = require('gulp-watch');
const	RENAME = require('gulp-rename');

// DEV COMPILE
///////////////////////////////////////////////

GULP.task('dev', function() {
	GULP.watch('source/pre/sass/**/*.sass', ['sass-dev']);
	GULP.watch('source/pre/js/**/*.js', ['js-dev']);
	GULP.watch('source/pre/assets/**/*', ['imagemin']);
	GULP.watch('source/pre/fonts/**/*', ['fonts']);
});

GULP.task('prod', function() {
	GULP.watch('source/pre/sass/**/*.sass', ['sass-prod']);
	GULP.watch('source/pre/js/**/*.js', ['js-prod']);
	GULP.watch('source/pre/assets/**/*', ['imagemin-prod']);
	GULP.watch('source/pre/fonts/**/*', ['fonts']);
});

GULP.task('wp', function() {
	GULP.watch('source/pre/sass/**/*.sass', ['sass-wp']);
	GULP.watch('source/pre/js/**/*.js', ['js-wp']);
	GULP.watch('source/pre/assets/**/*', ['imagemin-wp']);
	GULP.watch('source/pre/fonts/**/*', ['fonts-wp']);
});

// SASS & CSS
///////////////////////////////////////////////

GULP.task('sass-dev', function() {
	GULP.src('source/pre/sass/**/*.sass')
		.pipe(SASS.sync().on('error', SASS.logError))
		.pipe(PREFIXCSS())
		.pipe(GULP.dest('source/post/css'))
		.pipe(GULP.dest('source/_dev/css'));

	GULP.src('source/pre/css/**/*.css')
		.pipe(GULP.dest('source/_dev/css'))
		.pipe(GULP.dest('html/css'));
});

GULP.task('sass-prod', function() {
	GULP.src('source/pre/sass/**/*.sass')
		.pipe(SASS.sync().on('error', SASS.logError))
		.pipe(PREFIXCSS())
		.pipe(MINCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
		.pipe(RENAME({suffix: '.min'}))
		.pipe(GULP.dest('source/_prod/css'))
		.pipe(GULP.dest('html/css'));

	GULP.src('source/pre/css/**/*.css')
		.pipe(GULP.dest('source/_prod/css'))
		.pipe(GULP.dest('html/css'));
});

GULP.task('sass-wp', function() {
	GULP.src('source/pre/sass/**/*.sass')
		.pipe(SASS.sync().on('error', SASS.logError))
		.pipe(PREFIXCSS())
		.pipe(MINCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
		.pipe(RENAME({suffix: '.min'}))
		.pipe(GULP.dest('wordpress/wp-content/themes/new-theme/css'));
});

// JAVASCRIPT
///////////////////////////////////////////////

GULP.task('js-dev', function(){
	GULP.src(['source/pre/js/**/*.js'])
		.pipe(JSCONCAT('app.min.js'))
		.pipe(GULP.dest('source/post/js'))
		.pipe(GULP.dest('source/_dev/js'));
});

GULP.task('js-prod', function(){
	GULP.src(['source/js/**/*.js'])
		.pipe(JSCONCAT('*.js'))
		.pipe(JSUGLIFY())
		.pipe(RENAME('app.min.js'))
		.pipe(GULP.dest('source/_prod/js'))
		.pipe(GULP.dest('html/js'));
});

GULP.task('js-wp', function(){
	GULP.src(['source/js/**/*.js'])
		.pipe(JSCONCAT('*.js'))
		.pipe(JSUGLIFY())
		.pipe(RENAME('app.min.js'))
		.pipe(GULP.dest('wordpress/wp-content/themes/new-theme/js'));
});

// IMAGES
///////////////////////////////////////////////

GULP.task('imagemin', function(){
	GULP.src('source/pre/assets/images/**/*')
		.pipe(IMAGEMIN())
		.pipe(GULP.dest('source/_dev/assets/'))
		.pipe(GULP.dest('html/assets/images/'));
});

GULP.task('imagemin-prod', function(){
	GULP.src('source/pre/assets/images/**/*')
		.pipe(IMAGEMIN())
		.pipe(GULP.dest('source/_prod/assets/'))
		.pipe(GULP.dest('html/assets/images/'));
});

GULP.task('imagemin-wp', function(){
	GULP.src('source/pre/assets/images/**/*')
		.pipe(IMAGEMIN())
		.pipe(GULP.dest('wordpress/wp-content/themes/new-theme/assets'));
});

// FONTS
///////////////////////////////////////////////

GULP.task('fonts', function(){
	GULP.src('source/pre/assets/fonts/**/*')
		.pipe(GULP.dest('source/post/fonts/**/*'))
		.pipe(GULP.dest('source/_dev/fonts/**/*'))
		.pipe(GULP.dest('source/_prod/fonts/**/*'))
		.pipe(GULP.dest('html/assets/fonts/**/*'));
});

GULP.task('fonts-wp', function(){
	GULP.src('source/pre/assets/fonts/**/*')
		.pipe(GULP.dest('wordpress/wp-content/themes/new-theme/fonts/**/*'));
});
