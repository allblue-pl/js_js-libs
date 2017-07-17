const jsLibs = new ((() => { 'use strict';


class JSLibs
{

    get Require()
    { let self = this;
        return Require;
    }


    constructor()
    { let self = this;
        self._packages = {};
    }

    exportModule(package_name, module_path, module_init_fn)
    { let self = this;
        if (!(package_name in self._packages))
            self._packages[package_name] = new Package(self, package_name);

        self._packages[package_name].addModule(module_path, module_init_fn);
    }

    importModule(package_name, module_path)
    { let self = this;
        if (!(package_name in self._packages)) {
            throw new Error('Assertion error. Package `' + package_name +
                    '` does not exist.');
        }

        return self._packages[package_name].importModule(module_path);
    }


    _parsePackagePath(package_path)
    { let self = this;
        return package_path;
    }

}


class Module
{

    get instance()
    { let self = this;
        if (self._instance === null) {
            let module = {
                exports: null
            };
            self._instance = self._initFn(self._package.require.fn, module);

            if (module.exports === null) {
                throw new Error('No `exports` found in module `' +
                        self._package.name + '/' + self.path + '`.');
            }
            self._instance = module.exports;
        }

        return self._instance;
    }


    constructor(js_lib_package, init_fn)
    { let self = this;
        self._package = js_lib_package;
        self._initFn = init_fn;

        self._instance = null;
    }

}


class Package
{

    get require()
    { let self = this;
        return self._require;
    }


    constructor(js_libs, package_name)
    { let self = this;
        self._modules = {};
        self._require = new Require(js_libs, package_name)
    }

    addModule(module_path, module_init_fn)
    { let self = this;
        self._modules[module_path] = new Module(self, module_init_fn);
    }

    importModule(module_path)
    { let self = this;
        if (!(module_path in self._modules))
            throw new Error('Module `' + module_path + '` does not exist.');

        return self._modules[module_path].instance;
    }

}


class Require
{

    get fn()
    { let self = this;
        return self._fn;
    }


    constructor(js_libs, package_name)
    { let self = this;
        self._fn = (import_path) => {
            if (import_path.indexOf('./') !== 0)
                return js_libs.importModule(import_path, 'index');

            return js_libs.importModule(package_name, import_path.substring(2));
        };
    }

}


return JSLibs;

})())();

const require = (new jsLibs.Require(jsLibs, null)).fn;
