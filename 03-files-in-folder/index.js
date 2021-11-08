
const path = require('path');
const fs = require('fs');
const pathSecret = path.join(__dirname, 'secret-folder')
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
                console.log(name + ' - ' + extention + ' - ' + fileSizeInKb + 'Kb (' + fileSizeInBytes + ' bytes)');

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
readDir();