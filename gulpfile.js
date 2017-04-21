const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const debug = require("gulp-debug");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const buffer = require("vinyl-buffer");

const dest = ".build";
const src = "src";

gulp.task("compile-ts", function () {
    return gulp.src(`${src}/**/*.{ts,tsx}`)
        .pipe(tsProject())
        .js.pipe(gulp.dest(dest));
});

gulp.task("copy-html", function () {
    return gulp.src(`${src}/views/**/*.{html,css}`)
        .pipe(gulp.dest(`${dest}/client`));
});

gulp.task("browserify", ["compile-ts"], function () {
    return browserify(`${dest}/views/index.js`)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${dest}/client`));
});

gulp.task("default", ["copy-html", "browserify"]);

gulp.task("dev", ["default"], function () {
    gulp.watch(`${src}/**/*.{ts,tsx}`, ["browserify"]);
    gulp.watch(`${src}/views/**/*.{html,css}`, ["copy-html"])
});
