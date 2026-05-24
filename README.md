# Ford Compare App (3ESPV Mobile IoT Sprint)

Um aplicativo móvel React Native construído com Expo, permitindo que os usuários naveguem, visualizem detalhes e comparem veículos da Ford. Este projeto é integrado ao Firebase para dados e autenticação, e utiliza Zustand para gerenciamento de estado.

## 📱 Funcionalidades
- **Navegação de Veículos:** Visualize uma lista de veículos disponíveis (`/browse`).
- **Detalhes do Veículo:** Visualize informações detalhadas sobre um veículo específico (`/vehicle/[id]`).
- **Comparação de Veículos:** Adicione veículos a uma lista para comparar suas especificações/recursos lado a lado (`/compare`).
- **Autenticação:** Login e gerenciamento de usuários (`/auth`).

## 🛠 Tecnologias
- **Framework:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- **Navegação:** [Expo Router](https://docs.expo.dev/router/introduction/) (roteamento baseado em arquivos)
- **Gerenciamento de Estado:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend/Banco de Dados:** [Firebase](https://firebase.google.com/) (Autenticação, Firestore/Realtime Database)
- **Linguagem:** TypeScript

---

## 🚀 Como Começar

### Pré-requisitos
- [Node.js](https://nodejs.org/) (recomendado v18+)
- `npm` ou `yarn` instalado
- O aplicativo Expo Go no seu dispositivo físico, ou um Simulador iOS / Emulador Android instalado.

### 1. Instalação
Clone o repositório e instale as dependências:
```bash
npm install
```

### 2. Variáveis de Ambiente
Este projeto depende do Firebase. Você precisa fornecer suas chaves de API para rodar o aplicativo.
1. Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp .envExample .env
   ```
2. Abra o arquivo `.env` e substitua os valores de exemplo pelas credenciais reais do seu projeto Firebase.

### 3. Rodando o Aplicativo
Inicie o servidor de desenvolvimento do Expo:
```bash
npx expo start
```

Assim que o servidor estiver rodando, você pode pressionar as seguintes teclas no terminal para abrir o app:
- **`a`**: Abrir no Emulador Android
- **`i`**: Abrir no Simulador iOS
- **`w`**: Abrir no Navegador Web
- Ou escaneie o código QR usando o aplicativo **Expo Go** no seu dispositivo móvel físico.

## 📁 Destaques da Estrutura do Projeto
- **`app/`**: Contém as páginas das telas e a arquitetura de roteamento (Expo Router).
- **`services/`**: Chamadas de API e regras de negócio (ex: `vehicleService.ts`).
- **`src/config/`**: Configuração de integrações externas (configuração do Firebase).
- **`store/`**: Configuração do gerenciamento de estado global (`compareStore.ts`).
- **`types/`**: Interfaces e tipos TypeScript.

## Integrantes
- Joao Victor Oliveira dos Santos - RM557948
- Matheus Alcântara Estevão - RM558193
- Nicolle Pellegrino Jelinski - RM558610
- Pedro Pereira dos Santos - RM552047
- Eric Segawa Montagner- RM558224

