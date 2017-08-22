'use strict';

const fs = require('fs');
const path = require('path');

const abFS = require('ab-fs');


class WebBuilder
{

    constructor(js_lib_name, js_lib_path, build_path)
    { let self = this;
        self.jsLib_Name = js_lib_name;
        self.jsLib_Path = js_lib_path;
        self.build_Path = build_path;
    }

    build(callback)
    { let self = this;
        try {
            if (!fs.existsSync(self.build_Path))
                fs.mkdirSync(self.build_Path);
        } catch (err) {
            callback(err);
            return;
        }

        let file_paths = abFS.matcher.getPaths([ self.jsLib_Path + '/**/*.js' ],
                (err, file_paths) => {
            if (err !== null) {
                callback(err);
                return;
            }

            let build_file_promises = [];
            let built_file_paths = [];
            for (let i = 0; i < file_paths.length; i++) {
                build_file_promises.push(self._build_File_Promise(file_paths[i],
                        built_file_paths));

                let relative_path = path.relative(self.jsLib_Path, file_paths[i]);
            }

            Promise.all(build_file_promises)
                .catch((err) => {
                    callback(err, null);
                })
                .then(() => {
                    callback(null, built_file_paths);
                });
        });
    }


    _build_File_Promise(file_path, built_file_paths)
    { let self = this;
        return new Promise((resolve, reject) => {
            fs.readFile(file_path, 'utf-8', (err, data) => {
                if (err !== null) {
                    reject(err);
                    return;
                }

                let basename = path.basename(file_path);
                let relative_path = path.relative(self.jsLib_Path, file_path);
                let built_file_path = path.join(self.build_Path, relative_path);
                let built_dir_path = path.dirname(built_file_path);

                if (!abFS.dir.existsSync(built_dir_path))
                    abFS.dir.createRecursiveSync(built_dir_path);

                let module_path = self._parseModulePath(
                        relative_path === 'index.js' ?
                        'index' :
                        (basename === 'index.js' ?
                        path.dirname(relative_path) + '/index' :
                        path.dirname(relative_path) + '/' +
                        path.parse(relative_path).name));

                data = 'jsLibs.exportModule(' +
                        '\'' + self.jsLib_Name + '\'' +
                        ', \'' + module_path + '\'' +
                        ', (require, module) => { ' +
                        data +
                        ' });';

                fs.writeFile(built_file_path, data, 'utf-8',
                        (err) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }

                    built_file_paths.push(built_file_path);
                    resolve();
                });
            });
        });
        //console.log(path.relative(self.jsLib_Path, file_path));
    }

    _parseModulePath(module_path)
    { let self = this;
        if (module_path.indexOf('./') === 0)
            return module_path.substring(2);

        return module_path;
    }

}

module.exports = WebBuilder;
