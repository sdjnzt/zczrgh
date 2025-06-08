import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { UserOutlined, TeamOutlined, RiseOutlined, FallOutlined, ArrowLeftOutlined, 
  BankOutlined, BookOutlined, SafetyCertificateOutlined, AlertOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useNavigate } from 'react-router-dom';
// import CountUp from 'react-countup';

// 自定义数字滚动 Hook
function useCountUp(end: number, duration = 1.5, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const current = start + (end - start) * progress;
      setValue(Number(current.toFixed(decimals)));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, decimals]);
  return value;
}

const AnimatedNumber: React.FC<{end: number, decimals?: number, suffix?: string}> = ({ end, decimals = 0, suffix }) => {
  const value = useCountUp(end, 1.5, decimals);
  return <span>{value.toLocaleString()}{suffix || ''}</span>;
};

const cardStyle = {
  background: 'rgba(30,40,90,0.85)',
  color: '#fff',
  borderRadius: 20,
  boxShadow: '0 0 32px #3f8efc55',
  height: '100%',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(63,142,252,0.2)',
  transition: 'all 0.3s ease',
};

const indicatorStyle = {
  ...cardStyle,
  textAlign: 'center' as const,
  fontSize: 32,
  fontWeight: 700,
  minHeight: 120,
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid #3f8efc',
  position: 'relative' as const,
  overflow: 'hidden',
};

