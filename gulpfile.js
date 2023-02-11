const path = require('node:path');

require('dotenv').config({
    path: path.join(__dirname, './config.env')
});

const { src, dest, series, task, watch } = require('gulp');
const plumber = require('gulp-plumber');
const prefix = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');

const { pino } = require('pino');

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
});

logger.level = 'info';

const isDev = process.env.NODE_ENV === 'development';

const onError = function (runner, callback) {
    return function (error) {
        logger.error(error, `error - ${runner}`);
        callback();
    };
};

const onSuccess = function (runner, callback) {
    return function () {
        logger.info(`finished - ${runner}`);
        callback();
    };
};

const scss = (done) => {
    src('./design/scss/main.scss')
        .pipe(plumber(onError('scss', done)))
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(concat('app.min.css'))
        .pipe(
            sass({
                includePaths: ['./design/scss/', 'node_modules/@picocss/pico/scss/'],
                outputStyle: 'compressed',
            })
        )
        .pipe(
            prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
                cascade: true
            })
        )
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(dest(path.join(__dirname, './public/assets/css')))
        .on('end', onSuccess('sass', done));
}

const js = (done) => {
    src(['./js/**/*.js'])
        .pipe(plumber(onError('js', done)))
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(concat('app.min.js'))
        .pipe(gulpif(!isDev, stripDebug()))
        .pipe(gulpif(!isDev, uglify()))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(dest(path.join(__dirname, './public/assets/js')))
        .on('end', onSuccess('js', done));
}

task('watch', () => watch(['./design/scss/**/*.scss', './js/**/*.js'], series(scss, js)));

exports.default = series(scss, js);