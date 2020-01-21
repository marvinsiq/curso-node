# Notas

## Usando melhor os recursos do HTTP

Existem diversos status code HTTP e conhecê-los e utilizá-los corretamente é extremamente importância para o bom desenho de uma api REST. Veja abaixo os principais códigos e seus significados:

* 100 Continue: o servidor recebeu a solicitação e o cliente pode continuar a comunicação.
* 200 Ok: tudo ocorreu como esperado.
* 201 Created: um novo recurso foi criado no servidor.
* 301 Moved: a url solicitada foi movida.
* 400 Bad Request: problemas na requisição do cliente.
* 404 Not Found: a url solicitada não foi encontrada.
* 500 Internal Server Error: algo inesperado aconteceu do lado do servidor.

Além destes, existem diversos outros que valem muito a pena ser conhecidos e estudados.

Note que cada centena corresponde à uma categoria específica de informação. A família do 100 indica uma conexão continuada. A família do 200 indica sucesso. 300 significa redirecionamento. 400 é para erro do cliente e finalmente a família do 500 é usada para informar outros erros, em sua maioria do lado do servidor.

O bom uso dos status code HTTP, portanto não se restringe somente às situações de falha. Na verdade eles devem ser explorados ao máximo da melhor maneira possível sempre que a api precise passar qualquer informação para o cliente.


## O estilo Arquitetural REST

A sigla REST vêm de Representational State Transfer e surgiu da tese de doutorado de Roy Fielding, descrevendo as ideias que levaram à criação do protocolo HTTP. A Web é o maior exemplo de uso de uma arquitetura REST, onde os verbos são as operações disponíveis no protocolo (GET, POST, DELETE, PUT, OPTION...), os recursos são identificados pelas URLs e as representações podem ser definidas com o uso de Mime Types(texto, XML, JSON e outros).

## Orientado ao recurso

REST não é uma especificação nem uma tecnologia, é um modelo arquitetural. Neste modelo, o pensamento da aplicação gira em torno dos recursos. Depois de definir os recursos, usamos os verbos disponíveis (no HTTP temos o GET, POST, PUT e outros) para manipular estes recursos.

Uma das ideias da arquitetura REST é aproveitar ao máximo o protocolo de comunicação (HTTP) usando-o direito. Nesse escopo, um dos princípios que o REST prega é a utilização das URIs de acordo com sua denominação, URI é a sigla para Uniform Resource Identifier (Identificador Uniforme de Recurso). Pensando voltado a recursos, podemos imaginar que cada recurso tem um identificador único perante os usúarios.

Casando com a ideia de manipular os recursos usando os verbos do protocolo, se cada recurso tem um único endereço, basta fazer uma requisição do tipo POST para criar um novo recurso ou fazer uma requisição GET para buscar o recurso. Tudo gira em torno do recurso.

## Diferentes representações

Os recursos em geral estarão "guardados" ou gerados no servidor, então o cliente da aplicação não pode simplesmente pegá-lo, no máximo ele pode vizualizá-lo. Porém, essa visualização pode ocorrer de várias maneiras, por meio de uma página HTML, uma interface desktop, mobile e etc.

Parte da ideia REST foca que em cada recurso pode ter suas representações. Cada representação pode ter seu formato específico, por exemplo, via XML, HTML, JSON ou

## Métodos HTTP

Ao desenhar aplicações REST, pensamos nos recursos a serem disponibilizados pela aplicação e em seus formatos, em vez de pensar nas operações.

As operações disponíveis para cada um dos recursos no protocolo HTTP são:

* **GET**: retorna uma representação do recurso
* **POST**: cria ou altera o recurso
* **PUT**: cria ou altera o recurso
* **DELETE**: remove o recurso
* outras menos comuns, como **HEAD** e **OPTIONS**

Os quatro principais verbos do protocolo HTTP são comumente associados às operações de CRUD em sistemas Restful (POST -> INSERT, GET -> SELECT, PUT -> UPDATE, DELETE -> DELETE). Há uma grande discussão dos motivos pelos quais usamos POST para criação (INSERT) e PUT para alteração (UPDATE). A razão principal é que o protocolo HTTP especifica que a operação PUT deve ser idempotente, já POST não.

