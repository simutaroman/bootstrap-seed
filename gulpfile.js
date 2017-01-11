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


// Other dependencies
let browserSync = require("browser-sync").create();
let pkg = require("./package.json");

// local variables
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

// jshint task
gulp.task("jshint", function () {
    gulp.src("js/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
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

gulp.task("clean", function () {
    gulp.src(`${buildname}`, { read: false })
        .pipe(clean());
});

// copies all .min css and js files to build directory
gulp.task("copyvendormin", ["copy-vendor"], function () {
    gulp.src("vendor/**/*.min.*")
        .pipe(gulp.dest(`${buildname}/vendor`));
});

// minifies all
gulp.task("usemin", ["clean","copyvendormin"], function () {
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
    browserSync.init({
        server: {
            baseDir: ""
        },
    })
})

// runs everything
gulp.task("default", ["less", "jshint", "usemin"]);
