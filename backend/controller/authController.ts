import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import PedidoModel from '../models/pedidoModel';
import DadosClienteModel from '../models/DadosClienteModel';
import crypto from 'crypto';
const nodemailer = require('nodemailer');
import UserModel, { IUser } from '../models/ResetPasswordModel';

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    res.status(400).json({ message: 'Email e senha são obrigatórios' });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Usuário não encontrado' });
      return;
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      res.status(401).json({ message: 'Senha incorreta' });
      return;
    }

    res.status(200).json({ message: 'Login realizado com sucesso!' });
  } catch (error: any) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// REGISTRO
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, telefone, senha } = req.body;

  if (!email || !telefone || !senha) {
    res.status(400).json({ message: 'Email, telefone e senha são obrigatórios' });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Usuário já cadastrado' });
      return;
    }

    const existingTelefone = await User.findOne({ telefone });
    if (existingTelefone) {
      res.status(400).json({ message: 'Telefone já cadastrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    await User.create({ email, senha: hashedPassword, telefone });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error: any) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// ESQUECI A SENHA
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.tokenExpires = new Date(Date.now() + 3600000);
    await user.save();

    const resetLink = `http://localhost:5000/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Redefinição de senha',
      html: `<p>Clique no link para redefinir sua senha:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });

    res.status(200).json({ message: 'Email de redefinição enviado com sucesso' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar solicitação', error: error.message });
  }
};

// REDEFINIR SENHA
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      tokenExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: 'Token inválido ou expirado' });
      return;
    }

    user.senha = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.tokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Senha redefinida com sucesso' });
  } catch (error: any) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ message: 'Erro ao redefinir senha', error: error.message });
  }
};


// CRIAR PEDIDO
export const criarPedido = async (req: Request, res: Response): Promise<void> => {
  const { pedido } = req.body;

  if (!pedido || !pedido.itens || pedido.itens.length === 0) {
    res.status(400).json({ message: 'Pedido inválido ou vazio' });
    return;
  }

  try {
    const novoPedido = await PedidoModel.create(pedido);
    res.status(201).json({ message: 'Pedido registrado com sucesso!', pedido: novoPedido });
  } catch (error: any) {
    console.error('Erro ao registrar pedido:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// CADASTRAR DADOS DO CLIENTE
export const cadastrarDados = async (req: Request, res: Response): Promise<void> => {
  const { dadosCliente } = req.body;

  if (
    !dadosCliente ||
    !dadosCliente.nome ||
    !dadosCliente.telefone ||
    dadosCliente.telefone.length < 10 ||
    !dadosCliente.email
  ) {
    res.status(400).json({ message: 'Dados do cliente inválidos ou incompletos' });
    return;
  }

  try {
    const novoCadastro = await DadosClienteModel.create({
      nome: dadosCliente.nome,
      telefone: dadosCliente.telefone,
      email: dadosCliente.email,
    });

    res.status(201).json({
      message: 'Dados do cliente registrados com sucesso!',
      dados: {
        _id: novoCadastro._id,
        nome: novoCadastro.nome,
        telefone: novoCadastro.telefone,
        email: novoCadastro.email,
      },
    });
  } catch (error: any) {
    console.error('Erro ao registrar dados do cliente:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// BUSCAR DADOS CLIENTE POR ID
export const buscarDadosCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ mensagem: 'ID do cliente ausente' });
    return;
  }

  try {
    const cliente = await DadosClienteModel.findById(id).lean();

    if (!cliente) {
      res.status(404).json({ mensagem: 'Cliente não encontrado' });
      return;
    }

    res.status(200).json(cliente);
  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar cliente', erro: error.message });
  }
};

// ATUALIZAR DADOS CLIENTE
export const atualizarDadosCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nome, telefone, email } = req.body;

  if (!nome || !telefone || !email) {
    res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    return;
  }

  try {
    const clienteAtualizado = await DadosClienteModel.findByIdAndUpdate(
      id,
      { nome, telefone, email },
      { new: true }
    );

    if (!clienteAtualizado) {
      res.status(404).json({ message: 'Cliente não encontrado' });
      return;
    }

    res.status(200).json({ message: 'Dados atualizados com sucesso', cliente: clienteAtualizado });
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};