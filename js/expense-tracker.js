export class ExpenseTracker {
    constructor(storage) {
      this.storage = storage;
      this.expenses = this.storage.getExpenses();
    }
    
    /**
     * Add a new expense
     * @param {Object} expense - The expense object to add
     * @param {string} expense.description - Description of the expense
     * @param {number} expense.amount - Amount of the expense
     * @param {string} expense.category - Category of the expense
     * @returns {Object} The added expense with generated id and date
     */
    addExpense(expense) {
      const newExpense = {
        id: this.generateId(),
        description: expense.description,
        amount: parseFloat(expense.amount),
        category: expense.category,
        date: new Date().toISOString()
      };
      
      this.expenses.push(newExpense);
      this.storage.saveExpenses(this.expenses);
      
      return newExpense;
    }
    
    /**
     * Delete an expense by id
     * @param {string} id - ID of the expense to delete
     * @returns {boolean} Success status
     */
    deleteExpense(id) {
      const index = this.expenses.findIndex(expense => expense.id === id);
      
      if (index !== -1) {
        this.expenses.splice(index, 1);
        this.storage.saveExpenses(this.expenses);
        return true;
      }
      
      return false;
    }
    
    /**
     * Get all expenses
     * @returns {Array} Array of expense objects
     */
    getExpenses() {
      return this.expenses;
    }
    
    /**
     * Calculate the total amount of all expenses
     * @returns {number} Total amount
     */
    getTotalAmount() {
      return this.expenses.reduce((total, expense) => {
        return total + expense.amount;
      }, 0);
    }
    
    /**
     * Generate a unique ID for an expense
     * @returns {string} Unique ID
     */
    generateId() {
      // Simple ID generation - timestamp + random
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
  }