# Campo minado

## Como rodar o projeto

Para rodar o projeto, precisamos ter o Node.js, e algumas libs do C.

### Rodando o servidor

Para rodar o servidor, precisamos ter o Node.js instalado, e rodar o seguinte comando:

```bash
cd server && npm install && npm start
```

### Rodando o cliente

Para compilar o cliente, precisamos ter duas bibliotecas instaladas, jansson e curl (libcurl4-openssl-dev), para instalar no Ubuntu, basta rodar o seguinte comando:

```bash
sudo apt-get install libjansson-dev libcurl4-openssl-dev
```

Para compilar o cliente, basta rodar o seguinte comando:

linux:

```bash
cd client && gcc client.c -o client -lcurl -ljansson && ./client
```

windows:

```
cd client && gcc client.c -o client -lcurl -ljansson ; ./client
```
