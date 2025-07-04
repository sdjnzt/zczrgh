import React, { useState } from 'react';
import { Card, Table, Tabs, Row, Col, Input, Button, Select, Tag, Space, Statistic, Upload, message, Modal, Descriptions, Form } from 'antd';
import { SearchOutlined, UploadOutlined, EnvironmentOutlined, FileImageOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { ColumnsType } from 'antd/es/table';
import { List } from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;

// 定义规划项目类型
interface PlanningProject {
  key: string;
  id: string;
  name: string;
  type: string;
  area: string;
  startDate: string;
  endDate: string;
  status: string;
  principal: string;
}

// 定义规划图层类型
interface PlanningLayer {
  key: string;
  id: string;
  name: string;
  type: string;
  updateTime: string;
  size: string;
  status: string;
}

const UrbanPlanning: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [planningType, setPlanningType] = useState('all');
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState<PlanningProject | null>(null);
  const [form] = Form.useForm();

  // 模拟规划项目数据
  const planningProjects: PlanningProject[] = [
    {
      key: '1',
      id: 'ZC-GH-2025-001',
      name: '邹城市中心区控制性详细规划',
      type: '控制性详细规划',
      area: '中心城区',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      status: '实施中',
      principal: '李工',
    },
    {
      key: '2',
      id: 'ZC-GH-2025-002',
      name: '邹城市北部新城区总体规划',
      type: '总体规划',
      area: '北部新城',
      startDate: '2025-06-05',
      endDate: '2025-06-25',
      status: '实施中',
      principal: '王工',
    },
    {
      key: '3',
      id: 'ZC-GH-2025-003',
      name: '邹城市东部产业园区详细规划',
      type: '详细规划',
      area: '东部产业园',
      startDate: '2025-06-10',
      endDate: '2025-06-20',
      status: '已完成',
      principal: '张工',
    },
    {
      key: '4',
      id: 'ZC-GH-2025-004',
      name: '邹城市南部生态区规划',
      type: '专项规划',
      area: '南部生态区',
      startDate: '2025-06-05',
      endDate: '2025-06-25',
      status: '审批中',
      principal: '赵工',
    },
    {
      key: '5',
      id: 'ZC-GH-2025-005',
      name: '邹城市西部农业区土地利用规划',
      type: '土地利用规划',
      area: '西部农业区',
      startDate: '2025-06-08',
      endDate: '2025-06-28',
      status: '编制中',
      principal: '刘工',
    },
    {
      key: '6',
      id: 'ZC-GH-2025-006',
      name: '邹城市高新区城市设计',
      type: '城市设计',
      area: '高新区',
      startDate: '2025-06-12',
      endDate: '2025-06-30',
      status: '编制中',
      principal: '孙工',
    },
  ];

  // 模拟规划图层数据
  const planningLayers: PlanningLayer[] = [
    {
      key: '1',
      id: 'ZC-GHT-2025-001',
      name: '邹城市土地利用现状图',
      type: 'shapefile',
      updateTime: '2025-06-15',
      size: '156MB',
      status: '已发布',
    },
    {
      key: '2',
      id: 'ZC-GHT-2025-002',
      name: '邹城市总体规划图',
      type: 'geotiff',
      updateTime: '2025-06-10',
      size: '245MB',
      status: '已发布',
    },
    {
      key: '3',
      id: 'ZC-GHT-2025-003',
      name: '邹城市生态保护红线图',
      type: 'shapefile',
      updateTime: '2025-06-05',
      size: '98MB',
      status: '已发布',
    },
    {
      key: '4',
      id: 'ZC-GHT-2025-004',
      name: '邹城市中心城区控规图',
      type: 'geotiff',
      updateTime: '2025-06-18',
      size: '187MB',
      status: '审核中',
    },
    {
      key: '5',
      id: 'ZC-GHT-2025-005',
      name: '邹城市道路交通规划图',
      type: 'shapefile',
      updateTime: '2025-06-22',
      size: '124MB',
      status: '审核中',
    },
  ];

  // 表格列定义 - 规划项目
  const projectColumns: ColumnsType<PlanningProject> = [
    {
      title: '项目编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Button type="link" style={{ padding: 0 }}>{text}</Button>,
    },
    {
      title: '规划类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '总体规划', value: '总体规划' },
        { text: '控制性详细规划', value: '控制性详细规划' },
        { text: '详细规划', value: '详细规划' },
        { text: '专项规划', value: '专项规划' },
        { text: '土地利用规划', value: '土地利用规划' },
        { text: '城市设计', value: '城市设计' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.type.indexOf(value) === 0,
    },
    {
      title: '规划区域',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => a.startDate.localeCompare(b.startDate),
    },
    {
      title: '计划完成日期',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === '编制中') color = 'blue';
        if (status === '审批中') color = 'orange';
        if (status === '实施中') color = 'purple';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: '编制中', value: '编制中' },
        { text: '审批中', value: '审批中' },
        { text: '实施中', value: '实施中' },
        { text: '已完成', value: '已完成' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.status.indexOf(value) === 0,
    },
    {
      title: '负责人',
      dataIndex: 'principal',
      key: 'principal',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" style={{ padding: 0 }} onClick={() => handleView(record)}>查看</Button>
          <Button type="link" style={{ padding: 0 }} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" style={{ padding: 0 }} onClick={() => handleFile(record)}>文件</Button>
        </Space>
      ),
    },
  ];

  // 表格列定义 - 规划图层
  const layerColumns: ColumnsType<PlanningLayer> = [
    {
      title: '图层编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '图层名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Button type="link" style={{ padding: 0 }}>{text}</Button>,
    },
    {
      title: '图层类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'shapefile', value: 'shapefile' },
        { text: 'geotiff', value: 'geotiff' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.type.indexOf(value) === 0,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: (a, b) => a.updateTime.localeCompare(b.updateTime),
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === '审核中') color = 'orange';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: '审核中', value: '审核中' },
        { text: '已发布', value: '已发布' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.status.indexOf(value) === 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" style={{ padding: 0 }} onClick={() => handlePreview(record)}>预览</Button>
          <Button type="link" style={{ padding: 0 }} onClick={() => handleDownload(record)}>下载</Button>
          {record.status === '审核中' && 
            <Button type="link" style={{ padding: 0 }} onClick={() => handleReview(record)}>审核</Button>
          }
        </Space>
      ),
    },
  ];

  // 筛选项目数据
  const filteredProjects = planningProjects.filter(item => {
    if (planningType !== 'all' && item.type !== planningType) return false;
    return item.name.includes(searchText) || 
           item.id.includes(searchText) || 
           item.area.includes(searchText);
  });

  // 规划项目状态统计
  const statusData = [
    { value: planningProjects.filter(item => item.status === '编制中').length, name: '编制中' },
    { value: planningProjects.filter(item => item.status === '审批中').length, name: '审批中' },
    { value: planningProjects.filter(item => item.status === '实施中').length, name: '实施中' },
    { value: planningProjects.filter(item => item.status === '已完成').length, name: '已完成' },
  ];

  // 规划类型统计
  const typeData = [
    { value: planningProjects.filter(item => item.type === '总体规划').length, name: '总体规划' },
    { value: planningProjects.filter(item => item.type === '控制性详细规划').length, name: '控制性详细规划' },
    { value: planningProjects.filter(item => item.type === '详细规划').length, name: '详细规划' },
    { value: planningProjects.filter(item => item.type === '专项规划').length, name: '专项规划' },
    { value: planningProjects.filter(item => item.type === '土地利用规划').length, name: '土地利用规划' },
    { value: planningProjects.filter(item => item.type === '城市设计').length, name: '城市设计' },
  ];

  // 年度规划项目趋势
  const yearlyTrendOption = {
    title: {
      text: '年度规划项目趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['总体规划', '控规', '详规', '专项规划'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['2020年', '2021年', '2022年', '2025年', '2024年']
    },
    yAxis: {
      type: 'value',
      name: '项目数量'
    },
    series: [
      {
        name: '总体规划',
        type: 'line',
        data: [1, 2, 1, 2, 1],
      },
      {
        name: '控规',
        type: 'line',
        data: [2, 3, 4, 3, 2],
      },
      {
        name: '详规',
        type: 'line',
        data: [3, 5, 6, 4, 3],
      },
      {
        name: '专项规划',
        type: 'line',
        data: [2, 4, 3, 5, 4],
      }
    ]
  };

  // 规划状态饼图配置
  const statusChartOption = {
    title: {
      text: '规划项目状态分布',
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

  // 规划类型饼图配置
  const typeChartOption = {
    title: {
      text: '规划类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: typeData.map(item => item.name)
    },
    series: [
      {
        name: '规划类型',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: typeData,
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

  // 上传组件配置
  const uploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  const handleView = (record: PlanningProject) => {
    setCurrentProject(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: PlanningProject) => {
    setCurrentProject(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleFile = (record: PlanningProject) => {
    setCurrentProject(record);
    setFileModalVisible(true);
  };

  const handleEditSubmit = () => {
    form.validateFields().then(values => {
      // 在实际应用中，这里会调用API保存数据
      console.log('提交的表单数据:', values);
      setEditModalVisible(false);
    });
  };

  // 添加文件预览和下载功能
  const handlePreview = (record: PlanningLayer) => {
    Modal.info({
      title: `预览 - ${record.name}`,
      content: (
        <div>
          <p>这里将显示图层预览内容。在实际项目中，会集成地图控件显示空间数据。</p>
          <p>图层ID: {record.id}</p>
          <p>图层类型: {record.type}</p>
          <p>更新时间: {record.updateTime}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleDownload = (record: PlanningLayer) => {
    // 实际项目中，这里会调用API请求下载文件
    console.log(`下载文件: ${record.name}`);
    message.success(`${record.name} 文件开始下载`);
  };

  const handleReview = (record: PlanningLayer) => {
    Modal.confirm({
      title: '审核图层',
      content: `您确定要审核并发布图层"${record.name}"吗？`,
      onOk() {
        // 实际项目中，这里会调用API提交审核
        message.success(`图层 ${record.name} 已审核通过并发布`);
      }
    });
  };

  return (
    <div className="urban-planning">
      <h2>城市规划管理</h2>
      
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
        <TabPane tab="规划项目管理" key="1">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Input
                  placeholder="搜索项目编号/名称/区域"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="规划类型"
                  value={planningType}
                  onChange={value => setPlanningType(value)}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="总体规划">总体规划</Option>
                  <Option value="控制性详细规划">控制性详细规划</Option>
                  <Option value="详细规划">详细规划</Option>
                  <Option value="专项规划">专项规划</Option>
                  <Option value="土地利用规划">土地利用规划</Option>
                  <Option value="城市设计">城市设计</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Col>
              <Col span={10} style={{ textAlign: 'right' }}>
                <Space>
                  <Button icon={<UploadOutlined />}>批量导入</Button>
                  <Button type="primary">新建项目</Button>
                </Space>
              </Col>
            </Row>

            <Table
              columns={projectColumns}
              dataSource={filteredProjects}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="规划统计分析" key="2">
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="规划项目总数"
                  value={planningProjects.length}
                  prefix={<FileImageOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已完成项目"
                  value={planningProjects.filter(item => item.status === '已完成').length}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="进行中项目"
                  value={planningProjects.filter(item => item.status !== '已完成').length}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="规划覆盖率"
                  value={85.6}
                  suffix="%"
                  prefix={<EnvironmentOutlined />}
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
                <ReactECharts option={typeChartOption} style={{ height: 400 }} />
              </Card>
            </Col>
          </Row>

          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card>
                <ReactECharts option={yearlyTrendOption} style={{ height: 400 }} />
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="规划图层管理" key="3">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Input
                  placeholder="搜索图层编号/名称"
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col span={18} style={{ textAlign: 'right' }}>
                <Space>
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>上传图层</Button>
                  </Upload>
                  <Button type="primary">管理图层类别</Button>
                </Space>
              </Col>
            </Row>

            <Table
              columns={layerColumns}
              dataSource={planningLayers}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 查看详情模态框 */}
      <Modal
        title="规划项目详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentProject && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="项目编号">{currentProject.id}</Descriptions.Item>
            <Descriptions.Item label="项目名称">{currentProject.name}</Descriptions.Item>
            <Descriptions.Item label="规划类型">{currentProject.type}</Descriptions.Item>
            <Descriptions.Item label="规划范围">{currentProject.area}</Descriptions.Item>
            <Descriptions.Item label="开始日期">{currentProject.startDate}</Descriptions.Item>
            <Descriptions.Item label="结束日期">{currentProject.endDate}</Descriptions.Item>
            <Descriptions.Item label="状态">{currentProject.status}</Descriptions.Item>
            <Descriptions.Item label="负责人">{currentProject.principal}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 编辑模态框 */}
      <Modal
        title="编辑规划项目"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditSubmit}
        width={700}
      >
        {currentProject && (
          <Form form={form} layout="vertical" initialValues={currentProject}>
            <Form.Item name="id" label="项目编号" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="name" label="项目名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="规划类型" rules={[{ required: true }]}>
              <Select>
                <Option value="总体规划">总体规划</Option>
                <Option value="控制性详细规划">控制性详细规划</Option>
                <Option value="详细规划">详细规划</Option>
                <Option value="专项规划">专项规划</Option>
                <Option value="土地利用规划">土地利用规划</Option>
                <Option value="城市设计">城市设计</Option>
              </Select>
            </Form.Item>
            <Form.Item name="area" label="规划范围" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="startDate" label="开始日期" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="endDate" label="结束日期" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select>
                <Option value="编制中">编制中</Option>
                <Option value="审批中">审批中</Option>
                <Option value="实施中">实施中</Option>
                <Option value="已完成">已完成</Option>
              </Select>
            </Form.Item>
            <Form.Item name="principal" label="负责人" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 文件管理模态框 */}
      <Modal
        title="规划项目文件"
        open={fileModalVisible}
        onCancel={() => setFileModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentProject && (
          <>
            <Descriptions title="项目文件" bordered column={1} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="项目名称">{currentProject.name}</Descriptions.Item>
              <Descriptions.Item label="项目编号">{currentProject.id}</Descriptions.Item>
              <Descriptions.Item label="规划类型">{currentProject.type}</Descriptions.Item>
            </Descriptions>
            
            <List
              header={<div>文件列表</div>}
              bordered
              dataSource={[
                { name: `${currentProject.name}-规划图.pdf`, type: "PDF", size: "2.5MB", date: "2025-06-15" },
                { name: `${currentProject.name}-说明书.doc`, type: "Word", size: "1.8MB", date: "2025-06-12" },
                { name: `${currentProject.name}-数据表.xlsx`, type: "Excel", size: "0.5MB", date: "2025-06-10" }
              ]}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link" key="view">预览</Button>,
                    <Button type="link" key="download">下载</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.type} | ${item.size} | 上传日期: ${item.date}`}
                  />
                </List.Item>
              )}
            />
            
            <div style={{ marginTop: 20 }}>
              <Upload>
                <Button icon={<UploadOutlined />}>上传新文件</Button>
              </Upload>
            </div>
          </>
        )}
      </Modal>

    </div>
  );
};

export default UrbanPlanning; 