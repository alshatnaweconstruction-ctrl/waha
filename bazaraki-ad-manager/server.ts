import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Database File Path
const DB_FILE = path.join(process.cwd(), 'db.json');

// Logs state in memory (for live logs tab)
let systemLogs: { id: string; timestamp: string; level: 'info' | 'warn' | 'error' | 'success'; message: string }[] = [];

function addLog(level: 'info' | 'warn' | 'error' | 'success', message: string) {
  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    level,
    message,
  };
  systemLogs.unshift(log);
  if (systemLogs.length > 200) {
    systemLogs.pop();
  }
  console.log(`[${level.toUpperCase()}] ${message}`);
}

// Initialize Database with default data
function initDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (data.services && data.listings && data.settings) {
        addLog('info', 'Database loaded successfully from file.');
        return data;
      }
    } catch (e) {
      addLog('error', 'Error reading db.json, reinitializing to defaults.');
    }
  }

  const defaultDB = {
    services: [
      {
        id: 'serv_1',
        name: 'Renovations & Remodeling',
        usp: 'High-quality Italian tiling, gypsum ceiling work, and custom woodwork. Completed with a dedicated local Cypriot supervisor. Over 15 years in Limassol.',
        lastPostedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        displayOrder: 1,
      },
      {
        id: 'serv_2',
        name: 'Concrete works & Structural Formwork',
        usp: 'Structural concrete pouring, earthquake-resistant foundation reinforcing, retaining walls, and custom framework. Full load tests and Cyprus building regulation compliant.',
        lastPostedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        displayOrder: 2,
      },
      {
        id: 'serv_3',
        name: 'Roofing & Polyurethane Waterproofing',
        usp: 'Flat roof waterproofing using advanced polyurethane membranes (Sika/Isomat). 10-year written warranty. Solves Cyprus seaside humidity and heavy winter rain leaks.',
        lastPostedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        displayOrder: 3,
      },
      {
        id: 'serv_4',
        name: 'Excavations & Demolition',
        usp: 'Equipped with heavy track excavators, rock breakers, and dump trucks. Rapid clearance of land plots, foundation trenching, and controlled house demolitions.',
        lastPostedAt: null,
        isActive: true,
        displayOrder: 4,
      },
      {
        id: 'serv_5',
        name: 'Plastering & Thermal Facade Painting',
        usp: 'Thermal insulation systems (Kelyfos) and 3-coat premium plastering. Finished with high-durability, anti-fungal exterior paint to withstand Cyprus summer sun.',
        lastPostedAt: null,
        isActive: true,
        displayOrder: 5,
      },
    ],
    listings: [
      {
        id: 'lst_1718000000000_3a1b',
        serviceId: 'serv_1',
        serviceName: 'Renovations & Remodeling',
        title: 'Professional Apartment Renovation & Tiling in Limassol',
        body: 'Al Shatnawe Construction Ltd offers reliable apartment and house renovations. Our team specializes in top-grade Italian tiling, gypsum plasterboard decorations, bathroom refits, and custom kitchen upgrades. Every project is supervised by our local Cypriot engineer ensuring strict adherence to European quality guidelines. We serve Limassol, Paphos, and Larnaca districts. Call or message us to request an on-site consultation and clear quotation.',
        similarityScore: 0.12,
        similarityComparisonListingId: null,
        status: 'published',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        telegramMessageId: 'tg_msg_1001',
        history: [],
      },
      {
        id: 'lst_1718000010000_7c2d',
        serviceId: 'serv_3',
        serviceName: 'Roofing & Polyurethane Waterproofing',
        title: 'Roof Waterproofing and Polyurethane Insulation Cyprus',
        body: 'Secure your property against dampness and water damage. We provide heavy-duty waterproofing solutions using professional polyurethane liquid membranes. Ideal for flat roofs, terraces, and balconies. Our coatings are highly UV-resistant to withstand the intense Cyprus summer heat and stop winter rains completely. Includes a 10-year warranty. Serving Limassol, Larnaca, and Nicosia areas. Contact Al Shatnawe Construction Ltd for details.',
        similarityScore: 0.15,
        similarityComparisonListingId: null,
        status: 'published',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        telegramMessageId: 'tg_msg_1002',
        history: [],
      },
    ],
    settings: {
      telegramBotToken: '',
      telegramChatId: '',
      useRealTelegram: false,
      bazarakiPhone: '+357 99 713028',
      bazarakiLocation: 'Limassol, Cyprus',
      bazarakiCategory: 'Services > Construction & Renovation',
      n8nWebhookUrl: 'https://n8n.alshatnawe.com/webhook/bazaraki-ad-trigger',
      schedulerActive: true,
      schedulerHour: 9,
      schedulerMinute: 0,
    },
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), 'utf-8');
  addLog('info', 'Database initialized with standard defaults for AL SHATNAWE CONSTRUCTION LTD.');
  return defaultDB;
}

