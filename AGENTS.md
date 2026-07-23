# AGENTS.md

## Objetivo

Este projeto contém exclusivamente a app GameNight, um marcador de pontos
para jogos de tabuleiro.

## Regras

- Manter a app 100% client-side: sem backend, sem tracking, sem login.
- Os dados dos jogos vivem só em localStorage (`src/data/storage.ts`) —
  não adicionar sincronização remota sem pedido explícito.
- Apagar um jogo tem de continuar a pedir confirmação antes de o remover.
- Não colocar aqui código do portfólio ou de outras aplicações.

## Validação

```bash
npm run check
npm run build
```
