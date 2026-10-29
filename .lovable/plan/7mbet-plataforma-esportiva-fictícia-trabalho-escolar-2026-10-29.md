# 7MBET — plataforma esportiva fictícia (trabalho escolar)

Simulação educacional: nenhum dinheiro real, só créditos fictícios. Tudo em português.

## Identidade visual

- Cores: azul-marinho #062653 (fundo/cabeçalho), azul #0789F9 (destaques), branco, cinza-claro #F2F4F7, verde #20A464 (positivo).
- Logo enviada (7M branco + BET azul) usada no cabeçalho e como ícone do site; a imagem vertical com faixas diagonais vira fundo do banner principal.
- Tipografia: Barlow Condensed (títulos, itálico esportivo como a logo) + Barlow (texto). Cantos levemente arredondados, animações suaves.
- Celular primeiro (a pré-visualização está em celular): menu inferior/gaveta no mobile, cupom como painel deslizante; no computador, cupom fixo à direita.

## Páginas

- **Início** (`/`): cabeçalho com logo, menu (Início, Futebol, Basquete, Tênis, Ao Vivo, Resultados), busca de times/campeonatos, banner "A emoção do esporte começa aqui" com botões "Explorar jogos" e "Ver resultados", partidas em destaque, campeonatos populares, próximos jogos, rodapé com aviso educacional.
- **Futebol / Basquete / Tênis**: lista de cartões de partida (escudos gerados com iniciais/cores, times, campeonato, data/hora, odds 1-X-2 — tênis/basquete sem empate, status Em breve/Ao vivo/Encerrada) com filtros por campeonato, data e status.
- **Ao Vivo**: placar, cronômetro fictício que avança, indicador pulsante "AO VIVO", estatísticas (posse, chutes, escanteios), odds ilustrativas, aviso de dados simulados.

**Resultados**: cartões de partidas encerradas com placar final, campeonato, data; histórico agrupado por dia.

&nbsp;

- **Busca**: resultados da pesquisa de times/competições.
- **Entrar / Cadastrar**: telas visuais; "entrar" cria apenas uma sessão demo com apelido, sem guardar senha.
- **Admin (demo)**: adicionar/editar/excluir partidas, times, campeonato, data/hora, placar, status e odds; botão "restaurar dados de exemplo". Aviso de que não é área protegida.

## Cupom demonstrativo

Uma seleção por partida (clicar na outra odd troca), lista de eventos, remover, valor fictício (saldo demo de 1.000 créditos), odd combinada, retorno teórico, limpar, botão "Simular aposta" que só registra no histórico local. Aviso "Simulação educacional. Nenhuma aposta real é realizada".

## Detalhes técnicos

- React + TypeScript + Tailwind, rotas TanStack separadas por página, head() com títulos próprios.
- Dados de exemplo em `src/data`, estado (partidas, cupom, sessão, preferências) em um store com LocalStorage, lido após carregar a página para evitar divergência.
- Lógica do cupom (odd combinada = produto, retorno = valor × odd, uma seleção por partida) em funções puras com testes vitest.
- Logos enviadas hospedadas via Lovable Assets; favicon gerado a partir da logo quadrada.