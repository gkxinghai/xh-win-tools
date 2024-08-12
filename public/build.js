const path =require("path") ;
const fsPromise = require("node:fs/promises");
const fs = require("fs");
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

(async function (){
    /*修改package.json*/
    const cmdConfig=process.argv.splice(2)[0]
    const url = path.join(process.cwd(), 'package.json')
    const json = fs.readFileSync(url, 'utf-8')
    let pkg = JSON.parse(json)
    if(cmdConfig=='dev'){
        // pkg.main='./electron/main/main.js'
        pkg.main='./electron/main/main.js'
        pkg.build.nsis.include= "./public/electron/installer.nsh"
    }else{
        pkg.main='./dist/assets/progress.js'
        pkg.build.nsis.include= "./dist/electron/installer.nsh"

    }
    const pkgStr=JSON.stringify(pkg, null, 2)
    const writePromise=fsPromise.writeFile(url,pkgStr)
    await writePromise

    /*运行rollup*/
    if(cmdConfig=='build'){
        const { stdout, stderr } = await exec(`rollup --config rollup.config.main.js`);
        const { stdoutPreload, stderrPreload } = await exec('rollup --config rollup.config.preload.js');
        console.log('stdout:', stdout);
        console.log('stdoutPreload:', stdoutPreload);
        console.error('stderr:', stderr);
    }

})()
