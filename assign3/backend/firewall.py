import ipaddress
from datetime import datetime
import json

class FirewallSimulator:
    """
    Firewall Simulator for creating and evaluating firewall rules
    """
    
    def __init__(self):
        self.rules = []
        self.rule_counter = 1
    
    def add_rule(self, action, ip=None, port=None, protocol='tcp', priority=100):
        """
        Add a new firewall rule
        
        Args:
            action: 'allow' or 'deny'
            ip: IP address or IP range (e.g., '192.168.1.0/24')
            port: Port number or None for all ports
            protocol: 'tcp', 'udp', or 'all'
            priority: Priority of the rule (lower number = higher priority)
        
        Returns:
            Created rule
        """
        try:
            if action not in ['allow', 'deny']:
                raise ValueError("Action must be 'allow' or 'deny'")
            
            rule = {
                'id': self.rule_counter,
                'action': action,
                'ip': ip,
                'port': port,
                'protocol': protocol,
                'priority': priority,
                'created_at': datetime.now().isoformat()
            }
            
            self.rules.append(rule)
            self.rules.sort(key=lambda x: x['priority'])  # Sort by priority
            self.rule_counter += 1
            
            return rule
        except Exception as e:
            raise Exception(f"Failed to add rule: {str(e)}")
    
    def delete_rule(self, rule_id):
        """Delete a firewall rule by ID"""
        try:
            self.rules = [r for r in self.rules if r['id'] != rule_id]
        except Exception as e:
            raise Exception(f"Failed to delete rule: {str(e)}")
    
    def get_rules(self):
        """Get all firewall rules"""
        return self.rules
    
    def evaluate_traffic(self, source_ip, dest_ip, port, protocol='tcp'):
        """
        Evaluate if traffic would be allowed based on firewall rules
        
        Args:
            source_ip: Source IP address
            dest_ip: Destination IP address
            port: Destination port
            protocol: Protocol ('tcp' or 'udp')
        
        Returns:
            Dictionary with 'allowed' (boolean) and 'rule_id' (int or None)
        """
        try:
            # Check against each rule in priority order
            for rule in self.rules:
                if self._matches_rule(source_ip, dest_ip, port, protocol, rule):
                    return {
                        'allowed': rule['action'] == 'allow',
                        'rule_id': rule['id']
                    }
            
            # Default deny if no rule matches
            return {
                'allowed': False,
                'rule_id': None
            }
        except Exception as e:
            raise Exception(f"Failed to evaluate traffic: {str(e)}")
    
    def _matches_rule(self, source_ip, dest_ip, port, protocol, rule):
        """Check if traffic matches a rule"""
        try:
            # Check protocol
            if rule['protocol'] != 'all' and rule['protocol'] != protocol:
                return False
            
            # Check port
            if rule['port'] is not None and rule['port'] != port:
                return False
            
            # Check IP
            if rule['ip'] is not None:
                try:
                    # Handle IP range (CIDR notation)
                    if '/' in rule['ip']:
                        network = ipaddress.ip_network(rule['ip'], strict=False)
                        if not ipaddress.ip_address(source_ip) in network:
                            return False
                    else:
                        # Single IP address
                        if source_ip != rule['ip']:
                            return False
                except ValueError:
                    return False
            
            return True
        except Exception:
            return False
    
    def clear_rules(self):
        """Clear all firewall rules"""
        self.rules = []
    
    def get_rule_summary(self):
        """Get a summary of firewall rules"""
        allow_count = sum(1 for r in self.rules if r['action'] == 'allow')
        deny_count = sum(1 for r in self.rules if r['action'] == 'deny')
        
        return {
            'total_rules': len(self.rules),
            'allow_rules': allow_count,
            'deny_rules': deny_count
        }
