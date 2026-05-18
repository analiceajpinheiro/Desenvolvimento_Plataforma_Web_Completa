// Exemplo de estrutura para um Service
// Este é um template para orientar o desenvolvimento

/**
 * Services contêm a lógica de negócio
 * Eles são chamados pelos Controllers
 * 
 * @example
 * export class AuthService {
 *   static async login(email: string, password: string) {
 *     // Validar email
 *     // Buscar usuário no banco (Repository)
 *     // Validar senha (bcrypt)
 *     // Gerar JWT
 *     // Retornar token
 *   }
 * }
 */

export class ExampleService {
  /**
   * Executa a lógica de negócio principal
   */
  static async execute(data: any) {
    try {
      // 1. Validação de dados
      // 2. Verificação de regras de negócio
      // 3. Chamada ao Repository
      // 4. Transformação de dados se necessário
      // 5. Retorno do resultado

      return {
        success: true,
        result: null,
      };
    } catch (error) {
      throw new Error(`Erro no serviço: ${error}`);
    }
  }
}
