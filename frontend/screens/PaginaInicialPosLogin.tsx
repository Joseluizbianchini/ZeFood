import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import ItemProduto from '../components/ComponentPedidos';
import uuid from 'react-native-uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'PaginaInicialPosLogin'>;

type ItemPedido = {
  idProduto: string;
  nome: string;
  quantidade: number;
  preco: number;
};

type Pedido = {
  idPedido: string;
  itens: ItemPedido[];
  idCliente: string;
};

const produtos = [
  {
    id: '1',
    titulo: 'Lanches Artesanais',
    imagem: require('../assets/TelaPedidos/Lanche1.png'),
    ingredientes: 'Hamburguer',
    preco: 29.90,
  },
  {
    id: '2',
    titulo: 'Batata Frita',
    imagem: require('../assets/TelaPedidos/Batata1.png'),
    ingredientes: 'Hamburguer',
    preco: 19.90,
  },
  {
    id: '3',
    titulo: 'Combo Lanche + Batata',
    imagem: require('../assets/TelaPedidos/Combo1.png'),
    ingredientes: 'Hamburguer',
    preco: 44.90,
  },
];

const PaginaInicialPosLogin: React.FC<Props> = ({ route, navigation }) => {
  const idCliente = route.params?.idCliente;

  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    if (idCliente) {
      setPedido({
        idPedido: uuid.v4() as string,
        itens: [],
        idCliente,
      });
    }
  }, [idCliente]);

  if (!idCliente) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>ID do cliente não informado. Faça login novamente.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.voltarButton}>
          <Text style={styles.voltarText}>Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!pedido) {
    return (
      <View style={styles.centered}>
        <Text>Carregando pedido...</Text>
      </View>
    );
  }

  const adicionarNaSacola = (nome: string, quantidade: number, preco: number) => {
    if (quantidade <= 0) {
      Alert.alert('Quantidade inválida', 'Informe uma quantidade válida para adicionar.');
      return;
    }

    setPedido((prev) => {
      if (!prev) return prev;

      const itemExistenteIndex = prev.itens.findIndex((item) => item.nome === nome);

      let novaLista: ItemPedido[];

      if (itemExistenteIndex >= 0) {
        novaLista = [...prev.itens];
        const itemExistente = novaLista[itemExistenteIndex];
        novaLista[itemExistenteIndex] = {
          ...itemExistente,
          quantidade: itemExistente.quantidade + quantidade,
        };
      } else {
        novaLista = [
          ...prev.itens,
          { idProduto: uuid.v4() as string, nome, quantidade, preco },
        ];
      }

      return {
        ...prev,
        itens: novaLista,
      };
    });

    Alert.alert('Adicionado!', `${quantidade}x "${nome}" adicionado(s) à sacola.`);
  };

  const concluirPedido = () => {
    if (pedido.itens.length === 0) {
      Alert.alert('Sacola vazia', 'Adicione ao menos um item antes de continuar.');
      return;
    }

    if (!pedido.idCliente) {
      Alert.alert('Erro', 'Cliente não identificado. Faça login novamente.');
      return;
    }

    navigation.navigate('ConclusaoPedido', { pedido });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fazer pedido</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemProduto
            titulo={item.titulo}
            imagem={item.imagem}
            ingredientes={item.ingredientes}
            preco={item.preco.toFixed(2)}
            onAdicionar={adicionarNaSacola}
          />
        )}
        contentContainerStyle={styles.lista}
      />

      <TouchableOpacity style={styles.botaoConcluir} onPress={concluirPedido}>
        <Text style={styles.logoutText}>Concluir Pedido</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutText}>Sair e Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    color: '#D7204C',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  lista: {
    paddingBottom: 100,
  },
  logoutButton: {
    backgroundColor: '#D7204C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },
  botaoConcluir: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  voltarButton: {
    marginTop: 20,
  },
  voltarText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default PaginaInicialPosLogin;
