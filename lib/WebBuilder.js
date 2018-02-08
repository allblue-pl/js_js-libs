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
                abFS.mkdirRecursiveSync(self.build_Path);
        } catch (err) {
            callback(err);
            return;
        }

        abFS.matcher.getPaths([ self.jsLib_Path + '/**/*.js' ],
                (err, filePaths) => {
            if (err !== null) {
                callback(err);
                return;
            }

            let buildFilePromises = [];
            let builtFilePaths = [];
            for (let i = 0; i < filePaths.length; i++) {
                buildFilePromises.push(self._build_File_Promise(filePaths[i],
                        builtFilePaths));
            }

            Promise.all(buildFilePromises)
                .catch((err) => {
                    callback(err, null);
                })
                .then(() => {
                    callback(null, builtFilePaths);
                });
        });
    }


    _build_File_Promise(file_path, builtFilePaths)
    { let self = this;
        return new Promise((resolve, reject) => {
            fs.readFile(file_path, 'utf-8', (err, data) => {
                if (err !== null) {
                    reject(err);
                    return;
                }

                let basename = path.basename(file_path);
                let relativePath = path.relative(fs.realpathSync(
                        self.jsLib_Path), file_path);
                let builtFilePath = path.join(self.build_Path, relativePath);
                let builtDirPath = path.dirname(builtFilePath);

                if (!abFS.dir.existsSync(builtDirPath))
                    abFS.dir.createRecursiveSync(builtDirPath);

                let module_path = self._parseModulePath(
                        relativePath === 'index.js' ?
                        'index' :
                        (basename === 'index.js' ?
                        path.dirname(relativePath) + '/index' :
                        path.dirname(relativePath) + '/' +
                        path.parse(relativePath).name));

                data = 'jsLibs.exportModule(' +
                        '\'' + self.jsLib_Name + '\'' +
                        ', \'' + module_path + '\'' +
                        ', (require, module) => { ' +
                        data +
                        ' });';

                fs.writeFile(builtFilePath, data, 'utf-8',
                        (err) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }

                    builtFilePaths.push(builtFilePath);
                    resolve();
                });
            });
        });
        //console.log(path.relative(self.jsLib_Path, file_path));
    }

    _parseModulePath(module_path)
    { let self = this;
        module_path = module_path.replace(/\\/g, '/');

        if (module_path.indexOf('./') === 0)
            return module_path.substring(2);

        return module_path;
    }

}

module.exports = WebBuilder;
