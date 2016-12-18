(A work in progress...)

structure [![Build Status](https://travis-ci.org/taitulism/structure.svg?branch=master)](https://travis-ci.org/taitulism/structure)
=========

* Create a full folder structure based on a JSON object or an array.
* Map an existing folder structure to a JSON/Array.
* Choose the result object's fields like: totalSize, chmod, fileExtension and more.
* async

Installation and usage
----------------------
```sh
$ npm install --save structure
```

```js
const structure = require('structure');
```

API
===
* [.toJson()](#toJsonpath,callback)
* .toArry()
* .fromJson()
* .fromArray()


.toJson(path, callback)
--------------------------
Generates a JSON object that reflects a folder structure.
The `callback` gets called with two arguments:  
`err` and `result`.

**Example:**

```
my-folder
├─ utils
│  └─ helper.js
└─ index.js
```


```js
structure.toJson('path/to/my-folder', (err, result) => {
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
    entries: {
        'utils': {
            path:'path/to/my-folder/utils',
            type: 0
            entries: {
                "helper.js": {
                    path:'path/to/my-folder/utils/helper.js',
                    type: 1
                }
            }
        },
        'index.js': {
            path:'path/to/my-folder/index.js',
            type: 1
        }
    }
};
```

