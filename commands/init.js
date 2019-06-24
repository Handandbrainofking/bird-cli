const {
    prompt
} = require('inquirer')
const {
    writeFile
} = require('fs')
const {
    listTable
} = require(`${__dirname}/../utils`)
const {
    resolve
} = require('path')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')

let tplList = require(`${__dirname}/../templates`)

const question = [{
        type: 'input',
        name: 'name',
        message: 'please input template name',
        validate(val) {
            if (tplList[val]) {
                return true
            } else if (val === '') {
                return 'Name is required!'
            } else if (!tplList[val]) {
                return 'This is template doesn\'t exists .'
            }
        }
    },
    {
        type: 'input',
        name: 'project',
        message: 'Project name:',
        validate(val) {
            if (val !== '') {
                return true
            }
            return 'Project name is required!'
        }
    },
    {
        type: 'input',
        name: 'author',
        message: 'please input the author:'
    },
    {
        type: 'input',
        name: 'place',
        message: 'Where to init the project:',
        default: './news'
    }
]

module.exports = prompt(question).then(({
    name,
    project,
    author,
    place
}) => {
    const spinner = ora('Downloading template...')
    const repoUrl = 'SBoudrias/Inquirer.js'
    const branch = 'master'
    spinner.start()
    download(`${repoUrl}#${branch}`, `${place}/${project}`, (err) => {
        if(err) {
            console.log(chalk.red(err))
            process.exit()
        }
        spinner.stop()
        console.log(chalk.green('New project has been initialized successfully!'))
    })
}).catch((error) => {
    console.log(chalk.red(error))
})