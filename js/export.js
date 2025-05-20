import { formatCurrency, formatDate } from './utils.js';

export class ExpenseExporter {
  constructor(expenseTracker) {
    this.expenseTracker = expenseTracker;
  }
  
  /**
   * Export expenses to CSV
   */
  exportToCSV() {
    const expenses = this.expenseTracker.getExpenses();
    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount'],
      ...expenses.map(expense => [
        formatDate(new Date(expense.date)),
        expense.description,
        expense.category,
        expense.amount
      ])
    ]
    .map(row => row.map(item => `"${item}"`).join(','))
    .join('\n');
    
    this.downloadFile(csvContent, 'expenses.csv', 'text/csv');
  }
  
  /**
   * Download file helper
   */
  downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}