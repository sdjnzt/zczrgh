import React, { useState } from 'react';
import { Table } from 'antd';

interface LogItem {
  time: string;
  type: string;
  detail: string;
}

const defaultLogs: LogItem[] = [
  { time: '2025-05-21 09:00:00', type: '登录', detail: '用户 admin 登录系统' },
  { time: '2025-05-21 09:05:12', type: '数据编辑', detail: '编辑土地资源信息：邹城市西部工业园区地块' },
  { time: '2025-05-21 09:10:23', type: '数据删除', detail: '删除过期规划申请：济宁智慧城市发展有限公司' },
  { time: '2025-05-21 09:15:45', type: '数据新增', detail: '新增土地使用权申请：邹城市高新技术产业开发区' },
  { time: '2025-05-21 09:20:00', type: '登出', detail: '用户 admin 退出系统' },
  { time: '2025-05-21 10:00:00', type: '登录', detail: '用户 user1 登录系统' },
  { time: '2025-05-21 10:05:12', type: '数据编辑', detail: '编辑矿产资源信息：邹城市北部矿区' },
  { time: '2025-05-21 10:10:23', type: '数据删除', detail: '删除无效规划图：邹城市南部生态保护区' },
  { time: '2025-05-21 10:15:45', type: '数据新增', detail: '新增规划项目：邹城市数字科技产业园规划' },
  { time: '2025-05-21 10:20:00', type: '登出', detail: '用户 user1 退出系统' },
  { time: '2025-05-21 11:00:00', type: '登录', detail: '用户 user2 登录系统' },
  { time: '2025-05-21 11:05:12', type: '数据编辑', detail: '编辑土地用途变更：山东鲁南装备制造有限公司工业用地' },
  { time: '2025-05-21 11:10:23', type: '数据删除', detail: '删除过期批复文件：邹城市住宅用地审批' },
  { time: '2025-05-21 11:15:45', type: '数据新增', detail: '新增规划许可证：邹城市商业中心开发项目' },
  { time: '2025-05-21 11:20:00', type: '登出', detail: '用户 user2 退出系统' },
  { time: '2025-05-21 12:00:00', type: '登录', detail: '用户 admin 登录系统' },
  { time: '2025-05-21 12:05:12', type: '数据编辑', detail: '编辑规划信息：邹城市城市总体规划2023版' },
  { time: '2025-05-21 12:10:23', type: '数据删除', detail: '删除过期土地资源数据：2018年度调查数据' },
  { time: '2025-05-21 12:15:45', type: '数据新增', detail: '新增土地卫片执法检查记录：邹城市东部农用地' },
  { time: '2025-05-21 12:20:00', type: '登出', detail: '用户 admin 退出系统' },
];

const LogCenter: React.FC = () => {
  const [logs] = useState<LogItem[]>(() => {
    const local = localStorage.getItem('logCenter');
    if (local) return JSON.parse(local);
    return defaultLogs;
  });

  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '详情', dataIndex: 'detail', key: 'detail' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>操作日志</h2>
      <Table columns={columns} dataSource={logs} rowKey={(r) => r.time + r.type + r.detail} bordered />
    </div>
  );
};

export default LogCenter; 