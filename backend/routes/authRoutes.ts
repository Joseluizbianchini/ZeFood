import express from 'express';
import {
  login,
  register,
  criarPedido,
  cadastrarDados,
  buscarDadosCliente,
  atualizarDadosCliente,
  forgotPassword,
  resetPassword,
} from '../controller/authController';

import { enviarPedidoPorEmail } from '../utils/sendEmail';

const router = express.Router();

// Autenticação
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Pedido
router.post('/pedido', criarPedido);

// Email
router.post('/email/enviar-pedido', enviarPedidoPorEmail);

// Cliente
router.post('/clientes', cadastrarDados);
router.get('/clientes/:id', buscarDadosCliente);
router.put('/clientes/:id', atualizarDadosCliente);

export default router;
