import gulp from 'gulp'
import sass from 'gulp-sass'
import livereload from 'gulp-livereload'

gulp.task('compile', () => {
  gulp.src('src/**/main.scss')
      .pipe(sass())
      .pipe(gulp.dest('css'));
});

gulp.task('default', () => {
  livereload.listen();
  gulp.watch('src/**/*.scss', ['compile']);
});
