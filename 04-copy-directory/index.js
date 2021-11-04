
const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');
const pathFiles = path.join(__dirname, 'files');
const pathFilesCopy = path.join(__dirname, 'files-copy');
async function copyDir() {
  try {
    await fs.promises.rm(pathFilesCopy, { force: true, recursive: true });
    await fs.promises.mkdir(pathFilesCopy);
    await fs.readdir(pathFiles,
      { withFileTypes: true },
      (err, files) => {
        if (err)
          console.log(err);
        else {

          files.forEach(file => {
            if (file.isFile()) {
              fs.copyFile(path.join(pathFiles, file.name), path.join(pathFilesCopy, file.name), (err) => {
                if (err)
                  console.log(err);
              })
            }
          }
          )
        }
      });

  } catch (err) {
    console.error(err);
  }

}
copyDir();

async function readDir() {
  try {
    await fs.readdir(pathSecret,
      { withFileTypes: true },
      (err, files) => {
        if (err)
          console.log(err);
        else {
          console.log("\nCurrent directory files:");
          files.forEach(file => {
            if (file.isFile()) {
              fs.stat(path.join(pathSecret, file.name), (errS, stats) => {
                if (errS) console.log(errS);

                let fileSizeInBytes = stats.size;
                let fileSizeInKb = Math.round(fileSizeInBytes / (1024));
                let dotInd = file.name.lastIndexOf('.');
                let name = file.name.substring(0, dotInd != -1 ? dotInd : file.name.length);
                let extention = file.name.substring(dotInd != -1 ? dotInd + 1 : file.name.length);
                console.log(name + ' - ' + extention + ' - ' + fileSizeInKb + 'Kb');

              });

            }
          }
          )
        }
      });

  } catch (err) {
    console.error(err);
  }
}
