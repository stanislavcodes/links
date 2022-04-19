// Initialize modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const pug = require("gulp-pug");

// Use dart-sass for @use
//sass.compiler = require('dart-sass');

// Pug Task
function pugTask() {
  return src("src/*.pug")
    .pipe(
      pug({
        locals: {},
        pretty: true,
      })
    )
    .pipe(dest("dist"));
}

// Sass Task
function scssTask() {
  return src("src/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
}

// JavaScript Task
function jsTask() {
  return src("src/script.js", { sourcemaps: true })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." }));
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "dist/",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  // watch("*.html", browserSyncReload);
  watch(
    ["src/**/*.pug", "src/**/*.scss", "src/**/*.js"],
    series(pugTask, scssTask, jsTask, browserSyncReload)
  );
}

// Default Gulp Task
exports.watch = series(pugTask, scssTask, jsTask, browserSyncServe, watchTask);

// Build Gulp Task
exports.build = series(pugTask, scssTask, jsTask);
