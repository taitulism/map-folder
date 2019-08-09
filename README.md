(A work in progress...)  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/mapFolder.svg?branch=develop)](https://travis-ci.org/taitulism/mapFolder)

mapFolder
=========
Asynchronously generate a JSON representation of a folder tree.

Installation
------------
```sh
$ npm install map-folder
```

Usage
-----
Example folder tree:
```
└─ my-project
   ├─ common
   │  └─ util.js
   └─ index.js
```

Create a folder map:
```js
const mapFolder = require('map-folder');

mapFolder('path/to/my-project').then((result) => {
    console.log(result);
});
```

Results:
```js
  /*
  │ FOLDER = 0
  │ FILE   = 1
*/
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

