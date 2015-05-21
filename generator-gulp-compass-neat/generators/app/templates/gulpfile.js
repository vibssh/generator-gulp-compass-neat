/*

  ==================================================
  ** Project : Gulpfile for Gulp-Compass-Neat
  ** Version : 0.0.1
  ** Author  : Vaibhav S
  ** Date    : 21.05.2015
  ==================================================

*/


// Gulp Plugins
var gulp          = require('gulp'),
    uglify        = require('gulp-uglify'),
    concat        = require('gulp-concat'),
    compass       = require('gulp-compass'),
    cssmin        = require('gulp-minify-css'),
    rename        = require('gulp-rename'),
    ignore        = require('gulp-ignore'), // Ignore files that don't need to be deleted from the folder
    rimraf        = require('gulp-rimraf'), // Cleaning CSS file generated
    gutil         = require('gulp-util'),   // Utility like beep when error
    plumber       = require('gulp-plumber'), // This is used so that the gulp watch doesn't break even though error
    imagemin      = require('gulp-imagemin'),
    pngcrush      = require('imagemin-pngcrush'),
    notify        = require('gulp-notify'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload;

// Define path
var paths = {
    sass        : 'app/source/sass/**/*.scss',
    stylesheet  : 'app/source/sass',
    js          : 'app/source/js/**/*.js',
    img         : 'app/source/images/*'
};

var dest  = {
    css         : 'app/Css',
    script      : 'app/Scripts/custom',
    image       : 'app/images'
};

// Compass Modules here
var modules = ['breakpoint'];


// Plumber Error
var onError = function (){
  gutil.beep();
  this.emit('end');
};


// Browser-Sync Server Start
gulp.task('browser-sync', function () {
  browserSync({
    port: 4000,
    notify: false,
      server: {
        baseDir : './app/',
     }
    });
});

// Notification Centre
var cleanUp       = "Cleanup Done";
var cssMessage    = "Compass Compilation Done";
var htmlMessage   = "HTML Changes Reloaded";
var imgMesssage   = "Images Compressed";
var jsMessage     = "Javascript Changes Reloaded";


/* ==========================

 ** TASKS BEGIN HERE

   ==========================
*/

// Compass Tasks here
gulp.task('compass', function() {
  return gulp
        .src(paths.sass)
        .pipe(plumber({
          errorHandler: notify.onError("Compass build failed")
        }))
        .pipe(compass({
            sass        : paths.stylesheet,
            css         : dest.css,
            require     : modules

        }))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dest.css))
        .pipe(notify({message: cssMessage}))
        .pipe(reload({stream: true})); // This is for Browser-Sync
});


// JS Tasks Here
gulp.task('scripts', function() {
  return gulp
        .src(paths.js)
        .pipe(plumber({
          errorHandler: notify.onError("JS build failed")
        }))
        .pipe(concat('./compiled.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest.script))
        .pipe(notify({message: jsMessage}))
        .pipe(reload({stream: true})); // This is for Browser-Sync
});


// Image Minfication Tasks Here
gulp.task('image', function() {
  return gulp
        .src(paths.img)
        .pipe(imagemin())
        .pipe(gulp.dest(dest.image))
        .pipe(notify({message: imgMesssage}))
        .pipe(reload({stream: true})); // This is for Browser-Sync
});


// HTML Task Here
gulp.task('html', function() {
  return gulp
        .src('app/*.html')
        .pipe(notify({message: htmlMessage}))
        .pipe(reload({stream: true})); // This is for Browser-Sync
});


// Clean up files that we don't need post build
gulp.task('clean', function() {
  return gulp
        .src('app/css/*.css') // Source of Folder to clean the files from
        .pipe(ignore('*.min.css')) // Ignore files that don't need cleanup
        .pipe(rimraf()) // Actual clean up plugin
        .pipe(reload({stream: true})); // This is for Browser-Sync
});


//Watch here
gulp.task('watch', function() {
        gulp.watch(paths.sass, ['compass']);  // Compass Watch
        gulp.watch('app/css/*.css', ['clean']); // Clean Watch
        gulp.watch('app/*.html', ['html']); // HTML Watch
        gulp.watch(paths.js, ['scripts']); // Script Watch
        gulp.watch(paths.img, ['image']); // ImageMin Watch
});


// Default Tasks
gulp.task('default', ['watch', 'browser-sync']); // Default Task
