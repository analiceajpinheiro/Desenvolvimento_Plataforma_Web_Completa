import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../utils/errors';

const prisma = new PrismaClient();

export const userRepository = {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundError('Usuário');
    return user;
  },

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async findAll(limit = 10, skip = 0, role?: string) {
    const where = role ? { role } : {};
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          specialty: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);
    return { data, total };
  },

  async create(data: any) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email já está registrado');
    }

    return await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        specialty: true,
        isActive: true,
        createdAt: true,
      },
    });
  },

  async update(id: string, data: any) {
    await this.findById(id);
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        specialty: true,
        isActive: true,
        updatedAt: true,
      },
    });
  },

  async delete(id: string) {
    await this.findById(id);
    return await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  },
};

export const patientRepository = {
  async findById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
    });
    if (!patient) throw new NotFoundError('Paciente');
    return patient;
  },

  async findByCPF(cpf: string) {
    return await prisma.patient.findUnique({
      where: { cpf },
    });
  },

  async findAll(limit = 10, skip = 0) {
    const [data, total] = await Promise.all([
      prisma.patient.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count(),
    ]);
    return { data, total };
  },

  async search(query: string, limit = 10) {
    return await prisma.patient.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { cpf: { contains: query } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });
  },

  async create(data: any) {
    const existingByCPF = await this.findByCPF(data.cpf);
    if (existingByCPF) {
      throw new ConflictError('CPF já está registrado');
    }

    const existingByEmail = await prisma.patient.findUnique({
      where: { email: data.email },
    });
    if (existingByEmail) {
      throw new ConflictError('Email já está registrado');
    }

    return await prisma.patient.create({
      data,
    });
  },

  async update(id: string, data: any) {
    await this.findById(id);

    if (data.email) {
      const existingByEmail = await prisma.patient.findFirst({
        where: { email: data.email, id: { not: id } },
      });
      if (existingByEmail) {
        throw new ConflictError('Email já está registrado');
      }
    }

    return await prisma.patient.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    await this.findById(id);
    // Soft delete
    return await prisma.patient.update({
      where: { id },
      data: { email: `${id}-deleted-${Date.now()}@deleted.com` },
    });
  },
};

export const appointmentRepository = {
  async findById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true, patient: true },
    });
    if (!appointment) throw new NotFoundError('Agendamento');
    return appointment;
  },

  async findAll(limit = 10, skip = 0) {
    const [data, total] = await Promise.all([
      prisma.appointment.findMany({
        skip,
        take: limit,
        include: { doctor: true, patient: true },
        orderBy: { date: 'asc' },
      }),
      prisma.appointment.count(),
    ]);
    return { data, total };
  },

  async findByPatientId(patientId: string, limit = 10, skip = 0) {
    const [data, total] = await Promise.all([
      prisma.appointment.findMany({
        where: { patientId },
        skip,
        take: limit,
        include: { doctor: true },
        orderBy: { date: 'asc' },
      }),
      prisma.appointment.count({ where: { patientId } }),
    ]);
    return { data, total };
  },

  async findByDoctorId(doctorId: string, limit = 10, skip = 0) {
    const [data, total] = await Promise.all([
      prisma.appointment.findMany({
        where: { doctorId },
        skip,
        take: limit,
        include: { patient: true },
        orderBy: { date: 'asc' },
      }),
      prisma.appointment.count({ where: { doctorId } }),
    ]);
    return { data, total };
  },

  async findConflicts(doctorId: string, date: Date, excludeId?: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.appointment.findMany({
      where: {
        doctorId,
        status: 'CONFIRMED',
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
  },

  async create(data: any) {
    return await prisma.appointment.create({
      data,
      include: { doctor: true, patient: true },
    });
  },

  async update(id: string, data: any) {
    await this.findById(id);
    return await prisma.appointment.update({
      where: { id },
      data,
      include: { doctor: true, patient: true },
    });
  },

  async delete(id: string) {
    await this.findById(id);
    return await prisma.appointment.delete({
      where: { id },
    });
  },
};
