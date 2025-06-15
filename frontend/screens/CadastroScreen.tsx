import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

const CadastroScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const formatarTelefone = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, '').slice(0, 11);

    if (apenasNumeros.length <= 10) {
      return apenasNumeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }

    return apenasNumeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return /^\d{10,11}$/.test(digits);
  };

  const handleVoltar = () => {
    navigation.navigate('Login');
  };

  const handleCadastro = async () => {
    if (!email || !telefone || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Digite um e-mail válido no formato exemplo@email.com');
      return;
    }
    if (!validatePhone(telefone)) {
      Alert.alert('Erro', 'Digite um telefone válido com 10 ou 11 números');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          telefone: telefone.replace(/\D/g, ''),
          senha,
          tipoConta: 'p'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        setEmail('');
        setTelefone('');
        setSenha('');
        setConfirmarSenha('');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', data.message || 'Erro ao cadastrar usuário');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/paginaLogin/LogoRosa.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.campoContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.CampoCadastro}
          placeholder="Digite seu E-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.CampoCadastro}
          placeholder="Digite seu Telefone"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={telefone}
          maxLength={15}
          onChangeText={(text) => setTelefone(formatarTelefone(text))}
        />
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.CampoCadastro}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Confirme sua senha</Text>
        <TextInput
          style={styles.CampoCadastro}
          placeholder="Confirme sua senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
      </View>

      <TouchableOpacity
        style={styles.botaoContinuar}
        onPress={handleCadastro}
        disabled={loading}
      >
        <View style={styles.containerEntrar}>
          <Image
            source={require('../assets/paginaLogin/cadastro.png')}
            style={styles.imageBotaoContinuar}
            resizeMode="contain"
          />
          <Text style={styles.textoBotao}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
          style={styles.botaoContinuar}
          onPress={handleVoltar}
          disabled={loading}
      >
      <View style={styles.containerEntrar}>
        <Image
          source={require('../assets/paginaLogin/de-volta.png')}
          style={styles.imageBotaoContinuar}
          resizeMode="contain"
        />
          <Text style={styles.textoBotao}>Voltar</Text>
      </View>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FEFEFE',
    paddingTop: 50,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  campoContainer: {
    width: 300,
    marginBottom: 10,
  },
  label: {
    marginLeft: 15,
    marginBottom: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D7204C',
  },
  CampoCadastro: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 2,
    fontSize: 16,
    color: '#000000',
  },
  botaoContinuar: {
    backgroundColor: '#D7204C',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  imageBotaoContinuar: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  containerEntrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
  },
});

export default CadastroScreen;
