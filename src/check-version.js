/**
 * Created by pomy on 18/01/2017.
 * check the cli version
 */

'use strict';

let semver = require('semver');
let chalk = require('chalk');
let axios = require('axios');
let ora = require('ora');

let pkg = require('../package.json');
let log = require('./log');

log.tips();

module.exports = function (done) {

    let spinner = ora({
        text: "checking waka cli version...",
        color:"blue"
    }).start();

    if (!semver.satisfies(process.version, pkg.engines.node)) {
        spinner.text = chalk.white('waka cli:checking waka cli version failed, error message as follows:');
        spinner.fail();

        log.tips();
        log.error(`  You must upgrade node to ${pkg.engines.node} to use waka cli`);
    }

    axios({
        url: 'http://r.npm.sankuai.com/@mx/waka',
        method: 'get',
        timeout: 10000
    }).then((res) => {
        if(res.status === 200){
            spinner.text = chalk.green('Checking waka cli version success.');
            spinner.succeed();

            let local = pkg.version;
            let latest = res.data['dist-tags'].latest;

            if (semver.lt(local, latest)) {
                log.tips();
                log.tips(chalk.blue('  A newer version of waka cli is available.'));
                log.tips();
                log.tips(`  latest:    ${chalk.green(latest)}`);
                log.tips(`  installed:    ${chalk.red(local)}`)
                log.tips(`  update waka latest: npm update -g waka`);
                log.tips();
            }
            done();
        }
    }).catch((err) => {
        if(err){
            let res = err.response;

            spinner.text = chalk.white('waka cli:checking waka cli version failed, error message as follows:');
            spinner.fail();

            log.tips();

            if(res){
                log.error(`     ${res.statusText}: ${res.headers.status}`);
            } else {
                log.error(`     ${err.message}`);
            }
        }
    });
};