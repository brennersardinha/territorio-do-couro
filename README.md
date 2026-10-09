# Território do Couro

Site narrativo da Território do Couro, desenvolvido com **Vite**, HTML, CSS e JavaScript.

## Requisitos

- [Node.js](https://nodejs.org/) instalado;
- npm disponível no terminal;
- celular e computador conectados à mesma rede local para testar em um dispositivo físico.

## Instalação

Abra o terminal na pasta do projeto:

```powershell
cd C:\Users\SERVIDOR\territorio-do-couro
```

Instale as dependências:

```bash
npm install
```

## Executar no computador

Inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

O terminal exibirá um endereço semelhante a:

```text
http://localhost:5173/
```

Abra esse endereço no navegador do computador.

> Não use o **Live Server** para este projeto. O Live Server apenas entrega arquivos estáticos e não processa corretamente o fluxo do Vite, incluindo o import do CSS e do JavaScript em `src/main.js`.

## Executar para testar no celular

Para permitir que outros dispositivos da rede acessem o site, execute:

```bash
npm run dev -- --host 0.0.0.0
```

O Vite exibirá vários endereços de rede. No Windows, descubra o endereço da rede local com:

```powershell
ipconfig
```

Procure o adaptador que está conectado à rede principal. Neste computador, o endereço correto é:

```text
192.168.15.9
```

No celular, conectado à mesma rede Wi-Fi ou Ethernet, abra:

```text
http://192.168.15.9:5173
```

### Endereços que normalmente não devem ser usados

Interfaces virtuais como estas geralmente não são acessíveis pelo celular:

```text
172.25.176.1
54.232.189.113
172.17.224.1
```

O endereço correto normalmente começa com `192.168.x.x` quando o computador está conectado a um roteador doméstico ou de escritório.

## Se o celular não conseguir abrir o site

### 1. Verifique a rede

- Confirme que o celular e o computador estão na mesma rede.
- Desative temporariamente a rede móvel do celular para garantir que ele está usando o Wi-Fi correto.
- Confira se o endereço IP do computador não mudou executando `ipconfig` novamente.

### 2. Permita o Node.js no Firewall do Windows

1. Abra **Segurança do Windows**.
2. Acesse **Firewall e proteção de rede**.
3. Clique em **Permitir um aplicativo pelo firewall**.
4. Permita o **Node.js** em redes privadas.

Como alternativa, abra o PowerShell como administrador e execute:

```powershell
New-NetFirewallRule `
  -DisplayName "Vite Dev Server 5173" `
  -Direction Inbound `
  -Protocol TCP `
  -LocalPort 5173 `
  -Action Allow `
  -Profile Private
```

Depois, tente novamente:

```text
http://192.168.15.9:5173
```

## Testar o layout mobile no computador

No Chrome ou Edge:

1. Abra o site pelo endereço do Vite.
2. Pressione `Ctrl + Shift + I` para abrir o DevTools.
3. Pressione `Ctrl + Shift + M` para ativar o modo de dispositivo móvel.
4. Teste diferentes aparelhos e tamanhos, como:
   - iPhone SE;
   - iPhone 12, 13 ou 14;
   - Pixel 7;
   - Galaxy S20;
   - `375 x 812`;
   - `390 x 844`;
   - `412 x 915`.

O DevTools permite verificar dimensões, CSS, JavaScript, rede e erros no console.

> A simulação do DevTools não reproduz perfeitamente todas as políticas de autoplay de um iPhone. Para validar o vídeo de fundo, faça também um teste em um celular real.

## Testar o vídeo no mobile

Ao testar o vídeo, verifique:

- se o vídeo aparece ao abrir a seção da experiência;
- se o vídeo muda conforme a rolagem da página;
- se o poster aparece durante o carregamento;
- se não existem erros no Console;
- se o arquivo de vídeo aparece com status `200` na aba **Network**.

O vídeo usa `muted` e `playsinline` para permitir reprodução compatível com dispositivos móveis. O `poster` funciona como fallback caso o navegador ainda esteja carregando o vídeo ou bloqueie a reprodução automática.

## Gerar o build de produção

Para criar a versão otimizada do site:

```bash
npm run build
```

Os arquivos gerados ficam na pasta `dist`.

Para testar localmente o build de produção:

```bash
npm run preview
```

O Vite exibirá um endereço local, normalmente:

```text
http://localhost:4173
```

Para permitir acesso externo ao preview:

```bash
npm run preview -- --host 0.0.0.0
```

## Scripts disponíveis

| Comando | Função |
| --- | --- |
| `npm install` | Instala as dependências do projeto |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `npm run dev -- --host 0.0.0.0` | Inicia o Vite acessível na rede local |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Executa localmente o build de produção |

## Estrutura principal

```text
.
├── index.html
├── package.json
├── src/
│   ├── main.js
│   └── style.css
├── VideoAnimacao.mp4
├── VideoAnimacao-poster.jpg
└── README.md
```
