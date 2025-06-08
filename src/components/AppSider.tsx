import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  SearchOutlined,
  UserOutlined,
  AlertOutlined,
  BellOutlined,
  EnvironmentOutlined,
  BuildOutlined,
  FileProtectOutlined,
  AreaChartOutlined,
  HomeOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const AppSider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '数据概览',
    },
    // {
    //   key: '/big-screen',
    //   icon: <BarChartOutlined />,
    //   label: '数字大屏',
    // },
    {
      key: '/land-management',
      icon: <EnvironmentOutlined />,
      label: '土地资源管理',
    },
    {
      key: '/urban-planning',
      icon: <BuildOutlined />,
      label: '城市规划管理',
    },
    {
      key: '/resource-monitoring',
      icon: <AreaChartOutlined />,
      label: '资源监测分析',
    },
    {
      key: '/project-approval',
      icon: <FileProtectOutlined />,
      label: '项目审批管理',
    },
    {
      key: '/real-estate',
      icon: <HomeOutlined />,
      label: '不动产登记',
    },
    {
      key: '/ecological-protection',
      icon: <ApartmentOutlined />,
      label: '生态保护监测',
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: '智能检索',
    },
    // {
    //   key: '/report',
    //   icon: <BarChartOutlined />,
    //   label: '分析报告',
    // },
    {
      key: '/log-center',
      icon: <UserOutlined />,
      label: '操作日志',
    },
    {
      key: '/alert-center',
      icon: <AlertOutlined />,
      label: '预警中心',
    },
    {
      key: '/message-center',
      icon: <BellOutlined />,
      label: '消息中心',
    },
  ];

  return (
    <Sider
      width={220}
      style={{
        background: 'linear-gradient(180deg, #f0f5ff 0%, #fff 100%)',
        boxShadow: '2px 0 8px #f0f1f2',
        minHeight: '100vh',
        paddingTop: 24,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          height: '100%',
          borderRight: 0,
          background: 'transparent',
          fontSize: 16,
          fontWeight: 500,
        }}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
      <style>{`
        .ant-menu-item-selected {
          background: #e6f7ff !important;
          border-radius: 8px !important;
          color: #1890ff !important;
        }
        .ant-menu-item:hover {
          background: #f0f5ff !important;
          border-radius: 8px !important;
        }
      `}</style>
    </Sider>
  );
};

export default AppSider; 