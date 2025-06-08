import React, { useState } from 'react';
import { Card, Table, Tabs, Row, Col, Input, Button, Select, Tag, Space, Statistic, Badge, DatePicker, Form, Steps, Divider, Timeline, Progress } from 'antd';
import { SearchOutlined, HomeOutlined, FileAddOutlined, CheckCircleOutlined, ClockCircleOutlined, PrinterOutlined, DownloadOutlined, BarChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 定义不动产登记类型
interface RealEstateRegistration {
  key: string;
  id: string;
  propertyName: string;
  propertyType: string;
  applicant: string;
  applyDate: string;
  status: string;
  area: number;
  address: string;
  handler: string;
}

// 定义登记证书类型
interface Certificate {
  key: string;
  id: string;
  registrationId: string;
  propertyName: string;
  propertyType: string;
  owner: string;
  issueDate: string;
  validPeriod: string;
  area: number;
  status: string;
}

const RealEstate: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [activeTabKey, setActiveTabKey] = useState('1');

  // 模拟不动产登记数据
  const registrations: RealEstateRegistration[] = [
    {
      key: '1',
      id: 'ZC-BDC-2023-001',
      propertyName: '邹城花园小区3号楼501室',
      propertyType: '住宅',
      applicant: '张三',
      applyDate: '2023-12-15',
      status: '已登记',
      area: 120.5,
      address: '邹城市中心区花园小区3号楼501室',
      handler: '李审批',
    },
    {
      key: '2',
      id: 'ZC-BDC-2023-002',
      propertyName: '邹城市东区商业广场A座201',
      propertyType: '商业',
      applicant: '邹城商贸有限公司',
      applyDate: '2023-11-20',
      status: '审核中',
      area: 358.6,
      address: '邹城市东区商业广场A座201',
      handler: '王审批',
    },
    {
      key: '3',
      id: 'ZC-BDC-2023-003',
      propertyName: '邹城市南湖庄园B区12号别墅',
      propertyType: '别墅',
      applicant: '李四',
      applyDate: '2025-05-10',
      status: '已登记',
      area: 285.3,
      address: '邹城市南湖庄园B区12号',
      handler: '赵审批',
    },
    {
      key: '4',
      id: 'ZC-BDC-2023-004',
      propertyName: '邹城市工业园区厂房3号',
      propertyType: '工业',
      applicant: '邹城机械制造有限公司',
      applyDate: '2023-09-05',
      status: '已驳回',
      area: 1500.0,
      address: '邹城市工业园区东区A-12地块',
      handler: '张审批',
    },
    {
      key: '5',
      id: 'ZC-BDC-2024-001',
      propertyName: '邹城阳光新城5号楼1单元302室',
      propertyType: '住宅',
      applicant: '王五',
      applyDate: '2024-01-15',
      status: '材料补正',
      area: 89.5,
      address: '邹城市北区阳光新城5号楼1单元302室',
      handler: '孙审批',
    },
    {
      key: '6',
      id: 'ZC-BDC-2024-002',
      propertyName: '邹城市中央公园1号地块',
      propertyType: '土地',
      applicant: '邹城房地产开发有限公司',
      applyDate: '2024-02-20',
      status: '待受理',
      area: 5000.0,
      address: '邹城市中央公园北侧地块',
      handler: '未分配',
    },
  ];

  // 模拟登记证书数据
  const certificates: Certificate[] = [
    {
      key: '1',
      id: 'ZC-BDC-ZS-2023-001',
      registrationId: 'ZC-BDC-2023-001',
      propertyName: '邹城花园小区3号楼501室',
      propertyType: '住宅',
      owner: '张三',
      issueDate: '2023-12-20',
      validPeriod: '2093-12-20',
      area: 120.5,
      status: '有效',
    },
    {
      key: '2',
      id: 'ZC-BDC-ZS-2023-003',
      registrationId: 'ZC-BDC-2023-003',
      propertyName: '邹城市南湖庄园B区12号别墅',
      propertyType: '别墅',
      owner: '李四',
      issueDate: '2025-05-15',
      validPeriod: '2093-10-15',
      area: 285.3,
      status: '有效',
    },
    {
      key: '3',
      id: 'ZC-BDC-ZS-2023-005',
      registrationId: 'ZC-BDC-2023-005',
      propertyName: '邹城市中心区写字楼A座1003室',
      propertyType: '办公',
      owner: '邹城科技有限公司',
      issueDate: '2023-08-12',
      validPeriod: '2063-08-12',
      area: 156.8,
      status: '有效',
    },
    {
      key: '4',
      id: 'ZC-BDC-ZS-2023-008',
      registrationId: 'ZC-BDC-2023-008',
      propertyName: '邹城市西区商铺B-15号',
      propertyType: '商业',
      owner: '赵六',
      issueDate: '2023-07-25',
      validPeriod: '2063-07-25',
      area: 68.5,
      status: '已注销',
    },
    {
      key: '5',
      id: 'ZC-BDC-ZS-2022-025',
      registrationId: 'ZC-BDC-2022-025',
      propertyName: '邹城市农业示范园3号大棚',
      propertyType: '农业设施',
      owner: '邹城农业发展有限公司',
      issueDate: '2022-11-10',
      validPeriod: '2052-11-10',
      area: 2500.0,
      status: '有效',
    },
  ];

  // 登记表格列定义
  const registrationColumns: ColumnsType<RealEstateRegistration> = [
    {
      title: '登记编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '不动产名称',
      dataIndex: 'propertyName',
      key: 'propertyName',
      render: (text) => <Button type="link" style={{padding: 0}}>{text}</Button>,
    },
    {
      title: '不动产类型',
      dataIndex: 'propertyType',
      key: 'propertyType',
      filters: [
        { text: '住宅', value: '住宅' },
        { text: '商业', value: '商业' },
        { text: '办公', value: '办公' },
        { text: '工业', value: '工业' },
        { text: '土地', value: '土地' },
        { text: '别墅', value: '别墅' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.propertyType.indexOf(value) === 0,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
    },
    {
      title: '面积(m²)',
      dataIndex: 'area',
      key: 'area',
      sorter: (a, b) => a.area - b.area,
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      sorter: (a, b) => a.applyDate.localeCompare(b.applyDate),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === '审核中' || status === '材料补正' || status === '待受理') color = 'blue';
        if (status === '已驳回') color = 'red';
        if (status === '已登记') color = 'green';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: '待受理', value: '待受理' },
        { text: '材料补正', value: '材料补正' },
        { text: '审核中', value: '审核中' },
        { text: '已登记', value: '已登记' },
        { text: '已驳回', value: '已驳回' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.status.indexOf(value) === 0,
    },
    {
      title: '经办人',
      dataIndex: 'handler',
      key: 'handler',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" style={{padding: 0}}>查看</Button>
          <Button type="link" style={{padding: 0}}>办理</Button>
          {record.status === '已登记' && <Button type="link" style={{padding: 0}}>打印证书</Button>}
        </Space>
      ),
    },
  ];

  // 证书表格列定义
  const certificateColumns: ColumnsType<Certificate> = [
    {
      title: '证书编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '不动产名称',
      dataIndex: 'propertyName',
      key: 'propertyName',
      render: (text) => <Button type="link" style={{padding: 0}}>{text}</Button>,
    },
    {
      title: '不动产类型',
      dataIndex: 'propertyType',
      key: 'propertyType',
      filters: [
        { text: '住宅', value: '住宅' },
        { text: '商业', value: '商业' },
        { text: '办公', value: '办公' },
        { text: '工业', value: '工业' },
        { text: '土地', value: '土地' },
        { text: '别墅', value: '别墅' },
        { text: '农业设施', value: '农业设施' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.propertyType.indexOf(value) === 0,
    },
    {
      title: '权利人',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '面积(m²)',
      dataIndex: 'area',
      key: 'area',
      sorter: (a, b) => a.area - b.area,
    },
    {
      title: '发证日期',
      dataIndex: 'issueDate',
      key: 'issueDate',
      sorter: (a, b) => a.issueDate.localeCompare(b.issueDate),
    },
    {
      title: '有效期至',
      dataIndex: 'validPeriod',
      key: 'validPeriod',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === '有效' ? 'green' : 'red';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: '有效', value: '有效' },
        { text: '已注销', value: '已注销' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.status.indexOf(value) === 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" style={{padding: 0}}>查看</Button>
          <Button type="link" style={{padding: 0}}>打印</Button>
          {record.status === '有效' && <Button type="link" style={{padding: 0}}>注销</Button>}
        </Space>
      ),
    },
  ];

  // 筛选登记数据
  const filteredRegistrations = registrations.filter(item => {
    if (propertyType !== 'all' && item.propertyType !== propertyType) return false;
    return item.propertyName.includes(searchText) || 
           item.id.includes(searchText) || 
           item.applicant.includes(searchText) ||
           item.address.includes(searchText);
  });

  // 不动产登记类型统计
  const propertyTypeData = [
    { value: registrations.filter(item => item.propertyType === '住宅').length, name: '住宅' },
    { value: registrations.filter(item => item.propertyType === '商业').length, name: '商业' },
    { value: registrations.filter(item => item.propertyType === '办公').length, name: '办公' },
    { value: registrations.filter(item => item.propertyType === '工业').length, name: '工业' },
    { value: registrations.filter(item => item.propertyType === '土地').length, name: '土地' },
    { value: registrations.filter(item => item.propertyType === '别墅').length, name: '别墅' },
  ];

  // 登记趋势图配置
  const registrationTrendOption = {
    title: {
      text: '月度不动产登记趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['住宅', '商业', '其他'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['2023年9月', '2023年10月', '2023年11月', '2023年12月', '2024年1月', '2024年2月']
    },
    yAxis: {
      type: 'value',
      name: '登记数量'
    },
    series: [
      {
        name: '住宅',
        type: 'bar',
        data: [30, 42, 35, 45, 38, 32],
      },
      {
        name: '商业',
        type: 'bar',
        data: [12, 15, 18, 10, 14, 16],
      },
      {
        name: '其他',
        type: 'bar',
        data: [8, 10, 12, 15, 9, 11],
      }
    ]
  };

  // 不动产类型饼图配置
  const propertyTypeChartOption = {
    title: {
      text: '不动产类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: propertyTypeData.map(item => item.name)
    },
    series: [
      {
        name: '不动产类型',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: propertyTypeData,
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
    <div className="real-estate">
      <h2>不动产登记管理</h2>
      
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
        <TabPane tab="登记申请管理" key="1">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Input
                  placeholder="搜索登记编号/不动产名称/申请人"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="不动产类型"
                  value={propertyType}
                  onChange={value => setPropertyType(value)}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="住宅">住宅</Option>
                  <Option value="商业">商业</Option>
                  <Option value="办公">办公</Option>
                  <Option value="工业">工业</Option>
                  <Option value="土地">土地</Option>
                  <Option value="别墅">别墅</Option>
                </Select>
              </Col>
              <Col span={6}>
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              </Col>
              <Col span={2}>
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Button type="primary" icon={<FileAddOutlined />}>
                  新建登记
                </Button>
              </Col>
            </Row>

            <Table
              columns={registrationColumns}
              dataSource={filteredRegistrations}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="证书管理" key="2">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Input
                  placeholder="搜索证书编号/不动产名称/权利人"
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col span={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="不动产类型"
                  defaultValue="all"
                >
                  <Option value="all">全部类型</Option>
                  <Option value="住宅">住宅</Option>
                  <Option value="商业">商业</Option>
                  <Option value="办公">办公</Option>
                  <Option value="工业">工业</Option>
                  <Option value="土地">土地</Option>
                  <Option value="别墅">别墅</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="证书状态"
                  defaultValue="all"
                >
                  <Option value="all">全部状态</Option>
                  <Option value="有效">有效</Option>
                  <Option value="已注销">已注销</Option>
                </Select>
              </Col>
              <Col span={2}>
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Space>
                  <Button icon={<PrinterOutlined />}>批量打印</Button>
                  <Button icon={<DownloadOutlined />}>导出数据</Button>
                </Space>
              </Col>
            </Row>

            <Table
              columns={certificateColumns}
              dataSource={certificates}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="统计分析" key="3">
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="累计登记数量"
                  value={458}
                  prefix={<HomeOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="本月登记数量"
                  value={59}
                  prefix={<FileAddOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="有效证书数量"
                  value={425}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均登记时长"
                  value={5.2}
                  suffix="天"
                  precision={1}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card>
                <ReactECharts option={propertyTypeChartOption} style={{ height: 400 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <ReactECharts option={registrationTrendOption} style={{ height: 400 }} />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="登记业务办理效率分析" extra={<Button type="link" icon={<BarChartOutlined />}>更多分析</Button>}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card type="inner" title="业务类型平均办理时长(天)">
                      <Row gutter={16}>
                        <Col span={8}>
                          <Statistic title="住宅登记" value={4.5} precision={1} />
                          <Progress percent={75} status="active" />
                        </Col>
                        <Col span={8}>
                          <Statistic title="商业登记" value={6.2} precision={1} />
                          <Progress percent={65} status="active" />
                        </Col>
                        <Col span={8}>
                          <Statistic title="土地登记" value={8.5} precision={1} />
                          <Progress percent={55} status="active" />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card type="inner" title="登记环节办理时长分布">
                      <Timeline>
                        <Timeline.Item color="green">材料受理: 平均0.5天</Timeline.Item>
                        <Timeline.Item color="green">初审: 平均1.2天</Timeline.Item>
                        <Timeline.Item color="red">复审: 平均2.3天 (耗时最长)</Timeline.Item>
                        <Timeline.Item color="blue">缮证: 平均0.8天</Timeline.Item>
                        <Timeline.Item color="gray">发证: 平均0.5天</Timeline.Item>
                      </Timeline>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RealEstate; 