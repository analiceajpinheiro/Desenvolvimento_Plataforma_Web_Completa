import { PrismaClient, Role, ExamType, ExamStatus } from '@prisma/client';
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
    const where = role ? { role: role as Role } : {};
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

export const medicalRecordRepository = {
  async findById(id: string) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            specialty: true,
            isActive: true,
            createdAt: true,
          },
        },
        prescriptions: true,
      },
    });
    if (!record) throw new NotFoundError('Prontuário');
    return record;
  },

  async findAll(filters?: { patientId?: string; doctorId?: string; appointmentId?: string }) {
    const where: { patientId?: string; doctorId?: string; appointmentId?: string } = {};
    if (filters?.patientId) where.patientId = filters.patientId;
    if (filters?.doctorId) where.doctorId = filters.doctorId;
    if (filters?.appointmentId) where.appointmentId = filters.appointmentId;

    return await prisma.medicalRecord.findMany({
      where,
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            name: true,
            role: true,
            specialty: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByAppointmentId(appointmentId: string) {
    return await prisma.medicalRecord.findUnique({
      where: { appointmentId },
    });
  },

  async create(data: any) {
    return await prisma.medicalRecord.create({
      data,
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            name: true,
            role: true,
            specialty: true,
          },
        },
        prescriptions: true,
      },
    });
  },

  async update(id: string, data: any) {
    await this.findById(id);
    return await prisma.medicalRecord.update({
      where: { id },
      data,
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            name: true,
            role: true,
            specialty: true,
          },
        },
        prescriptions: true,
      },
    });
  },

  async delete(id: string) {
    await this.findById(id);
    return await prisma.medicalRecord.delete({
      where: { id },
    });
  },
};

export const prescriptionRepository = {
  async findByMedicalRecord(medicalRecordId: string) {
    return await prisma.prescription.findMany({
      where: { medicalRecordId },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            role: true,
            specialty: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string) {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            role: true,
            specialty: true,
          },
        },
        medicalRecord: true,
      },
    });
    if (!prescription) throw new NotFoundError('Prescrição');
    return prescription;
  },

  async create(data: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
    doctorId: string;
    medicalRecordId: string;
  }) {
    return await prisma.prescription.create({
      data,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            role: true,
            specialty: true,
          },
        },
      },
    });
  },

  async update(
    id: string,
    data: {
      medication?: string;
      dosage?: string;
      frequency?: string;
      duration?: string;
      notes?: string;
    }
  ) {
    await this.findById(id);
    return await prisma.prescription.update({
      where: { id },
      data,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            role: true,
            specialty: true,
          },
        },
      },
    });
  },

  async delete(id: string) {
    await this.findById(id);
    return await prisma.prescription.delete({
      where: { id },
    });
  },
};

// ===== EXAM REPOSITORY =====
export const examRepository = {
  async findById(id: string) {
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          select: { id: true, name: true, email: true, role: true, specialty: true, isActive: true, createdAt: true },
        },
      },
    });
    if (!exam) throw new NotFoundError('Exame');
    return exam;
  },

  async findAll(limit = 10, skip = 0, filters?: { patientId?: string; doctorId?: string; status?: ExamStatus }) {
    const where: any = {};
    if (filters?.patientId) where.patientId = filters.patientId;
    if (filters?.doctorId) where.doctorId = filters.doctorId;
    if (filters?.status) where.status = filters.status;

    const [data, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: { select: { id: true, name: true, cpf: true } },
          doctor: { select: { id: true, name: true, specialty: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.exam.count({ where }),
    ]);
    return { data, total };
  },

  async create(data: {
    name: string;
    type?: ExamType;
    description?: string;
    patientId: string;
    doctorId: string;
    scheduledAt?: Date;
  }) {
    return await prisma.exam.create({
      data,
      include: {
        patient: { select: { id: true, name: true, cpf: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
      },
    });
  },

  async update(id: string, data: {
    name?: string;
    type?: ExamType;
    description?: string;
    result?: string;
    status?: ExamStatus;
    scheduledAt?: Date;
    completedAt?: Date;
  }) {
    await this.findById(id);
    return await prisma.exam.update({
      where: { id },
      data,
      include: {
        patient: { select: { id: true, name: true, cpf: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
      },
    });
  },

  async delete(id: string) {
    await this.findById(id);
    return await prisma.exam.delete({ where: { id } });
  },
};

// ===== SPECIALTY REPOSITORY =====
export const specialtyRepository = {
  async findById(id: string) {
    const specialty = await prisma.specialty.findUnique({ where: { id } });
    if (!specialty) throw new NotFoundError('Especialidade');
    return specialty;
  },

  async findByName(name: string) {
    return await prisma.specialty.findUnique({ where: { name } });
  },

  async findAll(limit = 10, skip = 0) {
    const [data, total] = await Promise.all([
      prisma.specialty.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.specialty.count(),
    ]);
    return { data, total };
  },

  async create(data: { name: string; description?: string }) {
    const existing = await this.findByName(data.name);
    if (existing) throw new ConflictError('Especialidade já cadastrada');
    return await prisma.specialty.create({ data });
  },

  async update(id: string, data: { name?: string; description?: string; isActive?: boolean }) {
    await this.findById(id);
    if (data.name) {
      const existing = await prisma.specialty.findFirst({
        where: { name: data.name, id: { not: id } },
      });
      if (existing) throw new ConflictError('Especialidade já cadastrada');
    }
    return await prisma.specialty.update({ where: { id }, data });
  },

  async delete(id: string) {
    await this.findById(id);
    return await prisma.specialty.update({ where: { id }, data: { isActive: false } });
  },
};

// ===== HEALTH PLAN REPOSITORY =====
export const healthPlanRepository = {
  async findById(id: string) {
    const plan = await prisma.healthPlan.findUnique({
      where: { id },
      include: { patient: { select: { id: true, name: true, cpf: true } } },
    });
    if (!plan) throw new NotFoundError('Convênio');
    return plan;
  },

  async findByPlanNumber(planNumber: string) {
    return await prisma.healthPlan.findUnique({ where: { planNumber } });
  },

  async findAll(limit = 10, skip = 0, patientId?: string) {
    const where: any = patientId ? { patientId } : {};
    const [data, total] = await Promise.all([
      prisma.healthPlan.findMany({
        where,
        skip,
        take: limit,
        include: { patient: { select: { id: true, name: true, cpf: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.healthPlan.count({ where }),
    ]);
    return { data, total };
  },

  async create(data: {
    planName: string;
    provider: string;
    planNumber: string;
    validUntil: Date;
    notes?: string;
    patientId: string;
  }) {
    const existing = await this.findByPlanNumber(data.planNumber);
    if (existing) throw new ConflictError('Número do plano já cadastrado');
    return await prisma.healthPlan.create({
      data,
      include: { patient: { select: { id: true, name: true, cpf: true } } },
    });
  },

  async update(id: string, data: {
    planName?: string;
    provider?: string;
    planNumber?: string;
    validUntil?: Date;
    notes?: string;
    isActive?: boolean;
  }) {
    await this.findById(id);
    if (data.planNumber) {
      const existing = await prisma.healthPlan.findFirst({
        where: { planNumber: data.planNumber, id: { not: id } },
      });
      if (existing) throw new ConflictError('Número do plano já cadastrado');
    }
    return await prisma.healthPlan.update({
      where: { id },
      data,
      include: { patient: { select: { id: true, name: true, cpf: true } } },
    });
  },

  async delete(id: string) {
    await this.findById(id);
    return await prisma.healthPlan.delete({ where: { id } });
  },
};
