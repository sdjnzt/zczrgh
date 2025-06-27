import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tabs, DatePicker, Button, Select, Alert, Progress, Tag, Modal, Descriptions, Space, message } from 'antd';
import { AreaChartOutlined, EnvironmentOutlined, WarningOutlined, ExclamationCircleOutlined, EyeOutlined, LineChartOutlined, DownloadOutlined, CheckCircleOutlined, SearchOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 定义监测点类型
interface MonitoringPoint {
  key: string;
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  lastUpdate: string;
  value: number;
  unit: string;
  trend: string;
  warningLevel: string;
}

// 定义预警记录类型
interface WarningRecord {
  key: string;
  id: string;
  pointId: string;
  pointName: string;
  type: string;
  time: string;
  value: number;
  threshold: number;
  unit: string;
  level: string;
  status: string;
}

const ResourceMonitoring: React.FC = () => {
  const [resourceType, setResourceType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('1');
  const [trendModalVisible, setTrendModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [warningListModalVisible, setWarningListModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<MonitoringPoint | null>(null);
  const [currentWarning, setCurrentWarning] = useState<WarningRecord | null>(null);

  // 模拟监测点数据
  const monitoringPoints: MonitoringPoint[] = [
    {
      key: '1',
      id: 'ZC-JCD-001',
      name: '邹城市北部水质监测点',
      type: '水资源',
      location: '邹城市北部水库',
      status: '正常',
      lastUpdate: '2024-03-12 08:30:25',
      value: 92.5,
      unit: '%',
      trend: '稳定',
      warningLevel: '正常',
    },
    {
      key: '2',
      id: 'ZC-JCD-002',
      name: '邹城市东部土壤监测点',
      type: '土地资源',
      location: '邹城市东部农业区',
      status: '正常',
      lastUpdate: '2024-03-12 09:15:10',
      value: 85.3,
      unit: '%',
      trend: '下降',
      warningLevel: '轻度预警',
    },
    {
      key: '3',
      id: 'ZC-JCD-003',
      name: '邹城市南部森林覆盖监测点',
      type: '森林资源',
      location: '邹城市南部山区',
      status: '正常',
      lastUpdate: '2024-03-12 07:45:30',
      value: 38.5,
      unit: '%',
      trend: '上升',
      warningLevel: '正常',
    },
    {
      key: '4',
      id: 'ZC-JCD-004',
      name: '邹城市西部矿产资源监测点',
      type: '矿产资源',
      location: '邹城市西部矿区',
      status: '异常',
      lastUpdate: '2024-03-12 06:50:15',
      value: 75.2,
      unit: '%',
      trend: '下降',
      warningLevel: '中度预警',
    },
    {
      key: '5',
      id: 'ZC-JCD-005',
      name: '邹城市中心区空气质量监测点',
      type: '大气资源',
      location: '邹城市中心广场',
      status: '正常',
      lastUpdate: '2024-03-12 10:00:00',
      value: 65.8,
      unit: 'AQI',
      trend: '稳定',
      warningLevel: '轻度预警',
    },
    {
      key: '6',
      id: 'ZC-JCD-006',
      name: '邹城市工业园区排放监测点',
      type: '大气资源',
      location: '邹城市工业园区',
      status: '正常',
      lastUpdate: '2024-03-12 09:30:45',
      value: 78.6,
      unit: 'AQI',
      trend: '上升',
      warningLevel: '轻度预警',
    },
    {
      key: '7',
      id: 'ZC-JCD-007',
      name: '邹城市东南湖泊水质监测点',
      type: '水资源',
      location: '邹城市东南湖',
      status: '异常',
      lastUpdate: '2024-03-12 08:15:20',
      value: 68.3,
      unit: '%',
      trend: '下降',
      warningLevel: '中度预警',
    },
  ];

  // 模拟预警记录数据
  const warningRecords: WarningRecord[] = [
    {
      key: '1',
      id: 'ZC-YJ-20240310-001',
      pointId: 'ZC-JCD-004',
      pointName: '邹城市西部矿产资源监测点',
      type: '矿产资源',
      time: '2024-03-10 14:30:25',
      value: 72.5,
      threshold: 80.0,
      unit: '%',
      level: '中度预警',
      status: '处理中',
    },
    {
      key: '2',
      id: 'ZC-YJ-20240309-002',
      pointId: 'ZC-JCD-007',
      pointName: '邹城市东南湖泊水质监测点',
      type: '水资源',
      time: '2024-03-09 16:45:10',
      value: 65.8,
      threshold: 75.0,
      unit: '%',
      level: '中度预警',
      status: '处理中',
    },
    {
      key: '3',
      id: 'ZC-YJ-20240307-003',
      pointId: 'ZC-JCD-002',
      pointName: '邹城市东部土壤监测点',
      type: '土地资源',
      time: '2024-03-07 09:15:30',
      value: 82.5,
      threshold: 85.0,
      unit: '%',
      level: '轻度预警',
      status: '已处理',
    },
    {
      key: '4',
      id: 'ZC-YJ-20240305-004',
      pointId: 'ZC-JCD-005',
      pointName: '邹城市中心区空气质量监测点',
      type: '大气资源',
      time: '2024-03-05 12:50:15',
      value: 75.2,
      threshold: 70.0,
      unit: 'AQI',
      level: '轻度预警',
      status: '已处理',
    },
    {
      key: '5',
      id: 'ZC-YJ-20240302-005',
      pointId: 'ZC-JCD-006',
      pointName: '邹城市工业园区排放监测点',
      type: '大气资源',
      time: '2024-03-02 18:10:45',
      value: 82.6,
      threshold: 70.0,
      unit: 'AQI',
      level: '轻度预警',
      status: '已处理',
    },
  ];

  // 资源监测仪表盘数据
  const resourceQualityData = [
    { name: '水资源', value: 85.2 },
    { name: '土地资源', value: 82.1 },
    { name: '森林资源', value: 78.5 },
    { name: '矿产资源', value: 75.2 },
    { name: '大气资源', value: 72.2 },
  ];

  // 近期水质趋势数据
  const waterTrendOption = {
    title: {
      text: '水资源质量趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['北部水库', '东南湖泊'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      name: '水质指数(%)'
    },
    series: [
      {
        name: '北部水库',
        type: 'line',
        data: [88, 92, 90, 93, 95, 92.5],
      },
      {
        name: '东南湖泊',
        type: 'line',
        data: [85, 82, 78, 75, 70, 68.3],
      }
    ]
  };

  // 空气质量趋势数据
  const airTrendOption = {
    title: {
      text: '空气质量趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['中心区', '工业园区'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      name: 'AQI指数'
    },
    series: [
      {
        name: '中心区',
        type: 'line',
        data: [55, 60, 62, 58, 63, 65.8],
      },
      {
        name: '工业园区',
        type: 'line',
        data: [70, 75, 72, 76, 80, 78.6],
      }
    ]
  };

  // 资源类型分布饼图配置
  const resourceTypeOption = {
    title: {
      text: '资源质量评分',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}分'
    },
    series: [
      {
        name: '资源质量',
        type: 'gauge',
        detail: { formatter: '{value}分' },
        data: [{ value: 78.6, name: '综合评分' }],
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.3, '#ff6e76'],
              [0.7, '#fddd60'],
              [1, '#7cffb2']
            ]
          }
        }
      }
    ]
  };

  // 查看趋势图表数据
  const getPointTrendData = (point: MonitoringPoint) => {
    // 模拟过去6个月的数据
    const months = ['10月', '11月', '12月', '1月', '2月', '3月'];
    
    let data;
    if (point.trend === '上升') {
      data = [point.value * 0.8, point.value * 0.85, point.value * 0.9, point.value * 0.93, point.value * 0.96, point.value];
    } else if (point.trend === '下降') {
      data = [point.value * 1.2, point.value * 1.15, point.value * 1.1, point.value * 1.05, point.value * 1.02, point.value];
    } else { // 稳定
      data = [point.value * 0.98, point.value * 1.02, point.value * 0.99, point.value * 1.01, point.value * 0.97, point.value];
    }
    
    return {
      title: {
        text: `${point.name} - 监测趋势`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: months
      },
      yAxis: {
        type: 'value',
        name: point.unit
      },
      series: [{
        name: '监测值',
        type: 'line',
        data: data,
        markLine: {
          data: [
            { 
              name: '标准值', 
              yAxis: point.type === '大气资源' ? 70 : 80,
              lineStyle: { color: '#f5222d' },
              label: { show: true, position: 'middle', formatter: '预警阈值' }
            }
          ]
        }
      }]
    };
  };

  // 处理按钮点击事件
  const handleViewTrend = (record: MonitoringPoint) => {
    setCurrentPoint(record);
    setTrendModalVisible(true);
  };

  const handleViewDetail = (record: WarningRecord) => {
    setCurrentWarning(record);
    setDetailModalVisible(true);
  };

  const handleViewAllWarnings = () => {
    setWarningListModalVisible(true);
    // 自动切换到预警管理选项卡
    setActiveTab('3');
  };

  const handleExportReport = () => {
    setExportModalVisible(true);
  };

  const handleExport = (type: string) => {
    // 真实应用中会调用API生成并下载报告
    message.success(`资源监测分析${type === 'excel' ? 'Excel' : 'PDF'}报告已开始下载`);
    setExportModalVisible(false);
  };

  // 监测点表格列定义
  const monitoringColumns: ColumnsType<MonitoringPoint> = [
    {
      title: '监测点编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '监测点名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Button type="link" style={{ padding: 0 }}>{text}</Button>,
    },
    {
      title: '资源类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '水资源', value: '水资源' },
        { text: '土地资源', value: '土地资源' },
        { text: '森林资源', value: '森林资源' },
        { text: '矿产资源', value: '矿产资源' },
        { text: '大气资源', value: '大气资源' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.type.indexOf(value) === 0,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '监测值',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => `${value} ${record.unit}`,
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: '变化趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend) => {
        let icon = null;
        if (trend === '下降') {
          icon = <span style={{ color: 'red' }}>↓</span>;
        } else if (trend === '上升') {
          icon = <span style={{ color: 'green' }}>↑</span>;
        }
        return (
          <span>
            {trend} {icon}
          </span>
        );
      },
    },
    {
      title: '预警级别',
      dataIndex: 'warningLevel',
      key: 'warningLevel',
      render: (level) => {
        let color = 'green';
        if (level === '轻度预警') color = 'orange';
        if (level === '中度预警') color = 'red';
        if (level === '重度预警') color = 'purple';
        return (
          <Tag color={color}>
            {level}
          </Tag>
        );
      },
      filters: [
        { text: '正常', value: '正常' },
        { text: '轻度预警', value: '轻度预警' },
        { text: '中度预警', value: '中度预警' },
        { text: '重度预警', value: '重度预警' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.warningLevel.indexOf(value) === 0,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === '异常') color = 'red';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      sorter: (a, b) => a.lastUpdate.localeCompare(b.lastUpdate),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" icon={<LineChartOutlined />} onClick={() => handleViewTrend(record)}>查看趋势</Button>
      ),
    },
  ];

  // 预警记录表格列定义
  const warningColumns: ColumnsType<WarningRecord> = [
    {
      title: '预警编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '监测点',
      dataIndex: 'pointName',
      key: 'pointName',
      render: (text) => <Button type="link" style={{ padding: 0 }}>{text}</Button>,
    },
    {
      title: '资源类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '水资源', value: '水资源' },
        { text: '土地资源', value: '土地资源' },
        { text: '森林资源', value: '森林资源' },
        { text: '矿产资源', value: '矿产资源' },
        { text: '大气资源', value: '大气资源' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.type.indexOf(value) === 0,
    },
    {
      title: '预警时间',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      title: '预警值/阈值',
      key: 'values',
      render: (_, record) => (
        <span>
          {record.value}/{record.threshold} {record.unit}
        </span>
      ),
    },
    {
      title: '预警级别',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        let color = 'orange';
        if (level === '中度预警') color = 'red';
        if (level === '重度预警') color = 'purple';
        return (
          <Tag color={color}>
            {level}
          </Tag>
        );
      },
      filters: [
        { text: '轻度预警', value: '轻度预警' },
        { text: '中度预警', value: '中度预警' },
        { text: '重度预警', value: '重度预警' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.level.indexOf(value) === 0,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === '已处理' ? 'green' : 'orange';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: '处理中', value: '处理中' },
        { text: '已处理', value: '已处理' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.status.indexOf(value) === 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
      ),
    },
  ];

  return (
    <div className="resource-monitoring">
      <h2>资源监测分析</h2>
      
      <Alert 
        message="系统检测到2个监测点处于预警状态，请及时处理" 
        type="warning" 
        showIcon 
        icon={<WarningOutlined />}
        style={{ marginBottom: 16 }}
        action={
          <Button size="small" type="default" onClick={handleViewAllWarnings}>
            查看详情
          </Button>
        }
      />
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="资源监测仪表盘" key="1">
          <Row gutter={16}>
            {resourceQualityData.map(item => (
              <Col span={4} key={item.name}>
                <Card>
                  <Statistic
                    title={`${item.name}质量`}
                    value={item.value}
                    suffix="分"
                    precision={1}
                    valueStyle={{ color: item.value > 80 ? '#3f8600' : item.value > 70 ? '#faad14' : '#cf1322' }}
                    prefix={<AreaChartOutlined />}
                  />
                  <Progress 
                    percent={item.value} 
                    size="small" 
                    status={item.value > 80 ? 'success' : item.value > 70 ? 'normal' : 'exception'}
                    showInfo={false}
                    style={{ marginTop: 8 }}
                  />
                </Card>
              </Col>
            ))}
            <Col span={4}>
              <Card>
                <Statistic
                  title="监测点总数"
                  value={monitoringPoints.length}
                  prefix={<EnvironmentOutlined />}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Card title="资源综合评分">
                <ReactECharts option={resourceTypeOption} style={{ height: 300 }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="水资源质量趋势">
                <ReactECharts option={waterTrendOption} style={{ height: 300 }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="空气质量趋势">
                <ReactECharts option={airTrendOption} style={{ height: 300 }} />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card 
                title="资源监测预警状态" 
                extra={<Button type="link" icon={<DownloadOutlined />} onClick={handleExportReport}>导出报告</Button>}
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Card bordered={false}>
                      <Statistic
                        title="监测点总数"
                        value={monitoringPoints.length}
                        prefix={<EnvironmentOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card bordered={false}>
                      <Statistic
                        title="正常监测点"
                        value={monitoringPoints.filter(item => item.warningLevel === '正常').length}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<CheckCircleOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card bordered={false}>
                      <Statistic
                        title="轻度预警"
                        value={monitoringPoints.filter(item => item.warningLevel === '轻度预警').length}
                        valueStyle={{ color: '#faad14' }}
                        prefix={<ExclamationCircleOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card bordered={false}>
                      <Statistic
                        title="中度预警"
                        value={monitoringPoints.filter(item => item.warningLevel === '中度预警').length}
                        valueStyle={{ color: '#cf1322' }}
                        prefix={<WarningOutlined />}
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="监测点管理" key="2">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="资源类型"
                  value={resourceType}
                  onChange={value => setResourceType(value)}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="water">水资源</Option>
                  <Option value="land">土地资源</Option>
                  <Option value="forest">森林资源</Option>
                  <Option value="mineral">矿产资源</Option>
                  <Option value="air">大气资源</Option>
                </Select>
              </Col>
              <Col span={8}>
                <RangePicker 
                  style={{ width: '100%' }} 
                />
              </Col>
              <Col span={4}>
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Button type="primary">添加监测点</Button>
              </Col>
            </Row>

            <Table
              columns={monitoringColumns}
              dataSource={monitoringPoints}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="预警管理" key="3">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="资源类型"
                  value={resourceType}
                  onChange={value => setResourceType(value)}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="water">水资源</Option>
                  <Option value="land">土地资源</Option>
                  <Option value="forest">森林资源</Option>
                  <Option value="mineral">矿产资源</Option>
                  <Option value="air">大气资源</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="预警级别"
                  defaultValue="all"
                >
                  <Option value="all">全部级别</Option>
                  <Option value="light">轻度预警</Option>
                  <Option value="medium">中度预警</Option>
                  <Option value="heavy">重度预警</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="处理状态"
                  defaultValue="all"
                >
                  <Option value="all">全部状态</Option>
                  <Option value="processing">处理中</Option>
                  <Option value="processed">已处理</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Col>
            </Row>

            <Table
              columns={warningColumns}
              dataSource={warningRecords}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 监测点趋势图模态框 */}
      <Modal
        title="监测趋势分析"
        open={trendModalVisible}
        onCancel={() => setTrendModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setTrendModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentPoint && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="监测点名称">{currentPoint.name}</Descriptions.Item>
              <Descriptions.Item label="资源类型">{currentPoint.type}</Descriptions.Item>
              <Descriptions.Item label="当前监测值">{currentPoint.value} {currentPoint.unit}</Descriptions.Item>
              <Descriptions.Item label="最后更新时间">{currentPoint.lastUpdate}</Descriptions.Item>
            </Descriptions>
            <ReactECharts 
              option={getPointTrendData(currentPoint)} 
              style={{ height: 400 }} 
              theme="light"
            />
          </div>
        )}
      </Modal>

      {/* 预警详情模态框 */}
      <Modal
        title="预警详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentWarning && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="预警编号">{currentWarning.id}</Descriptions.Item>
              <Descriptions.Item label="监测点">{currentWarning.pointName}</Descriptions.Item>
              <Descriptions.Item label="资源类型">{currentWarning.type}</Descriptions.Item>
              <Descriptions.Item label="预警级别">
                <Tag color={currentWarning.level === '轻度预警' ? 'orange' : 'red'}>
                  {currentWarning.level}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="预警时间">{currentWarning.time}</Descriptions.Item>
              <Descriptions.Item label="处理状态">
                <Tag color={currentWarning.status === '已处理' ? 'green' : 'orange'}>
                  {currentWarning.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="预警值/阈值">
                {currentWarning.value}/{currentWarning.threshold} {currentWarning.unit}
              </Descriptions.Item>
              <Descriptions.Item label="监测点位置">
                {monitoringPoints.find(p => p.id === currentWarning.pointId)?.location || '未知'}
              </Descriptions.Item>
            </Descriptions>
            
            {currentWarning.status === '处理中' && (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <Space>
                  <Button type="primary" onClick={() => message.success(`已通知相关人员处理预警：${currentWarning.id}`)}>
                    发送通知
                  </Button>
                  <Button onClick={() => message.success(`已将预警${currentWarning.id}标记为已处理`)}>
                    标记为已处理
                  </Button>
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 导出报告模态框 */}
      <Modal
        title="导出资源监测报告"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ padding: '20px 0' }}>
          <p>请选择导出报告格式：</p>
          <Space size="large" style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="primary" 
              icon={<FileExcelOutlined />} 
              size="large" 
              onClick={() => handleExport('excel')}
            >
              Excel格式
            </Button>
            <Button 
              type="primary" 
              icon={<FilePdfOutlined />} 
              size="large"
              onClick={() => handleExport('pdf')}
            >
              PDF格式
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default ResourceMonitoring; 