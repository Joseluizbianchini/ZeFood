# 🍽️ ZeFood - Backend

Backend da aplicação **ZeFood**, desenvolvido com **Node.js**, **TypeScript**, **Express** e **MongoDB (Mongoose)**. 
Neste projeto foi trabalhado serviço que fornece autenticação, cadastro de usuários, gerenciamento de pedidos, recuperação de senha via e-mail e envio de pedidos realizados no aplicativo para o email.

## 📦 Tecnologias

- Node.js
- TypeScript
- Express.js
- MongoDB + Mongoose
- Sequelize + PostgreSQL (parcial)
- JWT para autenticação
- Bcrypt para criptografia de senhas
- Nodemailer para envio de e-mails

---

## ✅ Pré-requisitos

- Node.js (v14+)
- NPM ou Yarn
- MongoDB (local ou Atlas)
- Conta Gmail com autenticação em 2 fatores e **senha de aplicativo**

---

## Instalação de Dependências

Execute os comandos abaixo na raiz do projeto para instalar todas as bibliotecas necessárias:

### Dependências principais:

```bash
# Conexão com MongoDB
npm install mongoose

# Variáveis de ambiente
npm install dotenv

# Servidor e permissões de origem
npm install express cors

# Autenticação e criptografia
npm install jsonwebtoken bcrypt bcryptjs

# Envio de e-mails
npm install nodemailer

# Integração com PostgreSQL (via Sequelize)
npm install sequelize pg

# Utilitários adicionais
npm install axios
npm install react-native-uuid
npm install @react-native-async-storage/async-storage

# Tipagens adicionais
npm install --save-dev typescript ts-node @types/node
npm install --save-dev @types/express @types/sequelize

## Observações-para-o-frontend-react-native--expo
# Frontend do projeto
npx expo install react-native-gesture-handler react-native-screens react-native-safe-area-context
npm install @react-navigation/native

# Arquivo .env na raiz do projeto 
PORT=5000
MONGO_URI=LinkDaURLDoAtlas'https://www.mongodb.com/pt-br/products/platform/atlas-database'
db_password=SenhaDoDB
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app -> usar GMAIL e pegar a senha em https://myaccount.google.com/apppasswords

# Pastas do projeto 

ZeFood/
├── backend/
│   ├── config/                 # Configurações de conexão com banco
│   │   └── database.ts
│   ├── controller/             # Controladores (lógica da API)
│   │   └── authController.ts
│   ├── models/                 # Modelos de dados (Mongoose)
│   │   ├── DadosClienteModel.ts
│   │   ├── pedidoModel.ts
│   │   ├── ResetPassWordModel.ts
│   │   └── userModel.ts
│   ├── routes/                 # Rotas da aplicação
│   │   └── authRoutes.ts
│   ├── utils/                  # Utilitários (ex: envio de e-mail)
│   │   └── sendEmail.ts
│   └── server.ts               # Arquivo principal do servidor
│
├── frontend/                   # Aplicativo React Native
│   ├── assets/                 # Imagens e ícones
│   ├── components/             # Componentes reutilizáveis
│   └── screens/                # Telas principais do app
├── app.ts                      # Componente principal do Expo
├── index.ts                    # Ponto de entrada do app
│
├── .env                        # Variáveis de ambiente
├── package.json                # Scripts e dependências
├── tsconfig.json               # TypeScript (frontend)
├── tsconfig.backend.json       # TypeScript (backend)

# Execução do servidor
npm run dbstart

# Execução do frontend
npx expo start

#Ajustes no codigo se necessario
#Ajuste necessario no email e tirar de localhost para o ip da maquina e assim funcionar o pedido.
#Ao enviar um post para http://localhost:5000/auth/email/enviar-pedido
#Com o seguinte conteudo {
#  "nome": "João Silva",
# "email": "emaildoreceptor@exemplo.com",
#  "pedido": {
#    "itens": [
#      { "nome": "Produto A", "quantidade": 2, "preco": 50 },
#      { "nome": "Produto B", "quantidade": 1, "preco": 30 }
#    ]
#  },
#  "modoEntrega": "Entrega rápida",
#  "totalFinal": 130
#}'
#O envio ocorre normalmente
