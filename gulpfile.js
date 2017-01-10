"use strict"

let gulp = require("gulp");
let less = require("gulp-less");
let header = require("gulp-header");


let pkg = require("./package.json");

// Sets the header content
var devheader = ["/*!\n",
    " * Bootstrap Seed - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.repository%>)\n",
    " * Copyright " + (new Date()).getFullYear(), " <%= pkg.author %>\n",
    " * Licensed under <%= pkg.license %>\n",
    " */\n",
    ""
].join("");


// Compiles LESS files from ./less into ./css
gulp.task("less", function() {
    return gulp.src("less/custom.less")
        .pipe(less())
        .pipe(header(devheader, { pkg: pkg }))
        .pipe(gulp.dest("css"))
});


gulp.task("copy-vendor", function(){
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

// runs everything
gulp.task("default", ["less", "copy-vendor"]);
