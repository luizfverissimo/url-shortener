# WDNA Encurtador de Url

Projeto fullstack criado para o code-challenge da WDNA.

Back-end criado com *Node.js + Express*, utilizando base de dados *SQLite3 e Knex* para a manipulação, manipulação de datas fou utilizado o *Moment.js* e *shortId* para encurtamento das URLs.

Front-end foi criado com *Vue.js*.

<img src="/images/1.png" alt="imagem 1" height="400"/> <img src="/images/2.png" alt="imagem 2" height="400"/> <img src="/images/3.png" alt="imagem 3" height="400"/> 
 
## Instalação

Você precisará ter o [NodeJS](https://nodejs.org) instalado na sua máquina, e, após isso, clonar este repositório:
```sh
  git clone https://github.com/luizfverissimo/WDNA-url-shortener.git
```

Depois disso, instale as dependências do Front-end e do Back-end:
```sh
  cd WDNA-url-shortener/server && npm install # ou yarn install
  cd ../web && npm install # ou yarn install
```
## Executando a aplicação

Primeiro acesse a pasta do server e execute o seguinte comando:
```sh
  npm start
```

Caso queira recriar o banco de dados, delete o arquivo,
```sh
  WDNA-url-shortener/server/database/database.sqlite3
```
e rode o comando:
```sh
  npm run knex:migrate
```

Agora é só executar o front-end na past web:
```sh
  npm run serve
  ```
