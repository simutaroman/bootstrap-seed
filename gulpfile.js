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
    return gulp.src(`./src/less/${customname}.less`)
        .pipe(less())
        .pipe(header(devheader, { pkg: pkg }))
        .pipe(gulp.dest("./src/css"))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Jshint task
gulp.task("jshint", function () {
    return gulp.src("./src/js/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});


gulp.task("copybootstrap", function () {
    // copies bootstrap
    return gulp.src([
        "node_modules/bootstrap/dist/**/*",
        "!**/npm.js", "!**/bootstrap-theme.*",
        "!**/*.map"
    ])
        .pipe(gulp.dest("./src/vendor/bootstrap"))
});

gulp.task("copyjquery", function () {
    // copies jquery
    return gulp.src([
        "node_modules/jquery/dist/jquery.js",
        "node_modules/jquery/dist/jquery.min.js"
    ])
        .pipe(gulp.dest("./src/vendor/jquery"))
});

gulp.task("copyfontawesome", function () {
    // copies font-awesome
    return gulp.src([
        "node_modules/font-awesome/**",
        "!node_modules/font-awesome/**/*.map",
        "!node_modules/font-awesome/.npmignore",
        "!node_modules/font-awesome/*.txt",
        "!node_modules/font-awesome/*.md",
        "!node_modules/font-awesome/*.json"
    ])
        .pipe(gulp.dest("./src/vendor/font-awesome"))
});

// Copies main dependencies to ./vendor folder
gulp.task("copy-vendor", function (callback) {
    runSequence(["copybootstrap", "copyjquery", "copyfontawesome"], callback);
});

// Cleans output directory
gulp.task("clean", function () {
    return gulp.src(`${buildname}`, { read: false })
        .pipe(clean());
});

// Copies all .min css and js files to build directory
gulp.task("copyvendormin", function (callback) {
    return gulp.src("./src/vendor/**/*.min.*")
        .pipe(gulp.dest(`${buildname}/vendor`));
    callback();
});

// Minifies all
gulp.task("usemin", function () {
    return gulp.src("./src/*html")
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
        port: 3005,
        server: {
            baseDir: `${buildname}/`
        },
    })
})

// Runs everything to make production copy
gulp.task("default", function (callback) {
    runSequence(["less", "jshint"],
        "copy-vendor",
        "clean",
        "copyvendormin",
        "usemin",
        "browserSync",
        callback);
});

// Configuring the browserSync for devtask
gulp.task("browserSyncDev", function () {
    browserSync.init({
        port: 3010,
        server: {
            baseDir: "./src"
        },
    })
})

// Runs develper mode
gulp.task("dev", ["browserSyncDev", "less", "copy-vendor"], function () {
    // reloads the browser whenever HTML, JS or LESS files changed
    gulp.watch("./src/less/*.less", ["less"], browserSync.reload);
    gulp.watch("./src/*.html", browserSync.reload);
    gulp.watch("./src/js/**/*.js", browserSync.reload);
});