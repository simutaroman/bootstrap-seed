var gulp = require("gulp");
var less = require("gulp-less");


// Compile LESS files from ./less into ./css
gulp.task("less", function() {
    return gulp.src("less/custom.less")
        .pipe(less())
        .pipe(gulp.dest("css"))
});


// Run everything
gulp.task("default", ["less"]);
