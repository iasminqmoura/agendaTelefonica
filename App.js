
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  useFonts,
  Questrial_400Regular,
} from '@expo-google-fonts/questrial';

const MARROM = '#704e2e';
const BEGE = '#f0e6dd';

const CHAVE_CONTATOS = '@agendaTelefonica:contatos';

// Dimensões da imagem original do Canva
const LARGURA_MODELO = 928;
const ALTURA_MODELO = 1649;

export default function App() {
  const [fontsLoaded] = useFonts({
    Questrial_400Regular,
  });

  const { width, height } = useWindowDimensions();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [contatos, setContatos] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Ajusta o desenho à largura da tela
  const escala = width / LARGURA_MODELO;

  // Altura proporcional ao desenho original
  const alturaDesenho = ALTURA_MODELO * escala;

  // Garante que os elementos não sejam cortados em telas baixas
  const alturaConteudo = Math.max(
    alturaDesenho,
    height - (StatusBar.currentHeight || 0)
  );

  // Posicionamento proporcional
  const px = valor => valor * escala;

  useEffect(() => {
    carregarContatos();
  }, []);

  async function carregarContatos() {
    try {
      const dados = await AsyncStorage.getItem(CHAVE_CONTATOS);

      if (dados !== null) {
        const lista = JSON.parse(dados);

        if (Array.isArray(lista)) {
          setContatos(lista);
        }
      }
    } catch (erro) {
      console.error('Erro ao carregar contatos:', erro);

      Alert.alert(
        'Erro',
        'Não foi possível carregar os contatos.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function gravarContatos(lista) {
    await AsyncStorage.setItem(
      CHAVE_CONTATOS,
      JSON.stringify(lista)
    );
  }

  function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) {
      return numeros ? `(${numeros}` : '';
    }

    if (numeros.length <= 3) {
      return `(${numeros.slice(0, 2)})${numeros.slice(2)}`;
    }

    if (numeros.length <= 7) {
      return (
        `(${numeros.slice(0, 2)})${numeros.slice(2, 3)} ` +
        numeros.slice(3)
      );
    }

    return (
      `(${numeros.slice(0, 2)})${numeros.slice(2, 3)} ` +
      `${numeros.slice(3, 7)} - ${numeros.slice(7)}`
    );
  }

  function adicionarContato() {
    if (salvando) return;

    setSelecionado(null);
    setNome('');
    setTelefone('');
  }

  function selecionarContato(id) {
    setSelecionado(id);

    if (id === null) {
      setNome('');
      setTelefone('');
      return;
    }

    const contato = contatos.find(item => item.id === id);

    if (contato) {
      setNome(contato.nome);
      setTelefone(contato.telefone);
    }
  }

  async function salvarContato() {
    if (salvando || carregando) return;

    if (!nome.trim() || !telefone.trim()) {
      Alert.alert(
        'Atenção',
        'Preencha o nome e o telefone.'
      );
      return;
    }

    if (telefone.replace(/\D/g, '').length !== 11) {
      Alert.alert(
        'Telefone inválido',
        'Digite um telefone com DDD e 11 dígitos.'
      );
      return;
    }

    let novaLista;
    let mensagem;

    if (selecionado === null) {
      const novoContato = {
        id: `${Date.now()}-${Math.random()}`,
        nome: nome.trim(),
        telefone,
      };

      novaLista = [...contatos, novoContato];
      mensagem = 'Contato cadastrado com sucesso!';
    } else {
      novaLista = contatos.map(contato =>
        contato.id === selecionado
          ? {
              ...contato,
              nome: nome.trim(),
              telefone,
            }
          : contato
      );

      mensagem = 'Contato atualizado com sucesso!';
    }

    setSalvando(true);

    try {
      await gravarContatos(novaLista);

      setContatos(novaLista);
      setSelecionado(null);
      setNome('');
      setTelefone('');

      Alert.alert('Sucesso', mensagem);
    } catch (erro) {
      console.error('Erro ao salvar:', erro);

      Alert.alert(
        'Erro',
        'Não foi possível salvar o contato.'
      );
    } finally {
      setSalvando(false);
    }
  }

  async function removerContato() {
    if (salvando || carregando) return;

    if (selecionado === null) {
      Alert.alert(
        'Atenção',
        'Selecione um contato para remover.'
      );
      return;
    }

    const novaLista = contatos.filter(
      contato => contato.id !== selecionado
    );

    setSalvando(true);

    try {
      await gravarContatos(novaLista);

      setContatos(novaLista);
      setSelecionado(null);
      setNome('');
      setTelefone('');

      Alert.alert(
        'Sucesso',
        'Contato removido com sucesso!'
      );
    } catch (erro) {
      console.error('Erro ao remover:', erro);

      Alert.alert(
        'Erro',
        'Não foi possível remover o contato.'
      );
    } finally {
      setSalvando(false);
    }
  }

  if (!fontsLoaded || carregando) {
    return (
      <View style={styles.carregamento}>
        <ActivityIndicator
          size="large"
          color={MARROM}
        />
      </View>
    );
  }

  // Posicionamento absoluto com base na imagem
  function posicao(x, y, largura, altura) {
    return {
      position: 'absolute',
      left: px(x),
      top: px(y),
      width: px(largura),
      height: px(altura),
    };
  }

  // Estrela de oito pontas
  function Estrela() {
    const tamanho = px(92);
    const centro = tamanho / 2;

    const linhas = [
      { angulo: 0, comprimento: 46 },
      { angulo: 45, comprimento: 43 },
      { angulo: 90, comprimento: 46 },
      { angulo: 135, comprimento: 43 },
    ];

    return (
      <View
        style={{
          position: 'absolute',
          left: px(464) - centro,
          top: px(176) - centro,
          width: tamanho,
          height: tamanho,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {linhas.map((linha, indice) => (
          <View
            key={indice}
            style={{
              position: 'absolute',
              width: px(linha.comprimento * 2),
              height: Math.max(0.6, px(1.5)),
              backgroundColor: MARROM,
              transform: [
                { rotate: `${linha.angulo}deg` },
              ],
            }}
          />
        ))}
      </View>
    );
  }

  const estiloCampo = {
    borderWidth: Math.max(0.6, px(1.5)),
    borderColor: MARROM,
    backgroundColor: BEGE,
    color: MARROM,
    fontFamily: 'Questrial_400Regular',
    fontSize: px(30),
    paddingHorizontal: px(12),
    paddingVertical: 0,
  };

  const estiloRotulo = {
    color: MARROM,
    fontFamily: 'Questrial_400Regular',
    fontSize: px(29),
    letterSpacing: px(3),
    textAlign: 'right',
    includeFontPadding: false,
  };

  const estiloBotao = {
    width: px(388),
    height: px(103),
    borderRadius: px(45),
    backgroundColor: MARROM,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const estiloTextoBotao = {
    color: BEGE,
    fontFamily: 'Questrial_400Regular',
    fontSize: px(31),
    letterSpacing: px(3),
    includeFontPadding: false,
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BEGE}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          minHeight: alturaConteudo,
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width,
            height: alturaDesenho,
            backgroundColor: BEGE,
          }}
        >

          {/* ESTRELA */}
          <Estrela />

          {/* TÍTULO AGENDA */}
          <Text
            style={{
              ...posicao(170, 286, 588, 104),
              color: MARROM,
              fontFamily: 'Questrial_400Regular',
              fontSize: px(103),
              letterSpacing: px(2),
              textAlign: 'center',
              includeFontPadding: false,
              fontWeight: '300',
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            AGENDA
          </Text>

          {/* TÍTULO TELEFÔNICA */}
          <Text
            style={{
              ...posicao(135, 390, 658, 104),
              color: MARROM,
              fontFamily: 'Questrial_400Regular',
              fontSize: px(99),
              letterSpacing: px(1),
              textAlign: 'center',
              includeFontPadding: false,
              fontWeight: '300',
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            TELEFÔNICA
          </Text>

          {/* RÓTULO CONTATO */}
          <Text
            style={{
              ...posicao(110, 674, 225, 45),
              ...estiloRotulo,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            CONTATO:
          </Text>

          {/* SELETOR DE CONTATO */}
          <View
            style={{
              ...posicao(340, 653, 454, 74),
              borderWidth: Math.max(0.6, px(1.5)),
              borderColor: MARROM,
              backgroundColor: BEGE,
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Picker
              selectedValue={selecionado}
              onValueChange={selecionarContato}
              enabled={!salvando}
              dropdownIconColor={MARROM}
              style={{
                width: '100%',
                height: px(88),
                color: MARROM,
                fontSize: px(29),
                marginLeft: -px(5),
              }}
            >
              <Picker.Item
                label="Selecione"
                value={null}
              />

              {contatos.map(contato => (
                <Picker.Item
                  key={contato.id}
                  label={contato.nome}
                  value={contato.id}
                />
              ))}
            </Picker>
          </View>

          {/* RÓTULO NOME */}
          <Text
            style={{
              ...posicao(145, 812, 150, 45),
              ...estiloRotulo,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            NOME:
          </Text>

          {/* CAMPO NOME */}
          <TextInput
            style={{
              ...posicao(340, 792, 454, 74),
              ...estiloCampo,
            }}
            value={nome}
            onChangeText={setNome}
            editable={!salvando}
            selectionColor={MARROM}
          />

          {/* RÓTULO TELEFONE */}
          <Text
            style={{
              ...posicao(100, 951, 235, 45),
              ...estiloRotulo,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            TELEFONE:
          </Text>

          {/* CAMPO TELEFONE */}
          <TextInput
            style={{
              ...posicao(340, 931, 454, 74),
              ...estiloCampo,
            }}
            value={telefone}
            onChangeText={texto =>
              setTelefone(formatarTelefone(texto))
            }
            keyboardType="phone-pad"
            maxLength={17}
            editable={!salvando}
            selectionColor={MARROM}
          />

          {/* BOTÃO SALVAR */}
          <Pressable
            style={{
              ...posicao(270, 1156, 388, 103),
              ...estiloBotao,
              opacity: salvando ? 0.6 : 1,
            }}
            onPress={salvarContato}
            disabled={salvando}
          >
            <Text style={estiloTextoBotao}>
              {salvando ? 'AGUARDE...' : 'SALVAR'}
            </Text>
          </Pressable>

          {/* BOTÃO ADICIONAR */}
          <Pressable
            style={{
              ...posicao(270, 1284, 388, 103),
              ...estiloBotao,
              opacity: salvando ? 0.6 : 1,
            }}
            onPress={adicionarContato}
            disabled={salvando}
          >
            <Text style={estiloTextoBotao}>
              ADICIONAR
            </Text>
          </Pressable>

          {/* BOTÃO REMOVER */}
          <Pressable
            style={{
              ...posicao(270, 1412, 388, 103),
              ...estiloBotao,
              opacity: salvando ? 0.6 : 1,
            }}
            onPress={removerContato}
            disabled={salvando}
          >
            <Text style={estiloTextoBotao}>
              REMOVER
            </Text>
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEGE,
  },

  scroll: {
    flex: 1,
    backgroundColor: BEGE,
  },

  carregamento: {
    flex: 1,
    backgroundColor: BEGE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
