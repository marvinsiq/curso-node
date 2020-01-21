var logger = require('../servicos/logger.js');

module.exports = function (app) {

  // Consulta
  app.get('/pagamentos/pagamento/:id', function (req, res) {

    var id = req.params.id;

    logger.info(`Consultando pagamento: ${id}`);

    // Consultando no cache primeiro com o memcached
    var memcachedClient = app.servicos.memcachedClient();
    let pagamentoCacheKey = `pagamento-${id}`;
    memcachedClient.get(pagamentoCacheKey, function (erro, retorno) {

      if (erro) {
        res.status(500).json({
          "erro": erro
        });
        return;
      }

      // Não encontrou no cache
      else if (!retorno) {
        console.log('MISS - Chave nao encontrada: ${pagamentoCacheKey}!');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.buscaPorId(id, function (erro, resultado) {

          if (erro) {
            console.log(`Erro ao consultar no banco: ${erro}`);
            res.status(500).send(erro);
            return;

          } else {
            console.log(`Pagamento encontrado: ${JSON.stringify(resultado)}`);

            // Adiciona no cache
            addCache(app, pagamentoCacheKey, JSON.stringify(resultado));

            res.json(resultado);
            return;
          }
        });

        // Encontrou no cache
      } else {
        console.log('HIT - Valor: ' + JSON.stringify(retorno));
        res.json(retorno);
        return;
      }
    });

  });

  // Cancelamento
  app.delete('/pagamentos/pagamento/:id', function (req, res) {
    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CANCELADO';

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function (erro) {
      if (erro) {
        res.status(500).send(erro);
        return;
      }

      // Atualiza no cache
      pagamentoDao.buscaPorId(id, function (erro, resultado) {
        if (!erro) {
          addCache(app, `pagamento-${pagamento.id}`, resultado);
        }
      });

      console.log('pagamento cancelado');
      res.status(204).send(pagamento);
    });
  });

  // Confirmação
  app.put('/pagamentos/pagamento/:id', function (req, res) {

    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CONFIRMADO';

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function (erro) {
      if (erro) {
        res.status(500).send(erro);
        return;
      }
      console.log('pagamento confirmado');

      // Atualiza no cache
      pagamentoDao.buscaPorId(id, function (erro, resultado) {
        if (!erro) {
          addCache(app, `pagamento-${pagamento.id}`, resultado);
        }
      });

      res.send(pagamento);
    });

  });

  // Criação
  app.post('/pagamentos/pagamento', function (req, res) {

    req.assert("pagamento.forma_de_pagamento", "Forma de pagamento eh obrigatorio").notEmpty();
    req.assert("pagamento.valor", "Valor eh obrigatorio e deve ser um decimal").notEmpty().isFloat();

    var erros = req.validationErrors();

    if (erros) {
      console.log('Erros de validacao encontrados');
      res.status(400).send(erros);
      return;
    }

    var pagamento = req.body["pagamento"];
    console.log('processando uma requisicao de um novo pagamento');

    pagamento.status = 'CRIADO';
    pagamento.data = new Date;

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function (erro, resultado) {

      if (erro) {

        console.log('Erro ao inserir no banco:' + erro);
        res.status(500).send(erro);
      } else {

        pagamento.id = resultado.insertId;
        console.log('Pagamento criado');

        // Adiciona no cache
        addCache(app, `pagamento${pagamento.id}`, pagamento);

        if (pagamento.forma_de_pagamento == 'cartao') {

          var cartao = req.body["cartao"];
          console.log(cartao);

          var clienteCartoes = new app.servicos.clienteCartoes();

          clienteCartoes.autoriza(cartao,
            function (exception, request, response, retorno) {
              if (exception) {
                console.log(exception);
                res.status(400).send(exception);
                return;
              }
              console.log(retorno);

              res.location(`/pagamentos/pagamento/${pagamento.id}`);

              var response = {
                dados_do_pagamanto: pagamento,
                cartao: retorno,
                links: [
                  {
                    href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                    rel: "confirmar",
                    method: "PUT"
                  },
                  {
                    href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                    rel: "cancelar",
                    method: "DELETE"
                  }
                ]
              }

              res.status(201).json(response);
              return;
            });


        } else {

          res.location(`/pagamentos/pagamento/${pagamento.id}`);

          var response = {
            dados_do_pagamanto: pagamento,
            links: [
              {
                href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                rel: "confirmar",
                method: "PUT"
              },
              {
                href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                rel: "cancelar",
                method: "DELETE"
              }
            ]
          }

          res.status(201).json(response);
        }
      }
    });

  });

  function addCache(app, cacheKey, valor) {
    var memcachedClient = app.servicos.memcachedClient();
    memcachedClient.set(cacheKey,
      valor,
      60000,
      function (erro) {
        console.log(`Cache '${cacheKey}' - Valor adicionado: ${valor}`);
      });
  }
}
