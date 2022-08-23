const gulp = require('gulp');
const bourbon = require('node-bourbon');
const sass = require('gulp-sass')(require('sass'));
const frontnote = require("gulp-frontnote");
const uglify = require("gulp-uglify");
const rename = require('gulp-rename');
const browser = require("browser-sync");
const plumber = require("gulp-plumber");
const notify = require('gulp-notify');
const csscomb = require('gulp-csscomb');
const csslint = require('gulp-csslint');
const jshint = require('gulp-jshint');
const imagemin = require('gulp-imagemin');
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require('imagemin-pngquant');
const changed = require('gulp-changed');
const svgmin = require('gulp-svgmin');
const pleeease = require('gulp-pleeease');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

//ファイルパス関係
const f_root = "../";
const f_html = "../";
const f_css = "../assets/css/";
const f_js = "../assets/js/";
const f_image = "assets/images/";
const f_image_min = "../" + f_image;
const f_sass = "sass/";
const f_es6 = "es6/";
const f_es5 = "es5/";
const other = "other/";
const f_code = "html/";
const f_image_gulp = "img/";
const root_font_px = 15;
// const proxy = 'http://localhost/';
const baseDir = '../';
const browsers = [
    "last 4 versions",
    "> 1%",
    "Android 4.4",
  ];

  gulp.task('browser-sync', (done) => {
      browser.init({
          server: {
              baseDir: baseDir,
              index: "index.html"
          }
      });
      done();
  });

  bourbon.with( f_sass + '/style.scss');
  //sass
  gulp.task('sass', (done) => {
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
      done();
  });

  //cssComb実行
  gulp.task('styles', (done) => {
      return gulp.src([f_css + "**/*.css", "!" + f_css + "min/**/*.css"])
      .pipe(csscomb())
      .pipe(gulp.dest(f_css));
      done();
  });

  //css構文チェック
  gulp.task('csslint', (done) => {
      gulp.src([f_css + "**/*.css", "!" + f_css + "min/**/*.css"])
      .pipe(csslint())
      .pipe(csslint.reporter());
      done();
  });

  //スタイルガイド作成
  gulp.task('guide', (done) => {
      gulp.src(f_sass + '**/*.scss').pipe(frontnote({
          css: '../css/style.css'
      }));
      done();
  });

  //HTML構文チェック
  gulp.task('htmllint', (done) => {
      gulp.src(f_code + '**/*.html')
      .pipe(htmlhint())
      .pipe(htmlhint.reporter());
      done();
  });

  //JSのminify化
  gulp.task("jsminify", (done) => {
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
      done();
  });
  // JavaScript
  // gulp.task('jsminify', (done) => {
  //     return gulp
  //         .src(f_js + "**/*.js")
  //         .pipe(uglify()) //minify
  //         .pipe(rename({
  //             suffix: ".min",
  //         }))
  //         .pipe(gulp.dest(f_js));
  //     done();
  // })

  //jsチェック
  gulp.task('jslint', (done) => {
      return gulp.src(f_js + '**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
      done();
  });

  //画像圧縮
  gulp.task("imagemin", function () {
    return gulp
      .src([f_image_gulp + '**/*.{png,jpg,gif,svg}'])
      .pipe(changed(f_image_min)) // gulp-changed必要
      .pipe(
        imagemin([
          pngquant({
            quality: [.60, .70], // 画質
            speed: 1 // スピード
          }),
          mozjpeg({ quality: 80 }), // 画質
          imagemin.svgo(),
          imagemin.optipng(),
          imagemin.gifsicle({ optimizationLevel: 3 }) // 圧縮率
        ])
      )
      .pipe(gulp.dest(f_image_min));
  });

  //ベンダープレフィレクスとメディアクエリとコンブ
  gulp.task('ple', (done) => {
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
          done();
  });


  gulp.task('browserify', (done) => {
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
          .pipe(gulp.dest(f_js));
        done();
  });



  gulp.task('babel', (done) => {
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
          .pipe(gulp.dest(f_js));
          done();
  });

  gulp.task('move', (done) => {
      gulp.src(other + '**/*')
          .pipe(gulp.dest(f_html));
          done();
  });

  gulp.task('code', (done) => {
      gulp.src([f_code + "**/*.html"])
          .pipe(browser.reload({
              stream: true
          }))
          .pipe(gulp.dest(f_html));
          done();
  });

  gulp.task('default', gulp.series(['sass', 'babel', 'browserify', 'imagemin', 'move', 'code', 'browser-sync'], (done) => {
      gulp.watch(f_sass + '**/*.scss', gulp.series('sass'));
      gulp.watch(f_es6 + 'browserify/**/*.js', gulp.series('browserify'));
      gulp.watch(f_es6 + '**/*.js', gulp.series('babel'));
      gulp.watch(f_es5 + '**/*.js', gulp.series('babel'));
      gulp.watch(f_code + '**', gulp.series('code'));
      gulp.watch(f_image_gulp + '**', gulp.series('imagemin'));
      done();
  }));
  gulp.task('comp', gulp.series(('styles', 'jsminify')));
  gulp.task('check', gulp.series(('csslint', 'jslint')));
