import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

export default function App() {

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  // Lista de contatos cadastrados
  const [contatos, setContatos] = useState([]);

  // Guarda o ID do contato selecionado
  const [selecionado, setSelecionado] = useState(null);


  // Limpa os campos para cadastrar um novo contato
  function adicionarContato() {
    setSelecionado(null);
    setNome('');
    setTelefone('');
  }


  // Salva um novo contato ou altera um contato existente
  function salvarContato() {

    if (nome.trim() === '' || telefone.trim() === '') {
      Alert.alert(
        'Atenção',
        'Preencha o nome e o telefone.'
      );
      return;
    }

    // Novo contato
    if (selecionado === null) {

      const novoContato = {
        id: Date.now(),
        nome: nome,
        telefone: telefone,
      };

      setContatos([...contatos, novoContato]);

      Alert.alert(
        'Sucesso',
        'Contato cadastrado com sucesso!'
      );

    } else {

      // Alteração de contato existente
      const contatosAtualizados = contatos.map((contato) => {

        if (contato.id === selecionado) {
          return {
            ...contato,
            nome: nome,
            telefone: telefone,
          };
        }

        return contato;
      });

      setContatos(contatosAtualizados);

      Alert.alert(
        'Sucesso',
        'Contato atualizado com sucesso!'
      );
    }

    // Limpa o formulário
    setSelecionado(null);
    setNome('');
    setTelefone('');
  }


  // Carrega os dados quando um contato é selecionado
  function selecionarContato(id) {

    setSelecionado(id);

    if (id === null) {
      setNome('');
      setTelefone('');
      return;
    }

    const contatoEncontrado = contatos.find(
      (contato) => contato.id === id
    );

    if (contatoEncontrado) {
      setNome(contatoEncontrado.nome);
      setTelefone(contatoEncontrado.telefone);
    }
  }


  // Remove o contato selecionado
  function removerContato() {

    if (selecionado === null) {
      Alert.alert(
        'Atenção',
        'Selecione um contato para remover.'
      );
      return;
    }

    const novaLista = contatos.filter(
      (contato) => contato.id !== selecionado
    );

    setContatos(novaLista);

    setSelecionado(null);
    setNome('');
    setTelefone('');

    Alert.alert(
      'Sucesso',
      'Contato removido com sucesso!'
    );
  }


  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.formulario}>

        {/* Título */}
        <Text style={styles.titulo}>
          Agenda Telefônica
        </Text>


        {/* Lista de contatos */}
        <View style={styles.linha}>

          <Text style={styles.label}>
            Contato
          </Text>

          <View style={styles.pickerContainer}>

            <Picker
              selectedValue={selecionado}
              onValueChange={(valor) =>
                selecionarContato(valor)
              }
              style={styles.picker}
            >

              <Picker.Item
                label="Selecione um contato"
                value={null}
              />

              {contatos.map((contato) => (

                <Picker.Item
                  key={contato.id}
                  label={contato.nome}
                  value={contato.id}
                />

              ))}

            </Picker>

          </View>

        </View>


        {/* Nome */}
        <View style={styles.linha}>

          <Text style={styles.label}>
            Nome:
          </Text>

          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome"
          />

        </View>


        {/* Telefone */}
        <View style={styles.linha}>

          <Text style={styles.label}>
            Telefone:
          </Text>

          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Digite o telefone"
            keyboardType="phone-pad"
          />

        </View>


        {/* Botões */}
        <View style={styles.areaBotoes}>

          <Pressable
            style={styles.botao}
            onPress={adicionarContato}
          >
            <Text>Adicionar</Text>
          </Pressable>


          <Pressable
            style={styles.botao}
            onPress={removerContato}
          >
            <Text>Remover</Text>
          </Pressable>


          <Pressable
            style={styles.botao}
            onPress={salvarContato}
          >
            <Text>Salvar</Text>
          </Pressable>

        </View>

      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  formulario: {
    width: '90%',
    maxWidth: 500,
    padding: 20,
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 35,
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  label: {
    width: 90,
    fontSize: 16,
  },

  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
  },

  pickerContainer: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
  },

  picker: {
    width: '100%',
  },

  areaBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },

  botao: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#eeeeee',
  },

});