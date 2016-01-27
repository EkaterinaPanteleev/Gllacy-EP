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


gulp.task("style", function() {
  return gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({browsers: "last 2 versions"})
    ]))
    .pipe(gulp.dest("css"));
});


gulp.task("start", ["style"], function() {
  gulp.watch("less/**/*.less", ["style"]);
});

gulp.task("clean", function () {
  return gulp.src("build/*", {read: false})
    .pipe(clean());
});

gulp.task("compile", function() {
    return gulp.src("source/less/style.less")
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
                    "source/index.html",
                    "source/form.html"], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});


gulp.task("compress", function() {
  gulp.src("source/img/*")
  .pipe(imagemin())
  .pipe(gulp.dest("build/img"));
});

gulp.task("script", function() {
  return gulp.src(["source/js/*.js", "source/js/vendors/*.js"])
    .pipe(concat("script.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build/js"));
});

gulp.task("build", ["compile", "copy", "compress", "script"]);
