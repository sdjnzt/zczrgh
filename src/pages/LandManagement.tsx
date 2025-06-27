import React, { useState } from 'react';
import { Card, Table, Tabs, Row, Col, Input, Button, Select, Tag, Space, Statistic, Modal, Descriptions, Form } from 'antd';
import { SearchOutlined, EnvironmentOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;

// 定义地块数据类型
interface LandParcel {
  key: string;
  id: string;
  name: string;
  area: number;
  type: string;
  location: string;
  status: string;
  owner: string;
}

// 定义土地用途数据类型
interface LandTypeData {
  value: number;
  name: string;
}

const LandManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [landType, setLandType] = useState('all');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentLand, setCurrentLand] = useState<LandParcel | null>(null);
  const [form] = Form.useForm();

  // 模拟地块数据
  const landData: LandParcel[] = [
    {
      key: '1',
      id: 'ZC2023001',
      name: '邹城市中心区A-12地块',
      area: 25600,
      type: '商业用地',
      location: '邹城市中心区北部',
      status: '已出让',
      owner: '山东邹城地产开发有限公司',
    },
    {
      key: '2',
      id: 'ZC2023002',
      name: '邹城市高新区B-05地块',
      area: 35800,
      type: '工业用地',
      location: '邹城市高新技术开发区',
      status: '已出让',
      owner: '邹城市智能制造有限公司',
    },
    {
      key: '3',
      id: 'ZC2023003',
      name: '邹城市东部C-08地块',
      area: 52000,
      type: '住宅用地',
      location: '邹城市东部新区',
      status: '已出让',
      owner: '山东建设集团邹城分公司',
    },
    {
      key: '4',
      id: 'ZC2023004',
      name: '邹城市南部D-15地块',
      area: 18500,
      type: '公共设施用地',
      location: '邹城市南部生态区',
      status: '未出让',
      owner: '邹城市',
    },
    {
      key: '5',
      id: 'ZC2023005',
      name: '邹城市西部E-03地块',
      area: 42000,
      type: '工业用地',
      location: '邹城市西部工业园',
      status: '已出让',
      owner: '邹城市机械制造有限公司',
    },
    {
      key: '6',
      id: 'ZC2023006',
      name: '邹城市北部F-07地块',
      area: 30500,
      type: '住宅用地',
      location: '邹城市北部新城',
      status: '未出让',
      owner: '邹城市',
    },
  ];

  // 土地用途分类统计
  const landTypeData: LandTypeData[] = [
    { value: 82500, name: '住宅用地' },
    { value: 77800, name: '工业用地' },
    { value: 25600, name: '商业用地' },
    { value: 18500, name: '公共设施用地' },
  ];

  // 表格列定义
  const columns: ColumnsType<LandParcel> = [
    {
      title: '地块编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: LandParcel, b: LandParcel) => a.id.localeCompare(b.id),
    },
    {
      title: '地块名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Button type="link" style={{padding: 0}}>{text}</Button>,
    },
    {
      title: '面积(㎡)',
      dataIndex: 'area',
      key: 'area',
      sorter: (a: LandParcel, b: LandParcel) => a.area - b.area,
    },
    {
      title: '用地类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = 'green';
        if (type === '工业用地') color = 'blue';
        if (type === '商业用地') color = 'orange';
        if (type === '公共设施用地') color = 'purple';
        return (
          <Tag color={color}>
            {type}
          </Tag>
        );
      },
      filters: [
        { text: '住宅用地', value: '住宅用地' },
        { text: '工业用地', value: '工业用地' },
        { text: '商业用地', value: '商业用地' },
        { text: '公共设施用地', value: '公共设施用地' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.type.indexOf(value) === 0,
    },
    {
      title: '所在位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '已出让' ? 'green' : 'volcano'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: '已出让', value: '已出让' },
        { text: '未出让', value: '未出让' },
      ],
      onFilter: (value, record) => 
        typeof value === 'string' && record.status.indexOf(value) === 0,
    },
    {
      title: '使用权人',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: LandParcel) => (
        <Space size="middle">
          <Button type="link" style={{padding: 0}} onClick={() => handleView(record)}>查看</Button>
          <Button type="link" style={{padding: 0}} onClick={() => handleEdit(record)}>编辑</Button>
        </Space>
      ),
    },
  ];

  // 筛选数据
  const filteredData = landData.filter(item => {
    if (landType !== 'all' && item.type !== landType) return false;
    return item.name.includes(searchText) || 
           item.id.includes(searchText) || 
           item.location.includes(searchText);
  });

  // 土地分类饼图配置
  const landTypeChartOption = {
    title: {
      text: '土地用途分类统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} 平方米 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: landTypeData.map(item => item.name)
    },
    series: [
      {
        name: '土地用途',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: landTypeData,
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

  // 土地出让趋势图配置
  const landTransferChartOption = {
    title: {
      text: '土地出让趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['出让面积', '出让金额'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['2020年', '2021年', '2022年', '2023年', '2024年']
    },
    yAxis: [
      {
        type: 'value',
        name: '面积(㎡)',
        position: 'left',
      },
      {
        type: 'value',
        name: '金额(万元)',
        position: 'right',
      }
    ],
    series: [
      {
        name: '出让面积',
        type: 'bar',
        data: [120000, 132000, 101000, 134000, 90000],
        yAxisIndex: 0,
      },
      {
        name: '出让金额',
        type: 'line',
        data: [5600, 6200, 4800, 6500, 4200],
        yAxisIndex: 1,
      }
    ]
  };

  const handleView = (record: LandParcel) => {
    setCurrentLand(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: LandParcel) => {
    setCurrentLand(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    form.validateFields().then(values => {
      // 在实际应用中，这里会调用API保存数据
      console.log('提交的表单数据:', values);
      // 更新本地数据（模拟）
      if (currentLand) {
        const index = landData.findIndex(item => item.key === currentLand.key);
        if (index !== -1) {
          // 实际项目中这里应该通过API更新后端数据
          // landData[index] = { ...landData[index], ...values };
        }
      }
      setEditModalVisible(false);
    });
  };

  return (
    <div className="land-management">
      <h2>土地资源管理</h2>
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="地块管理" key="1">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Input
                  placeholder="搜索地块编号/名称/位置"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="用地类型"
                  value={landType}
                  onChange={value => setLandType(value)}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="住宅用地">住宅用地</Option>
                  <Option value="工业用地">工业用地</Option>
                  <Option value="商业用地">商业用地</Option>
                  <Option value="公共设施用地">公共设施用地</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Col>
              <Col span={10} style={{ textAlign: 'right' }}>
                <Space>
                  <Button icon={<FileExcelOutlined />}>导出Excel</Button>
                  <Button icon={<FilePdfOutlined />}>导出PDF</Button>
                  <Button type="primary">添加地块</Button>
                </Space>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="统计分析" key="2">
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总地块数"
                  value={landData.length}
                  prefix={<EnvironmentOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总面积(㎡)"
                  value={landData.reduce((sum, item) => sum + item.area, 0)}
                  prefix={<EnvironmentOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已出让地块"
                  value={landData.filter(item => item.status === '已出让').length}
                  prefix={<EnvironmentOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="未出让地块"
                  value={landData.filter(item => item.status === '未出让').length}
                  prefix={<EnvironmentOutlined />}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card>
                <ReactECharts option={landTypeChartOption} style={{ height: 400 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <ReactECharts option={landTransferChartOption} style={{ height: 400 }} />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 查看详情模态框 */}
      <Modal
        title="地块详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentLand && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="地块编号">{currentLand.id}</Descriptions.Item>
            <Descriptions.Item label="地块名称">{currentLand.name}</Descriptions.Item>
            <Descriptions.Item label="面积(㎡)">{currentLand.area}</Descriptions.Item>
            <Descriptions.Item label="用地类型">{currentLand.type}</Descriptions.Item>
            <Descriptions.Item label="位置">{currentLand.location}</Descriptions.Item>
            <Descriptions.Item label="出让状态">{currentLand.status}</Descriptions.Item>
            <Descriptions.Item label="使用权人" span={2}>{currentLand.owner}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 编辑模态框 */}
      <Modal
        title="编辑地块"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditSubmit}
        width={700}
      >
        {currentLand && (
          <Form form={form} layout="vertical" initialValues={currentLand}>
            <Form.Item name="id" label="地块编号" rules={[{ required: true, message: '请输入地块编号' }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="name" label="地块名称" rules={[{ required: true, message: '请输入地块名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="area" label="面积(㎡)" rules={[{ required: true, message: '请输入面积' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="type" label="用地类型" rules={[{ required: true, message: '请选择用地类型' }]}>
              <Select>
                <Option value="住宅用地">住宅用地</Option>
                <Option value="工业用地">工业用地</Option>
                <Option value="商业用地">商业用地</Option>
                <Option value="公共设施用地">公共设施用地</Option>
              </Select>
            </Form.Item>
            <Form.Item name="location" label="位置" rules={[{ required: true, message: '请输入位置' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="status" label="出让状态" rules={[{ required: true, message: '请选择出让状态' }]}>
              <Select>
                <Option value="已出让">已出让</Option>
                <Option value="未出让">未出让</Option>
              </Select>
            </Form.Item>
            <Form.Item name="owner" label="使用权人">
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default LandManagement; 