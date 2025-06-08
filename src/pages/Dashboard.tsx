import React from 'react';
import { Card, Row, Col, Statistic, Table, Tabs } from 'antd';
import { EnvironmentOutlined, BuildOutlined, HomeOutlined, AreaChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const Dashboard: React.FC = () => {
  // 土地资源总体分析
  const landResourceData = {
    total: 1268, // 总面积（平方公里）
    urban: 326, // 城市建设用地
    agriculture: 705, // 农业用地
    forest: 162, // 林地
    water: 45, // 水域
    other: 30, // 其他用地
  };

  // 不动产登记数据
  const realEstateData = {
    total: 28500, // 总登记数
    residential: 18600, // 住宅类
    commercial: 5400, // 商业类
    industrial: 3800, // 工业类
    other: 700, // 其他类型
  };

  // 项目审批数据
  const projectApprovalData = [
    {
      key: '1',
      category: '建设项目用地预审',
      count: 120,
      completed: 105,
      rate: 87.5,
    },
    {
      key: '2',
      category: '建设用地规划许可',
      count: 150,
      completed: 142,
      rate: 94.7,
    },
    {
      key: '3',
      category: '建设工程规划许可',
      count: 180,
      completed: 168,
      rate: 93.3,
    },
    {
      key: '4',
      category: '国有土地使用权出让',
      count: 70,
      completed: 65,
      rate: 92.9,
    },
  ];

  // 土地利用类型分布
  const landUsageData = [
    { name: '农业用地', value: 705 },
    { name: '城市建设用地', value: 326 },
    { name: '林地', value: 162 },
    { name: '水域', value: 45 },
    { name: '其他', value: 30 },
  ];

  // 重点区域建设情况
  const keyAreasData = {
    xAxis: {
      type: 'category',
      data: [
        '城市中心区',
        '高新技术开发区',
        '北部新城',
        '南部生态区',
        '东部工业园',
      ],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '已批建设用地（公顷）',
        type: 'bar',
        data: [520, 680, 450, 280, 620],
      },
    ],
  };

  // 规划许可趋势数据
  const permittingTrendData = {
    xAxis: {
      type: 'category',
      data: ['2023Q1', '2023Q2', '2023Q3', '2023Q4', '2024Q1'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '规划许可数量',
        type: 'line',
        data: [120, 135, 128, 142, 135],
      },
      {
        name: '不动产登记数量',
        type: 'line',
        data: [5800, 6200, 5900, 6500, 6100],
      },
    ],
  };

  const projectApprovalColumns = [
    {
      title: '审批类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '申请数量',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '已完成审批',
      dataIndex: 'completed',
      key: 'completed',
    },
    {
      title: '完成率',
      dataIndex: 'rate',
      key: 'rate',
      render: (text: number) => `${text}%`,
    },
  ];

  return (
    <div>
      <div style={{
        fontSize: 32,
        fontWeight: 900,
        color: '#3f8efc',
        textAlign: 'center',
        marginBottom: 32,
        letterSpacing: 2,
        textShadow: '0 0 16px #3f8efc55, 0 0 32px #3f8efc22',
      }}>
        邹城市自然资源和规划局大数据分析平台
      </div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="土地资源总体分析" key="1">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总面积（平方公里）"
                  value={landResourceData.total}
                  prefix={<EnvironmentOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="城市建设用地（平方公里）"
                  value={landResourceData.urban}
                  prefix={<BuildOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="农业用地（平方公里）"
                  value={landResourceData.agriculture}
                  prefix={<AreaChartOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="林地（平方公里）"
                  value={landResourceData.forest}
                  prefix={<AreaChartOutlined />}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="土地利用类型分布">
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'item',
                      formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                      orient: 'vertical',
                      right: 10,
                      top: 'center',
                      data: landUsageData.map(item => item.name)
                    },
                    series: [
                      {
                        name: '土地利用',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                          show: false,
                          position: 'center'
                        },
                        emphasis: {
                          label: {
                            show: true,
                            fontSize: '16',
                            fontWeight: 'bold'
                          }
                        },
                        labelLine: {
                          show: false
                        },
                        data: landUsageData.map(item => ({
                          value: item.value,
                          name: item.name
                        }))
                      }
                    ]
                  }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="规划许可趋势">
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'axis'
                    },
                    legend: {
                      data: permittingTrendData.series.map(item => item.name)
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: permittingTrendData.xAxis.data
                    },
                    yAxis: {
                      type: 'value'
                    },
                    series: permittingTrendData.series
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="规划管理分析" key="2">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="项目审批情况">
                <Table
                  columns={projectApprovalColumns}
                  dataSource={projectApprovalData}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="重点区域建设情况">
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'shadow'
                      }
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: [
                      {
                        type: 'category',
                        data: keyAreasData.xAxis.data,
                        axisTick: {
                          alignWithLabel: true
                        }
                      }
                    ],
                    yAxis: [
                      {
                        type: 'value'
                      }
                    ],
                    series: [
                      {
                        name: keyAreasData.series[0].name,
                        type: 'bar',
                        barWidth: '60%',
                        data: keyAreasData.series[0].data
                      }
                    ]
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="不动产登记分析" key="3">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总登记数"
                  value={realEstateData.total}
                  prefix={<HomeOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="住宅类"
                  value={realEstateData.residential}
                  prefix={<HomeOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="商业类"
                  value={realEstateData.commercial}
                  prefix={<HomeOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="工业类"
                  value={realEstateData.industrial}
                  prefix={<HomeOutlined />}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="不动产登记类型分布">
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'item',
                      formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                      orient: 'horizontal',
                      bottom: 'bottom',
                      data: ['住宅类', '商业类', '工业类', '其他']
                    },
                    series: [
                      {
                        name: '不动产登记',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                          { value: realEstateData.residential, name: '住宅类' },
                          { value: realEstateData.commercial, name: '商业类' },
                          { value: realEstateData.industrial, name: '工业类' },
                          { value: realEstateData.other, name: '其他' }
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
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard; 