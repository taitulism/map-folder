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
    path: 'path/to/my-project',
    type: FOLDER,
    entries: {
        'common': {
            path:'path/to/my-project/common',
            type: FOLDER,
            entries: {
                "helper.js": {
                    path:'path/to/my-project/common/utils.js',
                    type: FILE,
                    name: 'helper',
                    ext: 'js',
                }
            }
        },
        'index.js': {
            path:'path/to/my-project/index.js',
            type: FILE,
            name: 'index',
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
* `path`: String - The absolute path to the entry.
* `type`: Number - A file or a folder (enum):
    * **FOLDER** - 0  
    Folders have another property:
        * `entries`: Object - An object of the folder's child entries (sub-folders and files). Object keys are the entries folder/file name.

    * **FILE** - 1  
    Files also have the following properties:
        * `name`: String - The file name without extension.
        * `ext`: String - The file extension without a dot.

You can use the exported `FILE` and `FOLDER` constants as types to check entry type:
```js
const {FILE, FOLDER} = require('map-folder');

if (result.entries.myApp.type === FOLDER) // ...
```
> There are other entry types, like symlinks, but currently out of this module's scope.

&nbsp;

## Ignore
---------
`String | String[] | () => boolean`

To exclude entries (files and folder) you can use the `ignore` argument.

It could be a string or an array of strings you would like to skip when mapping. Like `node_modules` for example.

You could also use it as a predicate function. This function will get called for every entry in the target folder, recursively. Its argument is an object and it should return a `boolean`.

The object argument will have the following properties (all are strings):
* dir
* root
* base
* name
* ext

> This object is the result of Node's `path.parse()` method. [See docs](https://nodejs.org/api/path.html#path_path_parse_path).

Return `true` to map the current entry or `false` to skip it.

```js
const path = 'path/to/my-project';

mapFolder(path, 'node_modules')
mapFolder(path, ['node_modules', 'my-passwords.txt'])

// exclude a sensitive folder
mapFolder(path, ({name}) => name !== 'secrets'))
```
