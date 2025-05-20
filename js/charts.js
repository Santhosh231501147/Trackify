import Chart from 'chart.js/auto';

export class ExpenseCharts {
  constructor(expenseTracker) {
    this.expenseTracker = expenseTracker;
    this.categoryChart = null;
    this.timelineChart = null;
  }
  
  /**
   * Initialize charts
   */
  initializeCharts() {
    this.createCategoryChart();
    this.createTimelineChart();
  }
  
  /**
   * Update all charts with new data
   */
  updateCharts() {
    this.updateCategoryChart();
    this.updateTimelineChart();
  }
  
  /**
   * Create the category distribution chart
   */
  createCategoryChart() {
    const ctx = document.getElementById('category-chart');
    if (!ctx) return;
    
    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: this.getCategoryData(),
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  /**
   * Create the expense timeline chart
   */
  createTimelineChart() {
    const ctx = document.getElementById('timeline-chart');
    if (!ctx) return;
    
    this.timelineChart = new Chart(ctx, {
      type: 'line',
      data: this.getTimelineData(),
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  /**
   * Update category chart with new data
   */
  updateCategoryChart() {
    if (!this.categoryChart) return;
    
    const newData = this.getCategoryData();
    this.categoryChart.data = newData;
    this.categoryChart.update();
  }
  
  /**
   * Update timeline chart with new data
   */
  updateTimelineChart() {
    if (!this.timelineChart) return;
    
    const newData = this.getTimelineData();
    this.timelineChart.data = newData;
    this.timelineChart.update();
  }
  
  /**
   * Get data for category chart
   */
  getCategoryData() {
    const expenses = this.expenseTracker.getExpenses();
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    return {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#48BB78', // success
          '#F56565', // error
          '#F6AD55', // accent
          '#38B2AC', // primary
          '#DD6B20', // accent-dark
          '#718096'  // gray
        ]
      }]
    };
  }
  
  /**
   * Get data for timeline chart
   */
  getTimelineData() {
    const expenses = this.expenseTracker.getExpenses();
    const dailyTotals = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date).toLocaleDateString();
      dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
    });
    
    return {
      labels: Object.keys(dailyTotals),
      datasets: [{
        label: 'Daily Spending',
        data: Object.values(dailyTotals),
        borderColor: '#38B2AC',
        tension: 0.1
      }]
    };
  }
}