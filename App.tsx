import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './frontend/screens/LoginScreen';
import CadastroScreen from './frontend/screens/CadastroScreen';
import PaginaInicialScreen from './frontend/screens/PaginaInicialScreen';
import PaginaInicialPosLogin from './frontend/screens/PaginaInicialPosLogin';
import TelaConclulsaoPedido from './frontend/screens/TelaConclusaoPedido';

type ItemPedido = {
  idProduto: string;
  nome: string;
  quantidade: number;
  preco: number,
};

type Pedido = {
  idPedido: string;
  idCliente: string;
  nomeCliente?: string;
  telefoneCliente?: string;
  emailCliente?: string;
  itens: ItemPedido[];
};

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  PaginaInicial: undefined;
  PaginaInicialPosLogin: { idCliente: string };
  ConclusaoPedido: { pedido: Pedido };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PaginaInicial" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Cadastro" component={CadastroScreen}/>
        <Stack.Screen name="PaginaInicial" component={PaginaInicialScreen}/>
        <Stack.Screen name="PaginaInicialPosLogin" component={PaginaInicialPosLogin}/>
        <Stack.Screen name="ConclusaoPedido" component={TelaConclulsaoPedido}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
