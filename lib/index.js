'use strict';

const fs = require('fs');
const path = require('path');

const WebBuilder = require('./WebBuilder');


class JSLibs {

    build(jsLibName, jsLibFSPath, buildFSPath, callback)
    { let self = this;
        let webBuilder = new WebBuilder(jsLibName, jsLibFSPath, buildFSPath);
        webBuilder.build(callback);
    }

}

module.exports = new JSLibs();
