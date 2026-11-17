# ✍️ Qo'lyozma Studio (Handwriting Generator)

Word fayllar (.docx) va kompyuterda terilgan matnlarni **haqiqiy qo'lda yozilgan daftar sahifalariga** aylantirib beruvchi qulay va zamonaviy veb-ilova.

---

## 🌟 Asosiy imkoniyatlar va funksiyalar

### 1. 📁 Word fayllarni yuklash va qayta ishlash
- **Word (.docx)** va matnli **(.txt)** fayllarni to'g'ridan-to'g'ri ilovaga sudrab tashlash (Drag & Drop) yoki kompyuterdan tanlash.
- Matnlar, sarlavhalar va paragraflarni avtomatik ajratib oladi.
- Katta matnlarni avtomatik tarzda **1-sahifa, 2-sahifa, 3-sahifa...** qilib daftarning qatorlariga sig'dirib sahifalarga bo'lib beradi (Pagination).
- Jonli so'zlar, belgilar va varoqlar hisoblagichi.

### 2. ✍️ Boy dastxat va ruchka stillari
- **Dastxat turlari (Shriftlar)**:
  - *Erkin talaba dastxati* (Caveat - O'zbek lotin va kirill alifbosi to'liq qo'llab-quvvatlanadi)
  - *Maktab daftari yozuvi* (Bad Script - Kirill va Lotin)
  - *Tezkor konspekt yozuvi* (Neucha - Kirill va Lotin)
  - *Husnixat kaligrafiyasi* (Marck Script - Bog'langan chiroyli husnixat)
  - *Toza bosma qo'lyozma* (Pangolin - O'qilishi oson toza yozuv)
  - *Nozik qiya qalam yozuvi* (Homemade Apple - Erkin qiya yozuv)
  - *Marker / Sarlavha yozuvi* (Patrick Hand)
- **Ruchka siyohi ranglari**:
  - 🔵 Klassik moviy ruchka (#1a3c7b)
  - 🔷 Gel to'q ko'k ruchka (#102454)
  - ⚫ Qora ruchka (#222226)
  - 🔴 Qizil ruchka (#b01e1e)
  - 🟢 Yashil ruchka (#1b6b33)
  - ✏️ Oddiy qalam / grafit (#50535a)
  - 🎨 Ixtiyoriy rang tanlash (Color picker)
- **Ruchka va yozuv parametrlari**:
  - Ruchka uchi qalinligi (0.8x dan 2.0x gacha)
  - Shrift o'lchami (Font size slider)
  - Qatorlar oralig'i (Daftar chiziqlariga mukammal moslash)

### 3. 📄 Qulay va xilma-xil varoq turlari
- 📝 **O'quvchi daftari - Chiziqli** (Klassik maktab daftari, ko'k gorizontal chiziqlar va chap qizil hoshiya)
- ▦ **O'quvchi daftari - Katakli** (5x5mm katakli matematika/fizika daftari)
- 📑 **Konspekt daftari** (College Ruled - 80-96 varoqli umumiy daftar)
- 📄 **Oq qog'oz (A4)** (Toza format, mustaqil ishlar va referatlar uchun)
- 📋 **Sariq bloknot** (Legal Pad - sarg'ish chiziqli qog'oz)
- 📜 **Vintage qog'oz** (Qadimiy pergament va sarg'aygan qog'oz)
- 🔴 **Qizil hoshiya chizig'i**: Chapda, o'ngda yoki hoshiyasiz
- 📎 **Daftar spiral / halqalari**: Bloknot spiralini yoqish/o'chirish

### 4. 🎭 Haqiqiy inson omili va realizm (Human Touch)
- **Inson qo'li noaniqligi (Jitter slider)**: Harflar va so'zlarning tabiiy mikrotebranishi, kichik burchak qiyaligi va qatorning tabiiy siljishi.
- **Ruchka bosimi o'zgarishi**: Yozish jarayonida ruchka siyohi oqimining tabiiy o'zgarishi.
- **Siyohning qog'ozga singishi (Ink bleed)**: Qog'oz tolasiga singuvchi haqiqiy siyoh soyasi.
- **Surat / Stol yoritish effekti**: Stol chirog'i ostida telefon kamerasi orqali suratga olingandek realistik yorug'lik va soya effekti!
- **G'ijimlangan qog'oz effekti**: Ryukzakda yoki papkada biroz buklangan qog'oz burmalari.
- **Tasodifiy xatoliklar simulyatsiyasi**: Talaba xato qilib ustidan chizib qo'yganidek realistik chiziqlar.

### 5. ⚡ Tayyor shablonlar (Presets)
- *O'quvchi konspekti* (Chiziqli daftar + moviy ruchka)
- *Matematika daftari* (Katakli daftar + to'q ko'k ruchka)
- *Talaba ma'ruzasi* (Konspekt daftari + tezkor yozuv)
- *Rasmiy husnixat* (Oq qog'oz + qora kaligrafik dastxat)
- *Vintage qog'oz* (Qadimiy qog'oz + qalam yozuvi)

### 6. 💾 Eksport va yuklab olish
- 📷 **PNG yuklab olish**: Joriy ko'rilayotgan varoqni yuqori tiniqlikda (1400x1980px) rasm sifatida saqlash.
- 📕 **Barchasini PDF qilib olish**: Barcha sahifalarni birlashtirib, tartibli A4 ko'p sahifali PDF hujjat yaratish.
- 📦 **ZIP Arxiv**: Barcha sahifalarni alohida-alohida tartiblangan `.png` rasmlar to'plami qilib yuklab olish.
- 🖨️ **Chop etish (Print)**: To'g'ridan-to'g'ri printerga yuborish.

---

## 🚀 Qanday ishga tushiriladi?

### 1-usul: 1 marta bosish orqali (Eng oson)
Fayllar orasidagi `start.bat` faylini ikki marta bosing. U serverni ishga tushirib, brauzeringizda ilovani avtomatik ochadi.

### 2-usul: Python orqali
Terminal yoki buyruqlar satrida:
```bash
python run.py
```
So'ng brauzerda ochiladi: `http://localhost:8000/index.html`

### 3-usul: To'g'ridan-to'g'ri brauzerda
Istalgan brauzerda (Chrome, Edge, Firefox) `index.html` faylini oching.
Barcha shriftlar va kutubxonalar dastur ichida mahalliy saqlangan, shuning uchun hatto **internet bo'lmaganda ham (offline)** to'liq ishlaydi!

---

## 📂 Papka tuzilishi
```
├── index.html                 # Asosiy veb sahifa (Foydalanuvchi interfeysi)
├── run.py                     # Mahalliy Python serveri va avto-ochuvchi
├── start.bat                  # 1-klik bilan ishga tushiruvchi Windows fayli
├── README.md                  # Qo'llanma
├── create_sample_docx.py      # Sinov uchun namunaviy Word (.docx) yaratuvchi
├── samples/                   # Namunaviy Word hujjatlari
│   ├── Mustaqil_ish_Tarix.docx
│   └── Fizika_Konspekt.docx
└── assets/
    ├── css/
    │   └── style.css          # Zamonaviy vizual ko'rinish va dizayn
    ├── js/
    │   ├── app.js             # Asosiy dastur mantig'i va hodisalar
    │   ├── handwriting-engine.js # Qo'lyozma chizish va sahifalash dvigateli
    │   ├── paper-renderer.js  # Qog'oz va daftar turlarini chizish dvigateli
    │   ├── docx-parser.js     # Word (.docx) fayllarni o'quvchi
    │   └── exporter.js        # PDF, PNG, ZIP va chop etish eksporti
    ├── vendor/                # Mahalliy kutubxonalar (Offline ishlash uchun)
    │   ├── mammoth.min.js
    │   ├── jspdf.umd.min.js
    │   └── jszip.min.js
    └── fonts/                 # Mahalliy yuklangan qo'lyozma shriftlari
```
