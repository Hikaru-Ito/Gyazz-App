gulp = require 'gulp'
gutil = require 'gulp-util'
bower = require 'bower'
conc = require 'gulp-concat'
sass = require 'gulp-sass'
minifyCss = require 'gulp-minify-css'
rename = require 'gulp-rename'
sh = require 'shelljs'
coffee = require 'gulp-coffee'
uglify = require 'gulp-uglify'
coffeelint = require 'gulp-coffeelint'

paths =
  sass: './www/**/*.scss'
  coffee: './www/**/*.coffee'

gulp.task 'default', ['watch']

gulp.task 'sass', ->
  gulp.src './www/scss/**.scss'
    .pipe sass
      errLogToConsole: true
    .pipe gulp.dest './www/css/'
    .pipe minifyCss
      keepSpecialComments: 0
    .pipe rename
      extname: '.min.css'
    .pipe gulp.dest './www/css/'

gulp.task 'coffee', ->
  gulp.src paths.coffee
    .pipe do coffeelint
    .pipe do coffeelint.reporter
    .pipe coffee
      bare: true
    .pipe conc 'application.js'
    # .pipe do uglify
    .pipe gulp.dest './www/js'

gulp.task 'watch', ->
  gulp.watch paths.sass, ['sass']
  gulp.watch paths.coffee, ['coffee']