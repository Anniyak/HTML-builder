//Текстовый файл создается по факту ввода текста

const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');

stdout.write('Приветствую вас!\n');
stdout.write('Введите текст для сохранения в файл:\n');
stdin.on('data', text => {
  if (text.toString() == 'exit\r\n') { process.exit(0); }
  fs.appendFile(
    path.join(__dirname, 'text.txt'),
    text,
    (err) => {
      if (err) throw err;
    }
  );
});

process.on('exit', code => {
  if (code === 0) {
    stdout.write('До новых встреч!');
  } else {
    stderr.write(`Произошла ошибка. Код ошибки ${code}`);
  }
});

process.on('SIGINT', () => {
  process.exit(0);
});

