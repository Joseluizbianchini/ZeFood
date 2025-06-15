import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (_, res) => {
  res.send('API funcionando 🚀');
});

app.use('/auth', authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
};

startServer();
