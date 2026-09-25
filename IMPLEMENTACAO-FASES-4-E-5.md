# Implementacao das Fases 4 e 5

## Situacao atual

A aplicacao ja possui uma experiencia 3D funcional com Three.js, animacao por scroll, rotacao manual, zoom por etapa, texto dinamico e modo de movimento reduzido.

O modelo atual e procedural. Ele funciona como fallback enquanto o modelo ultrarrealista nao estiver pronto.

## Modelo 3D real

Quando o modelo for criado no Blender, exporte-o no formato:

```text
GLB
```

Coloque o arquivo neste caminho:

```text
public/models/sapato-social.glb
```

A aplicacao tenta carregar esse arquivo automaticamente. Se o arquivo nao existir, estiver incompleto ou nao puder ser carregado, o modelo procedural continua sendo exibido.

## Componentes obrigatorios

Os objetos do arquivo 3D devem permanecer separados e usar estes nomes:

```text
solado
palmilha
cabedal
lingueta
calcanhar
cadarco
cola
caixa
```

Os nomes podem usar letras maiusculas, minusculas, espacos, hifens ou sublinhados. O carregador normaliza essas variacoes.

## Etapas da experiencia

1. Sapato social completo.
2. Solado em destaque.
3. Palmilha em destaque.
4. Cabedal em couro ou material sintetico, com corte, producao e costura.
5. Cola usada na montagem.
6. Cadarco e caixa de sapatos no acabamento final.

Em cada etapa, o sistema atualiza:

- Produto destacado.
- Titulo e explicacao.
- Camera e zoom.
- Ponto de foco do modelo.
- Posicao dos componentes.
- Botao `Saiba mais`.

## Preparacao no Blender

- Modele cada componente como um objeto separado.
- Aplique transformacoes antes da exportacao.
- Corrija normais e intersecoes.
- Use nomes padronizados.
- Prepare materiais separados para couro, sintetico, solado, palmilha, cola, cadarco e caixa.
- Reduza a quantidade de poligonos em areas que nao serao destacadas.
- Comprima as texturas para uso na web.
- Exporte em GLB.

## Validacao

Depois de colocar o arquivo na pasta `public/models`, execute:

```powershell
npm run build
```

Em seguida, inicie o servidor:

```powershell
npm run dev
```

Acesse:

```text
http://127.0.0.1:5173/
```

Verifique se:

- O modelo GLB aparece no lugar do procedural.
- O scroll altera as etapas.
- O modelo gira e aproxima o componente correto.
- O botao `Saiba mais` abre as informacoes.
- O WhatsApp continua disponivel.
- O modelo permanece legivel em telas menores.

## Pendencia externa

A modelagem ultrarrealista ainda depende da criacao e exportacao do arquivo `sapato-social.glb`. O computador utilizado apresentou incompatibilidade grafica com a versao instalada do Blender. Enquanto isso, a aplicacao permanece funcional com o fallback procedural.