const db = initDB();

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    addLog('error', `Failed to write database file: ${(err as Error).message}`);
  }
}

// Lazy Initialize Gemini API
let aiInstance: GoogleGenAI | null = null;
function getAIInstance() {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiInstance = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiInstance;
}

// Local high-quality backup template generator for Cyprus contractor tone
function getLocalTemplateAd(serviceName: string, usp: string): { title: string; body: string } {
  addLog('warn', `Using native Cyprus Contractor generator for "${serviceName}"...`);
  
  const titles = [
    `Professional ${serviceName} in Limassol & District`,
    `Quality ${serviceName} - Al Shatnawe Construction Ltd`,
    `Experienced ${serviceName} Contractors Cyprus`,
    `Reliable ${serviceName} Service - Licensed Builder`
  ];
  const title = titles[Math.floor(Math.random() * titles.length)];

  const bodies = [
    `Al Shatnawe Construction Ltd offers top-tier ${serviceName.toLowerCase()} solutions for residential and commercial properties in Cyprus. Under strict project supervision, we deliver reliable results utilizing premium materials. \n\nKey advantages:\n- ${usp}\n- Experienced tradesmen and modern equipment\n- Full compliance with Cyprus safety and building standards\n- Professional, clean site work with direct developer support\n\nWe serve Limassol, Paphos, Larnaca, and Nicosia. Contact us today for a free on-site assessment and a transparent, competitive quote.`,
    `Need professional and reliable work? Al Shatnawe Construction Ltd delivers certified ${serviceName.toLowerCase()} services tailored to the Mediterranean climate. \n\nWhat we provide:\n- High-grade materials designed for local conditions\n- ${usp}\n- Hands-on supervisor management with transparent pricing\n- Complete cleanup post-construction\n\nLicensed in Cyprus with a solid track record. Reach out to schedule an on-site consultation at your convenience.`
  ];
  const body = bodies[Math.floor(Math.random() * bodies.length)];

  return { title, body };
}

// Tokenize and calculate Jaccard similarity to prevent duplicate flags
function calculateJaccardSimilarity(text1: string, text2: string): number {
  const tokenize = (text: string) => {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !['and', 'the', 'for', 'with', 'you', 'this', 'our', 'are', 'your', 'with', 'from', 'ltd'].includes(word))
    );
  };
  const set1 = tokenize(text1);
  const set2 = tokenize(text2);
  
  if (set1.size === 0 || set2.size === 0) return 0;
  
  let intersectionSize = 0;
  for (const word of set1) {
    if (set2.has(word)) intersectionSize++;
  }
  
  const unionSize = set1.size + set2.size - intersectionSize;
  return Number((intersectionSize / unionSize).toFixed(3));
}

// Find highest similarity against published/active listings
function checkSimilarityAgainstPublished(newTitle: string, newBody: string): { score: number; comparisonId: string | null; adText: string } {
  const published = db.listings.filter(l => l.status === 'published');
  if (published.length === 0) {
    return { score: 0, comparisonId: null, adText: '' };
  }

  const combinedNew = `${newTitle} ${newBody}`;
  let highestScore = 0;
  let highestComparisonId: string | null = null;
  let highestText = '';

  for (const ad of published) {
    const combinedPublished = `${ad.title} ${ad.body}`;
    const score = calculateJaccardSimilarity(combinedNew, combinedPublished);
    if (score > highestScore) {
      highestScore = score;
      highestComparisonId = ad.id;
      highestText = `Title: ${ad.title}\nBody: ${ad.body.substring(0, 80)}...`;
    }
  }

  return { score: highestScore, comparisonId: highestComparisonId, adText: highestText };
}

