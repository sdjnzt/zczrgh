import React, { useState, useRef } from 'react';
import { Card, Row, Col, Button, Select, DatePicker, Typography, Divider, message, Spin, Alert, Space } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface ReportData {
  employmentTrend: {
    months: string[];
    newEmployment: number[];
    unemployment: number[];
  };
  industryDistribution: {
    name: string;
    value: number;
  }[];
  keyPopulation: {
    name: string;
    value: number;
  }[];
  trainingCompletion: {
    name: string;
    value: number;
  }[];
  reportContent: {
    title: string;
    content: string;
  }[];
}

const SmartReport: React.FC = () => {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(1, 'month'), dayjs()]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // 报告类型选项
  const reportTypes = [
    { label: '月度就业报告', value: 'monthly' },
    { label: '季度就业报告', value: 'quarterly' },
    { label: '年度就业报告', value: 'yearly' },
    { label: '重点人群就业报告', value: 'keyPopulation' },
    { label: '技能培训报告', value: 'training' },
  ];

  // 模拟获取报告数据
  const fetchReportData = async () => {
    // 这里应该是实际的API调用
    return new Promise<ReportData>((resolve) => {
      setTimeout(() => {
        resolve({
          employmentTrend: {
            months: ['1月', '2月', '3月', '4月', '5月', '6月'],
            newEmployment: [5000, 5500, 4800, 6000, 5200, 5800],
            unemployment: [18000, 16500, 15800, 15200, 15000, 14500],
          },
          industryDistribution: [
            { name: '制造业', value: 45 },
            { name: '能源化工', value: 25 },
            { name: '信息技术', value: 15 },
            { name: '商贸服务', value: 10 },
            { name: '其他', value: 5 },
          ],
          keyPopulation: [
            { name: '高校毕业生', value: 4200 },
            { name: '农民工', value: 75000 },
            { name: '残疾人', value: 2100 },
            { name: '退役军人', value: 1800 },
          ],
          trainingCompletion: [
            { name: '制造业技能', value: 96 },
            { name: '信息技术', value: 95 },
            { name: '服务业技能', value: 90 },
            { name: '创业培训', value: 95 },
          ],
          reportContent: [
            {
              title: '就业形势总体分析',
              content: '本报告期内，我区就业形势总体稳定，就业率保持在80%以上，失业率控制在4.2%以内。新增就业人数持续增长，重点人群就业情况良好。',
            },
            {
              title: '重点人群就业情况',
              content: '高校毕业生就业率达到84%，农民工就业率达到93.8%，残疾人就业率达到70%，退役军人就业率达到90%。各项指标均达到预期目标。',
            },
            {
              title: '技能培训成效',
              content: '本报告期内，共开展各类技能培训15000人次，培训完成率达到90%以上。其中制造业技能培训完成率最高，达到96%。',
            },
            {
              title: '存在问题及建议',
              content: '1. 部分行业用工需求波动较大，需要加强就业预警和引导。\n2. 技能培训针对性有待提高，建议加强与企业需求对接。\n3. 重点人群就业服务需要进一步精准化。',
            },
          ],
        });
      }, 2000);
    });
  };

  // 生成报告
  const generateReport = async () => {
    setLoading(true);
    try {
      const data = await fetchReportData();
      setReportData(data);
      message.success('报告生成成功！');
    } catch (error) {
      message.error('报告生成失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  // 下载报告
  const downloadReport = async () => {
    if (!reportData) {
      message.warning('请先生成报告！');
      return;
    }

    setDownloading(true);
    try {
      if (!reportRef.current) {
        throw new Error('报告内容不存在');
      }

      // 创建PDF文档
      const pdf = new jsPDF('p', 'mm', 'a4');
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // 计算PDF页面大小
      const imgWidth = 210; // A4纸的宽度
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297; // A4纸的高度
      let heightLeft = imgHeight;
      let position = 0;

      // 添加报告标题
      pdf.setFontSize(20);
      pdf.text('邹城市就业形势分析报告', 105, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(
        `报告期间：${dateRange[0].format('YYYY-MM-DD')} 至 ${dateRange[1].format('YYYY-MM-DD')}`,
        105,
        30,
        { align: 'center' }
      );

      // 添加报告内容
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 40, imgWidth, imgHeight);

      // 如果内容超过一页，自动添加新页面
      while (heightLeft >= pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, -position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 生成文件名
      const fileName = `邹城市就业形势分析报告_${dateRange[0].format('YYYYMMDD')}_${dateRange[1].format('YYYYMMDD')}.pdf`;

      // 保存PDF
      pdf.save(fileName);
      message.success('报告下载成功！');
    } catch (error) {
      console.error('下载报告失败:', error);
      message.error('下载报告失败，请重试！');
    } finally {
      setDownloading(false);
    }
  };

  // 就业趋势图表配置
  const getEmploymentTrendOption = () => ({
    title: {
      text: '就业趋势分析',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: reportData?.employmentTrend.months || [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '新增就业',
        type: 'line',
        data: reportData?.employmentTrend.newEmployment || [],
      },
      {
        name: '失业人数',
        type: 'line',
        data: reportData?.employmentTrend.unemployment || [],
      },
    ],
  });

  // 行业分布图表配置
  const getIndustryDistributionOption = () => ({
    title: {
      text: '行业分布情况',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: reportData?.industryDistribution || [],
      },
    ],
  });

  // 重点人群就业情况图表配置
  const getKeyPopulationOption = () => ({
    title: {
      text: '重点人群就业情况',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: reportData?.keyPopulation.map(item => item.name) || [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '就业人数',
        type: 'bar',
        data: reportData?.keyPopulation.map(item => item.value) || [],
      },
    ],
  });

  // 技能培训完成情况图表配置
  const getTrainingCompletionOption = () => ({
    title: {
      text: '技能培训完成情况',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: reportData?.trainingCompletion || [],
      },
    ],
  });

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col span={24}>
            <Alert
              message="操作提示"
              description={
                <div>
                  <p>1. 选择报告类型（月度/季度/年度/重点人群/技能培训）</p>
                  <p>2. 选择报告时间范围</p>
                  <p>3. 点击"生成报告"按钮，系统将自动生成分析报告</p>
                  <p>4. 报告生成后，可以点击"下载报告"保存报告</p>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              value={reportType}
              onChange={setReportType}
              options={reportTypes}
            />
          </Col>
          <Col span={8}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]]);
                }
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={10}>
            <Space>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={generateReport}
                loading={loading}
              >
                生成报告
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={downloadReport}
                disabled={!reportData}
                loading={downloading}
              >
                下载报告
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Divider />

      <Spin spinning={loading}>
        {reportData && (
          <div ref={reportRef}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card>
                  <Title level={4}>邹城市就业形势分析报告</Title>
                  <Paragraph>
                    报告期间：{dateRange[0].format('YYYY-MM-DD')} 至 {dateRange[1].format('YYYY-MM-DD')}
                  </Paragraph>
                </Card>
              </Col>

              <Col span={24}>
                <Card>
                  {reportData.reportContent.map((item, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                      <Title level={5}>{item.title}</Title>
                      <Paragraph>{item.content}</Paragraph>
                    </div>
                  ))}
                </Card>
              </Col>

              <Col span={12}>
                <Card title="就业趋势分析">
                  <ReactECharts option={getEmploymentTrendOption()} style={{ height: '300px' }} />
                </Card>
              </Col>

              <Col span={12}>
                <Card title="行业分布情况">
                  <ReactECharts option={getIndustryDistributionOption()} style={{ height: '300px' }} />
                </Card>
              </Col>

              <Col span={12}>
                <Card title="重点人群就业情况">
                  <ReactECharts option={getKeyPopulationOption()} style={{ height: '300px' }} />
                </Card>
              </Col>

              <Col span={12}>
                <Card title="技能培训完成情况">
                  <ReactECharts option={getTrainingCompletionOption()} style={{ height: '300px' }} />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default SmartReport; 