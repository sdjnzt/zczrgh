import React, { useState } from 'react';
import { Card, Table, Tabs, Row, Col, Input, Button, Select, Tag, Space, Statistic, Steps, DatePicker, Form, Tooltip, Modal, Descriptions, message } from 'antd';
import { SearchOutlined, FileAddOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, EyeOutlined, EditOutlined, ApartmentOutlined, UserOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
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

// 定义审批环节类型
interface ApprovalStep {
  key: string;
  step: string;
  department: string;
  handler: string;
  timeLimit: string;
}

const ProjectApproval: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [projectType, setProjectType] = useState('all');
  const [activeTabKey, setActiveTabKey] = useState('1');
  
  // 模态框状态
  const [projectDetailVisible, setProjectDetailVisible] = useState(false);
  const [projectProcessVisible, setProjectProcessVisible] = useState(false);
  const [projectHandleVisible, setProjectHandleVisible] = useState(false);
  const [stepEditVisible, setStepEditVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentStep, setCurrentStep] = useState<ApprovalStep | null>(null);
  const [stepForm] = Form.useForm();

  // 审批环节数据
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>([
    { key: '1', step: '材料审核', department: '行政审批科', handler: '李明', timeLimit: '3个工作日' },
    { key: '2', step: '部门审批', department: '资源规划科', handler: '王强', timeLimit: '10个工作日' },
    { key: '3', step: '专家评审', department: '技术评审中心', handler: '张红', timeLimit: '7个工作日' },
    { key: '4', step: '联审会议', department: '多部门', handler: '赵主任', timeLimit: '5个工作日' },
    { key: '5', step: '批复发放', department: '行政审批科', handler: '李明', timeLimit: '5个工作日' },
  ]);

  // 模拟项目数据
  const projects: Project[] = [
    {
      key: '1',
      id: 'ZC-XM-2025-001',
      name: '邹城市北部新区土地开发项目',
      type: '土地开发',
      applicant: '邹城建设集团',
      applyDate: '2025-06-15',
      status: '审批中',
      currentStep: 2,
      dueDate: '2025-06-30',
      handler: '王科长',
    },
    {
      key: '2',
      id: 'ZC-XM-2025-002',
      name: '邹城市东部产业园区扩建项目',
      type: '产业园区',
      applicant: '邹城产业投资有限公司',
      applyDate: '2025-06-10',
      status: '审批中',
      currentStep: 3,
      dueDate: '2025-06-25',
      handler: '李科长',
    },
    {
      key: '3',
      id: 'ZC-XM-2025-003',
      name: '邹城市南部生态休闲区规划项目',
      type: '生态规划',
      applicant: '邹城环保科技有限公司',
      applyDate: '2025-06-05',
      status: '已通过',
      currentStep: 5,
      dueDate: '2025-06-20',
      handler: '张科长',
    },
    {
      key: '4',
      id: 'ZC-XM-2025-004',
      name: '邹城市西部农业示范区建设项目',
      type: '农业发展',
      applicant: '邹城农业发展有限公司',
      applyDate: '2025-06-01',
      status: '已驳回',
      currentStep: 2,
      dueDate: '2025-06-15',
      handler: '刘科长',
    },
    {
      key: '5',
      id: 'ZC-XM-2025-005',
      name: '邹城市中心商业区改造项目',
      type: '城市更新',
      applicant: '邹城城市建设投资有限公司',
      applyDate: '2025-06-08',
      status: '材料补正',
      currentStep: 1,
      dueDate: '2025-06-23',
      handler: '赵科长',
    },
    {
      key: '6',
      id: 'ZC-XM-2025-006',
      name: '邹城市北湖公园景观提升项目',
      type: '景观工程',
      applicant: '邹城园林绿化有限公司',
      applyDate: '2025-06-12',
      status: '待受理',
      currentStep: 0,
      dueDate: '2025-06-27',
      handler: '未分配',
    },
  ];

  // 处理按钮事件
  const handleViewProject = (record: Project) => {
    setCurrentProject(record);
    setProjectDetailVisible(true);
  };

  const handleProcessProject = (record: Project) => {
    setCurrentProject(record);
    setProjectProcessVisible(true);
  };

  const handleEditProject = (record: Project) => {
    setCurrentProject(record);
    setProjectHandleVisible(true);
  };

  const handleSaveConfig = () => {
    message.success('配置保存成功');
  };

  const handleEditStep = (record: ApprovalStep) => {
    setCurrentStep(record);
    stepForm.setFieldsValue(record);
    setStepEditVisible(true);
  };

  const handleDeleteStep = (key: string) => {
    Modal.confirm({
      title: '确定删除此审批环节吗?',
      content: '删除后将不可恢复',
      onOk() {
        setApprovalSteps(approvalSteps.filter(item => item.key !== key));
        message.success('审批环节已删除');
      }
    });
  };

  const handleAddStep = () => {
    setCurrentStep(null);
    stepForm.resetFields();
    setStepEditVisible(true);
  };

  const handleStepFormSubmit = () => {
    stepForm.validateFields().then(values => {
      if (currentStep) {
        // 编辑现有环节
        setApprovalSteps(approvalSteps.map(item => 
          item.key === currentStep.key ? { ...item, ...values } : item
        ));
        message.success('审批环节已更新');
      } else {
        // 添加新环节
        const newKey = (parseInt(approvalSteps[approvalSteps.length - 1].key) + 1).toString();
        setApprovalSteps([...approvalSteps, { key: newKey, ...values }]);
        message.success('新审批环节已添加');
      }
      setStepEditVisible(false);
    });
  };

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
          <Button type="link" icon={<EyeOutlined />} size="small" onClick={() => handleViewProject(record)}>查看</Button>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEditProject(record)}>办理</Button>
          <Button type="link" icon={<ApartmentOutlined />} size="small" onClick={() => handleProcessProject(record)}>流程</Button>
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

  // 项目审批趋势图配置
  const approvalTrendOption = {
    title: {
      text: '项目审批趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['申请数', '通过数', '驳回数'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['2025年1月', '2025年2月', '2025年3月', '2025年4月', '2025年5月', '2025年6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '申请数',
        type: 'line',
        data: [12, 15, 10, 18, 20, 15]
      },
      {
        name: '通过数',
        type: 'line',
        data: [8, 10, 8, 12, 15, 10]
      },
      {
        name: '驳回数',
        type: 'line',
        data: [2, 3, 1, 4, 3, 2]
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
                <ReactECharts option={approvalTrendOption} style={{ height: 400 }} />
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
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveConfig}>保存配置</Button>
                  </Form>
                </Card>
                
                <Card title="审批部门配置">
                  <Table 
                    dataSource={approvalSteps}
                    columns={[
                      { title: '审批环节', dataIndex: 'step', key: 'step' },
                      { title: '审批部门', dataIndex: 'department', key: 'department' },
                      { title: '经办人', dataIndex: 'handler', key: 'handler' },
                      { title: '办理时限', dataIndex: 'timeLimit', key: 'timeLimit' },
                      { 
                        title: '操作', 
                        key: 'action',
                        render: (_, record) => (
                          <Space>
                            <Button type="link" style={{padding: 0}} onClick={() => handleEditStep(record)}>编辑</Button>
                            <Button type="link" style={{padding: 0}} onClick={() => handleDeleteStep(record.key)}>删除</Button>
                          </Space>
                        )
                      },
                    ]}
                    pagination={false}
                  />
                  <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }} onClick={handleAddStep}>添加环节</Button>
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* 项目详情模态框 */}
      <Modal
        title="项目详情"
        open={projectDetailVisible}
        onCancel={() => setProjectDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setProjectDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentProject && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="项目编号">{currentProject.id}</Descriptions.Item>
            <Descriptions.Item label="项目名称">{currentProject.name}</Descriptions.Item>
            <Descriptions.Item label="项目类型">{currentProject.type}</Descriptions.Item>
            <Descriptions.Item label="申请单位">{currentProject.applicant}</Descriptions.Item>
            <Descriptions.Item label="申请日期">{currentProject.applyDate}</Descriptions.Item>
            <Descriptions.Item label="办理人">{currentProject.handler}</Descriptions.Item>
            <Descriptions.Item label="截止日期">{currentProject.dueDate}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={currentProject.status === '已通过' ? 'green' : currentProject.status === '已驳回' ? 'red' : 'blue'}>
                {currentProject.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="项目描述" span={2}>
              {currentProject.name}项目是一个重要的规划项目，旨在促进区域发展和资源的合理利用。
              项目位于{currentProject.name.includes('北部') ? '邹城市北部' : 
                currentProject.name.includes('东部') ? '邹城市东部' : 
                currentProject.name.includes('南部') ? '邹城市南部' : 
                currentProject.name.includes('西部') ? '邹城市西部' : '邹城市中心区'}，
              预计总投资约5000万元，建设周期为2年。
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 流程图模态框 */}
      <Modal
        title="项目审批流程"
        open={projectProcessVisible}
        onCancel={() => setProjectProcessVisible(false)}
        footer={[
          <Button key="close" onClick={() => setProjectProcessVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentProject && (
          <div>
            <Descriptions bordered style={{ marginBottom: 20 }}>
              <Descriptions.Item label="项目编号">{currentProject.id}</Descriptions.Item>
              <Descriptions.Item label="项目名称">{currentProject.name}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={currentProject.status === '已通过' ? 'green' : currentProject.status === '已驳回' ? 'red' : 'blue'}>
                  {currentProject.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            
            <Steps 
              direction="vertical"
              current={currentProject.currentStep}
              status={currentProject.status === '已驳回' ? 'error' : currentProject.status === '已通过' ? 'finish' : 'process'}
              style={{ marginTop: 20 }}
            >
              <Step title="受理" description="已完成 (2025-06-15 09:30)" />
              <Step title="材料审核" description={currentProject.currentStep >= 1 ? "已完成 (2025-06-17 14:20)" : "等待中"} />
              <Step title="部门审批" description={currentProject.currentStep >= 2 ? "已完成 (2025-06-20 11:10)" : "等待中"} />
              <Step title="联审会议" description={currentProject.currentStep >= 3 ? "已完成 (2025-06-22 15:40)" : "等待中"} />
              <Step title="批复发放" description={
                currentProject.currentStep >= 4 ? 
                currentProject.status === '已通过' ? "已批准 (2025-06-25 10:30)" :
                currentProject.status === '已驳回' ? "已驳回 (2025-06-25 10:30)" :
                "等待中" : "等待中"
              } />
            </Steps>
          </div>
        )}
      </Modal>

      {/* 项目办理模态框 */}
      <Modal
        title="项目办理"
        open={projectHandleVisible}
        onCancel={() => setProjectHandleVisible(false)}
        footer={[
          <Button key="reject" danger onClick={() => {
            message.success('项目已驳回');
            setProjectHandleVisible(false);
          }}>
            驳回申请
          </Button>,
          <Button key="approve" type="primary" onClick={() => {
            message.success('项目已批准进入下一环节');
            setProjectHandleVisible(false);
          }}>
            批准通过
          </Button>,
        ]}
        width={700}
      >
        {currentProject && (
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="项目编号">
                  <Input value={currentProject.id} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="项目名称">
                  <Input value={currentProject.name} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="当前环节">
                  <Input value={['受理', '材料审核', '部门审批', '联审会议', '批复发放'][currentProject.currentStep]} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="处理人">
                  <Input defaultValue={currentProject.handler || '当前用户'} prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="审批意见">
              <Input.TextArea rows={4} placeholder="请输入审批意见..." />
            </Form.Item>
            <Form.Item label="附件上传">
              <Button icon={<FileAddOutlined />}>上传附件</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 审批环节编辑模态框 */}
      <Modal
        title={currentStep ? "编辑审批环节" : "添加审批环节"}
        open={stepEditVisible}
        onCancel={() => setStepEditVisible(false)}
        onOk={handleStepFormSubmit}
      >
        <Form form={stepForm} layout="vertical">
          <Form.Item name="step" label="审批环节" rules={[{ required: true, message: '请输入审批环节名称' }]}>
            <Input placeholder="如：材料审核、专家评审等" />
          </Form.Item>
          <Form.Item name="department" label="审批部门" rules={[{ required: true, message: '请输入审批部门' }]}>
            <Input placeholder="如：行政审批科、资源规划科等" />
          </Form.Item>
          <Form.Item name="handler" label="经办人" rules={[{ required: true, message: '请输入经办人姓名' }]}>
            <Input placeholder="请输入经办人姓名" />
          </Form.Item>
          <Form.Item name="timeLimit" label="办理时限" rules={[{ required: true, message: '请输入办理时限' }]}>
            <Input placeholder="如：3个工作日、5个工作日等" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectApproval; 