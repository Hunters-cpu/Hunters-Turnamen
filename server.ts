import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { waBotManager } from './src/server/whatsappBot';
import { processSaweriaWebhook, saweriaWebhookLogs } from './src/server/saweriaServiceServer';
import { 
  handleGeminiChat, 
  handleGeminiGenerateImage, 
  handleGeminiEditImage, 
  handleGeminiQuickQuery, 
  handleGeminiEsportsAnalysis 
} from './src/server/geminiService';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- WHATSAPP BOT REAL API ROUTES ---

  // Get WhatsApp Bot status & QR Code
  app.get('/api/whatsapp/status', (req, res) => {
    try {
      const status = waBotManager.getStatus();
      res.json({ success: true, ...status });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  // Initiate WhatsApp Bot Connection & generate QR
  app.post('/api/whatsapp/connect', async (req, res) => {
    try {
      await waBotManager.initSocket();
      const status = waBotManager.getStatus();
      res.json({ success: true, message: 'Inisialisasi bot WhatsApp dimulai!', ...status });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Gagal menghubungkan bot' });
    }
  });

  // Logout / Disconnect WhatsApp Bot
  app.post('/api/whatsapp/logout', async (req, res) => {
    try {
      await waBotManager.logout();
      res.json({ success: true, message: 'WhatsApp Bot berhasil diputuskan & sesi dihapus.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Gagal memutuskan bot' });
    }
  });

  // Get message history logs
  app.get('/api/whatsapp/logs', (req, res) => {
    try {
      const logs = waBotManager.getLogs();
      res.json({ success: true, logs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Gagal mengambil log' });
    }
  });

  // Send REAL WhatsApp Message
  app.post('/api/whatsapp/send', async (req, res) => {
    try {
      const { phone, message } = req.body;
      if (!phone || !message) {
        return res.status(400).json({ success: false, error: 'Nomor HP dan isi pesan wajib diisi!' });
      }

      const logEntry = await waBotManager.sendMessage(phone, message);
      res.json({ success: true, message: 'Pesan WhatsApp NYATA berhasil terkirim!', log: logEntry });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Gagal mengirim pesan WhatsApp' });
    }
  });

  // Send Test WhatsApp Message
  app.post('/api/whatsapp/send-test', async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ success: false, error: 'Nomor HP wajib diisi!' });
      }

      const testMsg = `🤖 [HUNTERS COMMUNITY BOT REAL] - TES KONEKSI WHATSAPP!\n\nStatus: ✅ BOT WHATSAPP UTAMA TERHUBUNG & AKTIF NYATA!\nWaktu Test: ${new Date().toLocaleString('id-ID')}\n\nPesan otomatis pendaftaran, konfirmasi slot, top up, saldo, dan pengingat match akan masuk langsung ke WhatsApp ini!`;
      
      const logEntry = await waBotManager.sendMessage(phone, testMsg);
      res.json({ success: true, message: `Pesan tes berhasil dikirim ke WhatsApp ${phone}!`, log: logEntry });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Gagal mengirim tes pesan WhatsApp' });
    }
  });


  // --- SAWERIA WEBHOOK & PAYMENT API ROUTES ---

  // 1. Saweria Webhook Receiver (GET - Status check / diagnostics / documentation)
  app.get(['/api/saweria-pembayaran', '/api/saweria-webhook', '/api/saweria/status'], (req, res) => {
    res.json({
      status: 'active',
      receiverUrl: 'https://pusat-turnamen-hunters-community.ai.studio/api/saweria-pembayaran',
      saweriaAccount: 'https://saweria.co/Hntrs',
      ready: true,
      message: '✅ Webhook Penerima Notifikasi Pembayaran Saweria Siap & Terhubung Realtime ke Firebase!',
      recentTransactionsCount: saweriaWebhookLogs.length,
      supportedFlows: [
        'PENDAFTARAN_TURNAMEN_FF',
        'PENDAFTARAN_TURNAMEN_MLBB',
        'TOP_UP_SALDO_PENGGUNA',
        'REKOMENDASI_MENU_FITUR',
        'DONASI'
      ],
      recentLogs: saweriaWebhookLogs.slice(0, 10)
    });
  });

  // 2. Saweria Webhook Receiver (POST - Incoming Real Webhook from Saweria)
  app.post(['/api/saweria-pembayaran', '/api/saweria-webhook', '/api/saweria/webhook'], async (req, res) => {
    try {
      const payload = req.body || {};
      console.log('[SAWERIA WEBHOOK RECEIVED]:', JSON.stringify(payload));
      
      const result = await processSaweriaWebhook(payload);
      
      // Saweria standard expects a 200 OK with success confirmation
      if (req.headers['accept']?.includes('application/json')) {
        return res.status(200).json(result);
      }
      return res.status(200).send(`OK — Pembayaran ${result.category} Rp${result.amount.toLocaleString('id-ID')} diproses & tersinkron ke Firebase ✅`);
    } catch (err: any) {
      console.error('[SAWERIA WEBHOOK ERROR]:', err);
      return res.status(500).json({ success: false, error: err?.message || 'Webhook processing failed' });
    }
  });

  // 3. Webhook Simulator for Testing / Admin Panel trigger
  app.post('/api/saweria-pembayaran/simulate', async (req, res) => {
    try {
      const payload = req.body || {};
      const result = await processSaweriaWebhook(payload);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Simulation failed' });
    }
  });

  // 4. Saweria Webhook Logs API
  app.get('/api/saweria/logs', (req, res) => {
    res.json({ success: true, logs: saweriaWebhookLogs });
  });

  // --- GEMINI AI INTELLIGENCE API ROUTES ---
  app.post('/api/gemini/chat', handleGeminiChat);
  app.post('/api/gemini/generate-image', handleGeminiGenerateImage);
  app.post('/api/gemini/edit-image', handleGeminiEditImage);
  app.post('/api/gemini/quick-query', handleGeminiQuickQuery);
  app.post('/api/gemini/esports-analysis', handleGeminiEsportsAnalysis);

  // --- VITE / STATIC FILE SERVING ---
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
    console.log(`🚀 Server HUNTERS Community running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
