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
mapFolder.toJson('path/to/target-folder', (err, result) => {
    if (err) {
        throw err;
    }

    console.log(result);
});
```


```js
/*
    Entry Types:
    ============
    0 = FOLDER  
    1 = FILE
*/
result = {
    path: 'path/to/target-folder',
    type: 0,
    mode: '0775',
    entries: {
        'utils': {
            path:'path/to/target-folder/utils',
            type: 0,
            mode: '0775',
            entries: {
                "helper.js": {
                    path:'path/to/target-folder/utils/helper.js',
                    type: 1,
                    mode: '0664'
                }
            }
        },
        'index.js': {
            path:'path/to/target-folder/index.js',
            type: 1,
            mode: '0664'
        }
    }
};
```

