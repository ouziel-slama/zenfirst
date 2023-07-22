import React, { useState, useEffect } from 'react';
import '../styles/App.css';

import { UserOutlined, BellOutlined } from '@ant-design/icons';
import { Spin, Card, Avatar } from 'antd';
import { useCookies } from 'react-cookie';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

import GetDashboard from '../services/GetDashboard';

const WelcomeCard = (props: any) => {
  const [cookies] = useCookies(['zenfirst-cookie']);

  return (
    <Card style={{ backgroundColor: "#E8E3FE"}}>
      <Card.Grid className="welcomeCardGridLeft">
        <p>Bienvenue,</p>
        <h2>{cookies['zenfirst-cookie'].user.firstName} {cookies['zenfirst-cookie'].user.lastName}</h2>
      </Card.Grid>
      <Card.Grid className="welcomeCardGridRight">
        <Avatar size="large" icon={<UserOutlined />} />
        <BellOutlined className="bellIcon" />
      </Card.Grid>
    </Card>
  )
}
const DashboardChart = (props: any) => {

  const formatLegend = (value: string, entry: any) => {
    const { color } = entry;
    return <span style={{ color }}>{value == "cashIn" ? "Encaissement" : "Décaissement"}</span>;
  };

  return (
    <div>
      <BarChart   
        width={300}
        height={300}
        data={props.data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Legend formatter={formatLegend}/>
        <Bar dataKey="cashIn" fill="#2FCE8F" />
        <Bar dataKey="cashOut" fill="#FF5B35" />
      </BarChart>
    </div>
  );
}

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);

    useEffect(() => {
        GetDashboard().then((result: any) => {
            setDashboardData(result);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
          <div className="dashboard">
            <Spin className='loading' tip="Chargement des données..." size="large">&nbsp;</Spin>
          </div>
        );
    } else {
        return (
          <div className="dashboard">
            <WelcomeCard />
            <DashboardChart data={dashboardData.chartData} />
          </div>
        );
    }
}

export default Dashboard;