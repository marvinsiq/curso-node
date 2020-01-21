
module.exports = function(app) {

    app.get('/pagamentos', function(req, res) {
        res.json({
            
        });
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        let pagamento = req.body;
        
        pagamento.status = "CRIADO";
        pagamento.data = new Date();

        console.log(pagamento);
        res.json(pagamento);
    });

}