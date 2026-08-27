# WAHA + n8n WhatsApp Automation Suite

A production-ready WhatsApp automation framework powered by **WAHA (WhatsApp HTTP API)** and **n8n Workflow Automation Engine**, containerized with Docker.

[![Validate & Lint](https://github.com/alshatnaweconstruction-ctrl/waha/actions/workflows/validate.yml/badge.svg)](https://github.com/alshatnaweconstruction-ctrl/waha/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🚀 Features

- **WhatsApp REST API (WAHA)**: Send and receive WhatsApp messages, media, voice notes, location, and documents via simple REST calls.
- **Workflow Automation (n8n)**: Visual no-code/low-code workflow engine for creating custom chatbots, AI agents, CRM syncs, and notifications.
- **Persistent Storage**: Isolated volume mounts for WhatsApp sessions, auth tokens, and n8n workflow states.
- **Ready-to-Use Workflows**: Pre-configured echo bot and AI auto-responder templates included.
- **Cross-Platform Scripts**: 1-click startup, shutdown, and health inspection scripts for PowerShell and Bash.

---

## 📁 Repository Structure

```text
├── .github/workflows/       # GitHub Actions CI validation
├── docker-compose/          # Docker Compose configurations & environment templates
│   ├── docker-compose.yml   # Multi-container orchestration (WAHA + n8n)
│   ├── .env.example         # Environment variables configuration template
│   └── n8n/                 # Persistent runtime data (sessions & media)
├── workflows/               # Importable n8n workflow blueprints
│   ├── waha_basic_echo_bot.json
│   └── waha_ai_autoresponder.json
├── scripts/                 # Management scripts (PowerShell & Bash)
│   ├── start.ps1 / start.sh
│   ├── stop.ps1 / stop.sh
│   └── status.ps1
└── docs/                    # Detailed technical documentation
    ├── SETUP_GUIDE.md
    └── API_REFERENCE.md
```

---

## ⚡ Quick Start

### 1. Launch the Stack

In PowerShell:
```powershell
.\scripts\start.ps1
```

In Linux / macOS / WSL:
```bash
./scripts/start.sh
```

### 2. Access the Dashboards

- **WAHA API & Swagger UI**: [http://localhost:3000](http://localhost:3000)
- **n8n Automation Console**: [http://localhost:5678](http://localhost:5678)

### 3. Connect WhatsApp & Import Workflows

1. Open `http://localhost:3000/dashboard`, start session `default`, and scan the QR code using WhatsApp on your phone (**Settings > Linked Devices**).
2. Open `http://localhost:5678`, go to **Workflows > Import from File**, and select `workflows/waha_basic_echo_bot.json`.
3. Activate the workflow to start processing messages automatically!

---

## 📖 Documentation

- [Step-by-Step Setup & QR Pairing Guide](docs/SETUP_GUIDE.md)
- [WAHA REST API Reference & Examples](docs/API_REFERENCE.md)

---

## 🛡️ License

This project is open-source and licensed under the [MIT License](LICENSE).
