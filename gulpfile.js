var gulp        = require('gulp');
var concat      = require('gulp-concat');
var jade        = require('gulp-jade');
var stylus      = require('gulp-stylus');
var browserSync = require('browser-sync');

gulp.task('default', function() {
  // place code for your default task here
});


// settings
// ----------------------------------------------------------------------------
var config = {
  file: {
    src: ['src/file/**/*', '!src/file/icon/*'],
    dest: 'public/file/'
  },
  icon: {
    src: ['src/file/icon/**/*.ico', 'src/file/icon/**/*.png'],
    dest: 'public'
  },
  jade: {
    src: ['src/jade/**/*.jade', '!src/jade/**/_*/**/*.jade'],
    dest: 'public/',
    options: { pretty:false },
    isCompile: false
  },
  stylus: {
    src: ['src/stylus/*.styl', '!src/stylus/**/_*/**/*.styl'],
    dest: 'public/css/',
    options: { compress: true }
  },
  javascript: {
    src: ['node_modules/vue/dist/vue.min.js', 'node_modules/vintagejs/dist/vintage.min.js', 'src/js/lib/**/*.js', 'src/js/*.js', '!src/js/**/_*/**/*.js'],
    dest: 'public/js/',
  },
  browserSync: {
    server: {
      baseDir: './public',
    },
    reloadDelay: 2000,
    open: true,
    browser: ["chrome"],
    reloadOnRestart: true
  }
};
var preservetime = require('gulp-preservetime');
gulp.task('staticFile', function() {
  gulp.src(config.file.src)
    .pipe(gulp.dest(config.file.dest))
    .pipe(preservetime());
  gulp.src(config.icon.src)
    .pipe(gulp.dest(config.icon.dest))
    .pipe(preservetime());
});

gulp.task('stylus', function() {
  gulp.src(config.stylus.src)
    .pipe(stylus(config.stylus.options))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(config.stylus.dest));
  browserSync.reload();
});

gulp.task('jade', function() {
  gulp.src(config.jade.src)
    .pipe(jade(config.jade.options))
    .pipe(gulp.dest(config.jade.dest));
  browserSync.reload();
});

gulp.task('javascript', function() {
  gulp.src(config.javascript.src)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(config.javascript.dest));
  browserSync.reload();
});

gulp.task('watch', ['staticFile', 'jade', 'stylus', 'javascript'], function() {
  browserSync(config.browserSync);
  config.jade.options.pretty = true;
  config.stylus.options.compress = false;
  gulp.watch(config.file.src,   ['staticFile']);
  gulp.watch(config.jade.src,   ['jade']);
  gulp.watch(config.stylus.src, ['stylus']);
  gulp.watch(config.javascript.src, ['javascript']);
});


gulp.task('compile', ['staticFile', 'jade', 'stylus', 'javascript']);

