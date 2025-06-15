import mongoose, { Schema, Document } from 'mongoose';

export interface IDadosCliente extends Document {
  nome: string;
  telefone: string;
  email: string;
  userId?: mongoose.Types.ObjectId;
}

const DadosClienteSchema: Schema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  telefone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

const DadosClienteModel = mongoose.model<IDadosCliente>('DadosCliente', DadosClienteSchema);

export default DadosClienteModel;
