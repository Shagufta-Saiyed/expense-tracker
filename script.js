const form = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const totalIncome = document.getElementById('total-income');
const totalExpenses = document.getElementById('total-expenses');
const netIncome = document.getElementById('net-income');
const updateButton = document.getElementById('update-button');
const filterCategory = document.getElementById('filter-category');
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(type) {
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!date || !description || !category || isNaN(amount) || amount <= 0) {
        alert('Please enter valid data for all fields.');
        return;
    }

    const transaction = {
        id: Date.now(),
        date,
        description,
        category,
        amount,
        type
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactions();
    form.reset();
}

function editTransaction(id) {
    const transaction = transactions.find(transaction => transaction.id === id);
    if (transaction) {
        document.getElementById('transaction-id').value = transaction.id;
        document.getElementById('date').value = transaction.date;
        document.getElementById('description').value = transaction.description;
        document.getElementById('category').value = transaction.category;
        document.getElementById('amount').value = transaction.amount;
        document.querySelectorAll('button[type=button]').forEach(btn => btn.style.display = 'none');
        updateButton.style.display = 'block';
    }
}

function updateTransaction() {
    const id = parseInt(document.getElementById('transaction-id').value);
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!date || !description || !category || isNaN(amount) || amount <= 0) {
        alert('Please enter valid data for all fields.');
        return;
    }

    const transactionIndex = transactions.findIndex(transaction => transaction.id === id);
    if (transactionIndex >= 0) {
        transactions[transactionIndex] = { id, date, description, category, amount, type: transactions[transactionIndex].type };
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateTransactions();
        form.reset();
        updateButton.style.display = 'none';
        document.querySelectorAll('button[type=button]').forEach(btn => btn.style.display = 'block');
    }
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactions();
}

function filterTransactions() {
    const selectedCategory = filterCategory.value;
    updateTransactions(selectedCategory);
}

function updateTransactions(filter = "All") {
    transactionList.innerHTML = '';
    let income = 0;
    let expenses = 0;

    transactions.forEach(transaction => {
        if (filter === "All" || transaction.category === filter) {
            const transactionItem = document.createElement('tr');
            transactionItem.classList.add('transaction');
            if (transaction.type === 'expense') {
                transactionItem.classList.add('expense');
                expenses += transaction.amount;
            } else {
                income += transaction.amount;
            }

            transactionItem.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td class="amount">${transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}</td>
                <td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                <td>
                    <button class="edit-button" onclick="editTransaction(${transaction.id})">Edit</button>
                    <button onclick="deleteTransaction(${transaction.id})">Delete</button>
                </td>
            `;

            transactionList.appendChild(transactionItem);
        }
    });

    totalIncome.textContent = income.toFixed(2);
    totalExpenses.textContent = expenses.toFixed(2);
    netIncome.textContent = (income - expenses).toFixed(2);
}

updateTransactions();
