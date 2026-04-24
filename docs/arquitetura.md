# Arquitetura do ServiceFlow

O ServiceFlow é uma aplicação full stack para gestão de chamados técnicos, atendimento interno e controle de SLA.

## Estrutura

- Back-end: Java, Spring Boot, Maven, Spring Data JPA, Spring Security e H2/PostgreSQL.
- Front-end: Angular, TypeScript, SCSS e consumo de API REST.
- Banco inicial: H2 em memória para desenvolvimento.
- Banco recomendado para produção: PostgreSQL.

## Fluxo da aplicação

Front-end Angular consome a API REST do Spring Boot. O back-end processa as regras de negócio, acessa o banco via JPA e retorna os dados em formato JSON.