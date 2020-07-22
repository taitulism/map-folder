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
```js
const {mapFolder, mapFolderSync} = require('map-folder');

// async
mapFolder('path/to/my-project', options).then((result) => {...});

// sync
const result = mapFolderSync('path/to/my-project', options);
```

Result
-----
Example folder structure:
```
└─ my-project
   ├─ common
   │  └─ utils.js
   └─ index.js
```

Results:
```js
{
    path: 'path/to/my-project',
    type: FOLDER,
    name: 'my-project',
    entries: {
        'common': {
            path:'path/to/my-project/common',
            name: 'common',
            type: FOLDER,
            entries: {
                "utils.js": {
                    path:'path/to/my-project/common/utils.js',
                    type: FILE,
                    name: 'utils.js',
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
## `mapFolder(path, options)`
### Arguments:
* **path** - A path to an existing folder.
* **options** - Exclude/Include items. Read more below.

### Return:
A JSON object (or a promise for JSON) that represents the target folder structure.

## Options
| Option      | Type                   | Description                                                |
|-------------|------------------------|------------------------------------------------------------|
| `exclude`   | Array\<String\>        | file & folder names and extensions to skip.                |
| `include`   | Array\<String/Object\> | file & folder names and extensions to map only.            |
| `skipEmpty` | boolean                | when using `include` empty folders are skipped by default. |
| `filter`    | (entryMap) => boolean  | decide if an entry should be mapped or not.                |

In case you only want `exclude` or `filter` you can pass it as the second argument instead of `options`:
```js
mapFolder(path, exclude)
mapFolder(path, filter)
```

&nbsp;

---------------------------------------------------------------------------------------------------
### `include` & `exclude`
By default all entries (file & folders) are mapped recursively. Use the `exclude` option to skip/ignore certain entries. Using the `include` option means *only* map the given items.


Both are array of strings, which are the entry names or file extensions you want to map. File extensions should start with a dot (e.g. `'.log'`).  
`include` also accept objects, see below.

Both are compared to the entry full name and/or extension by lower-cased comparison, meaning an `'abc'` item will also match `'ABC'` entry names.

When used together, excluded items will be substract from the included entries (include comes first). The only exception is when you include a folder, then it will be mapped completely, with no exclusions.


### `exclude`
Use the `exclude` option to skip/ignore certain entries.

```js
// map everything but "node_modules"
mapFolder('./my-project', {
    exclude: 'node_modules'
})

// map everything but "node_modules" and log files
mapFolder('./my-project', {
    exclude: ['node_modules', '.log']
})
```

If you only need the `exclude` option you can pass it as the second argument:
```js
mapFolder('./my-project', ['node_modules', '.log'])
```


### `include`
Use the `include` option when you only want to map certain entries in the target folder.

```js
// only map js files & the package.json file
mapFolder('./my-project', {
    include: ['.js', 'package.json']
})
```

>When including a folder name, the whole folder will be mapped, regardless of other options, including all entries in that folder.

If you want a sub-folder to be mapped with its own rules you can pass in an object. This object is an `options` object but should also have the folder name (`name` property).

```js
// map all .js files in the target folder and 
// all .svg files in "icons" sub-folder
mapFolder('./my-project', {
    include: ['.js', {
        name: 'icons',
        include: ['.svg']
    }]
})
```

### `skipEmpty`
Empty folders are mapped by default but when using the `include` option empty folders are skipped by default. Change this behavior by setting `skipEmpty` with a boolean.
```js
mapFolder('./my-project', {
    include: ['.js', '.json'],
    skipEmpty: false
})
```

### `filter`
If you need more control over which entries to map and which should be skipped you can pass a function to the `filter` option. This function gets called for every entry that was not handled by your `include`/`exclude` options. It gets called with an `entryMap` object (see below).

Return `true` to map the entry or `false` to skip it.
```js
// map all folders and files that starts with an "a"
mapFolder('./my-project', {
    filter: ({type, base}) => type === FOLDER || base.startsWith('a')
})
```

If you only need the `filter` option you can pass it as the second argument:
```js
mapFolder('./my-project', (entryMap) => boolean)
```


## Entry Map Object
Every entry in the result (including the result itself) holds the following properties:  
<!-- * `name`: `String` - The whole entry name. Includes file extensions.
* `path`: `String` - the absolute path to the entry.
* `type`: `Number` - a file or a folder enum. -->

| Prop name | Type   | Description                                     |
|-----------|--------|-------------------------------------------------|
| `name`    | String | The whole entry name. Includes file extensions. |
| `path`    | String | the absolute path to the entry.                 |
| `type`    | Number | a file or a folder enum.                        |


Each type has its own additional properties:
* **FOLDER** - 0
    <!-- * `entries`: Object - An object of the folder's child `entryMap`s (sub-folders and files). -->

    | Prop name | Type   | Description                                                              |
    |-----------|--------|--------------------------------------------------------------------------|
    | `entries` | Object | A JSON object of the folder's child `entryMap`s (sub-folders and files). |

* **FILE** - 1
    <!-- * `base`: String - The file name without the extension.
    * `ext`: String - The file extension without a dot. -->

    
    | Prop name | Type   | Description                          |
    |-----------|--------|--------------------------------------|
    | `base`    | String | The file name without the extension. |
    | `ext`     | String | The file extension without a dot.    |

You can use the exported `FILE` and `FOLDER` constants as types to check entry type:
```js
const {FILE, FOLDER} = require('map-folder');

if (result.entries.myApp.type === FOLDER) {
    // ...
}
```
> There are other entry types like symlinks, currently out of this module's scope.
