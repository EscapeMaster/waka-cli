/**
 * Created by pomy on 10/01/2017.
 * 检验模板名是否存在，避免使用不存在的模板名时长时间的下载等待
 */

'use strict';

let axios = require('axios');
let ora = require('ora');
let chalk = require('chalk');

let log = require('../src/log');

module.exports = function (template,officialTemplate,done){
    log.tips();

    template = template.indexOf('/') === -1 ? template : template.split('/')[0];

    let spinner = ora({
        text: "checking template...",
        color:"blue"
    }).start();

    axios({
        url: 'https://api.github.com/users/waka-templates/repos',
        headers: {
            'User-Agent': 'waka-cli'
        }
    }).then((res) => {
        if (Array.isArray(res.data)) {
            let reposName = [];

            res.data.forEach(function (repo) {
                reposName.push(repo.name);
            });

            if(reposName.indexOf(template) > -1){
                spinner.text = chalk.green('Template checked success.');
                spinner.succeed();

                log.tips();
                done(officialTemplate);
            } else {
                spinner.stop();
                log.tips(`Failed to download template ${chalk.red(template)}: ${chalk.red(template)} doesn\'t exist.`);
                log.tips();
                log.tips(`Please check all available official templates by ${chalk.blue('waka list')} in terminal.`);
            }
        } else {
            spinner.text = chalk.white('waka cli:checking template failed, error message as follows:');
            spinner.fail();

            log.tips();
            log.error(`     ${res.statusText}: ${res.data.message}`);
        }
    }).catch((err) => {
        let res = err.response;
        if(err){
            spinner.text = chalk.white('waka cli:checking official template failed, error message as follows:');
            spinner.fail();
            log.tips();
            log.error(`     ${res.statusText}: ${res.data.message}`);
        }
    });
};