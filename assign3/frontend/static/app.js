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
    const action = document.getElementById('action').value;
    const ip = document.getElementById('sourceIp').value.trim() || null;
    const port = document.getElementById('port').value ? parseInt(document.getElementById('port').value) : null;
    const protocol = document.getElementById('protocol').value;
    const priority = parseInt(document.getElementById('priority').value);

    // Validate inputs
    if (!validateFirewallRuleInputs(action, ip, port, protocol, priority)) {
        return;
    }

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
        document.getElementById('action').value = 'allow';
        document.getElementById('sourceIp').value = '';
        document.getElementById('port').value = '';
        document.getElementById('protocol').value = 'tcp';
        document.getElementById('priority').value = '100';

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
 * Validate firewall rule inputs
 */
function validateFirewallRuleInputs(action, ip, port, protocol, priority) {
    if (!['allow', 'deny'].includes(action)) {
        alert('Invalid action. Please select either "allow" or "deny".');
        return false;
    }

    if (ip && !/^\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?$/.test(ip)) {
        alert('Invalid IP address or subnet. Please enter a valid IP address or subnet.');
        return false;
    }

    if (port && (isNaN(port) || port < 1 || port > 65535)) {
        alert('Invalid port number. Please enter a number between 1 and 65535.');
        return false;
    }

    if (isNaN(priority) || priority < 1) {
        alert('Invalid priority. Please enter a positive number.');
        return false;
    }

    return true;
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
    const sourceIP = document.getElementById('sourceIpEval').value.trim();
    const destIP = document.getElementById('destinationIpEval').value.trim();
    const port = document.getElementById('portEval').value;
    const protocol = document.getElementById('protocolEval').value;

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