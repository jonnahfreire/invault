# Invault - Secret Management System

Invault é um sistema de gerenciamento de segredos (secret manager) escrito em TypeScript com arquitetura inspirada em Domain-Driven Design (DDD). A solução prioriza segurança, auditabilidade e isolamento multi-tenant para uso em ambientes corporativos e de infraestrutura.

## ✅ Objetivo da Aplicação

- Armazenar e versionar segredos (credenciais, tokens, certificados, chaves) de forma criptografada
- Gerenciar chaves de criptografia com suporte a derivação e rotação
- Autenticar e autorizar usuários em um modelo RBAC (role-based access control)
- Rastrear ações via trilhas de auditoria (audit logs)
- Suportar estruturas de organizações e permissões em nível de organização

## 🏗️ Arquitetura Geral

O projeto segue a separação em camadas e DDD:

- `src/domain/`: modelos do domínio, entidades, value objects, repositórios, regras de negócio e exceções
- `src/application/`: casos de uso, serviços, orquestração de fluxo de aplicação
- `src/infrastructure/`: integração com banco de dados (Sequelize), repositórios concretos, seed, HTTP e outros adaptadores
- `src/modules/`: composição de módulos de dependências (`invault.module.ts`, `app.module.ts`)
- `src/main.ts`: entrada da aplicação e bootstrapping

## 📦 Principais Componentes

- `domain/auth`: credenciais, identidade de autenticação
- `domain/organization`: organização, permissão, função, vínculo, escopo
- `domain/vault`: cofre e compartilhamento seguro
- `domain/secret`: segredo, versionamento e repositório
- `domain/key`: mestre e dados de chave, derivação e criptografia
- `domain/audit`: evento de auditoria e repositório

- `application/services`: `auth.service.ts`, `key-manager.service.ts`, `secret.service.ts`, `audit.service.ts`, `authorization.service.ts`, `encryption.service.ts`
- `application/usecases`: implementação de fluxos de negócio para `organization`, `secret`, `user`, `vault`
- `infrastructure/database`: conexão Sequelize e sementes (`seed.service.ts`)
- `infrastructure/repositories`: repositórios concretos implementando interfaces de domínio

## 🔐 Segurança e Criptografia

- AES-256-GCM para dados em repouso
- Gestão de chaves via `KeyEncryptionKey`, `DataEncryptionKey` e `Shamir Secret Sharing`
- Argon2id para derivação de senha e funções de hashing
- Exceções de domínio específicas (`environment.exception.ts`, `conflict.exception.ts` etc.)

## ⚙️ Recursos Disponíveis

- CRUD de segredos com versionamento
- Rotacionamento de chaves e políticas de rotação
- Autenticação sólida e autorização baseada em funções
- Suporte a múltiplas organizações/tenants
- Auditoria detalhada de operações críticas

## 🚀 Como Executar

1. Instalar dependências:

```bash
npm install
```

2. Rodar aplicação:

```bash
npm run start:dev
```

3. Testes:

```bash
npm test
```

## 🛠️ Extensões previstas

- API REST completa (controllers + rotas)
- UI de gerenciamento (dashboards)
- Suporte a OAuth / OpenID Connect
- CLI de administração
- Operações de migração de segredos entre instâncias

## 📄 Licença

MIT

---

> **Nota**: personalize as seções de ambiente e variáveis (`.env`) conforme seu setup local antes de uso em produção.
