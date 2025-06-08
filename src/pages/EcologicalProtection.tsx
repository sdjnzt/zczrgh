import React, { useState } from 'react';
import { Card, Table, Tabs, Row, Col, Input, Button, Select, Tag, Space, Statistic, Alert, Progress, DatePicker, Divider } from 'antd';
import { AreaChartOutlined, EnvironmentOutlined, WarningOutlined, ExclamationCircleOutlined, SearchOutlined, LineChartOutlined, PlusOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 定义保护区类型
interface ProtectionArea {
  key: string;
  id: string;
  name: string;
  type: string;
  location: string;
  area: number;
  level: string;
  establishDate: string;
  status: string;
  manager: string;
}

// 定义监测点类型
interface MonitoringStation {
  key: string;
  id: string;
  name: string;
  areaId: string;
  areaName: string;
  type: string;
  location: string;
  lastUpdate: string;
  indicator: string;
  value: number;
  unit: string;
  status: string;
}

// 定义生态事件类型
interface EcologicalEvent {
  key: string;
  id: string;
  title: string;
  type: string;
  areaId: string;
  areaName: string;
  date: string;
  level: string;
  status: string;
  description: string;
  reporter: string;
}

const EcologicalProtection: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [areaType, setAreaType] = useState('all');
  const [activeTabKey, setActiveTabKey] = useState('1');

  // 模拟保护区数据
  const protectionAreas: ProtectionArea[] = [
    {
      key: '1',
      id: 'ZC-STQ-001',
      name: '邹城市北部湿地保护区',
      type: '湿地保护',
      location: '邹城市北部区域',
      area: 12500,
      level: '市级',
      establishDate: '2015-06-15',
      status: '良好',
      manager: '张生态',
    },
    {
      key: '2',
      id: 'ZC-STQ-002',
      name: '邹城市东南部森林公园',
      type: '森林保护',
      location: '邹城市东南部区域',
      area: 25000,
      level: '省级',
      establishDate: '2010-08-20',
      status: '良好',
      manager: '李森林',
    },
    {
      key: '3',
      id: 'ZC-STQ-003',
      name: '邹城市西部草原生态区',
      type: '草原保护',
      location: '邹城市西部区域',
      area: 18500,
      level: '市级',
      establishDate: '2017-04-12',
      status: '良好',
      manager: '王草原',
    },
    {
      key: '4',
      id: 'ZC-STQ-004',
      name: '邹城市南湖水源保护区',
      type: '水源保护',
      location: '邹城市南部区域',
      area: 5600,
      level: '市级',
      establishDate: '2018-10-25',
      status: '一般',
      manager: '刘水源',
    },
    {
      key: '5',
      id: 'ZC-STQ-005',
      name: '邹城市中部野生动物栖息地',
      type: '野生动物保护',
      location: '邹城市中部区域',
      area: 8200,
      level: '省级',
      establishDate: '2012-03-18',
      status: '良好',
      manager: '赵动物',
    },
  ];

  // 模拟监测点数据
  const monitoringStations: MonitoringStation[] = [
    {
      key: '1',
      id: 'ZC-JCD-001',
      name: '北湿地1号监测点',
      areaId: 'ZC-STQ-001',
      areaName: '邹城市北部湿地保护区',
      type: '水质监测',
      location: '北湿地中心区域',
      lastUpdate: '2024-03-12 08:30:25',
      indicator: '溶解氧',
      value: 7.5,
      unit: 'mg/L',
      status: '正常',
    },
    {
      key: '2',
      id: 'ZC-JCD-002',
      name: '东南森林1号监测点',
      areaId: 'ZC-STQ-002',
      areaName: '邹城市东南部森林公园',
      type: '空气质量',
      location: '森林公园入口处',
      lastUpdate: '2024-03-12 09:15:10',
      indicator: 'PM2.5',
      value: 15.3,
      unit: 'μg/m³',
      status: '正常',
    },
    {
      key: '3',
      id: 'ZC-JCD-003',
      name: '西部草原土壤监测点',
      areaId: 'ZC-STQ-003',
      areaName: '邹城市西部草原生态区',
      type: '土壤监测',
      location: '草原中部区域',
      lastUpdate: '2024-03-12 07:45:30',
      indicator: '有机质含量',
      value: 3.8,
      unit: '%',
      status: '正常',
    },
    {
      key: '4',
      id: 'ZC-JCD-004',
      name: '南湖水质监测点',
      areaId: 'ZC-STQ-004',
      areaName: '邹城市南湖水源保护区',
      type: '水质监测',
      location: '南湖中心位置',
      lastUpdate: '2024-03-12 06:50:15',
      indicator: '总磷',
      value: 0.05,
      unit: 'mg/L',
      status: '异常',
    },
    {
      key: '5',
      id: 'ZC-JCD-005',
      name: '野生动物栖息地监测点',
      areaId: 'ZC-STQ-005',
      areaName: '邹城市中部野生动物栖息地',
      type: '生物多样性',
      location: '栖息地核心区',
      lastUpdate: '2024-03-12 10:00:00',
      indicator: '物种数量',
      value: 42,
      unit: '种',
      status: '正常',
    },
  ];

  // 模拟生态事件数据
  const ecologicalEvents: EcologicalEvent[] = [
    {
      key: '1',
      id: 'ZC-STSJ-2024-001',
      title: '北湿地水质轻度污染事件',
      type: '污染事件',
      areaId: 'ZC-STQ-001',
      areaName: '邹城市北部湿地保护区',
      date: '2024-02-25 14:30:00',
      level: '轻度',
      status: '已处理',
      description: '湿地北侧入水口发现轻度污染，疑似上游工业废水排放导致',
      reporter: '张巡查',
    },
    {
      key: '2',
      id: 'ZC-STSJ-2024-002',
      title: '东南森林公园发现非法砍伐',
      type: '破坏事件',
      areaId: 'ZC-STQ-002',
      areaName: '邹城市东南部森林公园',
      date: '2024-03-05 08:15:00',
      level: '中度',
      status: '处理中',
      description: '东南角发现约10棵树木被非法砍伐，已收集相关证据',
      reporter: '李巡查',
    },
    {
      key: '3',
      id: 'ZC-STSJ-2024-003',
      title: '西部草原野火事件',
      type: '自然灾害',
      areaId: 'ZC-STQ-003',
      areaName: '邹城市西部草原生态区',
      date: '2024-01-18 16:45:00',
      level: '重度',
      status: '已处理',
      description: '西部草原因雷击发生野火，烧毁约200亩草场，已扑灭',
      reporter: '王巡查',
    },
    {
      key: '4',
      id: '邹城市ZC-STSJ-2024-004',
      title: '南湖水源区发现非法排污口',
      type: '污染事件',
      areaId: 'ZC-STQ-004',
      areaName: '邹城市南湖水源保护区',
      date: '2024-03-10 11:20:00',
      level: '中度',
      status: '处理中',
      description: '南湖东岸发现一处隐蔽排污口，正在调查污染源',
      reporter: '刘巡查',
    },
    {
      key: '5',
      id: 'ZC-STSJ-2024-005',
      title: '野生动物栖息地发现珍稀物种',
      type: '生态发现',
      areaId: 'ZC-STQ-005',
      areaName: '邹城市中部野生动物栖息地',
      date: '2024-02-28 09:30:00',
      level: '重要',
      status: '跟踪中',
      description: '在栖息地发现国家二级保护动物白鹭繁殖地，已启动专项保护',
      reporter: '赵巡查',
    },
  ];

  // 保护区表格列定义
  const areaColumns: ColumnsType<ProtectionArea> = [
    {
      title: '保护区编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '保护区名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Button type="link" style={{padding: 0}}>{text}</Button>,
    },
    {
      title: '保护类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '湿地保护', value: '湿地保护' },
        { text: '森林保护', value: '森林保护' },
        { text: '草原保护', value: '草原保护' },
        { text: '水源保护', value: '水源保护' },
        { text: '野生动物保护', value: '野生动物保护' },
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
      title: '面积(公顷)',
      dataIndex: 'area',
      key: 'area',
      sorter: (a, b) => a.area - b.area,
    },
    {
      title: '保护级别',
      dataIndex: 'level',
      key: 'level',
      filters: [
        { text: '市级', value: '市级' },
        { text: '省级', value: '省级' },
        { text: '国家级', value: '国家级' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.level.indexOf(value) === 0,
    },
    {
      title: '建立时间',
      dataIndex: 'establishDate',
      key: 'establishDate',
      sorter: (a, b) => a.establishDate.localeCompare(b.establishDate),
    },
    {
      title: '生态状况',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === '一般') color = 'orange';
        if (status === '较差') color = 'red';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: '良好', value: '良好' },
        { text: '一般', value: '一般' },
        { text: '较差', value: '较差' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.status.indexOf(value) === 0,
    },
    {
      title: '管理人员',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" style={{padding: 0}}>查看详情</Button>
          <Button type="link" style={{padding: 0}}>监测数据</Button>
          <Button type="link" style={{padding: 0}}>管理</Button>
        </Space>
      ),
    },
  ];

  // 监测点表格列定义
  const stationColumns: ColumnsType<MonitoringStation> = [
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
      render: (text) => <Button type="link" style={{padding: 0}}>{text}</Button>,
    },
    {
      title: '所属保护区',
      dataIndex: 'areaName',
      key: 'areaName',
    },
    {
      title: '监测类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '水质监测', value: '水质监测' },
        { text: '空气质量', value: '空气质量' },
        { text: '土壤监测', value: '土壤监测' },
        { text: '生物多样性', value: '生物多样性' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.type.indexOf(value) === 0,
    },
    {
      title: '监测指标',
      dataIndex: 'indicator',
      key: 'indicator',
    },
    {
      title: '最新值',
      key: 'valueUnit',
      render: (_, record) => (
        <span>
          {record.value} {record.unit}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === '正常' ? 'green' : 'red';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: '正常', value: '正常' },
        { text: '异常', value: '异常' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.status.indexOf(value) === 0,
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
        <Space size="middle">
          <Button type="link" style={{padding: 0}}>查看趋势</Button>
          <Button type="link" style={{padding: 0}}>查看详情</Button>
        </Space>
      ),
    },
  ];

  // 生态事件表格列定义
  const eventColumns: ColumnsType<EcologicalEvent> = [
    {
      title: '事件编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '事件标题',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Button type="link" style={{padding: 0}}>{text}</Button>,
    },
    {
      title: '事件类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '污染事件', value: '污染事件' },
        { text: '破坏事件', value: '破坏事件' },
        { text: '自然灾害', value: '自然灾害' },
        { text: '生态发现', value: '生态发现' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.type.indexOf(value) === 0,
    },
    {
      title: '所属保护区',
      dataIndex: 'areaName',
      key: 'areaName',
    },
    {
      title: '发生时间',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        let color = 'green';
        if (level === '中度') color = 'orange';
        if (level === '重度') color = 'red';
        if (level === '重要') color = 'blue';
        return (
          <Tag color={color}>
            {level}
          </Tag>
        );
      },
      filters: [
        { text: '轻度', value: '轻度' },
        { text: '中度', value: '中度' },
        { text: '重度', value: '重度' },
        { text: '重要', value: '重要' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.level.indexOf(value) === 0,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === '处理中') color = 'orange';
        if (status === '跟踪中') color = 'blue';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: '处理中', value: '处理中' },
        { text: '已处理', value: '已处理' },
        { text: '跟踪中', value: '跟踪中' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.status.indexOf(value) === 0,
    },
    {
      title: '上报人',
      dataIndex: 'reporter',
      key: 'reporter',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" style={{padding: 0}}>查看详情</Button>
          <Button type="link" style={{padding: 0}}>处理</Button>
        </Space>
      ),
    },
  ];

  // 筛选保护区数据
  const filteredAreas = protectionAreas.filter(item => {
    if (areaType !== 'all' && item.type !== areaType) return false;
    return item.name.includes(searchText) || 
           item.id.includes(searchText) || 
           item.location.includes(searchText);
  });

  // 生态环境质量统计
  const ecologicalQualityData = [
    { name: '湿地保护区', value: 92.5 },
    { name: '森林保护区', value: 88.3 },
    { name: '草原生态区', value: 85.7 },
    { name: '水源保护区', value: 76.2 },
    { name: '野生动物栖息地', value: 90.1 },
  ];

  // 生态环境质量仪表盘配置
  const qualityGaugeOption = {
    title: {
      text: '生态环境综合评分',
      left: 'center'
    },
    tooltip: {
      formatter: '{a} <br/>{b} : {c}分'
    },
    series: [
      {
        name: '生态环境质量',
        type: 'gauge',
        detail: { formatter: '{value}分' },
        data: [{ value: 86.5, name: '综合评分' }],
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

  // 生态监测指标趋势配置
  const monitoringTrendOption = {
    title: {
      text: '主要监测指标趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['水质指数', '空气质量指数', '土壤健康度', '生物多样性'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['2023年9月', '2023年10月', '2023年11月', '2023年12月', '2024年1月', '2024年2月']
    },
    yAxis: {
      type: 'value',
      name: '指数值'
    },
    series: [
      {
        name: '水质指数',
        type: 'line',
        data: [82, 84, 80, 85, 83, 87],
      },
      {
        name: '空气质量指数',
        type: 'line',
        data: [88, 86, 87, 90, 89, 91],
      },
      {
        name: '土壤健康度',
        type: 'line',
        data: [78, 80, 79, 81, 82, 83],
      },
      {
        name: '生物多样性',
        type: 'line',
        data: [85, 86, 84, 85, 87, 89],
      }
    ]
  };

  // 生态事件统计图配置
  const eventStatOption = {
    title: {
      text: '生态事件类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['污染事件', '破坏事件', '自然灾害', '生态发现']
    },
    series: [
      {
        name: '事件类型',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: [
          { value: 12, name: '污染事件' },
          { value: 8, name: '破坏事件' },
          { value: 5, name: '自然灾害' },
          { value: 9, name: '生态发现' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <div className="ecological-protection">
      <h2>生态保护监测</h2>
      
      <Alert 
        message="监测到南湖水源保护区水质异常，请及时查看" 
        type="warning" 
        showIcon 
        icon={<WarningOutlined />}
        style={{ marginBottom: 16 }}
        action={
          <Button size="small" type="default">
            查看详情
          </Button>
        }
      />
      
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
        <TabPane tab="保护区管理" key="1">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Input
                  placeholder="搜索保护区编号/名称/位置"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="保护类型"
                  value={areaType}
                  onChange={value => setAreaType(value)}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="湿地保护">湿地保护</Option>
                  <Option value="森林保护">森林保护</Option>
                  <Option value="草原保护">草原保护</Option>
                  <Option value="水源保护">水源保护</Option>
                  <Option value="野生动物保护">野生动物保护</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="保护级别"
                  defaultValue="all"
                >
                  <Option value="all">全部级别</Option>
                  <Option value="市级">市级</Option>
                  <Option value="省级">省级</Option>
                  <Option value="国家级">国家级</Option>
                </Select>
              </Col>
              <Col span={2}>
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />}>
                  新增保护区
                </Button>
              </Col>
            </Row>

            <Table
              columns={areaColumns}
              dataSource={filteredAreas}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="生态监测" key="2">
          <Row gutter={16}>
            {ecologicalQualityData.map(item => (
              <Col span={4} key={item.name}>
                <Card>
                  <Statistic
                    title={`${item.name}质量`}
                    value={item.value}
                    suffix="分"
                    precision={1}
                    valueStyle={{ color: item.value > 85 ? '#3f8600' : item.value > 75 ? '#faad14' : '#cf1322' }}
                    prefix={<AreaChartOutlined />}
                  />
                  <Progress 
                    percent={item.value} 
                    size="small" 
                    status={item.value > 85 ? 'success' : item.value > 75 ? 'normal' : 'exception'}
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
                  value={monitoringStations.length}
                  prefix={<EnvironmentOutlined />}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card>
                <ReactECharts option={qualityGaugeOption} style={{ height: 350 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <ReactECharts option={monitoringTrendOption} style={{ height: 350 }} />
              </Card>
            </Col>
          </Row>
          
          <Card style={{ marginTop: 16 }}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="监测类型"
                  defaultValue="all"
                >
                  <Option value="all">全部类型</Option>
                  <Option value="water">水质监测</Option>
                  <Option value="air">空气质量</Option>
                  <Option value="soil">土壤监测</Option>
                  <Option value="bio">生物多样性</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="所属保护区"
                  defaultValue="all"
                >
                  <Option value="all">全部保护区</Option>
                  {protectionAreas.map(area => (
                    <Option key={area.id} value={area.id}>{area.name}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="监测状态"
                  defaultValue="all"
                >
                  <Option value="all">全部状态</Option>
                  <Option value="normal">正常</Option>
                  <Option value="abnormal">异常</Option>
                </Select>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />}>
                  新增监测点
                </Button>
              </Col>
            </Row>

            <Table
              columns={stationColumns}
              dataSource={monitoringStations}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="生态事件" key="3">
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <ReactECharts option={eventStatOption} style={{ height: 300 }} />
              </Card>
            </Col>
            <Col span={16}>
              <Card>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title="今年事件总数"
                      value={34}
                      prefix={<ExclamationCircleOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="待处理事件"
                      value={7}
                      valueStyle={{ color: '#faad14' }}
                      prefix={<WarningOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="本月事件数"
                      value={5}
                      prefix={<LineChartOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="事件处理率"
                      value={79.4}
                      suffix="%"
                      precision={1}
                    />
                    <Progress percent={79.4} size="small" style={{ marginTop: 8 }} />
                  </Col>
                </Row>
                
                <Divider />
                
                <Row gutter={16}>
                  <Col span={6}>
                    <Card size="small" title="污染事件" style={{ textAlign: 'center' }}>
                      <h3>12</h3>
                      <Progress percent={35} size="small" />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small" title="破坏事件" style={{ textAlign: 'center' }}>
                      <h3>8</h3>
                      <Progress percent={24} size="small" />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small" title="自然灾害" style={{ textAlign: 'center' }}>
                      <h3>5</h3>
                      <Progress percent={15} size="small" />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small" title="生态发现" style={{ textAlign: 'center' }}>
                      <h3>9</h3>
                      <Progress percent={26} size="small" />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          
          <Card style={{ marginTop: 16 }}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={5}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="事件类型"
                  defaultValue="all"
                >
                  <Option value="all">全部类型</Option>
                  <Option value="pollution">污染事件</Option>
                  <Option value="damage">破坏事件</Option>
                  <Option value="disaster">自然灾害</Option>
                  <Option value="discovery">生态发现</Option>
                </Select>
              </Col>
              <Col span={5}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="所属保护区"
                  defaultValue="all"
                >
                  <Option value="all">全部保护区</Option>
                  {protectionAreas.map(area => (
                    <Option key={area.id} value={area.id}>{area.name}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="事件级别"
                  defaultValue="all"
                >
                  <Option value="all">全部级别</Option>
                  <Option value="light">轻度</Option>
                  <Option value="medium">中度</Option>
                  <Option value="heavy">重度</Option>
                  <Option value="important">重要</Option>
                </Select>
              </Col>
              <Col span={5}>
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />}>
                  上报事件
                </Button>
              </Col>
            </Row>

            <Table
              columns={eventColumns}
              dataSource={ecologicalEvents}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EcologicalProtection; 