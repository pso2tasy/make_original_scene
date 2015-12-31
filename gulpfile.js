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
    src: ['src/file/**/*'],
    dest: 'public/file/'
  },
  image: {
    src: ['src/img/**/*'],
    dest: 'public/img/'
  },
  jade: {
    src: ['src/jade/**/*.jade', '!src/jade/**/_*/**/*.jade'],
    dest: 'public/',
    options: {pretty:false},
    isCompile: false
  },
  stylus: {
    src: ['src/stylus/*.styl', '!src/stylus/**/_*/**/*.styl'],
    dest: 'public/css/'
  },
  javascript: {
    src: ['node_modules/vue/dist/vue.min.js', 'src/js/lib/**/*.js', 'src/js/*.js', '!src/js/**/_*/**/*.js'],
    dest: 'public/js/'
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
gulp.task('file', function() {
  gulp.src(config.file.src)
    .pipe(gulp.dest(config.file.dest));
});

gulp.task('image', function() {
  gulp.src(config.image.src)
    .pipe(gulp.dest(config.image.dest));
});

gulp.task('stylus', function() {
  gulp.src(config.stylus.src)
    .pipe(stylus())
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

gulp.task('watch', ['file', 'image', 'jade', 'stylus', 'javascript'], function() {
  browserSync(config.browserSync);
  gulp.watch(config.file.src,   ['file']);
  gulp.watch(config.image.src,   ['image']);
  gulp.watch(config.jade.src,   ['jade']);
  gulp.watch(config.stylus.src, ['stylus']);
  gulp.watch(config.javascript.src, ['javascript']);
});

gulp.task('compile', ['file', 'image', 'jade', 'stylus', 'javascript']);