// Generate Ad using Gemini API
async function callGeminiToGenerate(serviceName: string, usp: string, rewriteInstruction?: string): Promise<{ title: string; body: string }> {
  const ai = getAIInstance();
  if (!ai) {
    return getLocalTemplateAd(serviceName, usp);
  }

  try {
    let prompt = `
You are writing a professional, high-converting classified ad for a local Cyprus contractor: "AL SHATNAWE CONSTRUCTION LTD".
Service to advertise: "${serviceName}"
Unique Selling Point (USP): "${usp}"

Tone Rules:
1. Sound like an actual, honest, experienced builder or contractor, NOT a fluffy marketing agency. Avoid words like "unlock your dreams", "innovative solutions", "your peace of mind is our priority", "trusted partner", "meticulous attention", "transform your space". Just state clean, direct facts about materials, quality of concrete/mortar, local engineer supervision, and standard prices.
2. Language: English ONLY.
3. Reference the Cyprus context: Limassol seaside humidity, hot summer heat protection, winter rain waterproofing, or strict European structural standards for Cyprus.
4. Avoid including contact details like phone numbers or emails in the title or body (as they are entered in separate fields on Bazaraki).
5. Titles must be simple, factual, and strictly professional. No exclamation marks, no sales-pitch capitalizations.
6. The output MUST be a strict, valid JSON object with EXACTLY keys "title" and "body".

${rewriteInstruction ? `CRITICAL REWRITE DIRECTION:\n${rewriteInstruction}` : ''}
`;

    addLog('info', `Calling Gemini 3.5 Flash for service: "${serviceName}"...`);
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '';
    const cleanJSON = responseText.trim();
    const result = JSON.parse(cleanJSON);

    if (result.title && result.body) {
      addLog('success', `Gemini successfully generated ad. Title length: ${result.title.length}, Body length: ${result.body.length}`);
      return {
        title: result.title.trim(),
        body: result.body.trim(),
      };
    }
    
    throw new Error("JSON structure parsed but missing 'title' or 'body' keys.");
  } catch (error) {
    addLog('error', `Gemini generation failed: ${(error as Error).message}. Falling back to template.`);
    return getLocalTemplateAd(serviceName, usp);
  }
}

// Send Real/Simulated Telegram message
async function sendTelegramMessage(ad: any, settings: typeof db.settings) {
  const messageText = `
🔔 *NEW BAZARAKI AD FOR APPROVAL*
🏗️ *Service*: ${ad.serviceName}
🆔 *ID*: \`${ad.id}\`
📊 *Similarity Score*: \`${ad.similarityScore}\` ${ad.similarityScore >= 0.75 ? '⚠️ High' : '✅ Safe'}

📌 *Title*: ${ad.title}

📝 *Body*: 
${ad.body}

---
Please review this ad for publication.`;

  if (settings.useRealTelegram && settings.telegramBotToken && settings.telegramChatId) {
    addLog('info', `Sending Telegram message to live channel via Bot Token: ...${settings.telegramBotToken.substring(0, 4)}`);
    try {
      const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;
      const keyboard = {
        inline_keyboard: [
          [
            { text: 'Approve ✅', callback_data: `a|${ad.id}` },
            { text: 'Reject ❌', callback_data: `r|${ad.id}` }
          ]
        ]
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: messageText,
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        })
      });

      const resData = await res.json();
      if (resData.ok) {
        ad.telegramMessageId = resData.result.message_id.toString();
        addLog('success', `Live Telegram message delivered! Msg ID: ${ad.telegramMessageId}`);
      } else {
        addLog('error', `Telegram API error: ${JSON.stringify(resData)}`);
      }
    } catch (err) {
      addLog('error', `Failed to deliver Live Telegram message: ${(err as Error).message}`);
    }
  } else {
    // Simulated delivery log
    ad.telegramMessageId = `mock_msg_${Date.now()}`;
    addLog('info', `[SIMULATED TELEGRAM] Sent message to simulated group for ${ad.serviceName}. Message ID: ${ad.telegramMessageId}`);
  }
}

/* =========================================
   REST API Endpoints
   ========================================= */

// Get services
app.get('/api/services', (req, res) => {
  res.json(db.services);
});

// Create/Update service
app.post('/api/services', (req, res) => {
  const { id, name, usp, isActive, displayOrder } = req.body;
  
  if (!name || !usp) {
    return res.status(400).json({ error: 'Name and USP are required.' });
  }

  if (id) {
    const idx = db.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      db.services[idx] = {
        ...db.services[idx],
        name,
        usp,
        isActive: isActive !== undefined ? isActive : db.services[idx].isActive,
        displayOrder: displayOrder !== undefined ? displayOrder : db.services[idx].displayOrder,
      };
      addLog('info', `Service updated: "${name}"`);
    } else {
      return res.status(404).json({ error: 'Service not found.' });
    }
  } else {
    const newService = {
      id: `serv_${Date.now()}`,
      name,
      usp,
      lastPostedAt: null,
      isActive: true,
      displayOrder: db.services.length + 1,
    };
    db.services.push(newService);
    addLog('info', `Created new construction service: "${name}"`);
  }
  
  saveDB();
  res.json({ success: true, services: db.services });
});

