var gulp = require('gulp'),
  zip = require('gulp-zip'),
  info = require('./package.json');
  eslint = require('gulp-eslint');

var options = {
  "eslint": {
    "globals": {
      "require": true
    },
    "useEslintrc": true
  }
};

var paths = {
  "js_src": "app/js/**/*.js",
  "linux_x64": ['build/Marvelous-linux-x64/**'],
  "linux_x32": ['build/Marvelous-linux-ia32/**'],
  "darwin_x64": ['build/Marvelous-darwin-x64/**'],
  "darwin_x32": ['build/Marvelous-darwin-ia32/**'],
  "win_x64": ['build/Marvelous-win-x64/**'],
  "win_x32": ['build/Marvelous-win-ia32/**']
};

gulp.task('lint:js', function () {
  return gulp.src(paths["js_src"])
    .pipe(eslint(options.eslint))
    .pipe(eslint.formatEach('compact', process.stderr));
})

gulp.task('release:linux-x64', function () {
  return gulp.src(paths["linux_x64"])
    .pipe(zip(info.name + "-linux-x64-" + info.version + ".zip"))
    .pipe(gulp.dest('dist'));
});

gulp.task('release:linux-x32', function () {
  return gulp.src(paths["linux_x32"])
    .pipe(zip(info.name + "-linux-x32-" + info.version + ".zip"))
    .pipe(gulp.dest('dist'));
});

gulp.task('release:linux', ['release:linux-x64', 'release:linux-x32'], function () {

});

gulp.task('release:darwin-x64', function () {
  return gulp.src(paths["darwin_x64"])
    .pipe(zip(info.name + "-darwin-x64-" + info.version + ".zip"))
    .pipe(gulp.dest('dist'));
});

gulp.task('release:darwin-x32', function () {
  return gulp.src(paths["darwin_x32"])
    .pipe(zip(info.name + "-darwin-x32-" + info.version + ".zip"))
    .pipe(gulp.dest('dist'));
});

gulp.task('release:darwin', ['release:darwin-x64', 'release:darwin-x32'], function () {

});

gulp.task('release:win-x64', function () {
  return gulp.src(paths["win_x64"])
    .pipe(zip(info.name + "-win-x64-" + info.version + ".zip"))
    .pipe(gulp.dest('dist'));
});

gulp.task('release:win-x32', function () {
  return gulp.src(paths["win_x32"])
    .pipe(zip(info.name + "-win-x32-" + info.version + ".zip"))
    .pipe(gulp.dest('dist'));
});

gulp.task('release:win', ['release:win-x64', 'release:win-x32'], function () {

});

gulp.task('default', ['release:linux']);
