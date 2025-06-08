import React, { useState } from 'react';
import { Card, Table, Tabs, Row, Col, Input, Button, Select, Tag, Space, Statistic, Steps, DatePicker, Form, Tooltip } from 'antd';
import { SearchOutlined, FileAddOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, UserOutlined, EyeOutlined, EditOutlined, ApartmentOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Step } = Steps;

// 定义项目类型
interface Project {
  key: string;
  id: string;
  name: string;
  type: string;
  applicant: string;
  applyDate: string;
  status: string;
  currentStep: number;
  dueDate: string;
  handler: string;
}

const ProjectApproval: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [projectType, setProjectType] = useState('all');
  const [activeTabKey, setActiveTabKey] = useState('1');

  // 模拟项目数据
  const projects: Project[] = [
    {
      key: '1',
      id: 'ZC-XM-2023-001',
      name: '邹城市北部新区土地开发项目',
      type: '土地开发',
      applicant: '邹城建设集团',
      applyDate: '2023-12-15',
      status: '审批中',
      currentStep: 2,
      dueDate: '2024-03-15',
      handler: '王科长',
    },
    {
      key: '2',
      id: 'ZC-XM-2023-002',
      name: '邹城市东部产业园区扩建项目',
      type: '产业园区',
      applicant: '邹城产业投资有限公司',
      applyDate: '2023-11-20',
      status: '审批中',
      currentStep: 3,
      dueDate: '2024-02-20',
      handler: '李科长',
    },
    {
      key: '3',
      id: 'ZC-XM-2023-003',
      name: '邹城市南部生态休闲区规划项目',
      type: '生态规划',
      applicant: '邹城环保科技有限公司',
      applyDate: '2025-05-10',
      status: '已通过',
      currentStep: 5,
      dueDate: '2024-01-10',
      handler: '张科长',
    },
    {
      key: '4',
      id: 'ZC-XM-2023-004',
      name: '邹城市西部农业示范区建设项目',
      type: '农业发展',
      applicant: '邹城农业发展有限公司',
      applyDate: '2023-09-05',
      status: '已驳回',
      currentStep: 2,
      dueDate: '2023-12-05',
      handler: '刘科长',
    },
    {
      key: '5',
      id: 'ZC-XM-2024-001',
      name: '邹城市中心商业区改造项目',
      type: '城市更新',
      applicant: '邹城城市建设投资有限公司',
      applyDate: '2024-01-15',
      status: '材料补正',
      currentStep: 1,
      dueDate: '2024-04-15',
      handler: '赵科长',
    },
    {
      key: '6',
      id: 'ZC-XM-2024-002',
      name: '邹城市北湖公园景观提升项目',
      type: '景观工程',
      applicant: '邹城园林绿化有限公司',
      applyDate: '2024-02-20',
      status: '待受理',
      currentStep: 0,
      dueDate: '2024-05-20',
      handler: '未分配',
    },
  ];

  // 表格列定义
  const projectColumns: ColumnsType<Project> = [
    {
      title: '项目编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
      width: 130,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          <Button type="link" style={{padding: 0}}>{text}</Button>
        </Tooltip>
      ),
    },
    {
      title: '项目类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '土地开发', value: '土地开发' },
        { text: '产业园区', value: '产业园区' },
        { text: '生态规划', value: '生态规划' },
        { text: '农业发展', value: '农业发展' },
        { text: '城市更新', value: '城市更新' },
        { text: '景观工程', value: '景观工程' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.type.indexOf(value) === 0,
      width: 120,
    },
    {
      title: '申请单位',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          <Button type="link" style={{padding: 0}}>{text}</Button>
        </Tooltip>
      ),
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      sorter: (a, b) => a.applyDate.localeCompare(b.applyDate),
      width: 120,
    },
    {
      title: '状态/进度',
      key: 'statusProgress',
      width: 180,
      render: (_, record) => {
        let color = 'blue';
        if (record.status === '已驳回') color = 'red';
        if (record.status === '已通过') color = 'green';
        
        const steps = ['受理', '材料审核', '部门审批', '联审会议', '批复发放'];
        const currentStep = record.status === '已通过' 
          ? '已完成' 
          : record.status === '已驳回' 
            ? '已驳回' 
            : `${steps[record.currentStep]}中`;
        
        return (
          <div>
            <Tag color={color} style={{ marginBottom: 5 }}>
              {record.status}
            </Tag>
            <div style={{ fontSize: '12px', color: '#666' }}>
              当前: {currentStep}
            </div>
          </div>
        );
      },
    },
    {
      title: '办理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} size="small">查看</Button>
          <Button type="link" icon={<EditOutlined />} size="small">办理</Button>
          <Button type="link" icon={<ApartmentOutlined />} size="small">流程</Button>
        </Space>
      ),
    },
  ];

  // 筛选项目数据
  const filteredProjects = projects.filter(item => {
    if (projectType !== 'all' && item.type !== projectType) return false;
    return item.name.includes(searchText) || 
           item.id.includes(searchText) || 
           item.applicant.includes(searchText);
  });

  // 项目状态统计
  const statusData = [
    { value: projects.filter(item => item.status === '待受理').length, name: '待受理' },
    { value: projects.filter(item => item.status === '材料补正').length, name: '材料补正' },
    { value: projects.filter(item => item.status === '审批中').length, name: '审批中' },
    { value: projects.filter(item => item.status === '已通过').length, name: '已通过' },
    { value: projects.filter(item => item.status === '已驳回').length, name: '已驳回' },
  ];

  // 项目类型统计
  const typeData = [
    { value: projects.filter(item => item.type === '土地开发').length, name: '土地开发' },
    { value: projects.filter(item => item.type === '产业园区').length, name: '产业园区' },
    { value: projects.filter(item => item.type === '生态规划').length, name: '生态规划' },
    { value: projects.filter(item => item.type === '农业发展').length, name: '农业发展' },
    { value: projects.filter(item => item.type === '城市更新').length, name: '城市更新' },
    { value: projects.filter(item => item.type === '景观工程').length, name: '景观工程' },
  ];

  // 项目状态饼图配置
  const statusChartOption = {
    title: {
      text: '项目审批状态分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: statusData.map(item => item.name)
    },
    series: [
      {
        name: '项目状态',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: statusData,
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

  // 审批时效趋势图配置
  const efficiencyChartOption = {
    title: {
      text: '审批时效趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['平均审批时长', '法定时限'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['2023年7月', '2023年8月', '2023年9月', '2023年10月', '2023年11月', '2023年12月', '2024年1月', '2024年2月']
    },
    yAxis: {
      type: 'value',
      name: '天数'
    },
    series: [
      {
        name: '平均审批时长',
        type: 'line',
        data: [35, 33, 31, 29, 28, 25, 23, 20],
      },
      {
        name: '法定时限',
        type: 'line',
        data: [40, 40, 40, 40, 40, 40, 40, 40],
        lineStyle: {
          type: 'dashed'
        }
      }
    ]
  };

  return (
    <div className="project-approval">
      <h2>项目审批管理</h2>
      
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
        <TabPane tab="项目列表" key="1">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Input
                  placeholder="搜索项目编号/名称/申请单位"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="项目类型"
                  value={projectType}
                  onChange={value => setProjectType(value)}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="土地开发">土地开发</Option>
                  <Option value="产业园区">产业园区</Option>
                  <Option value="生态规划">生态规划</Option>
                  <Option value="农业发展">农业发展</Option>
                  <Option value="城市更新">城市更新</Option>
                  <Option value="景观工程">景观工程</Option>
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
                  新建项目
                </Button>
              </Col>
            </Row>

            <Table
              columns={projectColumns}
              dataSource={filteredProjects}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1300 }}
              bordered
              size="middle"
            />
          </Card>
        </TabPane>
        
        <TabPane tab="统计分析" key="2">
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="项目总数"
                  value={projects.length}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已办结项目"
                  value={projects.filter(item => item.status === '已通过' || item.status === '已驳回').length}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="审批中项目"
                  value={projects.filter(item => item.status === '审批中' || item.status === '材料补正' || item.status === '待受理').length}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均审批时长"
                  value={23}
                  suffix="天"
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card>
                <ReactECharts option={statusChartOption} style={{ height: 400 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <ReactECharts option={efficiencyChartOption} style={{ height: 400 }} />
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="审批流程管理" key="3">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={24}>
                <Steps 
                  current={-1}
                  style={{ marginBottom: 20 }}
                  items={[
                    { title: '申请受理', description: '审核申请材料的完整性' },
                    { title: '初审', description: '相关部门初步审核' },
                    { title: '专家评审', description: '组织专家进行评审' },
                    { title: '联审会议', description: '多部门联合审议' },
                    { title: '审批决定', description: '作出行政许可决定' },
                  ]}
                />
                
                <Card title="审批流程配置" style={{ marginBottom: 20 }}>
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="项目类型" required>
                          <Select defaultValue="土地开发">
                            <Option value="土地开发">土地开发</Option>
                            <Option value="产业园区">产业园区</Option>
                            <Option value="生态规划">生态规划</Option>
                            <Option value="农业发展">农业发展</Option>
                            <Option value="城市更新">城市更新</Option>
                            <Option value="景观工程">景观工程</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="法定时限(工作日)" required>
                          <Input defaultValue="40" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="承诺时限(工作日)" required>
                          <Input defaultValue="30" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="是否需要专家评审">
                          <Select defaultValue="是">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="是否需要现场踏勘">
                          <Select defaultValue="是">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="是否需要公示">
                          <Select defaultValue="是">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Button type="primary">保存配置</Button>
                  </Form>
                </Card>
                
                <Card title="审批部门配置">
                  <Table 
                    dataSource={[
                      { key: '1', step: '材料审核', department: '行政审批科', handler: '李明', timeLimit: '3个工作日' },
                      { key: '2', step: '部门审批', department: '资源规划科', handler: '王强', timeLimit: '10个工作日' },
                      { key: '3', step: '专家评审', department: '技术评审中心', handler: '张红', timeLimit: '7个工作日' },
                      { key: '4', step: '联审会议', department: '多部门', handler: '赵主任', timeLimit: '5个工作日' },
                      { key: '5', step: '批复发放', department: '行政审批科', handler: '李明', timeLimit: '5个工作日' },
                    ]}
                    columns={[
                      { title: '审批环节', dataIndex: 'step', key: 'step' },
                      { title: '审批部门', dataIndex: 'department', key: 'department' },
                      { title: '经办人', dataIndex: 'handler', key: 'handler' },
                      { title: '办理时限', dataIndex: 'timeLimit', key: 'timeLimit' },
                      { 
                        title: '操作', 
                        key: 'action',
                        render: () => (
                          <Space>
                            <Button type="link" style={{padding: 0}}>编辑</Button>
                            <Button type="link" style={{padding: 0}}>删除</Button>
                          </Space>
                        )
                      },
                    ]}
                    pagination={false}
                  />
                  <Button type="primary" style={{ marginTop: 16 }}>添加环节</Button>
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProjectApproval; 