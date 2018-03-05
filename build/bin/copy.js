const fs = require('fs');
const path = require('path');
const _filename = 'serve.js';

function copy(srcFile, desFile){
    if (fs.existsSync(desFile)){
        //删除文件
        fs.unlinkSync(desFile);
    }
    if (fs.existsSync(srcFile)){
        fs.readFile(srcFile, (error, data) => {
            fs.writeFileSync(desFile, data);
        })
    }
}

module.exports = copy;