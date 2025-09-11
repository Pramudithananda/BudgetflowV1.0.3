import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('budgetflow.db');

// Initialize database tables
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Categories table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );

      // Funders table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS funders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );

      // Events table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          date TEXT,
          budget REAL DEFAULT 0,
          category TEXT,
          location TEXT,
          description TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );

      // Expenses table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          description TEXT,
          categoryId INTEGER,
          funderId INTEGER,
          eventId INTEGER,
          status TEXT DEFAULT 'Outstanding',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (categoryId) REFERENCES categories (id),
          FOREIGN KEY (funderId) REFERENCES funders (id),
          FOREIGN KEY (eventId) REFERENCES events (id)
        );`
      );

      // Initialize sample data
      tx.executeSql('SELECT COUNT(*) as count FROM categories', [], (_, result) => {
        if (result.rows.item(0).count === 0) {
          // Add sample categories
          const sampleCategories = [
            { name: 'Food & Beverages', description: 'Meals, snacks, and drinks' },
            { name: 'Decorations', description: 'Party decorations and setup' },
            { name: 'Transportation', description: 'Travel and transport costs' },
            { name: 'Other Expenses', description: 'Miscellaneous expenses' }
          ];
          
          sampleCategories.forEach(category => {
            tx.executeSql(
              'INSERT INTO categories (name, description) VALUES (?, ?)',
              [category.name, category.description]
            );
          });
        }
      });

      tx.executeSql('SELECT COUNT(*) as count FROM funders', [], (_, result) => {
        if (result.rows.item(0).count === 0) {
          // Add sample funders
          const sampleFunders = [
            { name: 'Sujith', phone: '+94 77 123 4567' },
            { name: 'Nirvan', phone: '+94 77 234 5678' },
            { name: 'Welfare', phone: '+94 77 345 6789' }
          ];
          
          sampleFunders.forEach(funder => {
            tx.executeSql(
              'INSERT INTO funders (name, phone) VALUES (?, ?)',
              [funder.name, funder.phone]
            );
          });
        }
      });

      tx.executeSql('SELECT COUNT(*) as count FROM events', [], (_, result) => {
        if (result.rows.item(0).count === 0) {
          // Add sample events
          const sampleEvents = [
            {
              name: 'Birthday Party',
              date: '2025-09-08',
              budget: 25000,
              category: 'Celebration',
              location: 'Home',
              description: 'Birthday celebration with friends and family'
            },
            {
              name: 'Conference 2025',
              date: '2025-10-15',
              budget: 50000,
              category: 'Business',
              location: 'Convention Center',
              description: 'Annual business conference'
            }
          ];
          
          sampleEvents.forEach(event => {
            tx.executeSql(
              'INSERT INTO events (name, date, budget, category, location, description) VALUES (?, ?, ?, ?, ?, ?)',
              [event.name, event.date, event.budget, event.category, event.location, event.description]
            );
          });
        }
      });

      tx.executeSql('SELECT COUNT(*) as count FROM expenses', [], (_, result) => {
        if (result.rows.item(0).count === 0) {
          // Add sample expenses
          const sampleExpenses = [
            {
              title: 'Catering',
              amount: 60000,
              description: 'Food and drinks for birthday party',
              categoryId: 1,
              funderId: 1,
              eventId: 1,
              status: 'Spent'
            },
            {
              title: 'Decorations',
              amount: 20000,
              description: 'Party decorations and balloons',
              categoryId: 2,
              funderId: 2,
              eventId: 1,
              status: 'Available'
            },
            {
              title: 'Transportation',
              amount: 10000,
              description: 'Travel costs for conference',
              categoryId: 3,
              funderId: 3,
              eventId: 2,
              status: 'Pending'
            },
            {
              title: 'Miscellaneous',
              amount: 10000,
              description: 'Other expenses',
              categoryId: 4,
              funderId: 1,
              eventId: 1,
              status: 'Outstanding'
            }
          ];
          
          sampleExpenses.forEach(expense => {
            tx.executeSql(
              'INSERT INTO expenses (title, amount, description, categoryId, funderId, eventId, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [expense.title, expense.amount, expense.description, expense.categoryId, expense.funderId, expense.eventId, expense.status]
            );
          });
        }
      });

    }, reject, resolve);
  });
};

// Category Operations
export const getCategories = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM categories ORDER BY name',
        [],
        (_, result) => {
          const categories = [];
          for (let i = 0; i < result.rows.length; i++) {
            categories.push(result.rows.item(i));
          }
          resolve(categories);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addCategory = (categoryData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [categoryData.name, categoryData.description || ''],
        (_, result) => {
          resolve({ id: result.insertId, ...categoryData });
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateCategory = (id, categoryData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE categories SET name = ?, description = ? WHERE id = ?',
        [categoryData.name, categoryData.description || '', id],
        (_, result) => {
          resolve({ id, ...categoryData });
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM categories WHERE id = ?',
        [id],
        (_, result) => {
          resolve(id);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Funder Operations
export const getFunders = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM funders ORDER BY name',
        [],
        (_, result) => {
          const funders = [];
          for (let i = 0; i < result.rows.length; i++) {
            funders.push(result.rows.item(i));
          }
          resolve(funders);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addFunder = (funderData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO funders (name, phone, email) VALUES (?, ?, ?)',
        [funderData.name, funderData.phone || '', funderData.email || ''],
        (_, result) => {
          resolve({ id: result.insertId, ...funderData });
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateFunder = (id, funderData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE funders SET name = ?, phone = ?, email = ? WHERE id = ?',
        [funderData.name, funderData.phone || '', funderData.email || '', id],
        (_, result) => {
          resolve({ id, ...funderData });
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteFunder = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM funders WHERE id = ?',
        [id],
        (_, result) => {
          resolve(id);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Event Operations
export const getEvents = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM events ORDER BY date DESC',
        [],
        (_, result) => {
          const events = [];
          for (let i = 0; i < result.rows.length; i++) {
            events.push(result.rows.item(i));
          }
          resolve(events);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getEvent = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM events WHERE id = ?',
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0));
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addEvent = (eventData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO events (name, date, budget, category, location, description) VALUES (?, ?, ?, ?, ?, ?)',
        [
          eventData.name || 'Untitled Event',
          eventData.date || '',
          eventData.budget || 0,
          eventData.category || '',
          eventData.location || '',
          eventData.description || ''
        ],
        (_, result) => {
          resolve({ id: result.insertId, ...eventData });
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateEvent = (id, eventData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE events SET name = ?, date = ?, budget = ?, category = ?, location = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [
          eventData.name || '',
          eventData.date || '',
          eventData.budget || 0,
          eventData.category || '',
          eventData.location || '',
          eventData.description || '',
          id
        ],
        (_, result) => {
          resolve({ id, ...eventData });
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteEvent = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM events WHERE id = ?',
        [id],
        (_, result) => {
          resolve(id);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Expense Operations
export const getExpenses = (categoryId = null) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      let query = 'SELECT * FROM expenses';
      let params = [];
      
      if (categoryId) {
        query += ' WHERE categoryId = ?';
        params.push(categoryId);
      }
      
      query += ' ORDER BY createdAt DESC';
      
      tx.executeSql(
        query,
        params,
        (_, result) => {
          const expenses = [];
          for (let i = 0; i < result.rows.length; i++) {
            expenses.push(result.rows.item(i));
          }
          resolve(expenses);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getExpensesByEvent = (eventId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM expenses WHERE eventId = ? ORDER BY createdAt DESC',
        [eventId],
        (_, result) => {
          const expenses = [];
          for (let i = 0; i < result.rows.length; i++) {
            expenses.push(result.rows.item(i));
          }
          resolve(expenses);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getExpense = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM expenses WHERE id = ?',
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0));
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addExpense = (expenseData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO expenses (title, amount, description, categoryId, funderId, eventId, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          expenseData.title || '',
          expenseData.amount || 0,
          expenseData.description || '',
          expenseData.categoryId || null,
          expenseData.funderId || null,
          expenseData.eventId || null,
          expenseData.status || 'Outstanding'
        ],
        (_, result) => {
          resolve({ id: result.insertId, ...expenseData });
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateExpense = (id, expenseData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE expenses SET title = ?, amount = ?, description = ?, categoryId = ?, funderId = ?, eventId = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [
          expenseData.title || '',
          expenseData.amount || 0,
          expenseData.description || '',
          expenseData.categoryId || null,
          expenseData.funderId || null,
          expenseData.eventId || null,
          expenseData.status || 'Outstanding',
          id
        ],
        (_, result) => {
          resolve({ id, ...expenseData });
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteExpense = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM expenses WHERE id = ?',
        [id],
        (_, result) => {
          resolve(id);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Status Summary
export const getEventStatusSummary = (eventId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT status, SUM(amount) as total FROM expenses WHERE eventId = ? GROUP BY status',
        [eventId],
        (_, result) => {
          const summary = { Pending: 0, Spent: 0, Available: 0, Outstanding: 0 };
          for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            const status = row.status || 'Outstanding';
            summary[status] = row.total || 0;
          }
          resolve(summary);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Listen functions (for compatibility with Firebase code)
export const listenEvents = (callback) => {
  getEvents().then(callback).catch(console.error);
  return () => {}; // No-op unsubscribe
};

export const listenExpensesByEvent = (eventId, callback) => {
  getExpensesByEvent(eventId).then(callback).catch(console.error);
  return () => {}; // No-op unsubscribe
};

export const listenExpenses = (callback) => {
  getExpenses().then(callback).catch(console.error);
  return () => {}; // No-op unsubscribe
};

export const listenCategories = (callback) => {
  getCategories().then(callback).catch(console.error);
  return () => {}; // No-op unsubscribe
};

export const listenFunders = (callback) => {
  getFunders().then(callback).catch(console.error);
  return () => {}; // No-op unsubscribe
};

// Budget Summary
export const getBudgetSummary = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT SUM(amount) as total FROM expenses',
        [],
        (_, result) => {
          const total = result.rows.item(0).total || 0;
          resolve({ total });
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};