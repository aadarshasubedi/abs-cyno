const replaceNgServe = require('./bin/replace-ngserve');
const replaceNgBuild = require('./bin/replace-ngbuild');
const replacePackage = require('./bin/replace-package');
const replaceNgCli = require('./bin/replace-cli');
const replaceSrcTsConfigApp = require('./bin/replace-src-tsconfigapp');
//run
replaceNgServe();
replaceNgBuild();
replacePackage();
replaceNgCli();
replaceSrcTsConfigApp();