// Delete service
app.delete('/api/services/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.services.findIndex(s => s.id === id);
  if (idx !== -1) {
    addLog('info', `Deleted service: "${db.services[idx].name}"`);
    db.services.splice(idx, 1);
    saveDB();
    res.json({ success: true, services: db.services });
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// Get listings
app.get('/api/listings', (req, res) => {
  res.json(db.listings);
});

// Update listing status
// Trigger n8n Webhook
async function triggerN8NWebhook(ad: any) {
  if (db.settings.n8nWebhookUrl && db.settings.n8nWebhookUrl.startsWith('http')) {
    addLog('info', `[N8N Webhook] Dispatching ad publication payload to: ${db.settings.n8nWebhookUrl}`);
    try {
      const response = await fetch(db.settings.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'ad_published',
          timestamp: new Date().toISOString(),
          ad: {
            id: ad.id,
            serviceId: ad.serviceId,
            serviceName: ad.serviceName,
            title: ad.title,
            body: ad.body,
            postedAt: ad.postedAt || new Date().toISOString(),
            bazarakiPhone: db.settings.bazarakiPhone,
            bazarakiLocation: db.settings.bazarakiLocation,
            bazarakiCategory: db.settings.bazarakiCategory,
          }
        })
      });
      addLog('success', `[N8N Webhook] Triggered successfully! Response status: ${response.status}`);
    } catch (err) {
      addLog('warn', `[N8N Webhook] Delivery failed: ${(err as Error).message}`);
    }
  }
}

// Update listing status
app.post('/api/listings/status', async (req, res) => {
  const { id, status } = req.body;
  const listing = db.listings.find(l => l.id === id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  
  listing.status = status;
  if (status === 'published') {
    listing.postedAt = new Date().toISOString();
    // Update the service lastPostedAt
    const sIdx = db.services.findIndex(s => s.id === listing.serviceId);
    if (sIdx !== -1) {
      db.services[sIdx].lastPostedAt = listing.postedAt;
    }
    addLog('success', `Ad "${listing.title}" is now published and active on Bazaraki feed.`);
    saveDB();
    // Trigger live webhook
    await triggerN8NWebhook(listing);
  } else if (status === 'rejected') {
    addLog('warn', `Ad "${listing.title}" was rejected.`);
    saveDB();
  } else {
    saveDB();
  }

  res.json({ success: true, listing });
});

// Get settings
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

// Update settings
app.post('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  addLog('success', 'System configurations updated.');
  saveDB();
  res.json({ success: true, settings: db.settings });
});

// Get logs
app.get('/api/system-logs', (req, res) => {
  res.json(systemLogs);
});

// Clear logs
app.post('/api/system-logs/clear', (req, res) => {
  systemLogs = [];
  addLog('info', 'System log console cleared.');
  res.json({ success: true });
});

// Telegram Callback Webhook Mock Endpoint
// Handles action query from TG Buttons: Approve ('a|listing_id') or Reject ('r|listing_id')
app.post('/api/telegram-callback', async (req, res) => {
  const { data } = req.body;
  if (!data || !data.includes('|')) {
    return res.status(400).json({ error: 'Invalid payload. Standard format: "a|LISTING_ID" or "r|LISTING_ID"' });
  }

  const [action, listingId] = data.split('|');
  const listing = db.listings.find(l => l.id === listingId);
  if (!listing) {
    addLog('error', `Callback webhook failed: Listing ID ${listingId} not found.`);
    return res.status(404).json({ error: 'Listing not found' });
  }

  if (action === 'a') {
    listing.status = 'published';
    listing.postedAt = new Date().toISOString();
    
    // Update service lastPostedAt to cycle rotation
    const sIdx = db.services.findIndex(s => s.id === listing.serviceId);
    if (sIdx !== -1) {
      db.services[sIdx].lastPostedAt = listing.postedAt;
    }
    addLog('success', `[TG-WEBHOOK CALLBACK] Approved listing ${listingId}! Ad is officially published to Bazaraki live XML feed.`);
    saveDB();
    // Trigger live webhook
    await triggerN8NWebhook(listing);
  } else if (action === 'r') {
    listing.status = 'rejected';
    addLog('warn', `[TG-WEBHOOK CALLBACK] Rejected listing ${listingId}. State saved, ad excluded from live feed.`);
    saveDB();
  }

  res.json({ success: true, listing });
});

