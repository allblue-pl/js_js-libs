'use strict';

const abPackage = require('ab-package');


abPackage.exec({
    config: {
        repos: [ 'git', 'npm', 'bower' ],
    },

    package: {
        name: 'js-libs',
        description: 'Node package, web script and convention for creating and importing JavaScript packages.',
        author: 'Jakub Zolcik (AllBlue)',
        gitUri: 'https://github.com/allblue-pl/js_js-libs',
        keywords: [ 'lib', 'library', 'libs', 'class', 'classes', 'javascript',
                    'import', 'web' ],
    },

});
