# ⚡ Electricity Bill Forecasting — Indian States (2025–2027)

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YOUR_USERNAME/electricity-forecast-india/blob/main/Electricity_Forecast_2025_2027.ipynb)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Made with Colab](https://img.shields.io/badge/Made%20with-Google%20Colab-orange.svg)](https://colab.research.google.com/)

> **ML-based monthly electricity bill forecasting for 8 Indian states using Random Forest, XGBoost, SARIMA, and Ensemble models — with an interactive dashboard.**

---

## 📌 Project Overview

This project forecasts **monthly household electricity bills** for major Indian states from **2025 to 2027** using machine learning and time series models. It includes full exploratory data analysis, feature engineering, model training, forecast generation, and an interactive dashboard built with `ipywidgets` — all running inside Google Colab.

---

## 🗺️ States Covered

| State | Base Bill | Growth Rate |
|-------|-----------|-------------|
| Tamil Nadu | ₹850 | 5.5% |
| Maharashtra | ₹1,100 | 6.0% |
| Uttar Pradesh | ₹950 | 7.0% |
| Rajasthan | ₹600 | 6.5% |
| Gujarat | ₹780 | 5.8% |
| Karnataka | ₹720 | 5.0% |
| Andhra Pradesh | ₹680 | 6.0% |
| West Bengal | ₹620 | 5.0% |

---

## 🤖 Models Used

| Model | Description |
|-------|-------------|
| **Random Forest** | Ensemble of decision trees with lag + seasonal features |
| **XGBoost** | Gradient boosting with cyclical month encoding |
| **SARIMA** | Seasonal ARIMA — captures monthly seasonality (period=12) |
| **Ensemble** | Weighted average of all three models (best accuracy) |

---

## 📊 Key Features

- ✅ Monthly bill forecasts for **2025, 2026, 2027**
- ✅ **90% confidence intervals** for each forecast month
- ✅ Peak month highlighted in **red**, lowest in **blue**
- ✅ Seasonal analysis — Summer / Monsoon / Winter
- ✅ Year-over-year comparison (2021–2027)
- ✅ State ranking heatmap
- ✅ Interactive dashboard with live dropdowns (ipywidgets)
- ✅ All charts auto-saved as PNG files

---

## 🗂️ Project Structure

```
electricity-forecast-india/
│
├── Electricity_Forecast_2025_2027.ipynb   ← Main Colab notebook
├── README.md                               ← This file
│
├── outputs/ (generated after running)
│   ├── eda_analysis.png
│   ├── decomposition.png
│   ├── forecast_trend.png
│   ├── forecast_heatmap.png
│   ├── model_comparison.png
│   └── monthly_bill_TamilNadu_2025.png
```

---

## 🚀 How to Run

### Option 1 — Open directly in Google Colab (recommended)
Click the badge at the top ☝️ or paste this URL in your browser:
```
https://colab.research.google.com/github/YOUR_USERNAME/electricity-forecast-india/blob/main/Electricity_Forecast_2025_2027.ipynb
```

### Option 2 — Run all cells at once
1. Open the notebook in Colab
2. Click **Runtime → Run all** (or press `Ctrl + F9`)
3. All 15 steps run automatically

### Option 3 — Run locally
```bash
git clone https://github.com/YOUR_USERNAME/electricity-forecast-india.git
cd electricity-forecast-india
pip install -r requirements.txt
jupyter notebook Electricity_Forecast_2025_2027.ipynb
```

---

## 📦 Requirements

```
numpy
pandas
matplotlib
seaborn
scikit-learn
xgboost
statsmodels
plotly
ipywidgets
```

Install all at once:
```bash
pip install numpy pandas matplotlib seaborn scikit-learn xgboost statsmodels plotly ipywidgets
```

---

## 📋 Notebook Steps

| Step | Description |
|------|-------------|
| 1 | Install libraries |
| 2 | Imports & configuration |
| 3 | Generate dataset — 8 states, 2019–2027 |
| 4 | Exploratory Data Analysis (EDA) |
| 5 | Time Series Decomposition (additive + multiplicative) |
| 6 | Feature Engineering (lag, cyclical, rolling) |
| 7 | Train Random Forest + XGBoost |
| 8 | SARIMA forecasting per state |
| 9 | Build ensemble forecast table |
| **10** | **📊 Main output — Monthly Bill Graph** |
| 11 | Forecast trend 2023–2027 + confidence intervals |
| 12 | State heatmaps (2025 / 2026 / 2027) |
| 13 | Model accuracy comparison |
| **14** | **🖥️ Interactive Dashboard (ipywidgets)** |
| 15 | Conclusions + forecast summary table |

---

## 🔧 Customize Your Output

In **Step 10**, change these 3 lines to get your specific forecast:

```python
SELECTED_STATE = 'Tamil Nadu'   # any of the 8 states
SELECTED_YEAR  = 2025           # 2025 / 2026 / 2027
SELECTED_MODEL = 'ensemble'     # ensemble / rf / xgb / sarima
```

---

## 📈 Sample Output

**Monthly Bill Forecast — Tamil Nadu 2025 (Ensemble)**

- 🔴 **Peak month: May** — highest AC & cooling demand
- 🔵 **Lowest month: January** — minimal cooling load
- 📊 Annual total: ₹13,200 (estimated household)
- 📉 Confidence interval widens for 2027 forecasts

---

## 🏆 Model Performance (Test Set)

| Model | MAE (₹) | RMSE (₹) | R² | MAPE (%) |
|-------|---------|----------|-----|----------|
| Random Forest | ~28 | ~35 | ~0.98 | ~3.2 |
| XGBoost | ~25 | ~32 | ~0.99 | ~2.9 |
| **Ensemble** | **~22** | **~29** | **~0.99** | **~2.5** |

---

## 👤 Author

**Your Name**
- GitHub: [sandeepkodavati36](https://github.com/sandeepkodavati36)
- Email: sandeepkodavati36@gmail.com

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Central Electricity Authority (CEA) — India for tariff structure reference
- Statsmodels library for SARIMA implementation
- XGBoost team for the gradient boosting framework
- Google Colab for free GPU/CPU compute

---

> ⭐ If this project helped you, please give it a star on GitHub!
