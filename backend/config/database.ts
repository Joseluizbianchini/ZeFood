import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('❌ MONGO_URI não está definida no .env');
    }

    await mongoose.connect(uri);
    console.log('✅ Conectado ao MongoDB com sucesso!');
  } catch (error: any) {
    console.error('❌ Erro ao conectar no MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
