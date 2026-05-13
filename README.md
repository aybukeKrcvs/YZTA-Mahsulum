# 🌾 Mahsulüm — Tarım Kooperatifi Yapay Zeka Asistanı

> **"Tarladan tabağa, akıllı yönetim."**

Polatlı Tarım Kooperatifi gibi küçük ve orta ölçekli tarım işletmeleri için geliştirilmiş, yapay zeka destekli stok ve sipariş yönetim sistemi.

## 🎯 Problem

KOBİ'ler ve kooperatifler günlük operasyonlarını büyük ölçüde manuel yöntemlerle yürütmektedir:
- Bir işletme sahibi günde **2-3 saatini** yalnızca stok sorularını yanıtlamakla geçirir
- Stok tükenmesi fark edildiğinde müşteri zaten kaybedilmiştir
- Kargo gecikmeleri müşteriye ulaşmadan işletmeye ulaşmaz

## 💡 Çözüm

Mahsulüm, bu süreçleri yapay zeka ile otomatikleştirir:

- **Akıllı Stok Takibi** — kritik seviyeye düşen ürünleri tespit eder, tahmini tükenme süresini hesaplar
- **Geçmiş Satış Analizi** — 120 günlük satış verisi üzerinden trend, mevsimsellik ve anomali tespiti
- **Talep Tahmini** — hareketli ortalama + mevsimsel düzeltme ile 7 günlük tahmin
- **AI İçgörüleri** — Gemini ile doğal dilde operasyonel öneriler
- **Tedarikçi Mail Taslağı** — tek tıkla profesyonel sipariş maili üretimi
- **Operasyon Takvimi** — siparişler, teslimatlar ve uyarılar tek ekranda

## 🏗️ Mimari
React Frontend (Vite + Tailwind + Recharts)
│
▼ REST API
FastAPI Backend (Python 3.11)
├── Analytics Service    → satış trendi, top ürünler, heatmap
├── Forecast Service     → hareketli ortalama + mevsimsellik
├── Alerting Service     → kritik stok algoritması
└── AI Layer (Gemini)    → içgörü, açıklama, mail taslağı
│
SQLite (SQLAlchemy ORM)
## 🤖 Yapay Zeka Kullanım Haritası

| Görev | Yöntem | Neden? |
|-------|--------|--------|
| Talep tahmini (sayı) | Hareketli ortalama + lineer trend | LLM sayı tahmininde güvenilmez |
| Tahmin yorumu | Gemini | Kuru rakamı anlaşılır dile çevirir |
| Anomali tespiti | İstatistiksel (z-score) | Deterministik olmalı |
| Dashboard içgörüleri | Gemini | Operasyonel öneri üretimi |
| Tedarikçi mail taslağı | Gemini | Saf metin üretimi, LLM'in en güçlü alanı |
| Kritik stok kararı | Formül (stok / günlük_ort) | Kesin hesap gerekiyor |

## 🛠️ Teknoloji Stack

**Backend:**
- Python 3.11
- FastAPI + Uvicorn
- SQLAlchemy + SQLite
- Google Gemini API (gemini-2.0-flash)

**Frontend:**
- React + Vite + TypeScript
- Tailwind CSS
- Recharts (grafikler)
- FullCalendar (takvim)
- Lucide React (ikonlar)

## 📦 Kurulum

### Gereksinimler
- Python 3.11+
- Node.js 20+
- Gemini API Key (https://aistudio.google.com/app/apikey)

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\python.exe -m pip install -r requirements.txt

# Mac/Linux
source venv/bin/activate
pip install -r requirements.txt
```

`.env` dosyası oluştur:
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./mahsulum.db
APP_NAME=Mahsulüm
DEBUG=True
Seed data yükle:
```bash
venv\Scripts\python.exe scripts/seed_data.py
```

Sunucuyu başlat:
```bash
venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

API: http://localhost:8000
Swagger: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Uygulama: http://localhost:5173

## 📊 Demo Senaryosu

**Polatlı Tarım Kooperatifi** — 20 ürün, 3 tedarikçi, 120 günlük satış geçmişi:

1. **Dashboard** → Gemini'nin sabah brifingini gör: kritik stoklar, satış trendleri
2. **Domates'e tıkla** → 90 günlük satış + 7 günlük tahmin grafiği + AI yorumu
3. **"Tedarikçiye Sipariş Taslağı Oluştur"** → Gemini profesyonel mail yazar
4. **Takvim** → Siparişler, teslimatlar, uyarılar tek ekranda

## 📁 Proje Yapısı
mahsulum/
├── backend/
│   ├── app/
│   │   ├── ai/          # Gemini entegrasyonu, prompt'lar
│   │   ├── models/      # SQLAlchemy modelleri (6 tablo)
│   │   ├── routers/     # FastAPI endpoint'leri (22 endpoint)
│   │   ├── schemas/     # Pydantic şemaları
│   │   └── services/    # İş mantığı (forecast, alerting, analytics)
│   └── scripts/
│       └── seed_data.py # 120 günlük demo verisi
└── frontend/
└── src/
├── api/         # Axios client
├── components/  # Yeniden kullanılabilir bileşenler
└── pages/       # 6 sayfa
## 🎓 Hackathon Bilgileri

**Etkinlik:** YZTA 5. Dönem AI Hackathon  
**Tema:** KOBİ ve kooperatifler için yapay zeka destekli operasyon otomasyonu  
**Kapsam:** Stok yönetimi + Sipariş takibi + Analitik & İçgörü

## 📝 Kaynaklar ve Araçlar

- [FastAPI Dokümantasyonu](https://fastapi.tiangolo.com/)
- [Google Gemini API](https://ai.google.dev/)
- [Recharts](https://recharts.org/)
- [FullCalendar](https://fullcalendar.io/)
- Geliştirme sürecinde Claude AI'dan yardım alındı

## 👥 Ekip

YZTA 5. Dönem — Yapay Zeka Bölümü