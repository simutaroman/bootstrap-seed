var gulp = require("gulp");
var less = require("gulp-less");


// Compile LESS files from ./less into ./css
gulp.task("less", function() {
    return gulp.src("less/custom.less")
        .pipe(less())
        .pipe(gulp.dest("css"))
});


gulp.task("copy-vendor", function(){
    // copy bootstrap
    gulp.src([
        "node_modules/bootstrap/dist/**/*",
        "!**/npm.js", "!**/bootstrap-theme.*",
        "!**/*.map"
    ])
    .pipe(gulp.dest("vendor/bootstrap"))
    // copy jquery
    gulp.src([
        "node_modules/jquery/dist/jquery.js",
        "node_modules/jquery/dist/jquery.min.js"
    ])
    .pipe(gulp.dest("vendor/jquery"))
    // copy font-awesome
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

// Run everything
gulp.task("default", ["less", "copy-vendor"]);
