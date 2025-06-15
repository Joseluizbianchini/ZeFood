import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import uuid from 'react-native-uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const [telaRecuperacao, setTelaRecuperacao] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Digite um e-mail válido no formato exemplo@email.com');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.0.2.2:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token);
        }

        const idCliente = data.idCliente || (uuid.v4() as string);

        Alert.alert('Sucesso', `Bem-vindo, ${email}!`);
        setEmail('');
        setSenha('');

        navigation.navigate('PaginaInicialPosLogin', { idCliente });
      } else {
        Alert.alert('Erro', data.message || 'Usuário ou senha inválidos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperacao = async () => {
    if (!emailRecuperacao) {
      Alert.alert('Erro', 'Informe seu e-mail');
      return;
    }

    if (!validateEmail(emailRecuperacao)) {
      Alert.alert('Erro', 'Digite um e-mail válido no formato exemplo@email.com');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.0.2.2:5000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailRecuperacao }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message || 'Instruções enviadas para seu e-mail.');
        setEmailRecuperacao('');
        setTelaRecuperacao(false);
      } else {
        Alert.alert('Erro', data.message || 'Erro ao enviar instruções');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível se conectar ao servidor.');
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

      {telaRecuperacao ? (
        <>
          <Text style={styles.title}>Recuperar Senha</Text>
          <TextInput
            style={[styles.CampoCadastro, { textAlign: 'center' }]}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={emailRecuperacao}
            onChangeText={setEmailRecuperacao}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.botaoContinuar, loading ? { opacity: 0.6 } : {}]}
            onPress={handleRecuperacao}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>{loading ? 'Enviando...' : 'Enviar Instruções'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTelaRecuperacao(false)}
            disabled={loading}
          >
            <Text style={[styles.link, { marginTop: 20 }]}>Voltar para login</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.CampoCadastro, { textAlign: 'center' }]}
              placeholder="Digite seu E-mail"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[styles.CampoCadastro, { textAlign: 'center' }]}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.botaoContinuar, loading ? { opacity: 0.6 } : {}]}
            onPress={handleLogin}
            disabled={loading}
          >
            <View style={styles.containerEntrar}>
              <Image
                source={require('../assets/paginaLogin/entrar.png')}
                style={styles.imageBotaoContinuar}
                resizeMode="contain"
              />
              <Text style={styles.textoBotao}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTelaRecuperacao(true)}
            disabled={loading}
            style={{ marginTop: 15 }}
          >
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <View style={styles.cadastroContainer}>
            <Text style={styles.TextoCadastre}>Ainda não é cadastrado?</Text>
            <TouchableOpacity
              style={[styles.botaoContinuar, { marginTop: 5 }]}
              onPress={() => navigation.navigate('Cadastro')}
              disabled={loading}
            >
              <View style={styles.containerEntrar}>
                <Image
                  source={require('../assets/paginaLogin/cadastro.png')}
                  style={styles.imageBotaoContinuar}
                  resizeMode="contain"
                />
                <Text style={styles.textoBotao}>Cadastrar-se</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FEFEFE',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
  botaoContinuar: {
    backgroundColor: '#D7204C',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 5,
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
  CampoCadastro: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 2,
    fontSize: 16,
    color: '#000000',
  },
  cadastroContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  TextoCadastre: {
    color: '#D7204C',
    fontSize: 18,
    marginBottom: 5,
  },
  inputContainer: {
    width: 300,
    marginTop: 40,
  },
  label: {
    color: '#D7204C',
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
    fontSize: 16,
  },
  link: {
    color: '#D7204C',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D7204C',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default LoginScreen;
