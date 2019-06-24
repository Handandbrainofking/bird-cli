const { prompt } = require('inquirer')
const { writeFile } = require('fs')
const { listTable } = require(`${__dirname}/../utils`)
const { resolve } = require('path')

const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')

let tplList = require(`${__dirname}/../templates`)
const question = [
    {
        type: 'input',
        name: 'fruit',
        message: 'please choose apple or banana?',
        default: 'banana',
        validate(val) {
            if(val !== '') {
                return true
            }
        }
    }
]

module.exports = prompt(question).then(({fruit}) => {
    console.log('fruit', chalk.red(fruit))

    const spinner = ora('Downloading……')
    spinner.start();
})