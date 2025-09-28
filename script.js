const validUsername = "Shekhlabel@gmail.com";
const validPassword = "rouf";

// Load data from localStorage
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
let payments = JSON.parse(localStorage.getItem('payments')) || [];


// Login functionality
const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const mainHeader = document.getElementById('main-header');

function showHeader() {
    if (mainHeader) mainHeader.style.display = 'block';
}

function showLogin() {
    if (loginSection) loginSection.style.display = 'flex';
    if (mainHeader) mainHeader.style.display = 'none';
}

function checkLogin() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
        showHeader();
        if (window.location.pathname.includes('index.html')) {
            window.location.href = 'customers.html';
        }
    } else {
        showLogin();
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        const usernameError = document.getElementById('username-error');
        const passwordError = document.getElementById('password-error');
        if (usernameError) usernameError.style.display = 'none';
        if (passwordError) passwordError.style.display = 'none';
        if (usernameInput === validUsername && passwordInput === validPassword) {
            localStorage.setItem('loggedIn', 'true');
            showHeader();
            window.location.href = 'customers.html';
        } else if (usernameInput !== validUsername) {
            if (usernameError) {
                usernameError.textContent = 'Invalid username';
                usernameError.style.display = 'block';
            }
        } else if (passwordInput !== validPassword) {
            if (passwordError) {
                passwordError.textContent = 'Invalid password';
                passwordError.style.display = 'block';
            }
        }
    });
}

// Utility functions
function updateCustomerSelect() {
    const select = document.getElementById('invoice-customer');
    if (select) {
        select.innerHTML = '<option value="">Select Customer</option>' + customers.map(customer => `<option value="${customer.id}">${customer.name}</option>`).join('');
    }
}

function updateInvoiceSelect() {
    const select = document.getElementById('payment-invoice');
    if (select) {
        const unpaidInvoices = invoices.filter(invoice => invoice.paid < invoice.amount);
        select.innerHTML = '<option value="">Select Invoice</option>' + unpaidInvoices.map(invoice => {
            const dueAmount = invoice.amount - invoice.paid;
            return `<option value="${invoice.id}">${invoice.customer} - $${invoice.amount} (Due: $${dueAmount.toFixed(2)})</option>`;
        }).join('');
    }
}

function updateInvoiceList() {
    const invoiceList = document.getElementById('invoice-list');
    if (invoiceList) {
        invoiceList.innerHTML = '';
    }
}

function updatePaymentList() {
    const paymentList = document.getElementById('payment-list');
    if (paymentList) {
        paymentList.innerHTML = '';
    }
}

function showCustomerProfiles() {
    const profilesDiv = document.getElementById('customer-profiles');
    const profilesList = document.getElementById('profiles-list');
    if (profilesDiv && profilesList) {
        if (profilesDiv.style.display === 'block') {
            profilesDiv.style.display = 'none';
        } else {
            profilesList.innerHTML = '';
            if (customers.length === 0) {
                profilesList.innerHTML = '<li class="bg-gray-50 p-2 rounded">No customers added yet.</li>';
            } else {
                customers.forEach(customer => {
                    const li = document.createElement('li');
                    li.className = 'bg-gray-50 p-2 rounded';
                    li.innerHTML = `<strong class="text-gray-800">Name:</strong> ${customer.name}<br><strong class="text-gray-800">Email:</strong> ${customer.email}`;
                    profilesList.appendChild(li);
                });
            }
            profilesDiv.style.display = 'block';
        }
    }
}

