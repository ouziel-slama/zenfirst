import { Cookies } from 'react-cookie';

const submitRequest = async (url: string, params: Record<string, string>) => {
  const cookies = new Cookies();
  try {
    const geturl = url + "?" + new URLSearchParams(params).toString();
    const res = await fetch(geturl, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cookies.get('zenfirst-cookie').jwt
      },
    });
    const json = await res.json();
    if (res.ok) {
      return { response: json, error: undefined };
    } else {
      return { response: undefined, error: json };
    }
  } catch (error) {
    return { response: undefined, error: error };
  }
}

const getDashboardData = async () => {
  const url = "https://api.zenfirst.fr/dashboard";
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  const startingMonth = startDate.toISOString().slice(0, 8) + '01';
  const params = {
    'startingMonth': startingMonth,
    'saveStartingMonth': 'true',
  };
  return await submitRequest(url, params);
}

const getCategoriesData = async () => {
  const url = "https://api.zenfirst.fr/categories";
  const params = {
    '_sort': 'isDefaultCategory:ASC,order:ASC',
  };
  return await submitRequest(url, params);
}

const getItemsData = async () => {
  const url = "https://api.zenfirst.fr/items/";
  return await submitRequest(url, {});
}

const prepareChartData = (dashboardData: any, categoriesData: any, accountId: any) => {
  var categoriesKind: any = {};
  categoriesData.response.forEach((category: any) => {
    categoriesKind[category.id] = category.kind;
  });

  var chartDataByMonth: any = {};
  dashboardData.response.transactions.forEach((transaction: any) => {
    if (accountId == 0 || transaction.account == accountId) {
      const kind = categoriesKind[transaction.category];
      if (!(transaction.date in chartDataByMonth)) {
        chartDataByMonth[transaction.date] = {
          'cashIn': 0,
          'cashOut': 0,
        };
      }
      chartDataByMonth[transaction.date][kind] += transaction.amount;
    }
  });

  var chartData: any = [];
  for (const [date, amounts] of Object.entries(chartDataByMonth) as any) {
    chartData.push({
      'date': date,
      'cashIn': amounts['cashIn'],
      'cashOut': amounts['cashOut'],
    });
  }

  return chartData;
}

const prepareAccountData = (dashboardData: any, categoriesData: any, itemsData: any) => {
  var accounts: any = [];

  itemsData.response[0].accounts.forEach((account: any) => {
    accounts.push({
      'id': account.id,
      'name': account.name,
      'balance': account.balance,
      'bankName': itemsData.response[0].bank.name,
      'chartData': prepareChartData(dashboardData, categoriesData, account.id),
    });
  });
  var totalBalance = 0;
  accounts.forEach((account: any) => {
    totalBalance += account.balance;
  });

  accounts.unshift({
    'id': 0, // 0 means all accounts
    'name': 'Consolidé (' + accounts.length + ' comptes)',
    'balance': totalBalance,
    'bankName': '',
    'chartData': prepareChartData(dashboardData, categoriesData, 0),
  });

  return accounts;
}

const GetDashboard = async () => {
  const dashboardData = await getDashboardData();
  const categoriesData = await getCategoriesData();
  const itemsData = await getItemsData();

  const cookies = new Cookies();
  const user = cookies.get('zenfirst-cookie').user;

  const accounts = prepareAccountData(dashboardData, categoriesData, itemsData);

  var accountList: any = [];
  accounts.forEach((account: any) => {
    var accounName = account.name;
    if (account.bankName != '') {
      accounName += ' (' + account.bankName + ')';
    }
    accountList.push({
      label: accounName,
      value: accountList.length,
    });
  });
  console.log(accountList)
  return {
    user,
    accounts,
    accountList,
  };
};
  
export default GetDashboard;