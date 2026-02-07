import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../presentation/pages/LoginPage';
import DashboardPage from '../presentation/pages/DashboardPage';
import EmployeesPage from '../presentation/pages/EmployeesPage';
import PayslipsPage from '../presentation/pages/PayslipsPage';
import RecruitmentPage from '../presentation/pages/RecruitmentPage';
import AttendancePage from '../presentation/pages/AttendancePage';
import PerformancePage from '../presentation/pages/PerformancePage';
import BenefitsPage from '../presentation/pages/BenefitsPage';
import TrainingPage from '../presentation/pages/TrainingPage';
import ReportsPage from '../presentation/pages/ReportsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/payslips" element={<PayslipsPage />} />
      <Route path="/recruitment" element={<RecruitmentPage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/performance" element={<PerformancePage />} />
      <Route path="/benefits" element={<BenefitsPage />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
