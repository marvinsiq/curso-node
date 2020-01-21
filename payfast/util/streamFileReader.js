var fs = require('fs');

fs.createReadStream('../imagem.jpg')
  .pipe(fs.createWriteStream('../files/imagemsalva-com--stream.jpg'))
  .on('finish', function () {
    console.log('arquivo escrito com stream');
  });
