###
  パッケージ読み込み
###
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
jade = require 'gulp-jade'
plumber = require 'gulp-plumber'
notifier = require 'node-notifier'


###
  ファイルパス
###
paths =
  sass: './www/**/*.scss'
  coffee: './www/**/*.coffee'
  jade: './www/**/*.jade'


###
  エラーハンドラ
###
errorHandler = (error) ->
  notifier.notify
    message: error.message
    title: error.plugin
    sound: true
  , ->
    console.log error.message


###
  タスク群
###
gulp.task 'default', ['watch']

gulp.task 'prepare', ['sass', 'coffee', 'jade']

gulp.task 'sass', ->
  gulp.src './www/scss/**.scss'
    .pipe plumber
      errorHandler: errorHandler
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
    .pipe plumber
      errorHandler: errorHandler
    .pipe coffeelint opt: {max_line_length: {value: 1024, level: 'ignore'}}
    .pipe do coffeelint.reporter
    .pipe coffee
      bare: true
    .pipe conc 'application.js'
    .pipe gulp.dest './www/js'

gulp.task 'jade', ->
  gulp.src paths.jade
    .pipe plumber
      errorHandler: errorHandler
    .pipe jade
      pretty: true
    .pipe gulp.dest './www/'

gulp.task 'watch', ->
  gulp.watch paths.sass, ['sass']
  gulp.watch paths.coffee, ['coffee']
  gulp.watch paths.jade, ['jade']
