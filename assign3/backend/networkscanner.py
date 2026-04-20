import socket
import json
import random
from datetime import datetime
from threading import Thread

class NetworkScanner:
    """
    Network Scanner class for scanning IPs and ports
    Note: This is a simulated version that doesn't require Nmap
    """
    
    def __init__(self):
        self.common_ports = {
            21: 'FTP',
            22: 'SSH',
            23: 'Telnet',
            25: 'SMTP',
            53: 'DNS',
            80: 'HTTP',
            110: 'POP3',
            143: 'IMAP',
            443: 'HTTPS',
            445: 'SMB',
            3306: 'MySQL',
            3389: 'RDP',
            5432: 'PostgreSQL',
            5900: 'VNC',
            8080: 'HTTP-Proxy',
        }
        self.service_versions = {
            'FTP': 'vsftpd 3.0.3',
            'SSH': 'OpenSSH 7.4',
            'SMTP': 'Postfix 3.2.2',
            'HTTP': 'Apache/2.4.41',
            'HTTPS': 'Apache/2.4.41',
            'MySQL': 'MySQL 5.7.30',
            'RDP': 'Microsoft RDP',
            'PostgreSQL': 'PostgreSQL 12.2',
        }
    
    def scan(self, target, scan_type='tcp_syn', port_range='1-1000'):
        """
        Perform a simulated network scan on the target
        
        Args:
            target: Target IP or hostname
            scan_type: Type of scan ('tcp_syn', 'udp', 'full_connect')
            port_range: Port range to scan (e.g., '1-1000')
        
        Returns:
            List of scan results
        """
        try:
            # Validate target
            self._validate_target(target)
            
            # Parse port range
            ports = self._parse_port_range(port_range)
            
            # Simulate scan
            results = self._simulate_scan(target, ports, scan_type)
            
            return results
        
        except Exception as e:
            raise Exception(f"Scan failed: {str(e)}")
    
    def _validate_target(self, target):
        """Validate if the target is a valid IP or hostname"""
        try:
            socket.gethostbyname(target)
        except socket.gaierror:
            raise ValueError(f"Invalid target: {target}")
    
    def _parse_port_range(self, port_range):
        """Parse port range string into list of ports"""
        ports = []
        
        # Handle comma-separated ports
        if ',' in port_range:
            for part in port_range.split(','):
                part = part.strip()
                if '-' in part:
                    start, end = part.split('-')
                    ports.extend(range(int(start), int(end) + 1))
                else:
                    ports.append(int(part))
        # Handle range
        elif '-' in port_range:
            start, end = port_range.split('-')
            ports = list(range(int(start), int(end) + 1))
        else:
            ports = [int(port_range)]
        
        # Limit to max 1000 ports for performance
        return ports[:1000]
    
    def _simulate_scan(self, target, ports, scan_type):
        """Simulate a network scan with realistic results"""
        results = []
        
        # Common open ports (simulated)
        commonly_open_ports = [21, 22, 25, 53, 80, 110, 143, 443, 445, 3306, 8080]
        
        for port in ports:
            # Simulate port state (80% of common ports are open, 10% of others)
            if port in commonly_open_ports:
                is_open = random.random() < 0.8
            else:
                is_open = random.random() < 0.1
            
            if is_open:
                service_name = self.common_ports.get(port, 'Unknown')
                version = self.service_versions.get(service_name, '')
                
                results.append({
                    'ip': target,
                    'port': port,
                    'protocol': scan_type == 'udp' and 'udp' or 'tcp',
                    'state': 'open',
                    'service': service_name,
                    'version': version,
                    'timestamp': datetime.now().isoformat()
                })
        
        return results
    
    def get_service_info(self, port):
        """Get service information for a given port"""
        return self.common_ports.get(port, 'Unknown Service')

