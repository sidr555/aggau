/**
 * Author: Dmitry Sidorov
 * Email: sidr@sidora.net
 * Date: 26.01.16
 */

module.exports = function(grunt) {
    //var fs = require("fs");

    grunt.loadNpmTasks("grunt-env");
    //grunt.loadNpmTasks("grunt-preprocess");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-mocha-test');
    //grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-exec');

    var path = {
        app: "app/",
        web: "web/",
        f7: "node_modules/framework7/dist/"
    };
    path.js = path.web + "js/";
    path.css = path.web + "css/";
    path.img = path.web + "img/";

    grunt.initConfig({
        /**
         * Копируем файлы во временную папку для последующей сборки
         */
        copy: {
            f7: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: [path.f7 + "js/framework7.min.*"],
                    dest: path.js
                },{
                    expand: true,
                    flatten: true,
                    src: [path.f7 + "css/framework7*.min.css"],
                    dest: path.css
                },{
                    expand: true,
                    flatten: true,
                    src: [path.f7 + "img/*.png"],
                    dest: path.img
                }]
            }
        },
        watch: {
            options: {
                spawn:  true,           // запускать дочерние процессы
                debounceDelay: 500,     // антидребезг
                event: 'all',           // all|changed|added|deleted
                interrupt: true,        // прерывать предыдущий процесс при возникновении новых изменений
                forever:    true,       // не вылетать при ошибках
                dateFormat: function(time) {
                    grunt.log.writeln('Rebuild is finished in ' + time + 'ms at ' + (new Date()).toString());
                    grunt.log.writeln('Waiting for more changes...');
                },
                //livereload: {         // настройки для удаленного рестарта вотчера по http(s)
                //    host: 'localhost',
                //    port: 9000,
                //    key: grunt.file.read('ssl.key'),
                //    cert: grunt.file.read('ssl.cert'),
                // },
                //cwd: '',                // cd
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['watch']
            },

            app: {
                files: [path.app + '/**/*.js'],
                tasks: ['clean:css', 'copy:css', 'sass']
            },

            css: {
                //files: [path.css.src + '/**/*.scss', 'pr/modul/*/css/*.scss', '../go-*/modul/css/*.scss'],
                //tasks: ['clean:css', 'copy:css', 'sass']
            },

            js: {
                //files: [path.js.src + '/**/*.js', 'pr/modul/*/js/*.js', '../go-*/modul/js/*.js'],
                //tasks: ['clean:js', 'copy:js']
            }
        }
    });
}
