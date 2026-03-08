# Invault - Secret Management System

A secure secret management system built with TypeScript using Domain-Driven Design (DDD) principles.

## Features

- **Secret Management**: Store, version, and retrieve encrypted secrets
- **Key Management**: Hierarchical key management with rotation support
- **Authentication & Authorization**: User authentication with role-based permissions
- **Audit Logging**: Comprehensive audit trail for all operations
- **Organization Support**: Multi-tenant organization structure
- **Encryption**: AES-256-GCM encryption for data at rest

## Architecture

The system follows DDD principles with the following structure:

- **Domain**: Core business entities and rules
- **Application**: Use case services and business logic
- **Infrastructure**: Data persistence and external integrations

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Run the demo:
```bash
npx tsx src/index.ts
```

## Domain Entities

- **Organization**: Multi-tenant organizational units
- **User**: System users with authentication
- **Role**: Authorization roles with permissions
- **Secret**: Encrypted secrets with versioning
- **Key**: Cryptographic keys for encryption
- **AuditEvent**: Audit log entries

## Security Features

- AES-256-GCM encryption
- Role-based access control (RBAC)
- Comprehensive audit logging
- Secret versioning and rotation
- Secure key management

## Development

This is an initial working version demonstrating core vault functionality. Future enhancements may include:

- REST API endpoints
- Database persistence
- Key rotation policies
- Advanced authentication methods
- UI interface

## License

ISC