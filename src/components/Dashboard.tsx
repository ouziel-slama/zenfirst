import React, { useState, useEffect } from 'react';
import '../styles/App.css';

import { UserOutlined, BellOutlined, LeftOutlined, RightOutlined  } from '@ant-design/icons';
import { Spin, Card, Avatar, Select, Row, Col, Button } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

import GetDashboard from '../services/GetDashboard';
import { set } from 'react-hook-form';

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

  const chartData = props.data.accounts[props.currentAccount].chartData;

  return (
    <div>
      <BarChart   
        width={300}
        height={300}
        data={chartData}
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

const AccountSelector = (props: any) => {
  return (
    <div>
      <h3>Ma trésorerie:</h3>
      <Select 
        defaultValue={props.data.accountList[0]} 
        options={props.data.accountList} 
        onChange={props.setCurrentAccount}
        className="accountSelect"
      />
    </div>
  )
}

const AccountBalance = (props: any) => {
  return (
    <h1 className="balance">
      {new Intl.NumberFormat().format(props.data.accounts[props.currentAccount].balance)} €
    </h1>
  )
}

const MonthSelector = (props: any) => {

  const getCurrentMonth = () => {
    const monthString = props.data.accounts[props.currentAccount].chartData[props.currentMonthIndex].date;
    const currentMonth = new Date(monthString);
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1) + " " + currentMonth.getFullYear();
  }

  const changeMonth = (delta: number) => {
    const last = props.data.accounts[props.currentAccount].chartData.length - 1;
    const newIndex = props.currentMonthIndex + delta;
    if (newIndex < 0) props.setCurrentMonthIndex(0);
    else if (newIndex > last) props.setCurrentMonthIndex(last);
    else props.setCurrentMonthIndex(newIndex);
  }

  return (
    <Row align="middle" className="monthSelector">
      <Col span={3}>
        <Button 
          icon={<LeftOutlined />} 
          onClick={(e) => changeMonth(-1)} 
          disabled={props.currentMonthIndex == 0} 
        />
      </Col>
      <Col span={18}>
        <div className="currentMonth">
          {getCurrentMonth()}
        </div>
      </Col>
      <Col span={3} style={{textAlign: "right"}}>
        <Button 
          icon={<RightOutlined />} 
          onClick={(e) => changeMonth(1)} 
          disabled={props.currentMonthIndex == props.data.accounts[props.currentAccount].chartData.length - 1}
        />
      </Col>
    </Row>
  )
}

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [currentAccount, setCurrentAccount] = useState(0);
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

    useEffect(() => {
        GetDashboard().then((result: any) => {
            setDashboardData(result);
            setCurrentMonthIndex(result.accounts[0].chartData.length - 1);
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
        const defaultProps = {
          data: dashboardData,
          currentAccount, setCurrentAccount,
          currentMonthIndex, setCurrentMonthIndex,
        }
        return (
          <div className="dashboard">
            <WelcomeCard user={dashboardData.user} />
            <AccountSelector {...defaultProps } />
            <AccountBalance {...defaultProps }/>
            <MonthSelector {...defaultProps }  />
            <DashboardChart {...defaultProps } />
          </div>
        );
    }
}

export default Dashboard;