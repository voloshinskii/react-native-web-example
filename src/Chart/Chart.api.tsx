export const loadChartData = (period) => fetch(`https://api.tonkeeper.com/stock/chart-new?period=${period}`).then(res =>
    res.json()
);