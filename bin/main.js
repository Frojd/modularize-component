#!/usr/bin/env node

const yargs = require("yargs");
const fs = require("fs");
const path = require("path");
const readline = require('readline');


const options = yargs
 .usage("Usage: --component <path>")
 .option("c", { alias: "component", describe: "Path to component directory", type: "string", demandOption: true })
 .argv;

console.log(`Scanning ${options.component}`);
const componentDir = options.component
const fileNames = fs.readdirSync(componentDir)


let cssFile = null;
let jsFile = null;
let componentName = null;
fileNames.forEach(function(file) {
    const isCss = file.match(/css$/)
    const isJs = file.match(/\.js$/)
    if (isCss) {
        cssFile = file;
        console.log("Found CSS file: " + cssFile)
    } else if (isJs) {
        const match = file.match(/^([A-Za-z]+)\.js$/)
        if (match && match[1] !== 'index') {
            jsFile = file
            componentName = match[1]
            console.log("Found JS file: " + jsFile)
            console.log("Assuming component name: " + componentName)
        }
    }
})

if (!(cssFile && jsFile && componentName)) {
    console.error("Missing cssfile, jsfile or component name")
    process.exit(1)
}

maybeRenameCssFile();
updateJSFile();
console.log("Done!")


function maybeRenameCssFile() {
    if (cssFile.match('\.module\.')){
        return;
    }
    const cssFileSplit = cssFile.split('.')
    const cssExtension = cssFileSplit.pop()
    cssFileSplit.push('module')
    cssFileSplit.push(cssExtension)
    const newFileName = cssFileSplit.join('.')

    const originalPath = path.join(componentDir, cssFile);
    const newPath = path.join(componentDir, newFileName);

    console.log(`Moving "${originalPath}" to "${newPath}"`);
    fs.rename(originalPath, newPath, (err) => {
        if (err) {
            console.error("Could not move css file: " + err)
            process.exit(1)
        }
        cssFile =  newFileName
    })
}

function updateJSFile() {
    const originalPath = path.join(componentDir, jsFile);
    const tmpPath = path.join(componentDir, jsFile + '.tmp');

    const readStream = readline.createInterface({
        input: fs.createReadStream(originalPath),
    });

    const writeStream = fs.createWriteStream(tmpPath);

    readStream.on('line', (line) => {
        line = maybeChangeImport(line)
        line = maybeChangeJsx(line)
        writeStream.write(line + '\n')
    });

    readStream.on('close', () => {
        writeStream.end()
        fs.unlinkSync(originalPath)
        fs.renameSync(tmpPath, originalPath)
        console.log('Done!')
    })

}

function maybeChangeImport(line) {
    const match = line.match(RegExp("import.+" + componentName + '.+(css|sass|scss)'))
    if (match) {
        return `import styles from './${cssFile}'`
    } else {
        return line
    }
}

function maybeChangeJsx(line) {
    const re = RegExp("([\"']" + componentName + "[^\"']*?[\"'])([\\s:]*)", 'g')
    const componentStringMatch = line.match(re);
    if (!componentStringMatch) {
        return line
    }

    componentStringMatch.map(match => {
        match = match.trim()
        const isObjectKey = match[match.length -1] === ':';
        if (isObjectKey) {
            match = match.substr(0, match.length - 1)
        }
        const componentString = match.trim()

        const needBrackets = !!line.match(RegExp("=+" + componentString))

        let replacement = componentString.split(' ').map((string) => `styles[${string}]`).join(' + " " + ')

        if (isObjectKey) {
            replacement = `[${replacement}]`
        } else if (needBrackets){
            replacement = `{${replacement}}`
        }

        line = line.replace(match, replacement)
    });

    return line
}
