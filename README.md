[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/mapFolder.svg?branch=develop)](https://travis-ci.org/taitulism/mapFolder)

mapFolder
=========
Create a JSON representation of a folder structure tree.

Installation
------------
```sh
$ npm install map-folder
```

Usage
-----
Map a folder:
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
   │  └─ util.js
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
                    path:'path/to/my-project/common/util.js',
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
`mapFolder(path)`  
### Arguments:
* **path** - String - The path to the folder you'd like to map.

### Return:
A promise that resolves with the result object. 

Every entry in the result (including the result itself) holds the following properties:  
* `path`: String - The absolute path to the entry.
* `type`: Number - A file or a folder (enum).

You can use the exported `FILE` and `FOLDER` constants as types to check entry type:
```js
const {FILE, FOLDER} = require('map-folder');

if (result.entries.myApp.type === FOLDER) // ...
```
> There are other entry types, like symlinks, but currently out of this module's scope.

**FOLDER** - 0  
Folders have another property: `entries`, which is an object of the folder's child entries (sub-folders and files). Object keys are the entries folder/file name.

**FILE** - 1  
Files have two other properties: `name` and `ext`. Self explanatory.




