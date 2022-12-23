# JSMake
A nodejs library to help you construct the project using node.js(or typescript).

## Installation
Can't you use `npm install`? I don't want to each you again...  
Hey! Don't hit me. OKOK, I'll write a little about how to install this.  
First you need to create an node package in the directory where you want to build the project. Just `cd` to the directory and type:
```
npm init
```
And then, `npm` will tell you what information you need to input. Just like this. Easy peasy, huh? And then, type:
```
npm install @27onion/jsmake
```
OK, and that's all. Oops. I'm very tired now. If you have any question you can go to the Google or Stackoverflow to ask others! I don't want to teach you that how to use Google&Stackoverflow.

## Usage
Create a new javascript source file and write the following in to the file:
```javascript
const jsmake = require("@27onion/jsmake/jsmake");
```
after doing this, you can start to write the building codes. Thought JSMake also supports unmanaged build scripts, I still suggest you to use *Tasks* to make the build script more useful. Add a task just like this:
```javascript
jsmake.task('your_task_name_here', async () => {
    // Any valid javascript code goes here
})
```
You can add more tasks if you need. After creating all the tasks you need, add the following code at the end of the file.
```javascript
jsmake.build()
```
And then, do the following to start a task:
```bash
node /path/to/your_build_script <Task name goes here>
```
For more info, you can see the `_compile.js` in the package. This script is used to construct the JSMake itself.  
> The are two special kinds of tasks. The task with the name `pre before` will be always called by JSMake before the real task executes, and `pre after` will be called by JSMake after the build.

## Basic Methods

Here are some basic methods in JSMake:

```javascript
await jsmake.shell(`shell code here`)
```
This line of code calls the shell method of JSMake which allows you to execute a shell command. It also has an optional parameter `echo` which used to control if the command itself will be printed to the console.  
In JSMake, there are lots of environment variables stored in thd `jsmake.variables`. You can access them directly.

## C/C++ Build Supports
JSMake provides a bunch of methods to support C/C++ building. The compiler was specified by the environment variable `CC` and `CXX`, which defaults to `'gcc'` and `'g++'` respectively. The compiler options was stored in the environment variable `CC_FLAGS` and `CXX_FLAGS`, which defaults to an empty string.  
We can use the following code to compile C sources:
```javascript
await jsmake.buildC("source1.c", "source2.c", "source3.c")
```
You can put all the source files and configure the `CC_FLAGS` if you need. There's also a similar method called `buildCxx` which does the same thing as `buildC` but use another set of environment variables starts with `CXX_`.

## Files
We now support a few file operations.
```javascript
jsmake.rm("path/to/file")
```
This method can delete the file.
```javascript
jsmake.dir("path/to/dir", (path_of_each_file) => {})
```
This method can iterate all the files in the directory and call the callback function with these files' paths.
```javascript
jsmake.newer("path/to/file1","path/to/file2")
```
Returns `true` if `file1` is newer than `file2`.
> ### **Technologic Details**:   
> Compare by `mtime`.
```javascript
jsmake.exists("path/to/file")
```
Check if the file exists.

## File Selection & Including
In JSMake, **Include a File** means include the file into an environment variable `SOURCE_INCLUDED` and will never excluded due to compiling the file. On the other hand, **Select a File** means that the file won't be included into any environment variable; Oppositely, the selected file will be stored in a private array, and will soon be deleted from the array because of the compiling.  
We use `jsmake.selectSource(path_to_src)` to select an source and `jsmake.includeSource(path_to_src)` to include a source. And you can you use `await jsmake.compileAllSelectedAsC()` to compile all the selected source as C. Also the method `compileAllSelectedAsCxx` in the module `jsmake` do the same thing as `compileAllSelectedAsC` (and also needs `await` if you want to keep the order), but use the environment variables that starts with `CXX`. JSMake provides `includeAllSelected` and `selecteAllIncluded` to transform between the included files and selected files.  

## NPM Support
JSMake supports `npm` as well as C. You don't need to use the following form to use npm:
```javascript
await jsmake.shell(`npm op1 op2 op3 op4 ...`)
```
But use the following form.
```javascript
await jsmake.npm('op1', 'op2', 'op3', 'op4', '...')
```
And it's not all. JSMake also provides some method to support some common NPM operations. They are:
```javascript
await jsmake.nodePack.version('1.2.3')
await jsmake.nodePack.patch()
await jsmake.nodePack.publish()
await jsmake.nodePack.install('@27onion/jsmake')
```
These four methods is the equivalent of the following code:
```javascript
await jsmake.npm('version', '1.2.3')
await jsmake.npm('version', 'patch')
await jsmake.npm('publish')
await jsmake.npm('install', '@27onion/jsmake')
```

## Git support
JSMake also supports git as well.`jsmake.git.isGitted()` can test if the current directory has a file called `.git`. There are all the methods the JSMake supports:
```javascript
jsmake.git.isGitted() {...},
async jsmake.git.init() {...},
async jsmake.git.add(...paths) {...},
async jsmake.git.push() {...}
async jsmake.git.pushWithOptions(...options) {...},
async jsmake.git.branch(...options) {...},
async jsmake.git.remoteAddOrigin(originName, url) {...},
async jsmake.git.remoteAddOriginForBranch(branch, originName, url) {...},
async jsmake.git.invoke(...options) {...}
async jsmake.git.commit(cmt) { ... }
```

## Example
Here is an example the is from the build script of the JSMake. JSMake is just constructed using JSMake. So in the task `debug` we just need to test some JSMake commands. Here is the code:
```javascript
// JSMake, _compile.js
const jsmake = require("./jsmake");

jsmake.includeSource('_compile.js')
jsmake.includeSource('jsmake.js')
jsmake.includeSource('package.json')
jsmake.includeSource('README.md')

jsmake.task('publish', async () => {
    jsmake.variables.IGNORE_ERRORS = true
    await jsmake.nodePack.patch()
    await jsmake.buildTask('cleandbg')
    await jsmake.npm('publish')
})

jsmake.task('cleandbg', async () => {
    jsmake.dir('.', (path) => {
        if (!jsmake.isIncluded(path)) {
            jsmake.rm(path)
            console.log(`Cleared: ${path}`)
        }
    })
})

jsmake.task('debug', async () => {
    await jsmake.dir(".", (fn) => {
        console.log(`${fn} : ${jsmake.isIncluded(fn)}`)
    })
    console.log(jsmake.exists("jsmake.js"))
    console.log(jsmake.newer('jsmake.js', 'package.json'))
})

jsmake.build()
```

## Changes
> v1.0.9: Added `jsmake.d.ts` to provide more info about the types.  
> v1.0.10: OK... they're deleted by my build script...  
> v1.0.11: Recovered `jsmake.d.ts`. Oops.  
> v1.1.2: Nothing special. (Don't ask me where is v1.1.0 because my build script will increase the version automaticly and so that I don't know how to figure that =( ) 
> v1.1.3: Trying to fix that can't import the module.
> v1.1.4: Solved the problem issued in v1.1.3 by editing the `README.md`. =D  
> v1.1.5: Add a (rude) chapter in the `README.md`.
> v1.1.7: Add simple support for object files linking.
> v1.1.8: Add simple support for `rust` and `java` languages.
> v1.1.9: Changed how `shell` work. Added `commit` to the git support.
