(A work in progress...)  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/mapFolder.svg?branch=develop)](https://travis-ci.org/taitulism/mapFolder)

mapFolder
=========
Generates a JSON object that reflects a folder structure.

Installation and usage
----------------------
```sh
$ npm install --save map-folder
```

```js
const mapFolder = require('map-folder');
```

```
target-folder
├─ utils
│  └─ helper.js
└─ index.js
```


```js
mapFolder('path/to/target-folder', (err, result) => {
    if (err) {
        throw err;
    }

    console.log(result);
});
```

```js
const FOLDER = 0;
const FILE   = 1;

// Results:
{
    path: 'path/to/target-folder',
    type: FOLDER,
    entries: {
        'utils': {
            path:'path/to/target-folder/utils',
            type: FOLDER,
            entries: {
                "helper.js": {
                    path:'path/to/target-folder/utils/helper.js',
                    type: FILE,
                    name: 'helper',
                    ext: 'js',
                }
            }
        },
        'index.js': {
            path:'path/to/target-folder/index.js',
            type: FILE,
            name: 'index',
            ext: 'js',
        }
    }
};
```

