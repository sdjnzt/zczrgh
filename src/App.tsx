import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Dashboard from './pages/Dashboard';
import SmartSearch from './pages/SmartSearch';
import SmartReport from './pages/SmartReport';
import LogCenter from './pages/LogCenter';
import AlertCenter from './pages/AlertCenter';
import MessageCenter from './pages/MessageCenter';
import AppHeader from './components/AppHeader';
import AppSider from './components/AppSider';
import BigScreen from './pages/BigScreen';
import LandManagement from './pages/LandManagement';
import UrbanPlanning from './pages/UrbanPlanning';
import ResourceMonitoring from './pages/ResourceMonitoring';
import ProjectApproval from './pages/ProjectApproval';
import RealEstate from './pages/RealEstate';
import EcologicalProtection from './pages/EcologicalProtection';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Routes>
        <Route path="/big-screen" element={<BigScreen />} />
        <Route path="*" element={
          <Layout>
            <AppHeader />
            <Layout>
              <AppSider />
              <Layout style={{ padding: '24px' }}>
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/land-management" element={<LandManagement />} />
                    <Route path="/urban-planning" element={<UrbanPlanning />} />
                    <Route path="/resource-monitoring" element={<ResourceMonitoring />} />
                    <Route path="/project-approval" element={<ProjectApproval />} />
                    <Route path="/real-estate" element={<RealEstate />} />
                    <Route path="/ecological-protection" element={<EcologicalProtection />} />
                    <Route path="/search" element={<SmartSearch />} />
                    <Route path="/report" element={<SmartReport />} />
                    <Route path="/log-center" element={<LogCenter />} />
                    <Route path="/alert-center" element={<AlertCenter />} />
                    <Route path="/message-center" element={<MessageCenter />} />
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          </Layout>
        } />
      </Routes>
    </Layout>
  );
};

export default App; 