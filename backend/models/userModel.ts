import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  senha: string;
  telefone?: string;
  resetToken?: string;
  tokenExpires?: Date;
}

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  tokenExpires: {
    type: Date,
  },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
