// Exemplo de estrutura para um Controller
// Este é um template para orientar o desenvolvimento

import { Request, Response } from 'express';

/**
 * @example
 * import { AuthController } from './AuthController';
 * 
 * router.post('/login', AuthController.login);
 * router.post('/logout', AuthController.logout);
 */

export class ExampleController {
  /**
   * Descrição do que o método faz
   * 
   * @param req Express Request com body: { email, password }
   * @param res Express Response
   */
  static async handleRequest(req: Request, res: Response) {
    try {
      // 1. Validar entrada
      // 2. Chamar Service
      // 3. Retornar resposta

      res.status(200).json({
        success: true,
        data: {
          // dados aqui
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao processar requisição',
      });
    }
  }
}
