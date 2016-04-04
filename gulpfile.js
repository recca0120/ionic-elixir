var elixir = require('laravel-elixir');
var gutils = require('gulp-util');
/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */
elixir(function(mix) {
    // watch = false
    if ((gutils.env._.indexOf('watch') > -1) === false) {
        mix
            .copy([
                'node_modules/ionic-sdk/release/fonts',
            ], config.get('public.font.outputFolder'))
            // .copy([
            //     'node_modules/ionic-sdk/release/js/ionic.bundle.min.js',
            //     'node_modules/ng-cordova/dist/ng-cordova.min.js',
            // ], config.get('public.js.outputFolder'))
    }

    mix
        .browserify([
            'bundle.js'
        ])
        .sass([
            'bundle.scss'
        ], config.get('public.css.outputFolder') + '/bundle.css')
        // .copy([
        //     'www/**/*.css',
        //     'www/**/*.js',
        //     'www/**/*.html',
        // ], 'platforms/browser/www/')
        // .copy([
        //     'www/**/*.css',
        //     'www/**/*.js',
        //     'www/**/*.html',
        // ], 'platforms/ios/www/')
        // .copy([
        //     'www/**/*.css',
        //     'www/**/*.js',
        //     'www/**/*.html',
        // ], 'platforms/android/assets/www/')
        .browserSync({
            files: [
                'www/**/*.html',
                config.get('public.css.outputFolder')+'/**/*.css',
                config.get('public.js.outputFolder')+'/**/*.js',
            ],
            // proxy: {
            //     target: '127.0.0.1'
            // },
            // startPath: '/ionic/www/'
            proxy: {
                target : 'localhost:8000'
            }
        });
});



// var gulp = require('gulp');
// var gutil = require('gulp-util');
// var bower = require('bower');
// var concat = require('gulp-concat');
// var sass = require('gulp-sass');
// var minifyCss = require('gulp-minify-css');
// var rename = require('gulp-rename');
// var sh = require('shelljs');
//
// var paths = {
//   sass: ['./scss/**/*.scss']
// };
//
// gulp.task('default', ['sass']);
//
// gulp.task('sass', function(done) {
//   gulp.src('./scss/ionic.app.scss')
//     .pipe(sass())
//     .on('error', sass.logError)
//     .pipe(gulp.dest('./www/css/'))
//     .pipe(minifyCss({
//       keepSpecialComments: 0
//     }))
//     .pipe(rename({ extname: '.min.css' }))
//     .pipe(gulp.dest('./www/css/'))
//     .on('end', done);
// });
//
// gulp.task('watch', function() {
//   gulp.watch(paths.sass, ['sass']);
// });
//
// gulp.task('install', ['git-check'], function() {
//   return bower.commands.install()
//     .on('log', function(data) {
//       gutil.log('bower', gutil.colors.cyan(data.id), data.message);
//     });
// });
//
// gulp.task('git-check', function(done) {
//   if (!sh.which('git')) {
//     console.log(
//       '  ' + gutil.colors.red('Git is not installed.'),
//       '\n  Git, the version control system, is required to download Ionic.',
//       '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
//       '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
//     );
//     process.exit(1);
//   }
//   done();
// });
