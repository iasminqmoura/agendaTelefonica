# Agenda Telefônica

## Descrição

A **Agenda Telefônica** é um aplicativo mobile desenvolvido com React Native e Expo, que permite cadastrar, consultar, editar e remover contatos telefônicos de maneira simples e prática.

O aplicativo possui uma interface personalizada, com foco na organização e facilidade de uso.

## Funcionalidades

- **Cadastrar contatos:** adicionar novos contatos com nome e telefone.
- **Consultar contatos:** visualizar os contatos cadastrados por meio de uma lista de seleção.
- **Editar contatos:** selecionar um contato existente e atualizar suas informações.
- **Remover contatos:** excluir contatos cadastrados.
- **Formatação de telefone:** aplicar automaticamente uma máscara ao número digitado.
- **Validação de dados:** verificar o preenchimento dos campos e a quantidade de dígitos do telefone.
- **Armazenamento local:** manter os contatos salvos mesmo após fechar o aplicativo.

## Tecnologias Utilizadas

- **React Native:** desenvolvimento da interface mobile.
- **JavaScript:** implementação da lógica do aplicativo.
- **Expo:** ambiente de desenvolvimento e execução.
- **AsyncStorage:** armazenamento local dos contatos.
- **React Hooks:** gerenciamento dos estados e carregamento dos dados.
- **Expo Google Fonts:** utilização de fonte personalizada na interface.

## Funcionamento

O aplicativo apresenta três campos principais:

1. **Contato:** permite selecionar um contato já cadastrado.
2. **Nome:** campo para inserir ou editar o nome.
3. **Telefone:** campo para inserir ou editar o número telefônico.

Também possui três botões:

- **SALVAR:** cadastra um novo contato ou salva alterações em um contato existente.
- **ADICIONAR:** limpa os campos para iniciar um novo cadastro.
- **REMOVER:** exclui o contato selecionado.

Os dados são armazenados localmente no dispositivo utilizando AsyncStorage.

## Como executar o projeto

**1. Clone o repositório:**

```bash
git clone URL_DO_REPOSITORIO
```

**2. Acesse a pasta do projeto:**

```bash
cd agendaTelefonica
```

**3. Instale as dependências:**

```bash
npm install
```

**4. Inicie o Expo:**

```bash
npx expo start
```

**5. Execute o aplicativo:**

Abra o aplicativo **Expo Go** no celular e escaneie o QR Code exibido no terminal.

O computador e o celular devem estar conectados à mesma rede Wi-Fi para utilizar a conexão local.

## Estrutura do Projeto

```text
agendaTelefonica/
├── assets/
├── App.js
├── app.json
├── package.json
├── package-lock.json
└── README.md
```

- **App.js:** contém a interface e as funcionalidades da agenda.
- **assets/:** pasta destinada aos recursos visuais do projeto.
- **app.json:** configurações do aplicativo Expo.
- **package.json:** dependências e scripts do projeto.
- **package-lock.json:** registro das versões das dependências.
- **README.md:** documentação do projeto.

## Objetivo

O objetivo do projeto é colocar em prática os conhecimentos adquiridos na disciplina de **Programação para Dispositivos Móveis**, utilizando React Native e Expo.

A aplicação permite exercitar conceitos como criação de interfaces, gerenciamento de estados, manipulação de dados, validação de formulários e armazenamento local.