function updateSalesAnalysis(period) {
    const salesAnalysisContent = document.getElementById('sales-analysis-content');
    if (!salesAnalysisContent) return;
    let filteredPayments = [];
    const today = new Date();
    const oneDayAgo = new Date(today);
    oneDayAgo.setDate(today.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    if (period === 'daily') {
        filteredPayments = payments.filter(p => new Date(p.date) >= oneDayAgo);
    } else if (period === 'weekly') {
        filteredPayments = payments.filter(p => new Date(p.date) >= sevenDaysAgo);
    } else if (period === 'monthly') {
        filteredPayments = payments.filter(p => new Date(p.date) >= firstDayOfMonth);
    }

    // Display
    const totalSales = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    let content = `<p>Total Sales: $${totalSales.toFixed(2)}</p><ul>`;
    filteredPayments.forEach(p => {
        const invoice = invoices.find(inv => inv.id == p.invoiceId);
        const customer = invoice ? invoice.customer : 'Unknown';
        const email = invoice ? invoice.email : 'Unknown';
        content += `<li>${customer} (${email}) - $${p.amount.toFixed(2)} on ${p.date}</li>`;
    });
    content += '</ul>';
    salesAnalysisContent.innerHTML = content;
}

function updateReports() {
    const totalInvoicesEl = document.getElementById('total-invoices');
    const totalPaymentsEl = document.getElementById('total-payments');
    const outstandingBalanceEl = document.getElementById('outstanding-balance');
    const reportBody = document.getElementById('invoice-report-body');
    if (!totalInvoicesEl || !totalPaymentsEl || !outstandingBalanceEl || !reportBody) return;

    const totalInv = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPay = payments.reduce((sum, pay) => sum + pay.amount, 0);
    const outstanding = totalInv - totalPay;
    totalInvoicesEl.textContent = totalInv.toFixed(2);
    totalPaymentsEl.textContent = totalPay.toFixed(2);
    outstandingBalanceEl.textContent = outstanding.toFixed(2);

    // Generate detailed invoice report rows
    reportBody.innerHTML = '';

    invoices.forEach(invoice => {
        const dueAmount = invoice.amount - invoice.paid;
        const paymentStatus = dueAmount <= 0 ? 'Paid' : 'Pending';

        const statusClass = dueAmount <= 0 ? 'paid' : 'pending';
        const dueAmountDisplay = dueAmount > 0 ? `<span class="due">$${dueAmount.toFixed(2)}</span>` : '';

        const row = document.createElement('tr');

        const customerCell = document.createElement('td');
        customerCell.textContent = invoice.customer;

        const productCell = document.createElement('td');
        productCell.textContent = invoice.description || '-';

        const statusCell = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.textContent = paymentStatus;
        statusSpan.className = statusClass;
        statusCell.appendChild(statusSpan);

        const dueCell = document.createElement('td');
        dueCell.innerHTML = dueAmountDisplay;

        row.appendChild(customerCell);
        row.appendChild(productCell);
        row.appendChild(statusCell);
        row.appendChild(dueCell);

        reportBody.appendChild(row);
    });
}

// Page-specific functionality
const customerForm = document.getElementById('customer-form');
if (customerForm) {
    const viewCustomersBtn = document.getElementById('view-customers');
    customerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('customer-name').value.trim();
        const email = document.getElementById('customer-email').value.trim();
        // Check if customer with same name exists
        if (customers.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            alert('Customer with this name already exists.');
            return;
        }
        customers.push({ id: Date.now(), name, email });
        localStorage.setItem('customers', JSON.stringify(customers));
        updateCustomerSelect();
        customerForm.reset();
        showCustomerProfiles();
    });

    if (viewCustomersBtn) {
        viewCustomersBtn.addEventListener('click', showCustomerProfiles);
    }
    updateCustomerSelect();
}

const invoiceForm = document.getElementById('invoice-form');
if (invoiceForm) {
    invoiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customerId = document.getElementById('invoice-customer').value;
        const amount = parseFloat(document.getElementById('invoice-amount').value);
        const description = document.getElementById('invoice-description').value;
        const customer = customers.find(c => c.id == customerId);
        if (!customer) {
            alert('Please select a customer.');
            return;
        }
        // Prevent duplicate invoice for same customer with same description
        if (invoices.some(inv => inv.customer === customer.name && inv.description === description)) {
            alert('Invoice with this description for this customer already exists.');
            return;
        }
        invoices.push({ id: Date.now(), customer: customer.name, email: customer.email, amount, description, paid: 0 });
        localStorage.setItem('invoices', JSON.stringify(invoices));
        updateInvoiceSelect();
        updateReports();
        updateInvoiceList();
        invoiceForm.reset();
    });
    updateCustomerSelect();
    updateInvoiceSelect();
    updateInvoiceList();
}

const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const invoiceId = document.getElementById('payment-invoice').value;
        const amount = parseFloat(document.getElementById('payment-amount').value);
        const date = document.getElementById('payment-date').value;
        const invoice = invoices.find(inv => inv.id == invoiceId);
        if (invoice) {
            if (amount > (invoice.amount - invoice.paid)) {
                alert('Payment amount exceeds remaining balance.');
                return;
            }
            invoice.paid += amount;
            payments.push({ id: Date.now(), invoiceId, amount, date });
            localStorage.setItem('invoices', JSON.stringify(invoices));
            localStorage.setItem('payments', JSON.stringify(payments));
            updateReports();
            updateInvoiceSelect();
            updateSalesAnalysis('daily');
            updatePaymentList();
            paymentForm.reset();
        }
    });
    updateInvoiceSelect();
    updatePaymentList();
    const paymentDate = document.getElementById('payment-date');
    if (paymentDate) paymentDate.value = new Date().toISOString().split('T')[0];
}

const dailyBtn = document.getElementById('daily-btn');
const weeklyBtn = document.getElementById('weekly-btn');
const monthlyBtn = document.getElementById('monthly-btn');
if (dailyBtn) dailyBtn.addEventListener('click', () => updateSalesAnalysis('daily'));
if (weeklyBtn) weeklyBtn.addEventListener('click', () => updateSalesAnalysis('weekly'));
if (monthlyBtn) monthlyBtn.addEventListener('click', () => updateSalesAnalysis('monthly'));
if (document.getElementById('sales-analysis-content')) updateSalesAnalysis('daily');

if (document.getElementById('invoice-report-table')) updateReports();

// Initialize
checkLogin();
