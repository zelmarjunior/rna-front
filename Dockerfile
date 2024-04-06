# Use a imagem base do Node.js
FROM node:14-alpine

# Defina o diretório de trabalho dentro da imagem
WORKDIR /app

# Copie os arquivos do projeto para dentro da imagem
COPY . .

# Instale as dependências do projeto
RUN npm install

# Construa o aplicativo React
RUN npm run build

# Exponha a porta 3000 (a porta padrão usada pelo React)
EXPOSE 3000

# Inicie o servidor HTTP para servir o aplicativo React
CMD ["npm", "run", "start"]
