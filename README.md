(A work in progress...)

mapFolder [![Build Status](https://travis-ci.org/taitulism/structure.svg?branch=master)](https://travis-ci.org/taitulism/structure)
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
my-folder
├─ utils
│  └─ helper.js
└─ index.js
```


```js
mapFolder.toJson('path/to/my-folder', (err, result) => {
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
    path: 'path/to/my-folder',
    type: 0,
    mode: '0775',
    entries: {
        'utils': {
            path:'path/to/my-folder/utils',
            type: 0,
            mode: '0775',
            entries: {
                "helper.js": {
                    path:'path/to/my-folder/utils/helper.js',
                    type: 1,
                    mode: '0664'
                }
            }
        },
        'index.js': {
            path:'path/to/my-folder/index.js',
            type: 1,
            mode: '0664'
        }
    }
};
```

