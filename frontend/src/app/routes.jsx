import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../presentation/pages/LoginPage';
import DashboardPage from '../presentation/pages/DashboardPage';
import EmployeesPage from '../presentation/pages/EmployeesPage';
import EmployeeDetailsPage from '../presentation/pages/EmployeeDetailsPage';
import PayslipsPage from '../presentation/pages/PayslipsPage';
import RecruitmentPage from '../presentation/pages/RecruitmentPage';
import AttendancePage from '../presentation/pages/AttendancePage';
import PerformancePage from '../presentation/pages/PerformancePage';
import BenefitsPage from '../presentation/pages/BenefitsPage';
import TrainingPage from '../presentation/pages/TrainingPage';
import ReportsPage from '../presentation/pages/ReportsPage';
import UploadLogoPage from '../presentation/pages/UploadLogoPage';
import SectionPlaceholderPage from '../presentation/pages/SectionPlaceholderPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
      <Route path="/payslips" element={<PayslipsPage />} />
      <Route path="/recruitment" element={<RecruitmentPage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/performance" element={<PerformancePage />} />
      <Route path="/benefits" element={<BenefitsPage />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/reports" element={<ReportsPage />} />

      {/* Master Routes */}
      <Route path="/master/logo" element={<UploadLogoPage />} />
      <Route path="/master/countries" element={<SectionPlaceholderPage title="Manage Countries" />} />
      <Route path="/master/states" element={<SectionPlaceholderPage title="Manage States" />} />
      <Route path="/master/cities" element={<SectionPlaceholderPage title="Manage Cities" />} />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}