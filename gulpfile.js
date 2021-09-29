const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const nunjucks = require('gulp-nunjucks');


gulp.task('sass', function(){

    console.log("ejecutando sass")

    return gulp.src('src/**/*.scss' , {base: './src'})
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('docs/'));

});

gulp.task('nunjucks', function(){

    console.log("ejecutando nunjucks")
    
    return gulp.src(['src/**/*.njk' ,'!src/build/**/*'], {base: './src'})
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('docs/'));

});


gulp.task('all:watch', function(){
    gulp.watch('src/**/*.scss',  gulp.series('sass')),
    gulp.watch([  'src/**/*.njk' ] , gulp.series('nunjucks'));
    return;

});





/*
gulp.task('dihola', function(){

    //console.log("Hola");
    //return Promise.resolve();

    return new Promise((resolve, reject) => {

        console.log("Hola");

        setTimeout(()=>{
            console.log("Adios");
            resolve();
        },1000);

    });

});

*/



