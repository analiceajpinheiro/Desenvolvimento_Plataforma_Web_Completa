import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Navbar } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { Appointment, AppointmentStatus, UserRole } from '../types';
import api from '../services/api';

// ── Types ──────────────────────────────────────────────────────────────────

interface DashboardStats {
  patientsTotal: number | null;
  appointmentsToday: number | null;
  appointmentsThisMonth: number | null;
  recordsTotal: number | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const isToday = (dateStr: string): boolean => {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const isThisMonth = (dateStr: string): boolean => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
};

const formatTime = (dateStr: string): string =>
  new Date(dateStr).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

// ── Sub-components ─────────────────────────────────────────────────────────

const StatSkeleton: React.FC = () => (
  <div className="animate-pulse bg-gray-200 rounded h-9 w-20" />
);

interface MetricCardProps {
  label: string;
  value: number | null;
  icon: string;
  loading: boolean;
  valueClassName?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  loading,
  valueClassName = 'text-gray-800',
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
          {label}
        </p>
        {loading ? (
          <StatSkeleton />
        ) : (
          <p className={`text-3xl font-bold ${valueClassName}`}>
            {value ?? '—'}
          </p>
        )}
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

// ── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  [AppointmentStatus.CONFIRMED]: {
    label: 'Confirmado',
    className: 'bg-green-100 text-green-800',
  },
  [AppointmentStatus.COMPLETED]: {
    label: 'Concluído',
    className: 'bg-blue-100 text-blue-800',
  },
  [AppointmentStatus.CANCELLED]: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800',
  },
  [AppointmentStatus.RESCHEDULED]: {
    label: 'Reagendado',
    className: 'bg-yellow-100 text-yellow-800',
  },
};

// ── Main component ─────────────────────────────────────────────────────────

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [stats, setStats] = useState<DashboardStats>({
    patientsTotal: null,
    appointmentsToday: null,
    appointmentsThisMonth: null,
    recordsTotal: null,
  });
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoadingStats(true);
      setStatsError(null);

      const [patientsRes, appointmentsRes, recordsRes] = await Promise.allSettled([
        api.get('/patients?limit=1&page=1'),
        api.get('/appointments?limit=500&page=1'),
        api.get('/medical-records'),
      ]);

      const newStats: DashboardStats = {
        patientsTotal: null,
        appointmentsToday: null,
        appointmentsThisMonth: null,
        recordsTotal: null,
      };

      if (patientsRes.status === 'fulfilled') {
        newStats.patientsTotal =
          patientsRes.value.data.pagination?.total ?? 0;
      }

      if (appointmentsRes.status === 'fulfilled') {
        const apts: Appointment[] = appointmentsRes.value.data.data ?? [];
        const todayApts = apts
          .filter((a) => isToday(a.date))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        newStats.appointmentsToday = todayApts.length;
        newStats.appointmentsThisMonth = apts.filter((a) =>
          isThisMonth(a.date)
        ).length;
        setTodayAppointments(todayApts.slice(0, 5));
      }

      if (recordsRes.status === 'fulfilled') {
        newStats.recordsTotal = (recordsRes.value.data.data ?? []).length;
      }

      setStats(newStats);

      const failedCount = [patientsRes, appointmentsRes, recordsRes].filter(
        (r) => r.status === 'rejected'
      ).length;
      if (failedCount > 0) {
        setStatsError(
          'Alguns dados não puderam ser carregados. Verifique a conexão.'
        );
      }

      setLoadingStats(false);
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-1">
            Bem-vindo, {user?.name?.split(' ')[0] ?? 'usuário'}!
          </h1>
          <p className="text-lg text-gray-500">
            Plataforma de Gestão em Saúde — VitaLink
          </p>
        </div>

        {/* ── Error banner ── */}
        {statsError && (
          <div className="mb-6">
            <Alert
              type="warning"
              message={statsError}
              onClose={() => setStatsError(null)}
            />
          </div>
        )}

        {/* ── Metric cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Total de Pacientes"
            value={stats.patientsTotal}
            icon="👥"
            loading={loadingStats}
          />
          <MetricCard
            label="Consultas Hoje"
            value={stats.appointmentsToday}
            icon="📅"
            loading={loadingStats}
            valueClassName="text-green-600"
          />
          <MetricCard
            label="Consultas no Mês"
            value={stats.appointmentsThisMonth}
            icon="📆"
            loading={loadingStats}
            valueClassName="text-blue-600"
          />
          <MetricCard
            label="Prontuários"
            value={stats.recordsTotal}
            icon="🗂"
            loading={loadingStats}
            valueClassName="text-purple-600"
          />
        </div>

        {/* ── Agenda de Hoje ── */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Agenda de Hoje</h2>
            <Link
              to="/appointments"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {loadingStats ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4 items-center">
                  <div className="bg-gray-200 rounded h-4 w-14 shrink-0" />
                  <div className="bg-gray-200 rounded h-4 flex-1" />
                  <div className="bg-gray-200 rounded h-4 w-32" />
                  <div className="bg-gray-200 rounded h-5 w-20" />
                </div>
              ))}
            </div>
          ) : todayAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Horário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Médico
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((apt) => {
                    const statusCfg = STATUS_CONFIG[apt.status] ?? {
                      label: apt.status,
                      className: 'bg-gray-100 text-gray-700',
                    };
                    return (
                      <tr
                        key={apt.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-3 text-sm font-semibold text-gray-800">
                          {formatTime(apt.date)}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {apt.patient?.name ?? '—'}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {apt.doctor?.name
                            ? `Dr(a). ${apt.doctor.name}`
                            : '—'}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusCfg.className}`}
                          >
                            {statusCfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-400 text-base mb-4">
                Nenhum agendamento hoje
              </p>
              <Link to="/appointments/new">
                <Button variant="primary" size="sm">
                  + Novo Agendamento
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* ── Acesso rápido ── */}
        <h2 className="text-lg font-bold text-gray-700 mb-4">Acesso Rápido</h2>
        <div
          className={`grid grid-cols-1 gap-6 mb-8 ${
            isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-3'
          }`}
        >
          {/* Pacientes */}
          <Link
            to="/patients"
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-blue-800 mb-2">Pacientes</h3>
            <p className="text-blue-700 mb-4">
              Gerencie o cadastro e informações dos seus pacientes
            </p>
            <Button variant="primary" size="sm">
              Acessar →
            </Button>
          </Link>

          {/* Agendamentos */}
          <Link
            to="/appointments"
            className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Agendamentos
            </h3>
            <p className="text-green-700 mb-4">
              Agende e gerencie as consultas dos seus pacientes
            </p>
            <Button variant="success" size="sm">
              Acessar →
            </Button>
          </Link>

          {/* Prontuários */}
          <Link
            to="/medical-records"
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-purple-800 mb-2">
              Prontuários
            </h3>
            <p className="text-purple-700 mb-4">
              Acesso a prontuários eletrônicos
            </p>
            <Button variant="primary" size="sm">
              Acessar →
            </Button>
          </Link>

          {/* Equipe (somente ADMIN) */}
          {isAdmin && (
            <Link
              to="/users"
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
            >
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-2xl font-bold text-orange-800 mb-2">
                Equipe
              </h3>
              <p className="text-orange-700 mb-4">
                Gerencie médicos e recepcionistas
              </p>
              <Button variant="primary" size="sm">
                Acessar →
              </Button>
            </Link>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="text-center mt-4 text-gray-400 text-sm">
          <p>VitaLink v1.0.0 — Plataforma de Gestão em Saúde</p>
        </div>
      </div>
    </div>
  );
};
