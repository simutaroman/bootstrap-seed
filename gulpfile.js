"use strict"

// Gulp modules
let gulp = require("gulp");
let less = require("gulp-less");
let header = require("gulp-header");
let cleanCSS = require("gulp-clean-css");
let uglify = require("gulp-uglify");
let jshint = require("gulp-jshint");
let usemin = require("gulp-usemin");
let minifyHtml = require("gulp-minify-html");
let minifyCss = require("gulp-minify-css");
let rev = require("gulp-rev");
let clean = require("gulp-clean");
let runSequence = require('run-sequence');


// Other dependencies
let browserSync = require("browser-sync").create();
let pkg = require("./package.json");

// Local variables
let customname = "custom";
let buildname = "dist"

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

// Jshint task
gulp.task("jshint", function () {
    return gulp.src("js/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});


// Copies main dependencies to ./vendor folder
gulp.task("copy-vendor", function (callback) {
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

    callback();
});

// Cleans output directory
gulp.task("clean", function () {
    return gulp.src(`${buildname}`, { read: false })
        .pipe(clean());
});

// Copies all .min css and js files to build directory
gulp.task("copyvendormin", ["copy-vendor"], function () {
    return gulp.src("vendor/**/*.min.*")
        .pipe(gulp.dest(`${buildname}/vendor`));
});

// Minifies all
gulp.task("usemin", ["copyvendormin"], function () {
    return gulp.src("./*html")
        .pipe(usemin({
            css: [cleanCSS({ compability: "ie8" }), rev()],
            html: [minifyHtml({ empty: true })],
            js: [uglify(), header(devheader, { pkg: pkg }), rev()],
            inlinejs: [uglify()],
            inlinecss: [minifyCss(), "concat"]
        }))
        .pipe(gulp.dest(`${buildname}/`));
});

// Configuring the browserSync task
gulp.task("browserSync", function () {
    return browserSync.init({
        server: {
            baseDir: `${buildname}/`
        },
    })
})

// Runs everything to make production copy
//gulp.task("default", ["less", "jshint", "usemin", "browserSync"]);
gulp.task("default", function (callback) {
    runSequence(["less", "jshint"],
        "clean",
        "usemin",
        "browserSync",
        callback);
});

// Configuring the browserSync for devtask
gulp.task("browserSyncDev", function () {
    browserSync.init({
        server: {
            baseDir: ""
        },
    })
})

// Runs develper mode
gulp.task("dev", ["browserSyncDev", "less", "copy-vendor"], function () {
    // reloads the browser whenever HTML, JS or LESS files changed
    gulp.watch("less/*.less", ["less"], browserSync.reload);
    gulp.watch("*.html", browserSync.reload);
    gulp.watch("js/**/*.js", browserSync.reload);
});