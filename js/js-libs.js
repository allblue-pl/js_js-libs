const jsLibs = new ((() => { 'use strict';

class JSLibs
{

    get require()
    { let self = this;
        return self._require;
    }


    constructor()
    { let self = this;
        self._packages_Fns = {};
        self._packages_Imported = {};
        self._require = (package_path) => {
            return self._getPackage(package_path);
        };
    }

    exportPackage(package_path, package_fn)
    { let self = this;
        package_path = self._parsePackagePath(package_path);
        self._packages_Fns[package_path] = package_fn;
    }


    _getPackage(package_path)
    { let self = this;
        package_path = self._parsePackagePath(package_path);

        if (package_path in self._packages_Imported)
            return self._packages_Imported[package_path];

        return self._importPackage(package_path);
    }

    _importPackage(package_path)
    { let self = this;
        if (!(package_path in self._packages_Fns))
            throw new Error('Package `' + package_path + '` does not exist.');

        let module = {};
        self._packages_Fns[package_path](module);
        self._packages_Imported[package_path] = module.exports;

        return module.exports;
    }

    _parsePackagePath(package_path)
    { let self = this;
        return package_path;
    }

}

return JSLibs;

})())();

const require = jsLibs.require;
