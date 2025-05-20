import { formatCurrency, formatDate } from './utils.js';
import { CategoryManager } from './category-manager.js';
import { ExpenseCharts } from './charts.js';
import { ExpenseExporter } from './export.js';

export class UI {
  constructor(expenseTracker) {
    this.expenseTracker = expenseTracker;
    this.categoryManager = new CategoryManager();
    this.charts = new ExpenseCharts(expenseTracker);
    this.exporter = new ExpenseExporter(expenseTracker);
    
    // DOM elements
    this.form = document.getElementById('expense-form');
    this.descriptionInput = document.getElementById('expense-description');
    this.amountInput = document.getElementById('expense-amount');
    this.categorySelect = document.getElementById('expense-category');
    this.expensesContainer = document.getElementById('expenses-container');
    this.totalAmountElement = document.getElementById('total-amount');
    this.emptyState = document.getElementById('empty-state');
    this.exportBtn = document.getElementById('export-btn');
    this.addCategoryBtn = document.getElementById('add-category-btn');
    
    // Initialize charts
    this.charts.initializeCharts();
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Form submission
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // Click events on expenses container (for delete and edit buttons)
    this.expensesContainer.addEventListener('click', this.handleExpenseAction.bind(this));
    
    // Export button
    this.exportBtn.addEventListener('click', () => this.exporter.exportToCSV());
    
    // Add category button
    this.addCategoryBtn.addEventListener('click', this.handleAddCategory.bind(this));
  }
  
  /**
   * Handle adding a new category
   */
  handleAddCategory() {
    const category = prompt('Enter new category name:');
    if (!category) return;
    
    if (this.categoryManager.addCategory(category)) {
      this.categoryManager.updateCategorySelect(this.categorySelect);
    } else {
      alert('Category already exists or is invalid');
    }
  }
  
  /**
   * Handle form submission
   */
  handleFormSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }
    
    const expenseData = {
      description: this.descriptionInput.value,
      amount: this.amountInput.value,
      category: this.categorySelect.value
    };
    
    const newExpense = this.expenseTracker.addExpense(expenseData);
    this.addExpenseToUI(newExpense);
    this.updateTotal();
    this.charts.updateCharts();
    this.resetForm();
  }
  
  /**
   * Handle clicks on expense items
   */
  handleExpenseAction(e) {
    const expenseItem = e.target.closest('.expense-item');
    if (!expenseItem) return;
    
    const expenseId = expenseItem.dataset.id;
    
    if (e.target.classList.contains('delete-btn')) {
      this.handleDelete(expenseItem, expenseId);
    } else if (e.target.classList.contains('edit-btn')) {
      this.handleEdit(expenseId);
    }
  }
  
  /**
   * Handle expense deletion
   */
  handleDelete(expenseItem, expenseId) {
    expenseItem.style.animation = 'fadeOut 0.3s forwards';
    
    expenseItem.addEventListener('animationend', () => {
      this.expenseTracker.deleteExpense(expenseId);
      expenseItem.remove();
      this.updateTotal();
      this.charts.updateCharts();
      this.checkEmptyState();
    });
  }
  
  /**
   * Handle expense editing
   */
  handleEdit(expenseId) {
    const expense = this.expenseTracker.getExpenseById(expenseId);
    if (!expense) return;
    
    this.descriptionInput.value = expense.description;
    this.amountInput.value = expense.amount;
    this.categorySelect.value = expense.category;
    
    // Remove old expense and update UI
    this.expenseTracker.deleteExpense(expenseId);
    this.loadExpenses();
    this.charts.updateCharts();
    
    // Focus on description input
    this.descriptionInput.focus();
  }
  
  /**
   * Load all expenses from storage and display them
   */
  loadExpenses() {
    const expenses = this.expenseTracker.getExpenses();
    
    // Clear existing expenses
    this.expensesContainer.innerHTML = '';
    
    // Add empty state back
    this.expensesContainer.appendChild(this.emptyState);
    
    // Add each expense to UI
    expenses.forEach(expense => {
      this.addExpenseToUI(expense);
    });
    
    // Update total
    this.updateTotal();
    
    // Check if empty state should be shown
    this.checkEmptyState();
  }
  
  /**
   * Add an expense to the UI
   * @param {Object} expense - The expense to add
   */
  addExpenseToUI(expense) {
    // Hide empty state if visible
    this.hideEmptyState();
    
    // Create expense item element
    const expenseItem = document.createElement('div');
    expenseItem.className = `expense-item category-${expense.category}`;
    expenseItem.dataset.id = expense.id;
    
    // Set inner HTML for expense item
    expenseItem.innerHTML = `
      <div class="expense-details">
        <div class="expense-description">${expense.description}</div>
        <div class="expense-meta">
          <span class="expense-category">${expense.category}</span>
          <span class="expense-date">${formatDate(new Date(expense.date))}</span>
        </div>
      </div>
      <div class="expense-amount">${formatCurrency(expense.amount)}</div>
      <div class="expense-actions">
        <button class="delete-btn" aria-label="Delete expense">✕</button>
      </div>
    `;
    
    // Insert into DOM
    this.expensesContainer.appendChild(expenseItem);
  }
  
  /**
   * Update the total amount display
   */
  updateTotal() {
    const total = this.expenseTracker.getTotalAmount();
    this.totalAmountElement.textContent = formatCurrency(total);
    
    // Add a small animation to highlight the change
    this.totalAmountElement.classList.add('updated');
    
    // Remove the animation class after animation completes
    setTimeout(() => {
      this.totalAmountElement.classList.remove('updated');
    }, 300);
  }
  
  /**
   * Reset the form fields
   */
  resetForm() {
    this.form.reset();
    this.descriptionInput.focus();
  }
  
  /**
   * Validate form inputs
   * @returns {boolean} Whether the form is valid
   */
  validateForm() {
    // Check if fields are empty
    if (!this.descriptionInput.value.trim()) {
      this.showFormError(this.descriptionInput, 'Please enter a description');
      return false;
    }
    
    if (!this.amountInput.value || parseFloat(this.amountInput.value) <= 0) {
      this.showFormError(this.amountInput, 'Please enter a valid amount');
      return false;
    }
    
    if (!this.categorySelect.value) {
      this.showFormError(this.categorySelect, 'Please select a category');
      return false;
    }
    
    return true;
  }
  
  /**
   * Show an error for a form field
   * @param {HTMLElement} element - The input element
   * @param {string} message - The error message
   */
  showFormError(element, message) {
    // Add error class to element
    element.classList.add('error');
    
    // Show error message if it doesn't exist already
    let errorElement = element.parentElement.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('p');
      errorElement.className = 'error-message';
      element.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // Remove error after some time
    setTimeout(() => {
      element.classList.remove('error');
      errorElement.remove();
    }, 3000);
    
    // Focus the element
    element.focus();
  }
  
  /**
   * Hide the empty state
   */
  hideEmptyState() {
    this.emptyState.style.display = 'none';
  }
  
  /**
   * Show the empty state if no expenses exist
   */
  checkEmptyState() {
    const expenses = this.expenseTracker.getExpenses();
    
    if (expenses.length === 0) {
      this.emptyState.style.display = 'block';
    } else {
      this.emptyState.style.display = 'none';
    }
  }
}