# GameNight

Marcador de pontos para serões de jogos de tabuleiro: cria um jogo, junta
os jogadores, regista os pontos ronda a ronda e revela a classificação
quando quiseres.

## Ideia

- Cada jogo tem nome, data e uma lista de jogadores definida no início.
- Pontuação registada ronda a ronda numa tabela, com total sempre visível.
- Botão "Ver classificação" para revelar um pódio com medalhas (🥇🥈🥉),
  separado da tabela — pensado para o momento de suspense do fim do jogo.
- Histórico de jogos guardado no browser (localStorage), com o líder atual
  visível na lista sem precisar de abrir o jogo.
- "Terminar jogo" fecha a tabela para novas rondas, mas o jogo pode ser
  reaberto a qualquer momento.
- 100% client-side, sem contas, sem backend.

## Executar

```bash
npm install
npm run dev
```

Abrir <http://127.0.0.1:5181>.

## Validar

```bash
npm run check
npm run build
```

## Ideias para evoluir

- Exportar/partilhar a classificação final como imagem.
- Suportar pontuação negativa com validação visual.
- Estatísticas ao longo do tempo (quem ganha mais vezes a que jogo).
- Tradução da interface para PT/EN/DE, como as outras apps do portfólio.

O README deve ser atualizado quando o conceito, as funcionalidades ou as
prioridades mudarem.

## Nota técnica — Google Analytics

O Analytics só é carregado depois de o utilizador aceitar os cookies. A função
`gtag` deve enviar o objeto nativo `arguments` para `dataLayer`:

```js
function gtag() {
  dataLayer.push(arguments)
}
```

Não substituir por `dataLayer.push(args)` com um rest parameter (`...args`):
apesar de o script da Google carregar, o comando `config` e o `page_view` podem
não ser processados.
