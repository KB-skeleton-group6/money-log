export function aggregateChartData(transactions, filterType) {
  let labels = [];
  const dataLength = 5;
  const incomes = new Array(dataLength).fill(0);
  const expenses = new Array(dataLength).fill(0);
  const profits = new Array(dataLength).fill(0);

  const now = new Date();

  if (filterType === 'weekly') {
    labels = ['4주 전', '3주 전', '2주 전', '1주 전', '이번 주'];
  } else if (filterType === 'monthly') {
    labels = ['4개월 전', '3개월 전', '2개월 전', '1개월 전', '이번 달'];
  } else if (filterType === 'quarterly') {
    labels = ['4분기 전', '3분기 전', '2분기 전', '1분기 전', '이번 분기'];
  } else if (filterType === 'yearly') {
    labels = ['4년 전', '3년 전', '2년 전', '1년 전', '올해'];
  }

  // 거래 내역 순회하며 기준 기간에 따라 합산
  transactions.forEach((t) => {
    const tDate = new Date(t.transacted_at);
    let dataIndex = -1;

    if (filterType === 'weekly') {
      const diffDays = Math.floor((now - tDate) / (1000 * 60 * 60 * 24));
      dataIndex = 4 - Math.floor(diffDays / 7);
    } else if (filterType === 'monthly') {
      const diffMonths =
        (now.getFullYear() - tDate.getFullYear()) * 12 +
        (now.getMonth() - tDate.getMonth());
      dataIndex = 4 - diffMonths;
    } else if (filterType === 'quarterly') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const tQuarter = Math.floor(tDate.getMonth() / 3);
      const diffQuarters =
        (now.getFullYear() - tDate.getFullYear()) * 4 +
        (currentQuarter - tQuarter);
      dataIndex = 4 - diffQuarters;
    } else if (filterType === 'yearly') {
      const diffYears = now.getFullYear() - tDate.getFullYear();
      dataIndex = 4 - diffYears;
    }

    if (dataIndex >= 0 && dataIndex < dataLength) {
      if (t.type === 'INCOME') incomes[dataIndex] += t.amount;
      else expenses[dataIndex] += t.amount;
    }
  });

  for (let i = 0; i < dataLength; i++) {
    profits[i] = incomes[i] - expenses[i];
  }

  return { labels, incomes, expenses, profits };
}
