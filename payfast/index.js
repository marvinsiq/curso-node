const app = require('./config/custom-express')();

app.listen(3000, function() {
    console.log("Servidor executando na porta 3000");
});