## Idempotência e SAFE

Operações idempotentes são operações que podem ser chamadas uma ou mais vezes, sempre com o mesmo resultado final.

Uma operação é chamada SAFE se ela não altera nenhuma representação.

Idempotência e SAFE são propriedades das operações e fundamentais para a escalabilidade da Web.

## RESTful

Qualquer sistema que aplique as ideias do estilo arquitetural REST, pode ser chamado de RESTful. Existe uma intensa discussão na comunidade sobre quando um sistema pode ser considerado RESTful ou não, porém, na maioria dos casos, basta apenas implantar uma parte do REST (em especial pensar em recursos, verbos fixos e ligações entre apresentações) para ser chamado de RESTfull


## Vantagens Restful

Por quê (ou quando) usar uma arquitetura REST? A primeira coisa que deveríamos saber é quais são as vantagens do REST: http://en.wikipedia.org/wiki/Representational_State_Transfer#Claimed_benefits

Protocolos menos complexos: Não precisamos de tantos protocolos para enviar e receber informações, basta que as duas partes estejam de acordo com os recursos e representações (formatos) disponíveis.
Mais poder e flexibilidade: Por não precisarmos nos preocupar com dezenas de protocolos, temos maior liberdade na hora de devolver um recurso, por exemplo, se usarmos SOAP precisamos necessariamente devolver um recurso no formato de XML, já com a ideia do REST, podemos devolver um objeto JSON direto para uma página na Web.

Arquitetura amplamente disponível: Em linhas gerais, a arquitetura REST é mais simples, essa simplicidade permite que sua adoção seja mais fácil, com uma curva de aprendizado menor. Com isso é mais fácil disponibilizar seus serviços através do REST.
Menos overhead de protocolo: As requisições em uma arquitetura REST são menores, pois trabalhamos com menos protocolos, por exemplo, não precisamos enviar todas informações definidas no protocolo SOAP, basta padronizar com o cliente o XML que ele receberá para os recursos.

## Streaming de dados

Muitas das apis assíncronas utilizadas no Node.js trabalham utilizando o chamado buffer mode. Em uma operação de entrada de dados o buffer mode faz com que todos os dados oriundos da requisição fiquem armazenados em um buffer. Para que então seja passado para algum callback tão somente todo o recurso tenha sido lido.

Esse tipo de estratégia não é muito interessante para o Node.js, visto que ele é pensando para trabalhar com operações de I/O e faz isso muito bem, mas quando a necessidade é ficar manipulando muito recurso na memória, que é o que fazem os buffers, ele passa a perder bastante performance.

A solução ideal para resolver essa questão seria conseguir ir processando os dados conforme eles fossem chegando, ao invés de ter que esperar a leitura do dado por inteiro. É exatamente isso que a api de Streams do Node.js possibilita ao programador.

Existem diversas vantagens em se utilizar essa api sempre que possível. Veja as principais:

## Eficiência espacial

Primeiro de tudo, os Streams nos permitem fazer coisas que não seriam possíveis somente bufferizando dados processando-os todos de uma vez.

Por exemplo: imagine que a aplicação precise ler arquivos muito grandes da ordem dos mega ou até gigabytes. Agora imagine que a aplicação precise ler alguns desses arquivos de forma concorrente. Claramente utilizar uma api que retorna um grande buffer quando o arquivo está completamente lido não é uma boa ideia. A aplicação iria fatalmente cair por falta de memória.

Além disso, os buffers na V8, a runtime sobre a qual o Node.js roda, suporta como tamanho máximo para buffers um número que sequer chega a 1 GB de memória. Ou seja a aplicação esbarraria em uma limitação do próprio ambiente antes mesmo de chegar ao limite físico de memória.

Utilizar Streams nessa situação reduz em muito o uso de memória da aplicação e faz com que ela rode de uma maneira mais suave.

