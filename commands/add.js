const {
    prompt
} = require('inquirer')
const {
    writeFile,
    writeFileSync
} = require('fs')
const {
    listTable
} = require(`${__dirname}/../utils`)

let tplList = require(`${__dirname}/../templates`)

const question = [{
        type: 'input',
        name: 'name',
        message: 'Set the custom name of the template:',
        validate(val) {
            if (tplList[val]) {
                return 'Template is exited! please change and try again .'
            } else if (val === '') {
                return 'Name is required!'
            } else {
                return true
            }
        }
    },
    {
        type: 'input',
        name: 'address',
        message: 'Owner/name of the template:',
        validate(val) {
            if (val !== '') {
                return true
            }
            return 'Link is required!'
        }
    },
    {
        type: 'input',
        name: 'branch',
        message: 'Branch of the template:',
        default: 'master'
    }
]

module.exports = prompt(question).then(({
    name,
    address,
    branch
}) => {
    console.log(`name:  ${name} address:  ${address}  branch: ${branch}`)
    tplList[name] = {}
    tplList[name]['owner/name'] = address
    tplList[name]['branch'] = branch

    writeFileSync(`${__dirname}/../templates.json`, JSON.stringify(tplList), 'utf-8', (err) => {
        if (err) {
            console.log(err)
        }
        listTable(tplList, 'New template has been added successfully!')
    })
})