var fs = require('fs');

fs.readFile('../files/imagem.jpg', function (error, buffer) {
  console.log('arquivo lido');

  fs.writeFile('../files/imagemsalva-com-buffer.jpg', buffer, function (err) {
    console.log('arquivo escrito');
  });

});
