var gulp = require('gulp'),
    pump = require('pump'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    cp = require('child_process'),
    browserSync = require('browser-sync').create(),
    stream = browserSync.stream;

var paths = {
    dev: './_dev/',
    src: './_dev/src/',
    bower: './_dev/bower_components/',
    dist: './assets/'
}

var messages = {
    jekyllBuild: '<span style="color: grey">Запущено:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    return cp.spawn( 'bundle' , ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'concat', 'jekyll-build'], function() {
    browserSync.init({
        port: 4000,
        ui: {
            port: 4001
        },
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _dev/src/sass into both _site/assets/css (for live injecting) and assets/css (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src(paths.src + 'sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(autoprefixer({ browsers: [ 'ie >= 10', 'android >= 4.1' ] }))
        .pipe(sourcemaps.write('/maps'))
        // .pipe(sourcemaps.write('/assets/css/maps'))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
});

/**
 * Compile files from _dev/src/js into both _site/assets/js (for live injecting) and assets/js (for future jekyll builds)
 */
gulp.task('concat', function() {
    var jsFiles = [
        paths.bower + 'jquery/dist/jquery.min.js',
        paths.bower + 'underscore/underscore-min.js',
        paths.bower + 'tether/dist/js/tether.min.js',
        paths.bower + 'bootstrap/dist/js/bootstrap.min.js',
        paths.bower + 'enquire/dist/enquire.min.js',
        paths.bower + 'bLazy/blazy.min.js',
        // paths.bower + 'headroom.js/dist/headroom.min.js',
        // paths.bower + 'headroom.js/dist/jQuery.headroom.min.js',
        paths.bower + 'jquery.countdown/dist/jquery.countdown.min.js',
        paths.bower + 'ajaxchimp/jquery.ajaxchimp.min.js',
        // paths.bower + 'animsition/dist/js/animsition.min.js',
        paths.src + 'js/vendor/*.js',
        paths.src + 'js/scripts.js'
    ]

    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('/assets/js/maps'))
        .pipe(gulp.dest('./_site/assets/js'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(paths.dist + 'js'))
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(paths.src + 'sass/**/*.scss', ['sass']);
    gulp.watch(paths.src + 'js/**/*.js', ['concat']);
    gulp.watch([
        '*.{html,md,markdown}',
        '_layouts/**/*.html',
        '_includes/**/*.html',
        '_posts/*',
        'blog/*'
    ], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', [
    'browser-sync',
    'watch'
]);
