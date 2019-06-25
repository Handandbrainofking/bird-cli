const {
    prompt
} = require('inquirer')
const program = require('commander')

const fs = require('fs')
const {
    listTable
} = require(`${__dirname}/../utils`)
const {
    resolve
} = require('path')

const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')

const option = program.parse(process.argv).args[0]
// console.log(chalk.yellow(program.parse(process.argv).args))
const defaultName = typeof option === 'string' ? option : 'weex-demo-project'
let tplList = require(`${__dirname}/../templates`)
let defaultList = require(`${__dirname}/../default`)
const question = [{
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: defaultName,
        filter(val) {
            return val.trim()
        },
        validate(val) {
            const validate = (val.trim().split(' ')).length === 1
            return validate || 'Project name is not allowed to have space '
        },
        transformer(val) {
            return val
        }
    },
    {
        type: 'list',
        name: 'template',
        message: 'Project choice?',
        choices: defaultList,
        default: defaultList[0],
        validate(val) {
            return true
        },
        transformer(val) {
            return val
        }
    },
    {
        type: 'input',
        name: 'version',
        message: 'version:',
        default: '0.0.1',
        validate(val) {
            if (val !== '') {
                return true
            }
        }
    },
    {
        type: 'input',
        name: 'description',
        message: 'description:',
        default: 'A weex project with dolphin weex ui'
    },
    {
        type: 'input',
        name: 'author',
        message: 'author:'
    }
]

module.exports = prompt(question).then(({
    name,
    template,
    version,
    description,
    author,
    repository
}) => {
    console.log('name', chalk.magenta(name))
    console.log('template', chalk.cyan(template))
    console.log('version', chalk.blue(version))
    console.log('description', chalk.red(description))
    console.log('author', chalk.red(author))
    const projectName = name;
    const repoUrl = template
    const branch = 'master'

    const spinner = ora('Downloading, please wait……')
    spinner.start();
    download(`${repoUrl}#${branch}`, `./${projectName}`, (err) => {
        if (err) {
            console.log(chalk.red(err))
            process.exit()
        }
        spinner.stop()
        fs.readFile(`./${projectName}/package.json`, 'utf8', function (err, data) {
            if (err) {
                spinner.stop();
                console.error(err);
                return;
            }
            const packageJson = JSON.parse(data);
            packageJson.name = name;
            packageJson.description = description;
            packageJson.author = author;
            var updatePackageJson = JSON.stringify(packageJson, null, 2);
            fs.writeFile(`./${projectName}/package.json`, updatePackageJson, 'utf8', function (err) {
                if (err) {
                    spinner.stop();
                    console.error(err);
                    return;
                } else {
                    spinner.stop();
                    console.log(chalk.green('New project has been initialized successfully!'))
                    console.log(`
                        ${chalk.bgWhite.black('   Run Application  ')}
                        ${chalk.yellow(`cd ${name}`)}
                        ${chalk.yellow('npm install')}
                        ${chalk.yellow('npm start')}
                    `);
                }
            });
        });
    })
})