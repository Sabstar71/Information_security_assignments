# Machine Learning-Based Network Intrusion Detection System (ML-IDS)

## Objective
This project aims to develop a proof-of-concept Machine Learning classifier that detects network intrusions by analyzing traffic patterns. The solution demonstrates how ML can enhance traditional security tools with proactive threat detection.

## Dataset
- **Name**: UNSW-NB15
- **Description**: Simulated dataset with realistic network traffic, including normal and malicious flows.
- **Subset Used**: 4,000 flows (2,500 normal, 1,500 malicious).
- **Attack Types**: DDoS, infiltration, backdoor, reconnaissance, etc.

## Key Features
- **ML Frameworks**: scikit-learn, TensorFlow.
- **Data Tools**: pandas, numpy.
- **Visualization**: matplotlib, seaborn.
- **Language**: Python 3.8+

## Project Workflow
1. **Data Preprocessing**:
   - Encoding categorical features.
   - Balancing classes using SMOTE.
   - Normalizing features.
2. **Model Training**:
   - Primary Model: Random Forest.
   - Secondary Models: Decision Tree, Logistic Regression.
3. **Evaluation**:
   - Metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC.
   - Visualizations: Confusion Matrix, ROC Curve.

## Results
- **Random Forest Performance**:
  - Accuracy: 94.5%
  - Precision: 96.8%
  - Recall: 89.2%
  - ROC-AUC: 0.978

## How to Run
1. Install dependencies: `pip install -r requirements.txt`
2. Open the Jupyter notebook: `CLO4_IDS_ML_Solution.ipynb`
3. Run all cells to execute the ML pipeline.
4. Review the results and visualizations.

## Contribution
This project aligns with CLO 4: Create solutions to real-life scenarios using different security-related tools.