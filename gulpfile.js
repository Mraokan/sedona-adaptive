"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssmin = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var del = require("del");
var server = require("browser-sync").create();
var run = require("run-sequence");

gulp.task("style", function(done) {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(cssmin())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
    done();
});

gulp.task("images", function (done) {
	return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
    done();
});

gulp.task("copy", function (done) {
  return gulp.src([
    "source/fonts/**",
    "source/*.html",
    "source/img/**",
    "source/js/**"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
  done();
});

gulp.task("copy-html", function (done) {
  return gulp.src([
    "source/*.html"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
  done();
});

gulp.task("copy-js", function (done) {
  return gulp.src([
    "source/js/*.js"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
  done();
});

gulp.task("clean", function (done) {
  return del("build/**");
  done();
});

gulp.task("serve", function(done) {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("style"));
  gulp.watch("source/js/*.js").on("change", gulp.series("copy-js"));
  gulp.watch("source/js/*.js").on("change", server.reload);
  gulp.watch("source/*.html").on("change", gulp.series("copy-html"));
  gulp.watch("source/*.html").on("change", server.reload);
  done();
});

gulp.task("build", gulp.series("copy", "style"));
