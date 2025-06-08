import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Table, Space, Tag, message, Modal, Descriptions } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;

interface SearchResult {
  key: string;
  projectName: string;
  projectCode: string;
  type: string;
  area: number;
  status: string;
  landUse: string;
  applicant: string;
  location: string;
  approvalStatus: string;
  lastUpdateTime: string;
}

const SmartSearch: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResult[]>([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SearchResult | null>(null);
  const [editForm] = Form.useForm();

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 200,
    },
    {
      title: '项目编号',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '面积(亩)',
      dataIndex: 'area',
      key: 'area',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={status === '正常' ? 'green' : status === '待审批' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '用地性质',
      dataIndex: 'landUse',
      key: 'landUse',
      width: 120,
    },
    {
      title: '申请单位',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 200,
    },
    {
      title: '项目位置',
      dataIndex: 'location',
      key: 'location',
      width: 180,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 120,
      render: (status: string) => (
        <Tag color={status === '已批准' ? 'green' : status === '审批中' ? 'blue' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: SearchResult) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const mockData: SearchResult[] = [
      { key: '1', projectName: '邹城市西部工业园区扩建项目', projectCode: 'YZ20230001', type: '工业用地', area: 560, status: '正常', landUse: '工业用地', applicant: '邹城市山东鲁南装备制造有限公司', location: '邹城市西部工业园区', approvalStatus: '已批准', lastUpdateTime: '2025-05-15 14:30:00' },
      { key: '2', projectName: '邹城市智慧城市大数据中心建设项目', projectCode: 'YZ20230002', type: '商业用地', area: 120, status: '正常', landUse: '商业用地', applicant: '邹城市济宁智慧城市发展有限公司', location: '邹城市北湖新区', approvalStatus: '已批准', lastUpdateTime: '2025-05-14 16:45:00' },
      { key: '3', projectName: '邹城市北湖生态公园建设项目', projectCode: 'YZ20230003', type: '公共绿地', area: 750, status: '正常', landUse: '公共绿地', applicant: '邹城市城市建设局', location: '邹城市北湖新区', approvalStatus: '已批准', lastUpdateTime: '2025-05-13 09:15:00' },
      { key: '4', projectName: '邹城市南部农田水利改造项目', projectCode: 'YZ20230004', type: '农用地', area: 1200, status: '待审批', landUse: '农用地', applicant: '邹城市农业发展局', location: '邹城市南部农业区', approvalStatus: '审批中', lastUpdateTime: '2025-05-12 11:20:00' },
      { key: '5', projectName: '邹城市东部矿区生态修复项目', projectCode: 'YZ20230005', type: '生态修复', area: 850, status: '正常', landUse: '生态用地', applicant: '邹城市自然资源和规划局', location: '邹城市东部矿区', approvalStatus: '已批准', lastUpdateTime: '2025-05-11 15:40:00' },
      { key: '6', projectName: '邹城市科技创新产业园规划', projectCode: 'YZ20230006', type: '产业用地', area: 320, status: '正常', landUse: '产业用地', applicant: '邹城市山东鲁南科技集团', location: '邹城市高新技术开发区', approvalStatus: '已批准', lastUpdateTime: '2025-05-10 10:25:00' },
      { key: '7', projectName: '邹城市鲁南装备制造基地扩建', projectCode: 'YZ20230007', type: '工业用地', area: 480, status: '正常', landUse: '工业用地', applicant: '邹城市济宁鲁南装备制造有限公司', location: '邹城市西部工业园区', approvalStatus: '已批准', lastUpdateTime: '2025-05-09 14:50:00' },
      { key: '8', projectName: '邹城市智慧城市服务中心建设', projectCode: 'YZ20230008', type: '商业用地', area: 95, status: '待审批', landUse: '商业用地', applicant: '邹城市济宁智慧城市发展有限公司', location: '邹城市中心城区', approvalStatus: '审批中', lastUpdateTime: '2025-05-08 16:30:00' },
      { key: '9', projectName: '邹城市大数据产业园二期', projectCode: 'YZ20230009', type: '产业用地', area: 280, status: '正常', landUse: '产业用地', applicant: '邹城市山东鲁南大数据科技有限公司', location: '邹城市北湖新区', approvalStatus: '已批准', lastUpdateTime: '2025-05-07 13:20:00' },
      { key: '10', projectName: '邹城市装备制造产业园扩建', projectCode: 'YZ20230010', type: '工业用地', area: 620, status: '正常', landUse: '工业用地', applicant: '邹城市山东鲁南装备制造有限公司', location: '邹城市西部工业园区', approvalStatus: '已批准', lastUpdateTime: '2025-05-06 10:10:00' },
      { key: '11', projectName: '邹城市城市道路改造工程', projectCode: 'YZ20230011', type: '市政用地', area: 350, status: '待审批', landUse: '市政用地', applicant: '邹城市城市建设局', location: '邹城市中心城区', approvalStatus: '审批中', lastUpdateTime: '2025-05-05 09:00:00' },
      { key: '12', projectName: '邹城市科技产业园配套设施', projectCode: 'YZ20230012', type: '配套用地', area: 180, status: '正常', landUse: '配套用地', applicant: '邹城市山东鲁南科技集团', location: '邹城市高新技术开发区', approvalStatus: '已批准', lastUpdateTime: '2025-05-04 15:30:00' },
      { key: '13', projectName: '邹城市智慧城市公共服务平台', projectCode: 'YZ20230013', type: '公共设施', area: 75, status: '待审批', landUse: '公共设施用地', applicant: '邹城市济宁智慧城市发展有限公司', location: '邹城市北湖新区', approvalStatus: '审批中', lastUpdateTime: '2025-05-03 14:10:00' },
      { key: '14', projectName: '邹城市南部农田生态保护带', projectCode: 'YZ20230014', type: '生态保护', area: 980, status: '正常', landUse: '生态用地', applicant: '邹城市农业发展局', location: '邹城市南部农业区', approvalStatus: '已批准', lastUpdateTime: '2025-05-02 11:50:00' },
      { key: '15', projectName: '邹城市大数据中心基础设施建设', projectCode: 'YZ20230015', type: '信息产业', area: 130, status: '正常', landUse: '产业用地', applicant: '邹城市山东鲁南大数据科技有限公司', location: '邹城市北湖新区', approvalStatus: '已批准', lastUpdateTime: '2025-05-01 10:30:00' },
    ];
    setData(mockData);
  }, []);

  const onFinish = (values: any) => {
    setLoading(true);
    // 真实感更强的15条模拟数据
    const mockData: SearchResult[] = [
      { key: '1', projectName: '邹城市西部工业园区扩建项目', projectCode: 'YZ20230001', type: '工业用地', area: 560, status: '正常', landUse: '工业用地', applicant: '邹城市山东鲁南装备制造有限公司', location: '邹城市西部工业园区', approvalStatus: '已批准', lastUpdateTime: '2025-05-15 14:30:00' },
      { key: '2', projectName: '邹城市智慧城市大数据中心建设项目', projectCode: 'YZ20230002', type: '商业用地', area: 120, status: '正常', landUse: '商业用地', applicant: '邹城市济宁智慧城市发展有限公司', location: '邹城市北湖新区', approvalStatus: '已批准', lastUpdateTime: '2025-05-14 16:45:00' },
      { key: '3', projectName: '邹城市北湖生态公园建设项目', projectCode: 'YZ20230003', type: '公共绿地', area: 750, status: '正常', landUse: '公共绿地', applicant: '邹城市城市建设局', location: '邹城市北湖新区', approvalStatus: '已批准', lastUpdateTime: '2025-05-13 09:15:00' },
      { key: '4', projectName: '邹城市南部农田水利改造项目', projectCode: 'YZ20230004', type: '农用地', area: 1200, status: '待审批', landUse: '农用地', applicant: '邹城市农业发展局', location: '邹城市南部农业区', approvalStatus: '审批中', lastUpdateTime: '2025-05-12 11:20:00' },
      { key: '5', projectName: '邹城市东部矿区生态修复项目', projectCode: 'YZ20230005', type: '生态修复', area: 850, status: '正常', landUse: '生态用地', applicant: '邹城市自然资源和规划局', location: '邹城市东部矿区', approvalStatus: '已批准', lastUpdateTime: '2025-05-11 15:40:00' },
      { key: '6', projectName: '邹城市科技创新产业园规划', projectCode: 'YZ20230006', type: '产业用地', area: 320, status: '正常', landUse: '产业用地', applicant: '邹城市山东鲁南科技集团', location: '邹城市高新技术开发区', approvalStatus: '已批准', lastUpdateTime: '2025-05-10 10:25:00' },
      { key: '7', projectName: '邹城市鲁南装备制造基地扩建', projectCode: 'YZ20230007', type: '工业用地', area: 480, status: '正常', landUse: '工业用地', applicant: '邹城市济宁鲁南装备制造有限公司', location: '邹城市西部工业园区', approvalStatus: '已批准', lastUpdateTime: '2025-05-09 14:50:00' },
      { key: '8', projectName: '邹城市智慧城市服务中心建设', projectCode: 'YZ20230008', type: '商业用地', area: 95, status: '待审批', landUse: '商业用地', applicant: '邹城市济宁智慧城市发展有限公司', location: '邹城市中心城区', approvalStatus: '审批中', lastUpdateTime: '2025-05-08 16:30:00' },
      { key: '9', projectName: '邹城市大数据产业园二期', projectCode: 'YZ20230009', type: '产业用地', area: 280, status: '正常', landUse: '产业用地', applicant: '邹城市山东鲁南大数据科技有限公司', location: '邹城市北湖新区', approvalStatus: '已批准', lastUpdateTime: '2025-05-07 13:20:00' },
      { key: '10', projectName: '邹城市装备制造产业园扩建', projectCode: 'YZ20230010', type: '工业用地', area: 620, status: '正常', landUse: '工业用地', applicant: '邹城市山东鲁南装备制造有限公司', location: '邹城市西部工业园区', approvalStatus: '已批准', lastUpdateTime: '2025-05-06 10:10:00' },
      { key: '11', projectName: '邹城市城市道路改造工程', projectCode: 'YZ20230011', type: '市政用地', area: 350, status: '待审批', landUse: '市政用地', applicant: '邹城市城市建设局', location: '邹城市中心城区', approvalStatus: '审批中', lastUpdateTime: '2025-05-05 09:00:00' },
      { key: '12', projectName: '邹城市科技产业园配套设施', projectCode: 'YZ20230012', type: '配套用地', area: 180, status: '正常', landUse: '配套用地', applicant: '邹城市山东鲁南科技集团', location: '邹城市高新技术开发区', approvalStatus: '已批准', lastUpdateTime: '2025-05-04 15:30:00' },
      { key: '13', projectName: '邹城市智慧城市公共服务平台', projectCode: 'YZ20230013', type: '公共设施', area: 75, status: '待审批', landUse: '公共设施用地', applicant: '邹城市济宁智慧城市发展有限公司', location: '邹城市北湖新区', approvalStatus: '审批中', lastUpdateTime: '2025-05-03 14:10:00' },
      { key: '14', projectName: '邹城市南部农田生态保护带', projectCode: 'YZ20230014', type: '生态保护', area: 980, status: '正常', landUse: '生态用地', applicant: '邹城市农业发展局', location: '邹城市南部农业区', approvalStatus: '已批准', lastUpdateTime: '2025-05-02 11:50:00' },
      { key: '15', projectName: '邹城市大数据中心基础设施建设', projectCode: 'YZ20230015', type: '信息产业', area: 130, status: '正常', landUse: '产业用地', applicant: '邹城市山东鲁南大数据科技有限公司', location: '邹城市北湖新区', approvalStatus: '已批准', lastUpdateTime: '2025-05-01 10:30:00' },
    ];
    // 模拟搜索延迟
    setTimeout(() => {
      const filteredData = mockData.filter(item => {
        const nameMatch = !values.projectName || item.projectName.includes(values.projectName);
        const codeMatch = !values.projectCode || item.projectCode.includes(values.projectCode);
        const statusMatch = !values.status || item.status === values.status;
        const typeMatch = !values.type || item.type === values.type;
        return nameMatch && codeMatch && statusMatch && typeMatch;
      });
      setData(filteredData);
      setLoading(false);
      message.success(`搜索完成，共找到 ${filteredData.length} 条记录`);
    }, 1000);
  };

  const onReset = () => {
    form.resetFields();
    setData([]);
  };

  const handleView = (record: SearchResult) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: SearchResult) => {
    setCurrentRecord(record);
    editForm.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleEditSave = () => {
    editForm.validateFields().then(values => {
      if (currentRecord) {
        // 更新data中的对应项
        setData(prevData => prevData.map(item => item.key === currentRecord.key ? { ...item, ...values } : item));
      }
      setEditModalVisible(false);
      message.success('保存成功，数据已更新');
    });
  };

  return (
    <div>
      <Card title="智能检索" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          name="search"
          onFinish={onFinish}
          layout="inline"
        >
          <Form.Item name="projectName" label="项目名称">
            <Input placeholder="请输入项目名称" allowClear />
          </Form.Item>
          <Form.Item name="projectCode" label="项目编号">
            <Input placeholder="请输入项目编号" allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
              <Option value="正常">正常</Option>
              <Option value="待审批">待审批</Option>
              <Option value="已终止">已终止</Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="类型">
            <Select placeholder="请选择类型" style={{ width: 120 }} allowClear>
              <Option value="工业用地">工业用地</Option>
              <Option value="商业用地">商业用地</Option>
              <Option value="公共绿地">公共绿地</Option>
              <Option value="农用地">农用地</Option>
              <Option value="生态修复">生态修复</Option>
              <Option value="产业用地">产业用地</Option>
              <Option value="市政用地">市政用地</Option>
            </Select>
          </Form.Item>
          <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                  搜索
                </Button>
            <Button style={{ margin: '0 8px' }} onClick={onReset} icon={<ReloadOutlined />}>
                  重置
                </Button>
            </Form.Item>
        </Form>
      </Card>

        <Table 
          columns={columns} 
          dataSource={data} 
        rowKey="key"
        bordered
        scroll={{ x: 1500 }}
          loading={loading}
      />

      {/* 查看详情模态框 */}
      <Modal
        title="项目详情"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="项目名称" span={2}>{currentRecord.projectName}</Descriptions.Item>
            <Descriptions.Item label="项目编号">{currentRecord.projectCode}</Descriptions.Item>
            <Descriptions.Item label="类型">{currentRecord.type}</Descriptions.Item>
            <Descriptions.Item label="面积(亩)">{currentRecord.area}</Descriptions.Item>
            <Descriptions.Item label="状态">{currentRecord.status}</Descriptions.Item>
            <Descriptions.Item label="用地性质">{currentRecord.landUse}</Descriptions.Item>
            <Descriptions.Item label="审批状态">{currentRecord.approvalStatus}</Descriptions.Item>
            <Descriptions.Item label="申请单位" span={2}>{currentRecord.applicant}</Descriptions.Item>
            <Descriptions.Item label="项目位置" span={2}>{currentRecord.location}</Descriptions.Item>
            <Descriptions.Item label="最后更新时间" span={2}>{currentRecord.lastUpdateTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 编辑模态框 */}
      <Modal
        title="编辑项目"
        visible={editModalVisible}
        onOk={handleEditSave}
        onCancel={() => setEditModalVisible(false)}
        width={700}
      >
        {currentRecord && (
          <Form form={editForm} layout="vertical" initialValues={currentRecord}>
            <Form.Item name="projectName" label="项目名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="projectCode" label="项目编号" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="type" label="类型" rules={[{ required: true }]}>
              <Select>
                <Option value="工业用地">工业用地</Option>
                <Option value="商业用地">商业用地</Option>
                <Option value="公共绿地">公共绿地</Option>
                <Option value="农用地">农用地</Option>
                <Option value="生态修复">生态修复</Option>
                <Option value="产业用地">产业用地</Option>
                <Option value="市政用地">市政用地</Option>
              </Select>
            </Form.Item>
            <Form.Item name="area" label="面积(亩)" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select>
                <Option value="正常">正常</Option>
                <Option value="待审批">待审批</Option>
                <Option value="已终止">已终止</Option>
              </Select>
            </Form.Item>
            <Form.Item name="landUse" label="用地性质" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="applicant" label="申请单位" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="location" label="项目位置" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="approvalStatus" label="审批状态" rules={[{ required: true }]}>
              <Select>
                <Option value="已批准">已批准</Option>
                <Option value="审批中">审批中</Option>
                <Option value="待审批">待审批</Option>
                <Option value="已驳回">已驳回</Option>
              </Select>
            </Form.Item>
        </Form>
        )}
      </Modal>
    </div>
  );
};

export default SmartSearch; 