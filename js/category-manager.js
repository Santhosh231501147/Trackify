export class CategoryManager {
    constructor() {
      this.categories = [
        'Food',
        'Bills',
        'Entertainment',
        'Transportation',
        'Shopping',
        'Other'
      ];
    }
    
    /**
     * Get all categories
     */
    getCategories() {
      return this.categories;
    }
    
    /**
     * Add a new category
     */
    addCategory(category) {
      if (!category || this.categories.includes(category)) {
        return false;
      }
      
      this.categories.push(category);
      return true;
    }
    
    /**
     * Remove a category
     */
    removeCategory(category) {
      const index = this.categories.indexOf(category);
      if (index === -1) return false;
      
      this.categories.splice(index, 1);
      return true;
    }
    
    /**
     * Update category select element
     */
    updateCategorySelect(selectElement) {
      // Save current value
      const currentValue = selectElement.value;
      
      // Clear existing options except placeholder
      while (selectElement.options.length > 1) {
        selectElement.remove(1);
      }
      
      // Add categories
      this.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        selectElement.appendChild(option);
      });
      
      // Restore value if it still exists
      if (this.categories.includes(currentValue)) {
        selectElement.value = currentValue;
      }
    }
  }