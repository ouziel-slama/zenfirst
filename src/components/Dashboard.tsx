import React, { useState, useEffect } from 'react';
import '../styles/App.css';

import { UserOutlined, BellOutlined, DownOutlined } from '@ant-design/icons';
import { Spin, Card, Avatar, Dropdown, Button } from 'antd';
import { useCookies } from 'react-cookie';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

import GetDashboard from '../services/GetDashboard';

const WelcomeCard = (props: any) => {
  return (
    <Card style={{ backgroundColor: "#E8E3FE"}}>
      <Card.Grid className="welcomeCardGridLeft">
        <h2>{props.user.firstName} {props.user.lastName}</h2>
        <p>{props.user.company.name}</p>
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
    const [currentAccount, setCurrentAccount] = useState(0);

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
            <WelcomeCard user={dashboardData.user} />
            <div>
              <h3>Ma trésorerie:</h3>
              <Dropdown placement="bottomLeft" menu={{
                items:dashboardData.accountList,
                onClick: (e: any) => setCurrentAccount(e.key)
              }}>
                  <span>{dashboardData.accountList[currentAccount].label} <Button icon={<DownOutlined />} /></span>
              </Dropdown>
            </div>
            <h1 className="balance">
              {new Intl.NumberFormat().format(dashboardData.accounts[currentAccount].balance)} €
            </h1>
            <DashboardChart data={dashboardData.accounts[currentAccount].chartData} />
          </div>
        );
    }
}

export default Dashboard;