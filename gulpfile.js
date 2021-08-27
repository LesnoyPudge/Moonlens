const { src, dest, watch, parallel, series } = require('gulp');
const gulp = require("gulp");
// const browserSync = require('browser-sync').create();
const del = require('del');
// const autoprefixer = require('gulp-autoprefixer');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
// const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
// const uglify = require('gulp-uglify-es').default;
// const fileinclude = require('gulp-file-include');
// const ts = require('gulp-typescript');


// const srcPath = 'src/';
const srcPath = './';
// const distPath = 'dist/';
const distPath = './';

const path = {
    build: {
        html: distPath,
        php: distPath,
        js: distPath + "js/",
        css: distPath + "public/css/",
        scss: distPath + "scss/",
        imagesPre: distPath + "imagesPre/",
        fonts: distPath + "fonts/",
        images: distPath + "public/images"
    },
    src: {
        html: srcPath + "*.html",
        php: srcPath + "*.php",
        js: srcPath + "js/*.js",
        ts: srcPath + "ts/*.ts",
        css: srcPath + "css/*.css",
        scss: srcPath + "scss/*.scss",
        imagesPre: srcPath + "imagesPre/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    watch: {
        html: srcPath + "**/*.html",
        php: srcPath + "**/*.php",
        js: srcPath + "**/*.js",
        ejs: srcPath + "**/*.ejs",
        ts: srcPath + "ts/**/*.ts",
        css: srcPath + "css/**/*.css",
        scss: srcPath + "scss/**/*.scss",
        images: srcPath + "imagesPre/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    clean: "./" + distPath
}

// const projectName = 'MoonlensV2';

// function browsersync() {
//     browserSync.init({
//         proxy: "http://localhost/" + projectName,
//         notify: false
//     });
// }

// function html() {
//     return src([
//         path.src.html, 
//         '!src/_*.html'
//     ])
//         //.pipe(dest(srcPath))
//         .pipe(fileinclude({
//             prefix: '@@',
//             basepath: '@file'
//         }))
//         .pipe(dest(path.build.html))
//         .pipe(browserSync.stream())
// }

// function php() {
//     return src(path.src.php)
//         .pipe(dest(path.build.php))
//         .pipe(browserSync.stream())
// }

// function css() {
//     return src(
//         ['node_modules/normalize.css/normalize.css',
//          path.src.scss
//         ])
//         .pipe(scss({ outputStyle: 'compressed' }))
//         .pipe(concat('style.min.css'))
//         .pipe(autoprefixer({
//             overrideBrowserslist: ['last 10 version'],
//             grid: true
//         }))
//         .pipe(dest(path.build.css))
//         .pipe(browserSync.stream())
// }

function cssMin() {
    return src([
        'node_modules/normalize.css/normalize.css',
         path.src.scss
        ])
        .pipe(scss({}))
        .pipe(concat('style.min.css'))
        .pipe(dest(path.build.css))
        // .pipe(browserSync.stream())
}

// function tsTransform() {
//     return src([
//         path.src.ts
//     ])
//         .pipe(ts({
//             // declaration: true,
//             // allowJs: true,
//             // noImplicitAny: true,
//             // outFile: '_output.js'
//         }))
//         .pipe(gulp.dest(srcPath + "js/"))
//         .pipe(browserSync.stream())
// }

// function js() {
//     return src([
//         path.src.js
//     ])
//         .pipe(browserSync.stream())
// }

// function build() {
//     return src([
//         //path.src.css,
//         path.src.fonts,
//         // path.src.js,
//         //path.src.html,
//         path.src.php
//     ], { base: srcPath })
//         .pipe(dest(distPath))
// }


function imagesMin() {
    return src(path.src.imagesPre)
        .pipe(
            webp({
                quality: 100
            })
        )
        .pipe(dest(path.build.images))
        // .pipe(browserSync.reload({ stream: true }));
}

// function cleanDist() {
//     return del(distPath);
// }

function watchFiles() {
    // watch(path.watch.html, html);
    // watch(path.watch.php, php);
    watch(path.watch.scss, cssMin);
    // watch(path.watch.js, browserSync.stream());
    // watch(path.watch.ejs, browserSync.stream());
    // watch(path.watch.ts, tsTransform, jsMin);
    // watch(path.watch.fonts, fonts);
    watch(path.watch.images, imagesMin);
}

// exports.html = html;
// exports.php = php;
// exports.css = css;
// exports.js = js;
// exports.images = images;
// exports.fonts = fonts;
exports.watchFiles = watchFiles;
// exports.cleanDist = cleanDist;

// exports.build = series(cleanDist, html, css, images, tsTransform, js, fonts, build);
exports.default = series(cssMin, imagesMin, parallel(watchFiles));