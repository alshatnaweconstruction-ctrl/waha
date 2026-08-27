# WhatsApp HTTP API (WAHA) & n8n Setup Guide

This guide walks you through launching the automation stack, pairing your WhatsApp account via QR code, and connecting incoming webhooks to n8n.

---

## 1. Quick Start

1. Open PowerShell in this repository root.
2. Run the startup script:
   ```powershell
   .\scripts\start.ps1
   ```
3. Verify that the services are running:
   ```powershell
   .\scripts\status.ps1
   ```

---

## 2. Dashboard Access

- **WAHA API & Swagger UI**: [http://localhost:3000](http://localhost:3000)
- **n8n Workflow Automation**: [http://localhost:5678](http://localhost:5678)

---

## 3. Pairing WhatsApp via QR Code

1. Navigate to `http://localhost:3000/dashboard` in your browser.
2. Select or create the session named `default` (Engine: `WEBJS` or `NOWEB`).
3. Click **Start Session** and then **Scan QR Code**.
4. Open WhatsApp on your mobile phone:
   - Go to **Settings > Linked Devices > Link a Device**.
   - Scan the QR code displayed on the WAHA dashboard.
5. Once connected, your session status will turn to **`WORKING`**.

---

## 4. Connecting WAHA to n8n

The stack automatically configures WAHA to deliver incoming messages to `http://n8n:5678/webhook/waha`.

1. Open n8n at `http://localhost:5678`.
2. Go to **Workflows > Import from File** and select `workflows/waha_basic_echo_bot.json`.
3. Click **Activate Workflow**.
4. Send a test WhatsApp message to your connected phone number — the bot will automatically echo the message back!
