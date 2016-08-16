var
  browserSync = require('browser-sync'),

  gulp = require('gulp'),
  rename = require('gulp-rename'),
  watch = require('gulp-watch'),
  gutil = require('gulp-util'),
  
  PrettyError = require('pretty-error'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),

  stylus = require('gulp-stylus'),
  prefixer = require('gulp-autoprefixer'),
  nano = require('gulp-cssnano'),
  
  include = require('gulp-include'),
  uglify = require('gulp-uglify'),

  pathSrc = './src',
  pathDst = './dist',

  _renderer = null,
  _notifier = null,

  _error = function(cb) {
    if (_renderer == null) {
      _notifier = notify.onError("Ошибка в Gulp! Смотри вывод терминала.");
      _renderer = new PrettyError();
      _renderer.skipNodeFiles();
    }
    return function(error) {
      var message = _renderer.render(error);
      _notifier(error);
      gutil.log(message);
      if (cb != null) cb();
    }
  },

  _src = function(glob, cb) {
    return gulp.src(pathSrc + '/' + glob)
      .pipe(plumber({errorHandler: _error(cb)}));
  },

  _dst = function(cb) {
    var result = gulp.dest(pathDst).on('end', cb);
    result.pipe(browserSync.reload({stream: true}));
    return result;
  },

  _watch = function(glob, task) {
    return watch(pathSrc + '/' + glob, function() { gulp.start(task); });
  }
;

process.on("uncaughtException", _error());

gulp.task('build:css', function(cb) {
  _src('./main.styl', cb)
    .pipe(stylus())
    .pipe(include())
    .pipe(prefixer({
      browsers: ['last 3 version'],
      cascade: false
    }))
    .pipe(gutil.env.compress != null ? nano() : gutil.noop())
    .pipe(rename('styles.css'))
    .pipe(_dst(cb));
});

gulp.task('build:js', function(cb) {
  _src('./main.js', cb)
    .pipe(include())
    .pipe(gutil.env.compress != null ? uglify() : gutil.noop())
    .pipe(rename('scripts.js'))
    .pipe(_dst(cb));
});

gulp.task('build:html', function(cb) {
  _src('./*.html', cb)
    .pipe(include())
    .pipe(_dst(cb));
});

gulp.task('build', ['build:css', 'build:js', 'build:html']);

gulp.task('watch', function(cb) {
  _watch('./**/*.html', 'build:html');
  _watch('./**/*.styl', 'build:css');
  _watch('./**/*.js', 'build:js');
  cb();
});

gulp.task('server', function(cb) {
  browserSync({
    server: {baseDir: pathDst},
    tunnel: false,
    port: 3010
  });
});

gulp.task('serve', ['watch', 'server']);
gulp.task('default', ['build']);