#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const package = require('./package.json');
const packageExt = require('./package.ext.json');
const _filename = 'package.json';

function replacePackage(){
    console.info('开始构建package.json扩展配置....');
    for (let er in packageExt.dependencies){
        package.dependencies[er] = packageExt.dependencies[er];
    }

    for (let er in packageExt.devDependencies){
        package.devDependencies[er] = packageExt.devDependencies[er];
    }
    const _r = __dirname.split(path.sep).slice(0, -2).join(path.sep) + path.sep;
    const _p = path.join(_r, _filename);

    if  (fs.existsSync(_p)){
        fs.unlinkSync(_p);
    }

    let data = JSON.stringify(package);
    fs.writeFileSync(_p, data);
    console.info('构建完成....');
}

module.exports = replacePackage;