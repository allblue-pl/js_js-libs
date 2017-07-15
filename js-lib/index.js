'use strict';

const abFS = require('ab-fs');


class JSLibs {

    construct()
    { let self = this;

    }

    build(js_lib_name, js_lib_path, build_path)
    { let self = this;
        self._parse(js_lib_path);
    }

    _parse(dir_path)
    { let self = this;
        let file_paths = abFS.matcher.getFilePaths([ dir_path + '/*.js' ]);
        console.log(file_paths);
    }

}

module.exports = new JSLibs();
