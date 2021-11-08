
const path = require('path');
const fs = require('fs');
const pathFiles = path.join(__dirname, 'files');
const pathFilesCopy = path.join(__dirname, 'files-copy');
async function copyDir() {
  try {
    await fs.promises.rm(pathFilesCopy, { force: true, recursive: true });
    await fs.promises.mkdir(pathFilesCopy);
    fs.readdir(pathFiles,
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
              });
            }
          }
          );
        }
      });

  } catch (err) {
    console.error(err);
  }

}
copyDir();


