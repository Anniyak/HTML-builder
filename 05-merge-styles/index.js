
const path = require('path');
const fs = require('fs');
const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');
let chunks = [];


async function mergeStyles() {
  const cssFiles = await getFiles();
  cssFiles.forEach(file => {
    chunks.push(getFileContent(file));
  });
  writeFile();
}

async function getFiles() {
  let result = await fs.promises.readdir(pathStyles);
  return result.filter(file => (path.extname(file).toLowerCase() === '.css'));
}

async function getFileContent(file) {
  let data = '';
  return new Promise((resolve, reject) => {
    let readStr = fs.createReadStream(path.resolve(pathStyles, file));
    readStr.addListener('data', (styles) => data += styles);
    readStr.addListener('end', (err) => { if (err) console.log(err); resolve(data) })
  });
}

async function writeFile() {
  let wStream = fs.createWriteStream(pathBundle);
  chunks.forEach(async cs => await cs.then((data) => {
    wStream.write(data);
  }));
}


mergeStyles();