const BigScreen: React.FC = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [updateTime] = useState(new Date());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredMonitor, setHoveredMonitor] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [monitorData, setMonitorData] = useState([
    { label: '今日新增就业岗位', value: 128 },
    { label: '今日新增求职者', value: 86 },
    { label: '今日社保业务办理', value: 256 },
    { label: '今日培训报名', value: 42 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    setIsLoaded(true);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setMonitorData(data => data.map(item => ({
        ...item,
        value: Math.max(0, item.value + Math.floor(Math.random() * 10 - 5)), // 随机波动，最小为0
      })));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 星空粒子背景
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // 增加粒子数量和大小变化
    let stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.3,
      o: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.2 + 0.1,
      pulse: Math.random() * 0.1 + 0.05,
      pulseDir: 1,
      trail: [] as { x: number; y: number }[],
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let s of stars) {
        // 绘制粒子轨迹
        ctx.beginPath();
        for (let i = 0; i < s.trail.length - 1; i++) {
          ctx.moveTo(s.trail[i].x, s.trail[i].y);
          ctx.lineTo(s.trail[i + 1].x, s.trail[i + 1].y);
        }
        ctx.strokeStyle = `rgba(63,143,252,${s.o * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(63,143,252,${s.o})`;
        ctx.shadowColor = '#3f8efc';
        ctx.shadowBlur = 12;
        ctx.fill();
        
        // 更新轨迹
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 5) s.trail.shift();
        
        // 粒子大小呼吸效果
        s.r += s.pulse * s.pulseDir;
        if (s.r > 1.8 || s.r < 0.3) s.pulseDir *= -1;
      }
    }

    function animate() {
      for (let s of stars) {
        s.x += s.speed;
        if (s.x > width) {
          s.x = 0;
          s.trail = [];
        }
      }
      draw();
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });
  }, []);

  const indicators = [
    { icon: <UserOutlined />, label: '劳动力人口', value: 350000 },
    { icon: <TeamOutlined />, label: '就业人数', value: 280000 },
    { icon: <RiseOutlined />, label: '就业率', value: 80, suffix: '%' },
    { icon: <FallOutlined />, label: '失业率', value: 4.2, suffix: '%' },
    { icon: <BankOutlined />, label: '社保参保率', value: 95.8, suffix: '%' },
    { icon: <BookOutlined />, label: '技能培训人次', value: 12500 },
    { icon: <SafetyCertificateOutlined />, label: '人才引进', value: 2800 },
    { icon: <AlertOutlined />, label: '预警指标', value: 12 },
  ];

  const trendOption = {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(30,40,90,0.9)',
      borderColor: '#3f8efc',
      textStyle: { color: '#fff' },
      axisPointer: {
        type: 'line',
        lineStyle: { color: '#3f8efc' }
      }
    },
    legend: { 
      data: ['就业人数', '失业人数', '社保参保人数'], 
      textStyle: { color: '#3f8efc', fontSize: 18, fontWeight: 700 },
      icon: 'roundRect',
      itemWidth: 20,
      itemHeight: 4,
    },
    grid: { left: 80, right: 20, bottom: 40, top: 40 },
    xAxis: {
      type: 'category',
      data: ['2023Q1', '2023Q2', '2023Q3', '2023Q4', '2024Q1'],
      axisLine: { lineStyle: { color: '#3f8efc' } },
      axisLabel: { color: '#fff', fontSize: 16 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#3f8efc' } },
      splitLine: { lineStyle: { color: 'rgba(63,142,252,0.1)' } },
      axisLabel: {
        color: '#fff',
        fontSize: 14,
        formatter: function (value: number) {
          if (value === 0) return '0';
          return value.toLocaleString('en-US');
        }
      },
    },
    series: [
      {
        name: '就业人数',
        type: 'line',
        data: [15000, 16000, 15500, 15800, 15700],
        color: '#3f8efc',
        symbol: 'circle',
        symbolSize: 14,
        lineStyle: { width: 5, shadowColor: '#3f8efc', shadowBlur: 16 },
        areaStyle: { 
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(63,142,252,0.3)' },
              { offset: 1, color: 'rgba(63,142,252,0.05)' }
            ]
          }
        },
        animationDuration: 2000,
        animationEasing: 'cubicInOut',
      },
      {
        name: '失业人数',
        type: 'line',
        data: [3000, 3200, 3100, 3050, 3000],
        color: '#ff7675',
        symbol: 'circle',
        symbolSize: 14,
        lineStyle: { width: 5, shadowColor: '#ff7675', shadowBlur: 16 },
        areaStyle: { 
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255,118,117,0.3)' },
              { offset: 1, color: 'rgba(255,118,117,0.05)' }
            ]
          }
        },
        animationDuration: 2000,
        animationEasing: 'cubicInOut',
      },
      {
        name: '社保参保人数',
        type: 'line',
        data: [28000, 28500, 29000, 29500, 30000],
        color: '#00b894',
        symbol: 'circle',
        symbolSize: 14,
        lineStyle: { width: 5, shadowColor: '#00b894', shadowBlur: 16 },
        areaStyle: { 
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0,184,148,0.3)' },
              { offset: 1, color: 'rgba(0,184,148,0.05)' }
            ]
          }
        },
        animationDuration: 2000,
        animationEasing: 'cubicInOut',
      },
    ],
  };

  const pieOption = {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'item',
      backgroundColor: 'rgba(30,40,90,0.9)',
      borderColor: '#3f8efc',
      textStyle: { color: '#fff' },
    },
    legend: {
      orient: 'vertical',
      left: 10,
      top: 40,
      textStyle: {
        color: '#3f8efc',
        fontSize: 16,
        fontWeight: 700,
        width: 120,
        overflow: 'break',
      },
      type: 'scroll',
      tooltip: { show: true },
      formatter: function(name: string) {
        return name.length > 6 ? name.slice(0, 6) + '\n' + name.slice(6) : name;
      }
    },
    series: [
      {
        name: '行业分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: [
          { value: 1048, name: '制造业' },
          { value: 735, name: '能源化工' },
          { value: 580, name: '信息技术' },
          { value: 484, name: '商贸服务' },
          { value: 300, name: '其他' },
        ],
        label: {
          show: true,
          color: '#fff',
          fontSize: 16,
          formatter: function(params: { name: string }) {
            const name = params.name;
            return name.length > 6 ? name.slice(0, 6) + '\n' + name.slice(6) : name;
          }
        },
        labelLine: { length: 40, length2: 60, lineStyle: { color: '#3f8efc' } },
        itemStyle: {
          borderColor: '#3f8efc',
          borderWidth: 3,
          shadowColor: '#3f8efc',
          shadowBlur: 16,
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(63,142,252,0.5)',
          },
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx: number) {
          return idx * 200;
        },
      },
    ],
  };

  const ageOption = {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(30,40,90,0.9)',
      borderColor: '#3f8efc',
      textStyle: { color: '#fff' },
      axisPointer: {
        type: 'shadow',
        shadowStyle: { color: 'rgba(63,142,252,0.1)' }
      }
    },
    grid: { left: 80, right: 20, bottom: 40, top: 40 },
    xAxis: {
      type: 'category',
      data: ['18-25岁', '26-35岁', '36-45岁', '46-55岁', '56岁以上'],
      axisLine: { lineStyle: { color: '#3f8efc' } },
      axisLabel: { color: '#fff', fontSize: 16 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#3f8efc' } },
      splitLine: { lineStyle: { color: 'rgba(63,142,252,0.1)' } },
      splitNumber: 5,
      minInterval: 1,
      axisLabel: {
        color: '#fff',
        fontSize: 14,
        interval: 0,
        showMaxLabel: true,
        formatter: function(value: number) {
          if (value === 0) return '0';
          return value.toLocaleString('en-US');
        }
      },
    },
    series: [
      {
        type: 'bar',
        data: [12000, 25000, 18000, 8000, 3000],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#3f8efc'
            }, {
              offset: 1,
              color: '#232946'
            }]
          },
          borderRadius: [4, 4, 0, 0],
          shadowColor: '#3f8efc',
          shadowBlur: 10,
        },
        barWidth: 20,
        animationDuration: 2000,
        animationEasing: 'elasticOut',
      },
    ],
  };

  return (
    <div style={{ 
      background: 'radial-gradient(ellipse at 60% 40%, #232946 60%, #0a0f2c 100%)', 
      minHeight: '100vh', 
      padding: 32, 
      position: 'relative', 
      overflow: 'hidden',
      animation: 'gradientBG 15s ease infinite',
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 1s ease',
    }}>
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes shine {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
          }
          @keyframes titleGlow {
            0%, 100% { text-shadow: 0 0 24px #3f8efc, 0 0 48px #3f8efc99; }
            50% { text-shadow: 0 0 32px #3f8efc, 0 0 64px #3f8efc99; }
          }
          @keyframes timeGlow {
            0%, 100% { text-shadow: 0 0 8px #fff; }
            50% { text-shadow: 0 0 16px #fff; }
          }
          @keyframes iconFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes cardHover {
            0% { transform: translateY(0); }
            100% { transform: translateY(-5px); }
          }
          @keyframes monitorHover {
            0% { transform: translateX(0); }
            100% { transform: translateX(5px); }
          }
        `}
      </style>
      <canvas ref={canvasRef} style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }} />
      <Button
        type="primary"
        shape="round"
        icon={<ArrowLeftOutlined />}
        size="large"
        style={{
          position: 'absolute',
          top: 32,
          left: 32,
          zIndex: 100,
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          boxShadow: '0 0 16px #3f8efc',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
        onClick={() => navigate('/')}
      >
        返回首页
      </Button>
      <div style={{ 
        color: '#fff', 
        fontSize: 40, 
        fontWeight: 900, 
        letterSpacing: 4, 
        textAlign: 'center', 
        marginBottom: 12, 
        textShadow: '0 0 24px #3f8efc, 0 0 48px #3f8efc99',
        animation: 'titleGlow 2s ease-in-out infinite',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 1s ease',
      }}>
        人力资源大数据分析平台 - 数字大屏
      </div>
      <div style={{ 
        color: '#3f8efc', 
        fontSize: 22, 
        textAlign: 'center', 
        marginBottom: 32, 
        textShadow: '0 0 8px #fff',
        animation: 'timeGlow 2s ease-in-out infinite',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 1s ease 0.2s',
      }}>
        {now.toLocaleString('zh-CN', { hour12: false })} | 数据更新时间：{updateTime.toLocaleString('zh-CN', { hour12: false })}
      </div>
      
      <Row gutter={[32, 32]}>
        {indicators.map((item, idx) => (
          <Col span={6} key={item.label}>
            <Card 
              bordered={false} 
              style={{
                ...indicatorStyle,
                transform: hoveredCard === item.label
                  ? 'translateY(-5px)'
                  : isLoaded
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                boxShadow: hoveredCard === item.label
                  ? '0 0 48px #3f8efc88'
                  : '0 0 32px #3f8efc55',
                opacity: isLoaded ? 1 : 0,
                transition: `all 0.5s ease ${idx * 0.1}s`,
              }}
              bodyStyle={{ padding: 0 }}
              onMouseEnter={() => setHoveredCard(item.label)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ 
                fontSize: 44, 
                marginBottom: 8, 
                textShadow: '0 0 16px #3f8efc',
                animation: 'iconFloat 2s ease-in-out infinite',
              }}>
                {item.icon}
              </div>
              <div style={{ 
                fontSize: 24, 
                marginBottom: 4, 
                textShadow: '0 0 8px #3f8efc',
                opacity: 0.9,
              }}>
                {item.label}
              </div>
              <div style={{ 
                fontSize: 40, 
                fontWeight: 900, 
                textShadow: '0 0 16px #fff',
                background: 'linear-gradient(45deg, #fff, #3f8efc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                <AnimatedNumber
                  end={item.value}
                  decimals={typeof item.value === 'number' && String(item.value).includes('.') ? 1 : 0}
                  suffix={item.suffix}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: 32 }}>
        <Col span={16}>
          <Card 
            bordered={false} 
            style={{
              ...cardStyle,
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease 0.4s',
            }}
          >
            <div style={{ 
              color: '#fff', 
              fontSize: 24, 
              fontWeight: 700, 
              marginBottom: 16, 
              textShadow: '0 0 8px #3f8efc',
              display: 'flex',
              alignItems: 'center',
            }}>
              <span style={{ 
                width: 4, 
                height: 24, 
                background: '#3f8efc', 
                marginRight: 12, 
                borderRadius: 2,
                boxShadow: '0 0 8px #3f8efc',
              }} />
              就业趋势分析
            </div>
            <ReactECharts option={trendOption} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            bordered={false} 
            style={{
              ...cardStyle,
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease 0.5s',
            }}
          >
            <div style={{ 
              color: '#fff', 
              fontSize: 24, 
              fontWeight: 700, 
              marginBottom: 16, 
              textShadow: '0 0 8px #3f8efc',
              display: 'flex',
              alignItems: 'center',
            }}>
              <span style={{ 
                width: 4, 
                height: 24, 
                background: '#3f8efc', 
                marginRight: 12, 
                borderRadius: 2,
                boxShadow: '0 0 8px #3f8efc',
              }} />
              行业分布
            </div>
            <ReactECharts option={pieOption} style={{ height: 400 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: 32 }}>
        <Col span={12}>
          <Card 
            bordered={false} 
            style={{
              ...cardStyle,
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease 0.6s',
            }}
          >
            <div style={{ 
              color: '#fff', 
              fontSize: 24, 
              fontWeight: 700, 
              marginBottom: 16, 
              textShadow: '0 0 8px #3f8efc',
              display: 'flex',
              alignItems: 'center',
            }}>
              <span style={{ 
                width: 4, 
                height: 24, 
                background: '#3f8efc', 
                marginRight: 12, 
                borderRadius: 2,
                boxShadow: '0 0 8px #3f8efc',
              }} />
              年龄结构分布
            </div>
            <ReactECharts option={ageOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            bordered={false} 
            style={{
              ...cardStyle,
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease 0.7s',
            }}
          >
            <div style={{ 
              color: '#fff', 
              fontSize: 24, 
              fontWeight: 700, 
              marginBottom: 16, 
              textShadow: '0 0 8px #3f8efc',
              display: 'flex',
              alignItems: 'center',
            }}>
              <span style={{ 
                width: 4, 
                height: 24, 
                background: '#3f8efc', 
                marginRight: 12, 
                borderRadius: 2,
                boxShadow: '0 0 8px #3f8efc',
              }} />
              实时监控
            </div>
            <div style={{ padding: 20 }}>
              {monitorData.map((item, idx) => (
                <div 
                  key={item.label + item.value}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: 16,
                    padding: '12px 16px',
                    background: hoveredMonitor === idx ? 'rgba(63,142,252,0.2)' : 'rgba(63,142,252,0.1)',
                    borderRadius: 8,
                    opacity: isLoaded ? 1 : 0,
                    transform: hoveredMonitor === idx
                      ? 'translateX(5px)'
                      : isLoaded
                        ? 'translateX(0)'
                        : 'translateX(-20px)',
                    transition: `all 0.5s ease ${0.8 + idx * 0.1}s`,
                  }}
                  onMouseEnter={() => setHoveredMonitor(idx)}
                  onMouseLeave={() => setHoveredMonitor(null)}
                >
                  <span style={{ color: '#3f8efc' }}>{item.label}</span>
                  <span style={{ 
                    color: '#fff', 
                    fontSize: 20,
                    fontWeight: 700,
                    textShadow: '0 0 8px #3f8efc',
                  }}>
                    <AnimatedNumber end={item.value} />
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BigScreen; 