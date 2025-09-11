# BlockchainApi

API simples para consultar carteiras e transações usando dados da [Blockchain.com](https://www.blockchain.com/)

---

## 🧾 Sobre

Esta aplicação permite:

- Obter dados de carteiras (wallets)  
- Consultar transações associadas  
- Mostrar esses dados de forma simples no frontend

---

## 🔧 Tecnologias usadas

| Camada | Ferramentas |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend / API | (não há backend separado — usa chamadas diretas para Blockchain.com) |
| Hospedagem / Deploy | GitHub Pages *(aparentemente já disponível em: `luizcolombo.github.io/BlockchainApi`)* :contentReference[oaicite:0]{index=0} |

---

## 🚀 Como executar localmente

1. Clone este repositório:
   ```bash
   git clone https://github.com/LuizColombo/BlockchainApi.git

2. Entre na pasta do projeto: 
   cd BlockchainApi

3. Abra o arquivo index.html no seu navegador (ou use um servidor local, se preferir)
Exemplos de servidor simples:
  - Usando Python 3:
    python3 -m http.server
  - Usando Node.js / pacote http-server:
    npx http-server

🧩 Estrutura do projeto
```text
BlockchainApi/
├── index.html          # Interface principal da aplicação
├── style.css           # Estilos
├── script.js           # Lógica JS para fazer as requisições e exibir os dados
├── img/                # Imagens 
└── README.md
```
📋 Funcionalidades

  - Digitar um endereço de carteira (wallet address) para consultar dados da blockchain
  - Visualizar lista de transações associadas ao endereço
  - Lidagem básica de erros (ex: endereço inválido, sem transações, etc.)

✅ Possíveis melhorias

  - Introduzir um backend para fazer caching ou proteger chamadas à API
  - Melhorar a interface de usuário (UX / UI)
  - Adicionar suporte a mais blockchains além da fornecida pela Blockchain.com
  - Mostrar mais detalhes de cada transação (taxas, status, etc.)
  - Autenticação / segurança, se for expandir para uso real

👤 Contato

  - Autor: Luiz Colombo
  - GitHub: @LuizColombo
  - Email: colombo.devops@gmail.com
