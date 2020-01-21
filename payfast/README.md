# Payfast

Projeto resultante do Curso "Node.js e HTTP: desenvolvendo uma API seguindo o estilo REST" da Alura"

## Módulos utilizados

* express
* consign
* nodemon
* body-parser
* mysql
* express-validator
* restify (alterado para restify-clients)
* soap
* fs
* memcached
* winston

## Instalação

###  Node

Lá você encontra as versões do executável para cada uma das plataformas mais comumente encontradas no mercado. Se você usar algum Linux, pode optar por instalar diretamente do gerenciador de pacotes. Veja mais informações aqui: https://nodejs.org/en/download/package-manager/

Note que nessa página já são mostradas as versões mais recentes, tanto a LTS (Long Therm Support), quanto a que possui as features mais recentes, que tende a estar sempre algumas versões a frente por razões óbvias. Para este curso utilizaremos a LTS, que é a mais provável de se usar em um ambiente real de produção.

Caso você prefira ver outras opções de download, inclusive para diferentes plataformas, pode visitar também a página de downloads do Node https://nodejs.org/en/download/.

Uma vez com o Node devidamente instalado, podemos verificar se está tudo ok, executando um comando que mostra a versão dele, por exemplo.

Para isso, basta abrir uma janela qualquer do terminal e digitar o comando a seguir:

`node --version`

### Banco da Dados

Você precisará instalar o servidor de banco de dados MySQL para executar o projeto.

No Ubuntu, basta executar o comando:
`sudo apt-get install mysql-server`

Após a instalação do servidor, abra um terminal, conecte no banco de dados e crie o banco payfast para ser utilizado na aplicação:

```
mysql -u root
```

Uma vez logado, execute o comando que cria o banco e passe a utilizá-lo:

```
create database payfast;
use payfast;
```

Utilize o script abaixo para criar a tabela de pagamentos:

```
    CREATE TABLE `pagamentos` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
       `forma_de_pagamento` varchar(255) NOT NULL,
       `valor` decimal(10,2) NOT NULL,
       `moeda` varchar(3) NOT NULL,
       `status` varchar(255) NOT NULL,
       `data` DATE,
       `descricao` text,
        PRIMARY KEY (id)
       );
```
Para ter certeza que tudo ocorreu bem, você pode executar um comando do sql que exibe as tabelas existentes no banco:

```
show tables;
```

### Projeto

Para baixar todas as dependencias do projeto basta executar o comando:

`npm install`

### Dependência

#### CardFast

O projeto payfast consome um serviço do cardfast. Para executar a rotina de criação de um pagamento do tipo cartão inicie o servidor do cardfast primeiro.

Entre no diretório raiz do projeto carfast e execute o comando.

`node index.js`

O servidor irá executar nas porta 3001.

#### MemCached

O projeto possui um recurso de cache e utiliza a aplicação MemCached. Para instalar execute os passos:

##### Instalando o pacote no Ubuntu

`sudo apt-get install memcached`

Ao instalar via pacote o memcached é instalado como serviço e inicia automaticamente.

`/etc/init.d/memcached status`

As configurações podem ser feitas no arquivo /etc/memcached.conf

#####Instalação via código fonte

```
wget http://memcached.org/latest
tar -zxvf memcached-1.x.x.tar.gz
cd memcached-1.x.x
./configure && make && make test && sudo make install
```

Após instalado, basta executar um comando no próprio terminal para que ele suba e fique pronto para receber conexões:

```
 memcached -vv
 ```

 O parâmetro -vv indica que queremos que ele rode num modo 'verboso' nível 2.

 Por padrão o servidor sobe na porta 11211.

## Executando o projeto

Para iniciar o projeto tenha certeza de que tem o nodemon instalado globalmente. Para verificar basta digitar o comando

`nodemon -v`

Deverá retornar a versão do nodemon instalada no sistema. Caso não esteja instalado execute o comando:

`sudo npm install -g nodemon`

Finalmente, para executar o projeto execute

`npm start`

O servidor deverá subir na porta 3000.

## Testando as rotas

Para testar as rotas você poderá utilizar o `curl` ou um cliente REST como o [Insomnia](https://insomnia.rest/download/) ou `Postman`

### Criando um pagamento (POST)

* Crie uma requisição do tipo POST para http://localhost:3000/pagamentos/pagamento 
* No corpo da requisição, utilize o tipo JSON. 
* Utilize como exemplo o aquivo `files/pagamento.json` deste repositório.

```
curl http://localhost:3000/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d '{
  "pagamento": {
    "forma_de_pagamento": "cartao",
    "valor": 98.53,
    "moeda": "USD",
    "descricao": "criando um pagamento"
  },
  "cartao": {
    "numero": 1234123412341234,
    "bandeira": "visa",
    "ano_de_expiracao": 2016,
    "mes_de_expiracao": 12,
    "cvv": 123
  }
}' | json_pp
```

Obs.: O `| json_pp` no final do comando é apenas para formatar o json resultante.

### Consultando um pagamento

* Crie uma requisição do tipo GET para http://localhost:3000/pagamentos/pagamento/id_do_pagamento

```
curl http://localhost:3000/pagamentos/pagamento/1 -X GET -v
```
Obs.: Depende do memcached estar executando.


### Confirmando um pagamento (PUT)

* Crie uma requisição do tipo PUT para http://localhost:3000/pagamentos/pagamento/id_do_pagamento

```
curl http://localhost:3000/pagamentos/pagamento/1 -X PUT -v
```

### Excluindo um pagamento (DELETE)

* Crie uma requisição do tipo DELETE para http://localhost:3000/pagamentos/pagamento/id_do_pagamento

```
curl http://localhost:3000/pagamentos/pagamento/1 -X DELETE -v
```

Obs.: O pagamento não será excluído fisicamente e sim atualizado com o status CANCELADO.


### Upload de arquivos

* Crie uma requisição do tipo POST para http://localhost:3000/upload/imagem
* Utilize o tipo `Binary File` e envie a imagem
* Utilize Content-type: application/octet-stream
* Envie o nome da imagem no heade "filename: imagem-final.jpg"

```
curl http://localhost:3000/upload/imagem -X POST --data-binary @imagem.jpg -H "Content-type: application/octet-stream" -v -H "filename: imagem-final.jpg"
```

## Lendo e escrevendo arquivos com node

Exemplo e diferença de leitura de arquivos com node utilizando buffer e streams.

### Lendo arquivos com Buffer

Entre na pasta util e execute

`node fileReader.js`

Todo o conteúdo do arquivo imagem.jpg da pasta files será lido e adicionado no buffer. Após o fim da leitura uma funcão callback será chamada e executará a escrita do mesmo arquivo porém com o nome magemsalva-com-buffer.jpg.


### Lendo arquivos com Streams

Entre na pasta util e execute

`node streamFileReader.js`

A medida que o conteúdo do arquivo imagem.jpg da pasta files é lido, o retorno é enviado como entrada para a função invocada no método pipe. Neste caso, leitura e escrita são feitos em pedaços de modo intercalado. O listener 'finish' é disparado quando o processo é finalizado.