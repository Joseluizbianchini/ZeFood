import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ItemProduto = ({ titulo, imagem, ingredientes, preco, onAdicionar }) => {
  const [quantidade, setQuantidade] = useState(0);

  const aumentar = () => setQuantidade((prev) => prev + 1);
  const diminuir = () => {
    if (quantidade > 0) setQuantidade((prev) => prev - 1);
  };

  const adicionar = () => {
    onAdicionar(titulo, quantidade, preco);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>

      <Image source={imagem} style={styles.imagem} />

      <Text style={styles.textoIngredientes}>{ingredientes || 'Sem ingredientes'}</Text>

      <Text style={styles.preco}>R$ {preco}</Text>

      <View style={styles.contador}>
        <TouchableOpacity onPress={diminuir} style={styles.botaoContador}>
          <Text style={styles.textoContador}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantidade}>{quantidade}</Text>

        <TouchableOpacity onPress={aumentar} style={styles.botaoContador}>
          <Text style={styles.textoContador}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botao} onPress={adicionar}>
        <View style={styles.ContainerBotaoSacola}>
          <Image
            source={require('../assets/TelaPedidos/sacola-de-compras.png')}
            style={styles.iconeBotaoSacola}
          />
          <Text style={styles.textoBotao}>Adicionar à Sacola</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    margin: 4,
  },
  titulo: {
    color: '#D7204C',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: -60,
    marginTop: 4,
  },
  imagem: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: -60,

  },
  preco: {
    fontSize: 24,
    color: '#444',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  botaoContador: {
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  textoContador: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantidade: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  iconeBotaoSacola: {
    width: 30,
    height: 30,
    marginRight: 20,
  },
  ContainerBotaoSacola: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
  },
  textoIngredientes: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
});

export default ItemProduto;
