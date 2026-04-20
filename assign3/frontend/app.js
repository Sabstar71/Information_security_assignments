const API_BASE = 'http://localhost:5000/api';

// DOM Elements
const scanButton = document.getElementById('scanButton');
const scanStatus = document.getElementById('scanStatus');
const resultsTable = document.getElementById('resultsTable');
const addRuleButton = document.getElementById('addRuleButton');
const rulesTable = document.getElementById('rulesTable');
const evalButton = document.getElementById('evalButton');
const evalResult = document.getElementById('evalResult');

// Event Listeners
scanButton.addEventListener('click', performScan);
addRuleButton.addEventListener('click', addFirewallRule);
evalButton.addEventListener('click', evaluateTraffic);

// Load rules on page load
document.addEventListener('DOMContentLoaded', loadFirewallRules);

/**
 * Perform a network scan
 */
async function performScan() {
    const target = document.getElementById('targetInput').value.trim();
    const scanType = document.getElementById('scanType').value;
    const portRange = document.getElementById('portRange').value.trim();

    if (!target) {
        showStatus('Please enter a target IP or hostname.', 'error');
        return;
    }

    scanButton.disabled = true;
    showStatus('Scanning in progress...', 'info');

    try {
        const response = await fetch(`${API_BASE}/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                target,
                scan_type: scanType,
                port_range: portRange
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showStatus(`Scan failed: ${data.error}`, 'error');
            return;
        }

        displayScanResults(data.results);
        showStatus('Scan completed successfully!', 'success');
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        scanButton.disabled = false;
    }
}

/**
 * Display scan results in table
 */
function displayScanResults(results) {
    const tbody = resultsTable.querySelector('tbody');

    if (results.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No open ports found.</td></tr>';
        return;
    }

    tbody.innerHTML = results.map(result => `
        <tr>
            <td>${result.ip}</td>
            <td>${result.port}</td>
            <td>${result.protocol}</td>
            <td><span class="${result.state === 'open' ? 'open' : 'closed'}">${result.state}</span></td>
            <td>${result.service}</td>
            <td>${result.version || '-'}</td>
        </tr>
    `).join('');
}

/**
 * Add a firewall rule
 */
async function addFirewallRule() {
    const action = document.getElementById('ruleAction').value;
    const ip = document.getElementById('ruleIP').value.trim() || null;
    const port = document.getElementById('rulePort').value ? parseInt(document.getElementById('rulePort').value) : null;
    const protocol = document.getElementById('ruleProtocol').value;
    const priority = parseInt(document.getElementById('rulePriority').value);

    addRuleButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/firewall/rules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action,
                ip,
                port,
                protocol,
                priority
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(`Error: ${data.error}`);
            return;
        }

        // Clear form
        document.getElementById('ruleAction').value = 'allow';
        document.getElementById('ruleIP').value = '';
        document.getElementById('rulePort').value = '';
        document.getElementById('ruleProtocol').value = 'tcp';
        document.getElementById('rulePriority').value = '100';

        // Reload rules
        loadFirewallRules();
        alert('Rule added successfully!');
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        addRuleButton.disabled = false;
    }
}

/**
 * Load and display firewall rules
 */
async function loadFirewallRules() {
    try {
        const response = await fetch(`${API_BASE}/firewall/rules`);
        const data = await response.json();

        if (!response.ok) {
            console.error('Error loading rules:', data.error);
            return;
        }

        displayFirewallRules(data.rules);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

/**
 * Display firewall rules in table
 */
function displayFirewallRules(rules) {
    const tbody = rulesTable.querySelector('tbody');

    if (rules.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No rules added yet.</td></tr>';
        return;
    }

    tbody.innerHTML = rules.map(rule => `
        <tr>
            <td>${rule.id}</td>
            <td><span class="${rule.action}">${rule.action}</span></td>
            <td>${rule.ip || 'All'}</td>
            <td>${rule.port || 'All'}</td>
            <td>${rule.protocol}</td>
            <td>${rule.priority}</td>
            <td><button class="btn btn-danger" onclick="deleteRule(${rule.id})">Delete</button></td>
        </tr>
    `).join('');
}

/**
 * Delete a firewall rule
 */
async function deleteRule(ruleId) {
    if (!confirm('Are you sure you want to delete this rule?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/firewall/rules/${ruleId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const data = await response.json();
            alert(`Error: ${data.error}`);
            return;
        }

        loadFirewallRules();
        alert('Rule deleted successfully!');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * Evaluate traffic based on firewall rules
 */
async function evaluateTraffic() {
    const sourceIP = document.getElementById('evalSourceIP').value.trim();
    const destIP = document.getElementById('evalDestIP').value.trim();
    const port = document.getElementById('evalPort').value;
    const protocol = document.getElementById('evalProtocol').value;

    if (!sourceIP || !destIP || !port) {
        alert('Please fill in all traffic evaluation fields.');
        return;
    }

    evalButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/firewall/evaluate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                source_ip: sourceIP,
                dest_ip: destIP,
                port: parseInt(port),
                protocol
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(`Error: ${data.error}`);
            return;
        }

        displayEvalResult(data.allowed, data.rule_id, sourceIP, destIP, port, protocol);
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        evalButton.disabled = false;
    }
}

/**
 * Display traffic evaluation result
 */
function displayEvalResult(allowed, ruleId, sourceIP, destIP, port, protocol) {
    const resultHTML = `
        <h4>${allowed ? '✓ Traffic Allowed' : '✗ Traffic Denied'}</h4>
        <p><strong>Source IP:</strong> ${sourceIP}</p>
        <p><strong>Destination IP:</strong> ${destIP}</p>
        <p><strong>Port:</strong> ${port}</p>
        <p><strong>Protocol:</strong> ${protocol}</p>
        <p><strong>Matched Rule:</strong> ${ruleId ? `Rule #${ruleId}` : 'Default Deny (No matching rule)'}</p>
    `;

    evalResult.innerHTML = resultHTML;
    evalResult.className = `eval-result ${allowed ? 'allowed' : 'denied'}`;
    evalResult.style.display = 'block';
}

/**
 * Show status message
 */
function showStatus(message, type) {
    scanStatus.textContent = message;
    scanStatus.className = `status-message ${type}`;
}
