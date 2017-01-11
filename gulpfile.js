"use strict"

let gulp = require("gulp");
let less = require("gulp-less");
let header = require("gulp-header");
let cleanCSS = require("gulp-clean-css");
let rename = require("gulp-rename");
let uglify = require("gulp-uglify");
let browserSync = require("browser-sync").create();
let jshint = require("gulp-jshint");

let pkg = require("./package.json");

let customname = "custom";

// Sets the header content
var devheader = ["/*!\n",
    " * Bootstrap Seed - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.repository%>)\n",
    " * Copyright " + (new Date()).getFullYear(), " <%= pkg.author %>\n",
    " * Licensed under <%= pkg.license %>\n",
    " */\n",
    ""
].join("");


// Compiles LESS files from ./less into ./css
gulp.task("less", function () {
    return gulp.src(`less/${customname}.less`)
        .pipe(less())
        .pipe(header(devheader, { pkg: pkg }))
        .pipe(gulp.dest("css"))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// TODO: minify group of css files
// minifies custom css file
gulp.task("minify-custom-css", ["less"], function () {
    return gulp.src(`css/${customname}.css`)
        .pipe(cleanCSS({ compability: "ie8" }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("css"))
        .pipe(browserSync.reload({
            stream: true
        }))

});

// JS hint task
gulp.task("jshint", function() {
  gulp.src("js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

// TODO: minify group of js files
// minifies custom js file
gulp.task("minify-custom-js", ["jshint"], function () {
    return gulp.src(`js/${customname}.js`)
        .pipe(uglify())
        .pipe(header(devheader, { pkg: pkg }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("js"))
        .pipe(browserSync.reload({
            stream: true
        }))

});

// copies main dependencies to ./vendor folder
gulp.task("copy-vendor", function () {
    // copies bootstrap
    gulp.src([
        "node_modules/bootstrap/dist/**/*",
        "!**/npm.js", "!**/bootstrap-theme.*",
        "!**/*.map"
    ])
        .pipe(gulp.dest("vendor/bootstrap"))
    // copies jquery
    gulp.src([
        "node_modules/jquery/dist/jquery.js",
        "node_modules/jquery/dist/jquery.min.js"
    ])
        .pipe(gulp.dest("vendor/jquery"))
    // copies font-awesome
    gulp.src([
        "node_modules/font-awesome/**",
        "!node_modules/font-awesome/**/*.map",
        "!node_modules/font-awesome/.npmignore",
        "!node_modules/font-awesome/*.txt",
        "!node_modules/font-awesome/*.md",
        "!node_modules/font-awesome/*.json"
    ])
        .pipe(gulp.dest("vendor/font-awesome"))
});

// Configuring the browserSync task
gulp.task("browserSync", function () {
    browserSync.init({
        server: {
            baseDir: ""
        },
    })
})
// runs everything
gulp.task("default", ["less", "minify-custom-css", "minify-custom-js", "copy-vendor"]);
