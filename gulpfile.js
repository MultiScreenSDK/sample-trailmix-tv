var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var http = require('http');
var less = require('gulp-less');
var path = require('path');
var express = require('express');
var runSequence = require('run-sequence');
var del = require('del');
var notify = require("gulp-notify");
var livereload = require('gulp-livereload');
var manifest = require('gulp-manifest');

var paths = {
  tv : {
    src   : './src/tv',
    dest  : './dist',
    scripts : ['./src/tv/js/**/*.{js,jsx}'],
    styles  : ['./src/tv/styles/**/*.less'],
    statics : ['./src/tv/{fonts,images,vendor}/**/*.*','./src/tv/index.html']
  },
};


function buildScripts(src,dest){
  return browserify({
      entries: src,
      debug: true
    })
    .transform(babelify.configure({
      optional: ["es7.asyncFunctions","es7.classProperties"]
    }))
    .bundle()
    .on('error',notify.onError("Error: <%= error.message %>"))
    .pipe(source('main.js'))
    .pipe(gulp.dest(dest))
    .pipe(livereload())
    .pipe(notify("Built Scripts!"));
}

function buildStyles(src,dest){
  return gulp.src(src)
    .pipe(less({}))
    .on('error',notify.onError("Error: <%= error.message %>"))
    .pipe(gulp.dest(dest))
    .pipe(livereload())
    .pipe(notify("Built Styles!"));
}

function buildStatics(src,dest){
  return gulp.src(src, {buffer:false})
    .on('error',notify.onError("Error: <%= error.message %>"))
    .pipe(gulp.dest(dest))
    .pipe(livereload());
}

function buildManifest(src,dest){
  gulp.src(src)
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['http://*', 'https://*', '*'],
      filename: 'app.manifest',
      exclude: 'app.manifest'
    }))
    .pipe(gulp.dest(dest));
}

/* Compilation and File Processing */
gulp.task('scripts:tv', function() {
  return buildScripts(paths.tv.src+'/index.js',paths.tv.dest+'/js');
});

gulp.task('styles:tv', function () {
  return buildStyles(paths.tv.src+'/styles/styles.less',paths.tv.dest+'/styles');
});

gulp.task('statics:tv', function () {
  return buildStatics(paths.tv.statics,paths.tv.dest);
});

gulp.task('manifest:tv', function(){
  return buildManifest([paths.tv.dest + '/**'], paths.tv.dest);
});


/* Watches */
gulp.task('watch:tv', ['build:tv','server'], function() {
  livereload.listen();
  gulp.watch(paths.tv.scripts, ['scripts:tv']).on('change', livereload.changed);
  gulp.watch(paths.tv.styles, ['styles:tv']).on('change', livereload.changed);
  gulp.watch(paths.tv.statics, ['statics:tv']).on('change', livereload.changed);
});

gulp.task('watch', ['watch:tv']);


/* CleanUp */
gulp.task('clean:tv', function (cb) {
  del([paths.tv.dest], cb);
});

gulp.task('clean',['clean:tv']);


/* Builds */
gulp.task('build:tv', function(callback) {
  // runSequence('clean:tv', ['scripts:tv','styles:tv', 'statics:tv'], ['manifest:tv'], callback);
  runSequence('clean:tv', ['scripts:tv','styles:tv', 'statics:tv'], callback);
});

gulp.task('build',['build:tv']);


/* Static Server */
gulp.task('server', function(done) {
  var app = express();
  var port = 3000;
  app.use(express.static(path.join(__dirname, './dist')));
  app.use('/tester', express.static(path.join(__dirname, './src/tester')));
  app.listen(port, function(){
    console.log('development server listening on port ' + port);
  });
  done();
});


/* Build Everything */
gulp.task('default',['build']);
