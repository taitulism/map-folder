[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/map-folder.svg?branch=develop)](https://travis-ci.org/taitulism/map-folder)

map-folder
==========
Create a JSON representation of a folder structure tree.

Installation
------------
```sh
$ npm install map-folder
```

Usage
-----
Map a folder:

Sync
```js
const mapFolder = require('map-folder');

const result = mapFolder.sync('path/to/my-project');
console.log(result);
```

Async
```js
const mapFolder = require('map-folder');

mapFolder('path/to/my-project').then((result) => {
    console.log(result);
});
```

Example folder structure:
```
└─ my-project
   ├─ common
   │  └─ utils.js
   └─ index.js
```

Example results:
```js
{
    name: 'my-project',
    path: 'path/to/my-project',
    type: FOLDER,
    entries: {
        'common': {
            name: 'common',
            path:'path/to/my-project/common',
            type: FOLDER,
            entries: {
                "utils.js": {
                    name: 'utils.js',
                    path:'path/to/my-project/common/utils.js',
                    type: FILE,
                    base: 'utils',
                    ext: 'js',
                }
            }
        },
        'index.js': {
            path:'path/to/my-project/index.js',
            type: FILE,
            name: 'index.js',
            base: 'index',
            ext: 'js',
        }
    }
};
```

## API
------------------------------------------------------------------------
## async - `mapFolder(path, ignore)`
## sync - `mapFolder.sync(path, ignore)`
### Arguments:
* **path** - A path to an existing folder.
* **ignore** - Exclude items mechanism. Read more below.

### Return:
A JSON object or a promise for that object. 

Every entry in the result (including the result itself) holds the following properties:  
* `name`: String - The whole entry name. Includes file extensions.
* `path`: String - the absolute path to the entry.
* `type`: Enum | Number - a file or a folder.

Each type has its own additional properties:
* **FOLDER** - 0
    * `entries`: Object - An object of the folder's child entries (sub-folders and files).
* **FILE** - 1
    * `base`: String - The file name without the extension.
    * `ext`: String - The file extension without a dot.

You can use the exported `FILE` and `FOLDER` constants as types to check entry type:
```js
const {FILE, FOLDER} = require('map-folder');

if (result.entries.myApp.type === FOLDER) // ...
```
> There are other entry types like symlinks, currently out of this module's scope.

&nbsp;

## Ignore
---------
`String | String[] | () => boolean`

To exclude entries (files and folder) you can use the `ignore` argument.

It could be a string or an array of strings you would like to skip when mapping. Like `node_modules` for example. They are compared with the entry's `name` property.

You could also use it as a predicate function. This function will get called for every entry in the target folder, recursively. Its argument is an entry map object (see above).

> Folders will not have the `entries` property at this point.

The predicate function should return a `boolean`. Return `true` to map the current entry or `false` to skip it.

```js
const path = 'path/to/my-project';

mapFolder(path, 'node_modules')
mapFolder(path, ['node_modules', 'my-passwords.txt'])

// exclude a sensitive folder
mapFolder(path, (entry) => {
    if (entry.type === FOLDER && entry.name === 'secrets') {
        return false;
    }
    return true;
});
```
