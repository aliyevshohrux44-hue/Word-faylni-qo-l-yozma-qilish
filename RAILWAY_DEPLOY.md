# 🚀 Railway'ga Deploy Qilish Yo'riqnomasi

## 1-qadam — railway.app saytiga kiring

https://railway.app saytiga o'ting va GitHub akkauntingiz bilan kirring (Sign in with GitHub).

---

## 2-qadam — Yangi loyiha yarating

1. Dashboard'da **"New Project"** tugmasini bosing
2. **"Deploy from GitHub repo"** ni tanlang
3. Repo ro'yxatidan **`Word-faylni-qo-l-yozma-qilish`** ni tanlang
4. **"Deploy Now"** ni bosing

---

## 3-qadam — Deploy avtomatik boshlanadi

Railway quyidagi fayllarni o'z-o'zidan aniqlaydi:
- `railway.json` — build va start sozlamalari
- `nixpacks.toml` — Python muhiti
- `Procfile` — `web: python server.py`
- `runtime.txt` — Python 3.13

Deploy 1-2 daqiqa ichida tugaydi.

---

## 4-qadam — Domen olish

Deploy tugagach:
1. **"Settings"** bo'limiga o'ting
2. **"Networking"** → **"Generate Domain"** tugmasini bosing
3. `xxxx.up.railway.app` ko'rinishidagi havola beriladi

Shu havola orqali ilovangiz internetda ochiq bo'ladi! 🌐

---

## Muhim fayl tuzilmasi (Railway foydalanadigan)

```
├── server.py        ← Asosiy server (PORT env o'qiydi)
├── Procfile         ← web: python server.py
├── railway.json     ← Railway konfiguratsiyasi
├── nixpacks.toml    ← Build konfiguratsiyasi
├── requirements.txt ← Python paketlar (bo'sh — standart kutubxonalar yetarli)
├── runtime.txt      ← python-3.13
└── index.html       ← Asosiy veb sahifa
```

---

## Muammolar bo'lsa

Railway loglari: Loyiha → "Deployments" → Oxirgi deploy → "View Logs"

Keng tarqalgan muammolar:
- **"Port not bound"** → `server.py` da `PORT = int(os.environ.get("PORT", 8000))` ✅ allaqachon tuzatilgan
- **Build fail** → `requirements.txt` bo'sh bo'lishi kerak ✅ tuzatilgan
