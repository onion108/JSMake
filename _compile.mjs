#!/usr/bin/env node

import jsmake from "./jsmake.js";

jsmake.includeSource('_compile.mjs')
jsmake.includeSource('jsmake.js')
jsmake.includeSource('package.json')
jsmake.includeSource('README.md')
jsmake.includeSource('jsmake.d.ts')
jsmake.includeSource('index.js')
jsmake.includeSource('tsconfig.json')
jsmake.includeSource('.hintrc')

jsmake.task('publish', async () => {
    await jsmake.buildTask('cleandbg')
    if (jsmake.newer('jsmake.js', 'jsmake.d.ts')) {
        await jsmake.buildTask('gendecl')
    }
    await jsmake.buildTask('push-git-for-release')
    await jsmake.nodePack.patch()
    await jsmake.nodePack.publish()
})

jsmake.task('cleandbg', async () => {
    jsmake.dir('.', (path) => {
        if (!jsmake.isIncluded(path) && !path.startsWith('.')) {
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
    console.log(jsmake.git.isGitted())
    await jsmake.shell("echo hello,world");
    await jsmake.shellRaw(["echo", "hello, world !!!"])
    await jsmake.shell("lsd -l")
    await jsmake.shell("echo \"Hello,    World!\"")
})

jsmake.task('gendecl', async () => {
    await jsmake.npm('run', 'gen_decl')
})

jsmake.task('push-git-for-release', async () => {
    if (!jsmake.git.isGitted()) {
        await jsmake.buildTask('enable-git')
    }
    await jsmake.git.add('.')
    await jsmake.git.commit('[chore] ready for release')
    await jsmake.git.push()
});

jsmake.task('enable-git', async () => {
    await jsmake.git.init()
})

jsmake.build()
