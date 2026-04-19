export type TransactionPropagation = "REQUIRED" | "REQUIRES_NEW";

export interface TransactionalOptions {
  /**
   * Define como a transação deve se propagar no fluxo atual.
   * - REQUIRED (padrão): reutiliza a transação ativa; se não houver, cria nova.
   * - REQUIRES_NEW: força abertura de uma nova transação para o bloco anotado.
   */
  propagation?: TransactionPropagation;

  /**
   * Lista de tipos de erro que DEVEM provocar rollback.
   * Se vazio/não informado, a regra padrão é rollback para qualquer erro.
   */
  rollbackFor?: Array<new (...args: any[]) => Error>;

  /**
   * Lista de tipos de erro que NÃO devem provocar rollback.
   * Nesses casos, a transação é confirmada (commit) e o erro é relançado.
   */
  noRollbackFor?: Array<new (...args: any[]) => Error>;
}
