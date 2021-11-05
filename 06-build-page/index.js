const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');


buildPage();
async function buildPage() {
  createDirectory(projectDist).then(() => {
    pasteComponents();
    mergeStyles();
    createDirectory(path.join(projectDist, 'assets'))
      .then(() => copyDirectory(assetsPath, path.join(projectDist, 'assets')));
  });

}
async function createDirectory(dir) {
  return fs.promises.mkdir(dir, { recursive: true }, (err) => {
    if (err) throw new Error('Невозможно создать папку');
  });
}

async function pasteComponents() {
  const templateStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const indexStream = fs.createWriteStream(path.join(projectDist, 'index.html'));
  let str = '';
  templateStream.on('data', data => {
    str = data.toString();
    fs.promises.readdir(componentsPath, { withFileTypes: true }).then(data => {
      let requests = [];
      let names = [];
      data.forEach(file => {
        const dotInd = file.name.lastIndexOf('.');
        const name = file.name.substring(0, dotInd != -1 ? dotInd : file.name.length);
        requests.push(fs.promises.readFile(path.join(componentsPath, file.name), 'utf-8'));
        names.push('{{' + name + '}}');
      });

      Promise.all(requests).then(result => {
        for (let i = 0; i < result.length; i++) {
          str = str.replaceAll(names[i], result[i]);
        }
        indexStream.write(str);
      })
    });

  });
}


async function mergeStyles() {
  let chunks = [];
  const cssFiles = await getFiles();
  cssFiles.forEach(file => {
    chunks.push(getFileContent(file));
  });
  writeFile(chunks);
}

async function getFiles() {
  let result = await fs.promises.readdir(stylesPath);
  return result.filter(file => (path.extname(file).toLowerCase() === '.css'));
}

async function getFileContent(file) {
  let data = '';
  return new Promise((resolve, reject) => {
    let readStr = fs.createReadStream(path.resolve(stylesPath, file));
    readStr.addListener('data', (styles) => data += styles);
    readStr.addListener('end', (err) => { if (err) console.log(err); resolve(data) })
  });
}

async function writeFile(chunks) {
  const pathStyleBundle = path.join(projectDist, 'style.css');
  let wStream = fs.createWriteStream(pathStyleBundle);
  chunks.forEach(async cs => await cs.then((data) => {
    wStream.write(data);
  }));
}


async function copyDirectory(current, dest) {
  await fs.promises
    .readdir(current, { withFileTypes: true })
    .then(files => {
      files.forEach(async (file) => {
        if (file.isDirectory()) {
          const currentPath = path.join(current, file.name);
          const destPath = path.join(dest, file.name);
          copyDirectory(currentPath, destPath);
        }
        else {
          fs.mkdir(dest, {
            recursive: true,
          }, err => { if (err) console.log('Ошибка создания папки: ' + dest); });
          fs.promises.copyFile(path.join(current, file.name), path.join(dest, file.name));
        }
      });
    });
}