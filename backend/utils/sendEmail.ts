import { Request, Response } from 'express';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
//Enviar Email Com o pedido
export const enviarPedidoPorEmail = async (req: Request, res: Response): Promise<void> => {
  const { nome, email, pedido, modoEntrega, totalFinal } = req.body;

  console.log('Recebendo dados para envio de email:', { nome, email, pedido, modoEntrega, totalFinal });

  if (!nome || !email || !pedido) {
    console.log('Dados incompletos detectados, abortando envio.');
    res.status(400).json({ error: 'Dados incompletos para enviar o email' });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const messageHtml = `
      <h1>Novo Pedido Recebido</h1>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Modo de Entrega:</strong> ${modoEntrega}</p>
      <p><strong>Total:</strong> R$ ${totalFinal}</p>
      <h2>Itens do Pedido:</h2>
      <ul>
        ${pedido.itens
          .map(
            (item: any) =>
              `<li>${item.nome} - Quantidade: ${item.quantidade} - Preço: R$ ${item.preco}</li>`
          )
          .join('')}
      </ul>
    `;

    console.log('Preparando para enviar email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Novo Pedido de ${nome}`,
      html: messageHtml,
    });

    console.log('Email enviado com sucesso! Informações:', info);
    res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (error: any) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ error: error.message || 'Erro ao enviar email' });
  }
};


// ENVIAR EMAIL PARA RECUPERAÇÃO DE SENHA
export const enviarEmailRecuperacaoSenha = async (req: Request, res: Response): Promise<void> => {
  const { email, tokenRecuperacao } = req.body;

  if (!email || !tokenRecuperacao) {
    res.status(400).json({ error: 'Email ou token de recuperação ausentes' });
    return;
  }

  try {
    const linkRecuperacao = `${process.env.FRONTEND_URL}/reset-password?token=${tokenRecuperacao}`;

    const messageHtml = `
      <h1>Recuperação de Senha</h1>
      <p>Você solicitou a recuperação de senha para este e-mail.</p>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${linkRecuperacao}">Redefinir Senha</a>
      <p>Se você não solicitou essa recuperação, ignore este e-mail.</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Instruções para Recuperação de Senha',
      html: messageHtml,
    });

    res.status(200).json({ message: 'Email de recuperação enviado com sucesso!' });
  } catch (error: any) {
    console.error('Erro ao enviar email de recuperação:', error);
    res.status(500).json({ error: 'Erro ao enviar email de recuperação' });
  }
};
