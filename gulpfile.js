"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-minify-css");
var rename = require("gulp-rename");
var clean = require("gulp-clean");
var imagemin = require("gulp-imagemin");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var csscomb = require("gulp-csscomb");
var svgstore = require('gulp-svgstore');
var inject = require('gulp-inject');
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');
var path = require('path');


gulp.task('svgstore', function () {
  var svgs = gulp
    .src('src/image/*.svg')

    .pipe(svgmin(function (file) {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
          plugins: [{
              cleanupIDs: {
                  prefix: prefix + '-',
                  minify: true
              }
          }]
        }
    }))

    .pipe(svgstore({ inlineSvg: true }))
    .pipe(cheerio(function ($) {
            $('svg').attr('style',  'display:none');
        }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

     return gulp
      .src('src/index.html')
      .pipe(inject(svgs, { transform: fileContents }))
      .pipe(gulp.dest('src'));
});


gulp.task("style", function() {
  return gulp.src("src/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({browsers: "last 2 versions"})
    ]))
    .pipe(gulp.dest("src/css"));
});


gulp.task("start", ["style"], function() {
  gulp.watch("src/less/**/*.less", ["style"]);
});

gulp.task("clean", function () {
  return gulp.src("build/*", {read: false})
    .pipe(clean());
});

gulp.task("compile", function() {
    return gulp.src("src/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({browsers: "last 2 versions"})
    ]))
    .pipe(csscomb())
    .pipe(rename("style.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("copy", function() {
  return gulp.src([
                    "src/index.html",
                    "src/catalog.html"], {
    base: "src"
  })
  .pipe(gulp.dest("build"));
});


gulp.task("compress", function() {
  gulp.src("src/image/*")
  .pipe(imagemin())
  .pipe(gulp.dest("build/image"));
});

gulp.task("script", function() {
  return gulp.src(["src/js/*.js", "src/js/vendors/*.js"])
    .pipe(concat("script.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build/js"));
});

gulp.task("build", ["compile", "copy", "compress", "script"]);
