import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';  // Importa do App.tsx

type Props = NativeStackScreenProps<RootStackParamList, 'PaginaInicial'>;

const PaginaInicialScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/paginaInicialImg/LogoBranca.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.textoCentral}>Está com fome?</Text>

      <TouchableOpacity
        style={styles.botaoContinuar}
        onPress={() => navigation.navigate('Login')}
      >
        <Image
          source={require('..//assets/paginaInicialImg/pedido-online.png')}
          style={styles.imageBotaoContinuar}
          resizeMode="contain"
        />
        <Text style={styles.textoBotao}>FAÇA SEU PEDIDO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D7204C',
    paddingTop: 50,
  },
  image: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  textoCentral: {
    marginTop: 30,
    fontSize: 40,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  botaoContinuar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textoBotao: {
    color: '#D7204C',
    fontWeight: 'bold',
    fontSize: 20,
  },
  imageBotaoContinuar: {
    height: 50,
    width: 50,
    marginRight: 20,
  },
});

export default PaginaInicialScreen;