// Reusable Pipeline Execution Helper
async function executeAdPipeline(serviceId?: string): Promise<{ success: boolean; error?: string; listing?: any }> {
  let service = null;

  if (serviceId) {
    service = db.services.find(s => s.id === serviceId);
  } else {
    // Automated rotation picker: Pick service with oldest lastPostedAt (nulls first)
    const activeServices = db.services.filter(s => s.isActive);
    if (activeServices.length === 0) {
      addLog('error', 'No active services available in rotation.');
      return { success: false, error: 'No active services in rotation.' };
    }
    
    // Sort so nulls are first, then oldest posting date
    activeServices.sort((a, b) => {
      if (!a.lastPostedAt) return -1;
      if (!b.lastPostedAt) return 1;
      return new Date(a.lastPostedAt).getTime() - new Date(b.lastPostedAt).getTime();
    });
    service = activeServices[0];
  }

  if (!service) {
    return { success: false, error: 'Service not found.' };
  }

  addLog('info', `[Pipeline Step 1] Starting ad pipeline for service: "${service.name}"`);
  
  // Step 2: Build listing ID
  const listingId = `lst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  addLog('info', `[Pipeline Step 2] Generated unique listing ID: "${listingId}"`);

  // Step 3: Claude/Gemini generates the ad with up to 3 rewrite iterations
  let title = '';
  let body = '';
  let similarityScore = 0;
  let comparisonId: string | null = null;
  const history: any[] = [];
  let rewriteInstruction = '';
  let passesCheck = false;
  let attempts = 0;

  addLog('info', `[Pipeline Step 3] Initiating duplicate detection & similarity loops against recent published ads...`);

  while (attempts < 4) {
    attempts++;
    addLog('info', `[Pipeline Loop] Generation attempt ${attempts} of 4...`);
    
    const generated = await callGeminiToGenerate(service.name, service.usp, rewriteInstruction);
    title = generated.title;
    body = generated.body;

    // Check similarity
    const check = checkSimilarityAgainstPublished(title, body);
    similarityScore = check.score;
    comparisonId = check.comparisonId;

    history.push({
      title,
      body,
      similarityScore,
      timestamp: new Date().toISOString(),
      note: `Attempt ${attempts} - similarity score: ${similarityScore}`
    });

    addLog('info', `[Duplicate Prevention] Jaccard similarity rating of ${similarityScore} computed against published database.`);

    if (similarityScore < 0.75) {
      addLog('success', `[Duplicate Prevention] Similarity is ${similarityScore} (Safe under 0.75). Ad accepted!`);
      passesCheck = true;
      break;
    } else if (similarityScore >= 0.75 && similarityScore <= 0.82 && attempts < 4) {
      addLog('warn', `[Duplicate Prevention] Similarity is ${similarityScore} (Too similar: 0.75 to 0.82). Triggering auto-rewrite loop...`);
      rewriteInstruction = `The previous draft scored a high similarity rating of ${similarityScore} against published ads. 
Avoid repeating similar sentences or structures. Rephrase key paragraphs and change sentence length significantly. 
Previous Draft Title: "${title}"
Previous Draft Body: "${body.substring(0, 100)}..."`;
    } else {
      addLog('error', `[Duplicate Prevention] Similarity is ${similarityScore} (Severe duplicate >= 0.82, or max rewrites exceeded). Ad marked rejected.`);
      passesCheck = false;
      break;
    }
  }

  const finalStatus = passesCheck ? 'pending_approval' : 'rejected';

  // Create the BazarakiAd
  const finalAd = {
    id: listingId,
    serviceId: service.id,
    serviceName: service.name,
    title,
    body,
    similarityScore,
    similarityComparisonListingId: comparisonId,
    status: finalStatus as any,
    createdAt: new Date().toISOString(),
    postedAt: null,
    telegramMessageId: null,
    history: history.slice(0, -1), // previous attempts
  };

  db.listings.unshift(finalAd);
  saveDB();

  if (passesCheck) {
    addLog('info', `[Pipeline Step 4] Ad passed similarity checks. Dispatching payload for approval...`);
    // Send message to Telegram Channel
    await sendTelegramMessage(finalAd, db.settings);
  } else {
    addLog('error', `[Pipeline Finished] Ad generation failed duplicate check or threshold. Auto-rejected to keep Bazaraki feed clean.`);
  }

  return { success: true, listing: finalAd };
}

// Background Interval Scheduler
let lastScheduledRunDay = '';
setInterval(async () => {
  if (!db.settings.schedulerActive) return;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  if (currentHour === db.settings.schedulerHour && currentMinute === db.settings.schedulerMinute) {
    if (lastScheduledRunDay !== todayStr) {
      lastScheduledRunDay = todayStr;
      addLog('info', `[SCHEDULER] Live scheduled trigger matches current time: ${db.settings.schedulerHour}:${db.settings.schedulerMinute.toString().padStart(2, '0')}. Booting pipeline...`);
      try {
        await executeAdPipeline();
      } catch (err) {
        addLog('error', `[SCHEDULER] Automated scheduled pipeline run failed: ${(err as Error).message}`);
      }
    }
  }
}, 30000); // Poll every 30 seconds to prevent double triggers and ensure capture within the minute

// Pipeline Execution Engine (simulates n8n workflow steps)
app.post('/api/pipeline/run', async (req, res) => {
  const { serviceId } = req.body;
  const result = await executeAdPipeline(serviceId);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.json({ success: true, listing: result.listing });
});

// Live XML Feed Endpoint
app.get('/api/feed.xml', (req, res) => {
  const publishedAds = db.listings.filter(l => l.status === 'published');
  
  res.header('Content-Type', 'application/xml; charset=utf-8');
  
  let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
  xml += '<bazaraki_feed>\n';
  xml += '  <provider>\n';
  xml += '    <name>Al Shatnawe Construction Ltd</name>\n';
  xml += `    <phone>${db.settings.bazarakiPhone}</phone>\n`;
  xml += '  </provider>\n';
  
  publishedAds.forEach(ad => {
    xml += '  <listing>\n';
    xml += `    <id>${ad.id}</id>\n`;
    xml += `    <title><![CDATA[${ad.title}]]></title>\n`;
    xml += `    <description><![CDATA[${ad.body}]]></description>\n`;
    xml += '    <price>0</price>\n';
    xml += `    <category><![CDATA[${db.settings.bazarakiCategory}]]></category>\n`;
    xml += `    <location><![CDATA[${db.settings.bazarakiLocation}]]></location>\n`;
    xml += `    <phone>${db.settings.bazarakiPhone}</phone>\n`;
    xml += '    <status>active</status>\n';
    xml += `    <created_at>${ad.createdAt}</created_at>\n`;
    if (ad.postedAt) {
      xml += `    <published_at>${ad.postedAt}</published_at>\n`;
    }
    xml += '  </listing>\n';
  });
  
  xml += '</bazaraki_feed>';
  
  res.send(xml);
});

// Dashboard stats endpoint
app.get('/api/stats', (req, res) => {
  const published = db.listings.filter(l => l.status === 'published').length;
  const pending = db.listings.filter(l => l.status === 'pending_approval').length;
  const rejected = db.listings.filter(l => l.status === 'rejected').length;
  
  // Calculate total auto rewrites
  let autoRewrites = 0;
  db.listings.forEach(ad => {
    if (ad.history && ad.history.length > 0) {
      autoRewrites += ad.history.length;
    }
  });

  // Next scheduled run
  let nextScheduledRun = null;
  if (db.settings.schedulerActive) {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(db.settings.schedulerHour, db.settings.schedulerMinute, 0, 0);
    
    if (scheduledTime.getTime() <= now.getTime()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    nextScheduledRun = scheduledTime.toISOString();
  }

  res.json({
    totalPublished: published,
    pendingReview: pending,
    totalRejected: rejected,
    autoRewrites,
    nextScheduledRun,
  });
});

/* =========================================
   Vite / Static Asset Handler
   ========================================= */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    addLog('info', `=== BAZARAKI AD MANAGER FOR AL SHATNAWE CONSTRUCTION LTD ===`);
    addLog('info', `Server is up and listening on http://0.0.0.0:${PORT}`);
    addLog('info', `Bazaraki XML Feed served at http://0.0.0.0:${PORT}/api/feed.xml`);
  });
}

startServer();
