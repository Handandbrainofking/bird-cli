const {
    prompt
} = require('inquirer')
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
        name: 'projectName',
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
        default: './'
    }
]

module.exports = prompt(question).then(({
    name,
    projectName,
    author,
    place
}) => {
    console.log(chalk.green(name))
    console.log(chalk.green(projectName))
    console.log(chalk.green(author))
    console.log(chalk.green(place))
    const spinner = ora('Downloading, please wait...')
    const repoUrl = tplList[name]['owner/name']
    const gitBranch = tplList[name]['branch']
    spinner.start()
    console.log('repo',repoUrl)
    download(`${repoUrl}#${gitBranch}`, `${place}/${projectName}`, (err) => {
        if(err) {
            console.log(chalk.red(err))
            process.exit()
        }
        fs.readFile(`./${place}/${projectName}/package.json`, 'utf8', function (err, data) {
            if(err) {
                spinner.stop()
                console.error(err)
                return
            }
            const packageJson = JSON.parse(data)
            packageJson.name = name
            packageJson.author = author
            var updatePackageJson = JSON.stringify(packageJson, null , 2)
            fs.writeFile(`./${place}/${projectName}/package.json`, updatePackageJson, 'utf-8', function(err) {
                if(err) {
                    spinner.stop()
                    console.error(`\n${err}`)
                    return
                } else {
                    spinner.stop()
                    console.log(chalk.green(`New Project has been initialized by ${name} successfully!`))
                    console.log(`
                        ${chalk.bgWhite.black('   Run Application  ')}
                        ${chalk.yellow(`cd ${projectName}`)}
                        ${chalk.yellow('npm install')}
                        ${chalk.yellow('npm start or npm run dev')}
                    `);
                }
            } )
        })
    })
}).catch((error) => {
    console.log(chalk.red(error))
})