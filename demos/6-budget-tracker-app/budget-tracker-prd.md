# **Custom Budget Tracker (Single-File App)**

## 1. Structure

* **Header**

  * App title (“My Budget Tracker”)
  * Buttons: `Add Expense`, `Add Income`, `Export Data (CSV/JSON)`, `Reset`

* **Sections**

  1. **Expense Tracker**

     * Table listing expenses:

       * Name
       * Amount
       * Category (dropdown: Rent, Food, Transport, Subscriptions, Misc, etc.)
       * Business/Personal toggle
       * Date
       * Delete/Edit row
     * Inline form or modal to add new expense

  2. **Income Tracker**

     * Table listing income sources:

       * Source name
       * Amount
       * Date
       * Type (Recurring / One-time)
       * Delete/Edit row

  3. **Savings Overview**

     * Show calculated totals:

       * Total Expenses (monthly, yearly)
       * Total Income
       * Net Savings = Income – Expenses
       * Split: Personal vs Business (based on toggle in expenses)

  4. **Charts & Visuals** (using something like Chart.js or pure canvas/SVG)

     * Line chart: Savings over time (Personal, Business, Total)
     * Pie chart: Expense distribution by category
     * Bar chart: Income vs Expenses (monthly)

* **Footer**

  * Last update date
  * Dark/light theme toggle

---

## 2. Features

* **Local Storage**

  * Save all data (expenses, income, settings) in `localStorage` so it persists between sessions.
  * Option to clear/reset.

* **Forms & Input Validation**

  * Prevent empty fields
  * Ensure amounts are numbers

* **Filtering & Sorting**

  * Filter expenses by category
  * Sort by amount/date

* **Progressive Enhancement**

  * Start with plain tables + forms
  * Add charts later
  * Add theme toggle later

---

## 3. Technical Stack

* **HTML**: Semantic layout (tables, forms, sections)
* **CSS**: Simple grid/flex layout, responsive, CSS variables for theme
* **JS**:

  * Handle data entry + storage (localStorage)
  * Update tables dynamically
  * Generate charts (Chart.js or custom canvas)
  * Export to CSV/JSON