import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  senha: string;
  telefone?: string;
  resetToken?: string;
  tokenExpires?: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  senha: { type: String, required: true },
  telefone: { type: String },
  resetToken: { type: String },
  tokenExpires: { type: Date },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
