import mongoose, { Document, Schema } from 'mongoose';

interface ItemPedido {
  idProduto: string;
  nome: string;
  quantidade: number;
  preco: String;
}

export interface PedidoDocument extends Document {
  idPedido: string;
  itens: ItemPedido[];
  preco: string;
}

const ItemPedidoSchema = new Schema<ItemPedido>({
  idProduto: { type: String, required: true },
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true },
  preco: {type: String, required:true }
});

const PedidoSchema = new Schema<PedidoDocument>({
  idPedido: { type: String, required: true, unique: true },
  itens: { type: [ItemPedidoSchema], required: true },
});

const PedidoModel = mongoose.model<PedidoDocument>('Pedido', PedidoSchema);

export default PedidoModel;
