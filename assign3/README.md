# Network Security Scanner & Firewall Visualizer

## Project Description

This is a web-based tool that allows users to scan local networks or specific IP addresses to identify open ports, services, and possible vulnerabilities. The tool also includes a firewall rule simulator that enables users to define firewall rules and see how they impact network traffic.

## Features

### 1. Network Scanner
- **Scan Types**:
  - TCP SYN Scan
  - Full Connect Scan
  - UDP Scan
- **Port Scanning**: Scan specific port ranges or individual ports
- **Service Detection**: Identify services running on open ports
- **Results Display**: View scan results in a structured table

### 2. Firewall Simulator
- **Rule Creation**: Create allow/deny rules based on:
  - Source IP address (supports CIDR notation)
  - Port number
  - Protocol (TCP, UDP, or All)
  - Priority-based rule evaluation
- **Rule Management**: Add, view, and delete firewall rules
- **Traffic Evaluation**: Test if traffic would be allowed based on current rules
- **Visual Flow Diagram**: Visualize traffic flow through the firewall

## Technology Stack

### Backend
- **Framework**: Flask
- **Language**: Python 3.x
- **Port Scanning**: Nmap (via python-nmap)
- **CORS**: Flask-CORS for cross-origin requests

### Frontend
- **HTML5**
- **CSS3** (Responsive design)
- **JavaScript** (Fetch API for backend communication)

## Installation

### Prerequisites
- Python 3.6 or higher
- Nmap installed on the system
- pip (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd assign3/backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. (Optional) Install Nmap if not already installed:
   - **Windows**: Download from https://nmap.org/download.html
   - **Linux**: `sudo apt-get install nmap`
   - **macOS**: `brew install nmap`

### Running the Application

1. Start the backend server:
```bash
cd assign3/backend
python app.py
```

The backend will run on `http://localhost:5000`

2. Open your browser and navigate to:
```
http://localhost:5000
```

## API Endpoints

### Network Scanner
- **POST** `/api/scan`
  - **Request**:
    ```json
    {
      "target": "192.168.1.1",
      "scan_type": "tcp_syn",
      "port_range": "1-1000"
    }
    ```
  - **Response**:
    ```json
    {
      "results": [
        {
          "ip": "192.168.1.1",
          "port": 80,
          "protocol": "tcp",
          "state": "open",
          "service": "HTTP",
          "version": "Apache/2.4.41"
        }
      ]
    }
    ```

### Firewall Rules Management
- **GET** `/api/firewall/rules` - Get all rules
- **POST** `/api/firewall/rules` - Add a new rule
  - **Request**:
    ```json
    {
      "action": "allow",
      "ip": "192.168.1.0/24",
      "port": 80,
      "protocol": "tcp",
      "priority": 1
    }
    ```
- **DELETE** `/api/firewall/rules/<rule_id>` - Delete a rule

### Traffic Evaluation
- **POST** `/api/firewall/evaluate` - Evaluate if traffic would be allowed
  - **Request**:
    ```json
    {
      "source_ip": "192.168.1.100",
      "dest_ip": "192.168.1.1",
      "port": 80,
      "protocol": "tcp"
    }
    ```
  - **Response**:
    ```json
    {
      "allowed": true,
      "rule_id": 1
    }
    ```

## Usage Examples

### Example 1: Scan a Local Network
1. Enter target: `192.168.1.1`
2. Select scan type: `TCP SYN Scan`
3. Port range: `1-1000`
4. Click "Start Scan"
5. View results in the table

### Example 2: Create a Firewall Rule
1. Action: `Allow`
2. Source IP: `192.168.1.0/24`
3. Port: `80`
4. Protocol: `TCP`
5. Priority: `1`
6. Click "Add Rule"

### Example 3: Evaluate Traffic
1. Source IP: `192.168.1.100`
2. Destination IP: `192.168.1.1`
3. Port: `80`
4. Protocol: `TCP`
5. Click "Evaluate"

## Security Notes

- **Local Network Scanning**: This tool is designed for scanning local networks only
- **Permission Requirements**: Nmap may require elevated privileges on some systems
- **Firewall Simulator**: The firewall simulation is for educational purposes and does not affect actual system firewall
- **Default Deny**: Traffic is denied by default if no matching rule is found

## Project Structure

```
assign3/
├── backend/
│   ├── app.py                 # Flask application
│   ├── networkscanner.py      # Scanner logic
│   ├── firewall.py           # Firewall simulator
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── index.html            # Main HTML file
│   ├── style.css             # Styling
│   └── app.js                # Frontend logic
└── README.md                 # This file
```

## Troubleshooting

### Issue: "Cannot find nmap"
**Solution**: Ensure Nmap is installed and added to system PATH.

### Issue: "Port 5000 already in use"
**Solution**: Change the port in `app.py` or kill the process using port 5000.

### Issue: CORS errors
**Solution**: Flask-CORS is configured to allow cross-origin requests. Check that the backend is running.

## Future Enhancements

- Real-time visualization of scan progress
- Support for advanced nmap options
- User authentication and rule persistence
- Export scan results to CSV/PDF
- Network topology visualization
- Advanced firewall rules with logging
- Multi-threaded scanning for better performance

## Notes

- This tool is for educational purposes only
- Ensure you have proper authorization before scanning networks you do not own
- Some university networks may block port scanning
- The application requires Nmap to be installed on the system

## License

This project is part of the Information Security course assignments.
