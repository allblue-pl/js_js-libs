'use strict';

const fs = require('fs');
const path = require('path');

const WebBuilder = require('./WebBuilder');


class JSLibs {

    build(js_lib_name, js_lib_fs_path, build_fs_path, callback)
    { let self = this;
        let web_builder = new WebBuilder(js_lib_name, js_lib_fs_path, build_fs_path);
        web_builder.build(callback);
    }

}

module.exports = new JSLibs();