## Eficiência temporal

Vamos considerar agora o caso de uma aplicação que precisa comprimir um arquivo e após fazer o seu upload para um servidor HTTP remoto. Este servidor então recebe o arquivo, descompacta e salva-o em seu sistema de arquivos.

Se o cliente tiver sido implementando utilizando uma api com buffers, o upload só iria iniciar uma vez que o arquivo inteiro tenha sido lido e compactado. Do outro lado e descompressão também só iria ter início uma vez que o arquivo inteiro tenha sido recebido.

Uma melhor solução seria implementar a mesma funcionalidade com streams. Do lado do cliente, os streams permitem que aplicação vá lendo e enviando os arquivos conforme eles forem sendo lidos do sistema de arquivos. E do lado do servidor ela permite que seja feita a descompactação de cada pedaço de arquivo, conforme eles vão sendo recebidos do cliente remoto. Esses pedaços costumam ser chamados de chunks.

É bem fácil perceber que a abordagem com streams gera um ganho de tempo gigantesco e que escala bem melhor.


## Trabalhando com Cache

Um ponto muito importante de se preocupar em uma aplicação de alta escalabilidade é com o gerenciamento dos recursos consumidos pela máquina, dentre eles memória e acesso a disco são dois dos mais sensíveis.

Sabemos que o Node.js trabalha muito bem e performa muito bem em operações de I/O e é uma boa prática que nosso código faça mais execuções de I/O do que de armazenamento em memória.

Porém é comum que a aplicação possua dados que não sofram variações com tanta frequência. E se esses dados estão armazenados em um banco de dados relacional, como é o nosso caso com MySQL, passa a ser um bom sinal de alerta para verificarmos se o uso de uma camada de cache que amenize os acessos ao banco seria uma melhoria na performance da aplicação.

### Cache de dados com Memcached

Um outro fator que pesa muito positivamente no momento de definir utilizar uma política de cache ou não é o fato que já existem no mercado muitos frameworks especialistas nessa função, que abstraem as partes complicadas de infraestrutura, são confiáveis e de fato tendem a melhorar a performance das aplicações em que são utilizados.

O Memcached é um ótimo exemplo desses frameworks citados. Ele é definido na verdade como um sistema de caching de objetos em memória grátis, open source, distribuído e de alta performance, genérico por natureza, mas com uma forte intenção de acelerar o processamento de aplicações web dinâmicas, aliviando a carga de acessos ao banco de dados. Exatamente o objetivo que tínhamos ao pensar em implementar uma política de cache no PayFast.

Ele funciona baseado em um esquema chave-valor que armazena pequenos pedaços de dados de qualquer tipo desejado (string, objetos...) em memória. Podendo esses dados ser oriundos de consultas à banco de dados, à outras APIs ou até mesmo do carregamento de páginas.

Ele é um framework simples, porém bastante poderoso. Fácil de instalar, fazer deploy e de desenvolver sobre ele, por ter um design simples. Além de prover APIs para diversas linguagens de programação.

A instalação do Memcached é muito simples. Uma forma bem padrão de fazê-la é baixar a última versão direto do site oficial, descompactar e instalar:
```
    wget http://memcached.org/latest
    tar -zxvf memcached-1.x.x.tar.gz
    cd memcached-1.x.x
    ./configure && make && make test && sudo make install
```

Este exemplo mostra a instalação feita diretamente no terminal.

Após instalado, basta executar um comando no próprio terminal para que ele suba e fique pronto para receber conexões:
```
    memcached -vv
```

O parâmetro -vv indica que queremos que ele rode num modo 'verboso' nível 2.

Após essa execução, ele já exibe no terminal um informativo do seu status atual, que fica sendo atualizado em tempo real conforme o cache for utilizado

```
  <18 server listening (auto-negotiate)
  <19 send buffer was 9216, now 5592405
  <19 server listening (udp)
  <20 server listening (udp)
  <21 server listening (udp)
  <23 send buffer was 9216, now 5592405
```