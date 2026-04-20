from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
from networkscanner import NetworkScanner
from firewall import FirewallSimulator

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend/static')
CORS(app)

scanner = NetworkScanner()
firewall = FirewallSimulator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scan', methods=['POST'])
def scan():
    """
    API endpoint to scan a target IP/hostname
    Expected JSON: {
        "target": "192.168.1.1",
        "scan_type": "tcp_syn" or "udp" or "full_connect",
        "port_range": "1-1000"
    }
    """
    try:
        data = request.json
        target = data.get('target')
        scan_type = data.get('scan_type', 'tcp_syn')
        port_range = data.get('port_range', '1-1000')

        if not target:
            return jsonify({'error': 'Target is required'}), 400

        results = scanner.scan(target, scan_type, port_range)
        return jsonify({'results': results}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/firewall/rules', methods=['GET'])
def get_firewall_rules():
    """Get current firewall rules"""
    try:
        rules = firewall.get_rules()
        return jsonify({'rules': rules}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/firewall/rules', methods=['POST'])
def add_firewall_rule():
    """
    Add a new firewall rule
    Expected JSON: {
        "action": "allow" or "deny",
        "ip": "192.168.1.100",
        "port": 80,
        "protocol": "tcp",
        "priority": 1
    }
    """
    try:
        data = request.json
        rule = firewall.add_rule(
            action=data.get('action'),
            ip=data.get('ip'),
            port=data.get('port'),
            protocol=data.get('protocol'),
            priority=data.get('priority')
        )
        return jsonify({'rule': rule}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/firewall/rules/<int:rule_id>', methods=['DELETE'])
def delete_firewall_rule(rule_id):
    """Delete a firewall rule"""
    try:
        firewall.delete_rule(rule_id)
        return jsonify({'message': 'Rule deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/firewall/evaluate', methods=['POST'])
def evaluate_traffic():
    """
    Evaluate if traffic would be allowed based on firewall rules
    Expected JSON: {
        "source_ip": "192.168.1.100",
        "dest_ip": "192.168.1.1",
        "port": 80,
        "protocol": "tcp"
    }
    """
    try:
        data = request.json
        result = firewall.evaluate_traffic(
            source_ip=data.get('source_ip'),
            dest_ip=data.get('dest_ip'),
            port=data.get('port'),
            protocol=data.get('protocol')
        )
        return jsonify({'allowed': result['allowed'], 'rule_id': result['rule_id']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
