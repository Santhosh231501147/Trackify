import { ExpenseTracker } from './expense-tracker.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules
  const storage = new Storage();
  const expenseTracker = new ExpenseTracker(storage);
  const ui = new UI(expenseTracker);
  
  // Load saved expenses
  ui.loadExpenses();
  
  // Set up event listeners
  ui.setupEventListeners();
});