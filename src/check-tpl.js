/**
 * Created by pomy on 10/01/2017.
 * 检验模板名是否存在，避免使用不存在的模板名时长时间的下载等待
 */

'use strict';

let axios = require('axios');
let ora = require('ora');
let chalk = require('chalk');

let log = require('./log');
let utils = require('../src/utils');

const REQUEST_URL = 'https://api.github.com/orgs/waka-templates/repos';

module.exports = function (template,officialTemplate,done){
    log.tips();

    template = template.indexOf('/') === -1 ? template : template.split('/')[0];

    let spinner = ora({
        text: "checking official template...",
        color:"blue"
    }).start();

    axios(utils.getAuthInfo(REQUEST_URL)).then((res) => {
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
        if(err){
            let res = err.response;

            spinner.text = chalk.white('waka cli:checking official template failed, error message as follows:');
            spinner.fail();
            log.tips();

            if(res.status === 403){
                //api rate limit:https://developer.github.com/v3/#rate-limiting
                log.tips(chalk.red(`     ${res.statusText}: ${res.data.message}\n\ndocumentation: ${res.data.documentation_url}`));
                log.tips();
                log.tips(`     Please set auth token to get a higher rate limit by ${chalk.blue('waka token')}. Check out the documentation for more details.`);
                log.tips();
                log.tips('     documentation: https://developer.github.com/v3/auth/#basic-authentication');
            } else {
                log.error(`     ${res.statusText}: ${res.data.message}`);
            }
        }
    });
};