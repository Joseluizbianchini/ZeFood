import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type ConclusaoPedidoRouteProp = RouteProp<RootStackParamList, 'ConclusaoPedido'>;

const ConclusaoPedido = () => {
  const route = useRoute<ConclusaoPedidoRouteProp>();
  const pedido = route.params?.pedido;

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [entregaSelecionada, setEntregaSelecionada] = useState<'retirada' | 'entrega'>('retirada');

  const aplicarMascaraTelefone = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, '').slice(0, 11);
    if (apenasNumeros.length <= 10) {
      return apenasNumeros.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3').trim();
    }
    return apenasNumeros.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3').trim();
  };

  const totalItens =
    pedido?.itens?.reduce((acc, item) => acc + item.preco * item.quantidade, 0) || 0;

  const taxaEntrega = entregaSelecionada === 'entrega' ? 5 : 0;
  const totalFinal = totalItens + taxaEntrega;

  const formatarPreco = (valor: number) =>
    `R$ ${valor.toFixed(2).replace('.', ',')}`;

  const enviarEmailPedido = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/email/enviar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          pedido,
          modoEntrega: entregaSelecionada,
          totalFinal,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Falha ao enviar email');
      }
      Alert.alert('Sucesso', 'Email enviado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar email. Tente novamente.');
    }
  };
  
  const finalizarPedido = () => {
    if (!nome.trim() || !telefone.trim() || !email.trim()) {
      Alert.alert('Preenchimento obrigatório', 'Preencha todos os campos antes de finalizar.');
      return;
    }
  
    const mensagem = `
  Pedido finalizado com sucesso! 🎉
  
  📦 Pedido #${pedido?.idPedido}
  ${pedido?.itens
    .map((item) => `- ${item.quantidade}x ${item.nome} - ${formatarPreco(item.preco * item.quantidade)}`)
    .join('\n')}
  
  💰 Total: ${formatarPreco(totalItens)}
  ${entregaSelecionada === 'entrega' ? '+ Entrega: R$ 5,00' : '(Retirada no local)'}
  🧾 Total Final: ${formatarPreco(totalFinal)}
  
  👤 Cliente: ${nome}
  📞 Telefone: ${telefone}
  📧 Email: ${email}
    `;
  
    Alert.alert(
      'Confirme o Pedido',
      mensagem.trim(),
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => enviarEmailPedido() },
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.TituloTela}>Conclusão Pedido</Text>

      <View style={styles.ContainerFinalizacao}>
        <Text style={styles.titulo}>Pedido #{pedido.idPedido}</Text>

        <FlatList
          data={pedido.itens}
          keyExtractor={(item) => item.idProduto}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item.quantidade}x {item.nome} - {formatarPreco(item.preco * item.quantidade)}
            </Text>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>
              Nenhum item no pedido.
            </Text>
          }
        />

        <Text style={styles.total}>Total: {formatarPreco(totalItens)}</Text>

        <View style={styles.linha} />

        <View style={styles.containerDadosContato}>
          <Text style={styles.dadosContato}>Dados do Cliente</Text>

          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome completo"
            editable={modoEdicao}
          />

          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={(text) => setTelefone(aplicarMascaraTelefone(text))}
            keyboardType="phone-pad"
            placeholder="Telefone"
            editable={modoEdicao}
          />

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email"
            editable={modoEdicao}
          />

          {/* Seleção de Entrega */}
          <Text style={styles.dadosContato}>Tipo de Entrega</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setEntregaSelecionada('retirada')}
            >
              <View style={entregaSelecionada === 'retirada' ? styles.radioSelecionado : styles.radio} />
              <Text style={styles.radioLabel}>Retirada no local</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setEntregaSelecionada('entrega')}
            >
              <View style={entregaSelecionada === 'entrega' ? styles.radioSelecionado : styles.radio} />
              <Text style={styles.radioLabel}>Entrega (R$ 5,00)</Text>
            </TouchableOpacity>
          </View>

          {/* Botão de Editar / Salvar */}
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => {
              if (modoEdicao) {
                if (!nome.trim() || !telefone.trim() || !email.trim()) {
                  Alert.alert('Preenchimento obrigatório', 'Preencha todos os campos antes de salvar.');
                  return;
                }
              }
              setModoEdicao(!modoEdicao);
            }}
          >
            <Image
              source={require('../assets/paginaLogin/editar.png')}
              style={styles.imageBotaoEditar}
            />
            <Text style={styles.botaoTexto}>{modoEdicao ? 'Salvar' : 'Editar'}</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Finalizar Pedido */}
        <TouchableOpacity style={styles.botaoFinalizar} onPress={finalizarPedido}>
          <Text style={styles.botaoTexto}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FEFEFE' },
  ContainerFinalizacao: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#D3D3D3',
    borderRadius: 12,
    elevation: 4,
    margin: 4,
    width: '100%',
  },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: { fontSize: 18, marginBottom: 10 },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'right',
    color: '#28a745',
    width: '100%',
  },
  TituloTela: {
    marginTop: 50,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 26,
    color: '#D7204C',
    fontWeight: 'bold',
  },
  linha: {
    height: 2,
    width: '100%',
    backgroundColor: '#707070',
    marginVertical: 30,
  },
  containerDadosContato: { width: '100%' },
  dadosContato: {
    textAlign: 'left',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  radioContainer: { marginBottom: 20 },
  radioButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D7204C',
    marginRight: 10,
  },
  radioSelecionado: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#D7204C',
    marginRight: 10,
  },
  radioLabel: { fontSize: 16 },
  botaoEditar: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  botaoFinalizar: {
    backgroundColor: '#D7204C',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  botaoTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageBotaoEditar: {
    height: 20,
    width: 20,
    marginRight: 20,
  },
});

export default ConclusaoPedido;
