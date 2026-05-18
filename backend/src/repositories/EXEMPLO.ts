// Exemplo de estrutura para um Repository
// Este é um template para orientar o desenvolvimento

import { PrismaClient } from '@prisma/client';

/**
 * Repositories são responsáveis pela comunicação com o banco de dados
 * Eles abstraem a lógica de acesso aos dados
 * 
 * @example
 * export class UserRepository {
 *   static async findById(id: string) {
 *     return prisma.user.findUnique({ where: { id } });
 *   }
 *   
 *   static async create(data: CreateUserInput) {
 *     return prisma.user.create({ data });
 *   }
 * }
 */

const prisma = new PrismaClient();

export class ExampleRepository {
  /**
   * Busca um registro por ID
   */
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Lista todos os registros
   */
  static async findAll() {
    return prisma.user.findMany();
  }

  /**
   * Cria um novo registro
   */
  static async create(data: any) {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Atualiza um registro
   */
  static async update(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta um registro (soft delete)
   */
  static async delete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
