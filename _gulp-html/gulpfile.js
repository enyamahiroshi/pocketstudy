const gulp = require('gulp');
const frontnote = require("gulp-frontnote");
const uglify = require("gulp-uglify");
const browser = require("browser-sync");
const bourbon = require('node-bourbon');
const plumber = require("gulp-plumber");
const notify = require('gulp-notify');
const csscomb = require('gulp-csscomb');
const prettify = require('gulp-prettify');
const htmlbeautify = require('gulp-html-beautify');
const htmlhint = require("gulp-htmlhint");
const csslint = require('gulp-csslint');
const jshint = require('gulp-jshint');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const pleeease = require('gulp-pleeease');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const sass = require('gulp-sass');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

//ファイルパス関係
const f_root = "../";
const f_html = "../";
const f_css = "../assets/css/";
const f_js = "../assets/js/";
const f_image = "images";
const f_image_min = "../assets/" + f_image;
const f_sass = "sass/";
const f_pug = "pug/";
const f_es6 = "es6/";
const f_es5 = "es5/";
const other = "other/";
const f_image_gulp = "images/";
const root_font_px = 14;
const browsers = [
  "last 3 versions",
  "> 1%",
];
bourbon.with(f_css + '/style.css', f_sass + '/style.scss');

gulp.task("server", () => {
  browser({
    server: {
      baseDir: f_root
    }
  });
});

//sass
gulp.task('sass', () => {
  return gulp.src(f_sass + '**/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(sass({
      includePaths: bourbon.includePaths
    }))
    .pipe(pleeease({
      rem: false,
      browsers: browsers,
      minifier: false, //変更
      mqpacker: true,

    }))
    .pipe(csscomb())
    .pipe(gulp.dest(f_css))
    //ブラウザリロード
    .pipe(browser.reload({
      stream: true
    }));
});

//cssComb実行
gulp.task('styles', () => {
  return gulp.src([f_css + "**/*.css", "!" + f_css + "min/**/*.css"])
    .pipe(csscomb())
    .pipe(gulp.dest(f_css));
});

//css構文チェック
gulp.task('csslint', () => {
  gulp.src([f_css + "**/*.css", "!" + f_css + "min/**/*.css"])
    .pipe(csslint())
    .pipe(csslint.reporter());
});

//スタイルガイド作成
gulp.task('guide', () => {
  gulp.src(f_sass + '**/*.scss').pipe(frontnote({
    css: '../css/style.css'
  }));
});

//HTML構文チェック
gulp.task('htmllint', () => {
  gulp.src(f_html + '**/*.html')
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());
});

//HTML整形
gulp.task('prettify', () => {
  gulp.src(f_html + '**/*.html')
    .pipe(prettify({
      indent_size: 2
    }))
    .pipe(gulp.dest(f_html));
});

gulp.task('htmlbeautify', function() {
  var options = {
    indentSize: 1,
    indent_level: 1,
  };
  gulp.src(f_html + '**/*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest(f_html));
});






//htmlタスク
gulp.task('html', () => {
  gulp.src(f_html + '**/*.html') //実行するファイル
    //ブラウザリロード
    .pipe(browser.reload({
      stream: true
    }));
});
//JSのminify化
gulp.task("js", () => {
  gulp.src([f_js + "**/*.js", "!" + f_js + "min/**/*.js"])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(uglify())
    .pipe(gulp.dest(f_js + "min"))
    //ブラウザリロード
    .pipe(browser.reload({
      stream: true
    }));
});

//jsチェック
gulp.task('jslint', () => {
  return gulp.src(f_js + '**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//画像圧縮
gulp.task('image', () => {
  return gulp.src([f_image_gulp + '**/*', "!" + f_image_gulp + "cars/**/*"])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(f_image_min));
});

//pug
gulp.task('pugcom', () => {
  const YOUR_LOCALS = {};
  gulp.src([f_pug + "**/*.pug", "!" + f_pug + "_*/**/*.pug"])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(pug({
      locals: YOUR_LOCALS,
      pretty:true
    }))
    .pipe(gulp.dest(f_html))
});

//ベンダープレフィレクスとメディアクエリとコンブ
gulp.task('ple', () => {
  return gulp.src([f_css + "**/*.css", "!" + f_css + "min/**/*.css"])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(pleeease({
      browsers: browsers,
      minifier: false, //変更
      mqpacker: true,
      rem: [root_font_px + "px"]
    }))
    .pipe(csscomb())
    .pipe(gulp.dest(f_css))
    .pipe(browser.reload({
      stream: true
    }));
});

gulp.task('browserify', () => {
  browserify(f_es6 + 'browserify/main.js', {
      debug: true //ソースマップの調整
    })
    .transform(babelify, {
      presets: ['es2015']
    })
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest(f_js))
});

gulp.task('babel', () => {
  gulp.src([f_es6 + '**/*.js', "!" + f_es6 + 'browserify/*'])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    //  .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    // .pipe(sourcemaps.write('maps', {
    //   includeContent: false,
    //   sourceRoot: '/public/resources/maps'
    // }))
    .pipe(gulp.dest(f_js))

  gulp.src(f_es5 + '**/*.js')
    .pipe(gulp.dest(f_js))
});

gulp.task('move', () => {
  gulp.src(other + '**/*')
    .pipe(gulp.dest(f_html))
});




gulp.task('watch', function(){
  gulp.watch(f_sass + "**/*.scss").on('change', gulp.series('sass'));
  gulp.watch(f_es6 + '**/*.js').on('change', gulp.series('babel'));
  gulp.watch(f_es6 + 'browserify/**/*.js').on('change', gulp.series('browserify'));
  gulp.watch(f_es5 + '**/*.js').on('change', gulp.series('babel'));
  gulp.watch(f_pug + '**/*.pug').on('change', gulp.series('pugcom'));
  gulp.watch(f_html + '*.html').on('change', gulp.series('html'));
  gulp.watch(f_image_gulp + '**').on('change', gulp.series('image'));
});

gulp.task('default', gulp.series( gulp.parallel('html','sass', 'babel', 'browserify', 'image', 'move', 'pugcom', 'server','watch')));






// gulp.task("comp", ['styles', 'js']);
// gulp.task("check", ['csslint', 'jslint']);
