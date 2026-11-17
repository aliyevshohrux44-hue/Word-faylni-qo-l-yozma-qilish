/**
 * App.js - Asosiy boshqaruvchi (Main Controller)
 * Foydalanuvchi interfeysi, hodisalar, jonli ko'rish (Live preview), eksport
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ilg'or namunaviy matnlar
    const sampleTexts = {
        tarix: `Mavzu: Amir Temurning davlatchilik siyosati va merosi

Amir Temur (1336-1405) - o'rta asrlarning buyuk davlat arbobi, sarkardasi va markazlashgan qudratli davlat asoschisidir. U Kesh (hozirgi Shahrisabz) yaqinidagi Xo'ja Ilg'or qishlog'ida dunyoga kelgan.

Sohibqiron davlatchiligining asosiy poydevori qat'iy intizom va qonun ustuvorligiga asoslangan bo'lib, uning mashhur shiori "Kuch - adolatdadir" tamoyili edi. 

Davlat boshqaruvida quyidagi muhim islohotlar amalga oshirildi:
1. Mamlakat hududida qaroqchilik va bosqinchilikka chek qo'yilib, xalqaro savdo yo'llari (Buyuk Ipak yo'li) xavfsizligi to'liq ta'minlandi.
2. Shaharlar obodonlashtirildi, Samarqand dunyoning eng go'zal va ilm-fan markazlaridan biriga aylantirildi.
3. Mashhur "Temur tuzuklari" asari yaratilib, unda davlatni boshqarish mezonlari, harbiy san'at va adolat qoidalari mukammal bayon etildi.

Bugungi kunda Amir Temur merosi milliy g'ururimiz va o'zbek davlatchiligi tarixining ajralmas oltin sahifasidir.`,

        fizika: `Fizika fanidan ma'ruza konspekti: Mexanika va dinamika asoslari

1. Nyuton qonunlari va ularning amaliy mohiyati:
- Nyutonning birinchi qonuni: Jismga tashqi kuch ta'sir etmasa, u o'zining tinch holatini yoki to'g'ri chiziqli tekis harakatini doimiy saqlaydi (inersiya qonuni).
- Nyutonning ikkinchi qonuni: Jism olgan tezlanish unga ta'sir qiluvchi kuchga to'g'ri mutanosib, massasiga teskari mutanosibdir: a = F / m yoki F = m * a.
- Nyutonning uchinchi qonuni: Ikki jism bir-biriga har doim modul jihatdan teng, yo'nalish bo'yicha qarama-qarshi kuchlar bilan ta'sir ko'rsatadi: F1 = -F2.

2. Butunjahon tortishish qonuni:
Ixtiyoriy ikki moddiy nuqta bir-birini ularning massalari ko'paytmasiga to'g'ri mutanosib va ular orasidagi masofaning kvadratiga teskari mutanosib kuch bilan tortadi.
Formula: F = G * (m1 * m2) / r^2

Ushbu qonuniyatlar osmon jismlari harakatini hamda yer yuzidagi har qanday mexanik jarayonni aniq hisoblash imkonini beradi.`,

        adabiyot: `Alisher Navoiy g'azalidan namuna:

Qaro ko'zum, kel-u mardumlig' emdi fan qilg'il,
Kuzum qorasida mardum kibi vatan qilg'il.

Yuzung guliga ko'ngul ravzasin yaso gulzor,
Qading niholig'a jon rishtasin rasan qilg'il.

Davo topilmas ekan ishq dardi bedavog'a,
Meni bu dard ila o'ltur, o'zing kahan qilg'il.

Faqir zotinga Navoiy erur gadosifat,
Kerak bu yo'lda o'zingni aningcha tan qilg'il.`
    };

    // Ilova holati (State)
    const state = {
        fullText: sampleTexts.tarix,
        documentTitle: 'Amir Temur davlatchiligi',
        dateText: '17.11.2026',
        topicText: "Mustaqil ish: Amir Temur davlatchiligi",
        currentPageIndex: 0,
        pages: [],
        zoom: 1.0,
        options: {
            canvasWidth: 1400,
            canvasHeight: 1980,
            paperType: 'lined',       // 'lined', 'grid', 'college', 'plain', 'yellow', 'vintage'
            lineHeight: 44,
            marginTop: 160,
            marginBottom: 120,
            marginLeft: 190,
            marginRight: 100,
            redMarginX: 170,
            showRedMargin: 'left',    // 'left', 'right', 'none'
            fontFamily: 'Caveat',
            fontSize: 32,
            inkColor: '#1a3c7b',      // Klassik moviy ruchka
            penThickness: 1.1,
            jitter: 35,               // Inson tebranishi
            paragraphIndent: 40,
            pageSlant: 0,             // Sahifa qiyaligi
            inkBleed: true,           // Siyoh singishi
            inkSmudges: false,        // Siyoh dog'lari
            simulateMistakes: false,  // Xatoliklar
            crumpledEffect: false,    // G'ijimlanish
            crumpleIntensity: 0.3,
            lightingEffect: 'desk_photo', // 'desk_photo', 'flat', 'scanner'
            showSpirals: false,
            spiralType: 'holes',      // 'holes', 'spiral'
            showPageNumber: true,
            pageNumberPosition: 'bottom-right',
            showHeader: true,
            dateText: '17.11.2026',
            topicText: '',
            showFaintGuides: false,
            showVintageLines: true
        }
    };

    // Dvigatellar
    const paperRenderer = new PaperRenderer();
    const handwritingEngine = new HandwritingEngine();

    // DOM Elementlari
    const mainCanvas = document.getElementById('mainCanvas');
    const mainCtx = mainCanvas.getContext('2d');
    const textEditor = document.getElementById('textEditor');
    const docxFileInput = document.getElementById('docxFileInput');
    const dropZone = document.getElementById('dropZone');

    // Sahifa navigatsiyasi elementlari
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const currentPageLabel = document.getElementById('currentPageLabel');
    const totalPagesLabel = document.getElementById('totalPagesLabel');
    const thumbnailList = document.getElementById('thumbnailList');

    // Statistika elementlari
    const wordCountSpan = document.getElementById('wordCountSpan');
    const charCountSpan = document.getElementById('charCountSpan');
    const pageCountSpan = document.getElementById('pageCountSpan');

    // Masshtab elementlari
    const zoomLevelSpan = document.getElementById('zoomLevelSpan');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomFitBtn = document.getElementById('zoomFitBtn');
    const canvasWrapper = document.getElementById('canvasWrapper');

    // Progress Modal elementlari
    const progressModal = document.getElementById('progressModal');
    const progressBar = document.getElementById('progressBar');
    const progressStatusText = document.getElementById('progressStatusText');

    /**
     * Matnni qayta hisoblash va sahifalash
     */
    function updatePagination() {
        state.options.dateText = state.dateText;
        state.options.topicText = state.topicText;
        state.options.documentTitle = state.documentTitle;

        state.pages = handwritingEngine.paginate(state.fullText, state.options);

        // Agar joriy sahifa chegaradan chiqib ketsa
        if (state.currentPageIndex >= state.pages.length) {
            state.currentPageIndex = Math.max(0, state.pages.length - 1);
        }

        updateStats();
        updateNavControls();
        renderCurrentPage();
        renderThumbnails();
    }

    /**
     * Statistika ma'lumotlarini yangilash
     */
    function updateStats() {
        const stats = DocxParser.countStats(state.fullText);
        if (wordCountSpan) wordCountSpan.textContent = stats.wordCount;
        if (charCountSpan) charCountSpan.textContent = stats.charCount;
        if (pageCountSpan) pageCountSpan.textContent = state.pages.length;
    }

    /**
     * Sahifa tugmalari holatini yangilash
     */
    function updateNavControls() {
        const total = state.pages.length || 1;
        const current = state.currentPageIndex + 1;

        if (currentPageLabel) currentPageLabel.textContent = current;
        if (totalPagesLabel) totalPagesLabel.textContent = total;

        if (prevPageBtn) prevPageBtn.disabled = state.currentPageIndex <= 0;
        if (nextPageBtn) nextPageBtn.disabled = state.currentPageIndex >= total - 1;
    }

    /**
     * Joriy sahifani asosiy canvasga chizish
     */
    function renderCurrentPage() {
        mainCanvas.width = state.options.canvasWidth;
        mainCanvas.height = state.options.canvasHeight;

        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        const pageNum = state.currentPageIndex + 1;
        const totalPages = state.pages.length || 1;

        // 1. Qog'oz varog'ini chizish
        paperRenderer.render(mainCanvas, mainCtx, state.options, pageNum, totalPages);

        // 2. Qo'lyozma matnni chizish
        if (state.pages.length > 0 && state.pages[state.currentPageIndex]) {
            handwritingEngine.renderPage(
                mainCanvas,
                mainCtx,
                state.pages[state.currentPageIndex],
                state.options,
                pageNum
            );
        }
    }

    /**
     * Sahifa miniaturalarini (Thumbnails) chizish
     */
    function renderThumbnails() {
        if (!thumbnailList) return;
        thumbnailList.innerHTML = '';

        const thumbWidth = 90;
        const thumbHeight = 127;

        state.pages.forEach((pageLines, idx) => {
            const item = document.createElement('div');
            item.className = `thumbnail-item ${idx === state.currentPageIndex ? 'active' : ''}`;
            item.title = `${idx + 1}-sahifa`;

            const thumbCanvas = document.createElement('canvas');
            thumbCanvas.width = thumbWidth;
            thumbCanvas.height = thumbHeight;
            const tCtx = thumbCanvas.getContext('2d');

            // Kichik masshtabda chizish
            tCtx.scale(thumbWidth / state.options.canvasWidth, thumbHeight / state.options.canvasHeight);
            paperRenderer.render(thumbCanvas, tCtx, state.options, idx + 1, state.pages.length);
            handwritingEngine.renderPage(thumbCanvas, tCtx, pageLines, state.options, idx + 1);

            const badge = document.createElement('span');
            badge.className = 'thumb-badge';
            badge.textContent = idx + 1;

            item.appendChild(thumbCanvas);
            item.appendChild(badge);

            item.addEventListener('click', () => {
                state.currentPageIndex = idx;
                updateNavControls();
                renderCurrentPage();
                document.querySelectorAll('.thumbnail-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
            });

            thumbnailList.appendChild(item);
        });
    }

    /**
     * Masshtabni sozlash
     */
    function setZoom(val) {
        state.zoom = Math.max(0.3, Math.min(2.5, val));
        if (zoomLevelSpan) zoomLevelSpan.textContent = `${Math.round(state.zoom * 100)}%`;
        mainCanvas.style.transform = `scale(${state.zoom})`;
    }

    function fitToScreen() {
        if (!canvasWrapper) return;
        const availableWidth = canvasWrapper.clientWidth - 40;
        const availableHeight = canvasWrapper.clientHeight - 40;
        const scaleX = availableWidth / state.options.canvasWidth;
        const scaleY = availableHeight / state.options.canvasHeight;
        setZoom(Math.min(scaleX, scaleY, 1.0));
    }

    // ================== HODISALAR (EVENT LISTENERS) ==================

    // 1. Matn kiritish
    if (textEditor) {
        textEditor.value = state.fullText;
        textEditor.addEventListener('input', (e) => {
            state.fullText = e.target.value;
            updatePagination();
        });
    }

    // 2. Namuna matnlarni yuklash tugmalari
    document.querySelectorAll('[data-sample]').forEach(btn => {
        btn.addEventListener('click', () => {
            const sampleKey = btn.getAttribute('data-sample');
            if (sampleTexts[sampleKey]) {
                state.fullText = sampleTexts[sampleKey];
                textEditor.value = state.fullText;
                if (sampleKey === 'tarix') {
                    state.topicText = "Mustaqil ish: Amir Temur davlatchiligi";
                } else if (sampleKey === 'fizika') {
                    state.topicText = "Fizika: Mexanika asoslari";
                } else {
                    state.topicText = "G'azal tahlili";
                }
                const topicInput = document.getElementById('topicTextInput');
                if (topicInput) topicInput.value = state.topicText;
                updatePagination();
            }
        });
    });

    // 3. Fayl yuklash (Word .docx va .txt)
    async function handleFile(file) {
        try {
            showProgress(20, "Fayl o'qilmoqda...");
            const data = await DocxParser.parseFile(file);
            hideProgress();

            state.fullText = data.text;
            if (textEditor) textEditor.value = state.fullText;

            if (data.title) {
                state.topicText = data.title;
                const topicInput = document.getElementById('topicTextInput');
                if (topicInput) topicInput.value = data.title;
            }

            state.documentTitle = file.name.replace(/\.[^/.]+$/, "");
            state.currentPageIndex = 0;
            updatePagination();

            // Bildirishnoma
            alert(`"${file.name}" muvaffaqiyatli yuklandi!\n${data.wordCount} ta so'z aniqlandi.`);
        } catch (err) {
            hideProgress();
            alert("Xatolik: " + err.message);
        }
    }

    if (docxFileInput) {
        docxFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        });
    }

    // Drag and Drop
    if (dropZone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                handleFile(files[0]);
            }
        });
    }

    // 4. Dastxat fonti tanlash — har bir shrift uchun optimal sozlamalar
    const FONT_PRESETS = {
        'Caveat':                { fontSize: 32, lineHeight: 44, penThickness: 1.1, jitter: 35 },
        'Bad Script':            { fontSize: 30, lineHeight: 44, penThickness: 1.0, jitter: 40 },
        'Neucha':                { fontSize: 30, lineHeight: 42, penThickness: 1.1, jitter: 45 },
        'Marck Script':          { fontSize: 32, lineHeight: 46, penThickness: 1.2, jitter: 20 },
        'Pangolin':              { fontSize: 30, lineHeight: 42, penThickness: 1.0, jitter: 25 },
        'Underdog':              { fontSize: 28, lineHeight: 42, penThickness: 1.3, jitter: 55 },
        'Kurale':                { fontSize: 30, lineHeight: 44, penThickness: 1.1, jitter: 20 },
        'Comfortaa':             { fontSize: 28, lineHeight: 42, penThickness: 1.0, jitter: 15 },
        'Marmelad':              { fontSize: 30, lineHeight: 44, penThickness: 1.1, jitter: 50 },
        'Homemade Apple':        { fontSize: 26, lineHeight: 50, penThickness: 0.9, jitter: 30 },
        'Pacifico':              { fontSize: 28, lineHeight: 46, penThickness: 1.3, jitter: 15 },
        'Indie Flower':          { fontSize: 28, lineHeight: 42, penThickness: 1.0, jitter: 40 },
        'Gochi Hand':            { fontSize: 30, lineHeight: 44, penThickness: 1.1, jitter: 35 },
        'Patrick Hand':          { fontSize: 30, lineHeight: 44, penThickness: 1.0, jitter: 25 },
        'Shadows Into Light':    { fontSize: 28, lineHeight: 42, penThickness: 0.9, jitter: 30 },
        'Reenie Beanie':         { fontSize: 32, lineHeight: 44, penThickness: 0.9, jitter: 45 },
        'Just Another Hand':     { fontSize: 32, lineHeight: 44, penThickness: 1.0, jitter: 50 },
        'Covered By Your Grace': { fontSize: 30, lineHeight: 46, penThickness: 1.0, jitter: 35 },
        'Dawning of a New Day':  { fontSize: 28, lineHeight: 46, penThickness: 0.9, jitter: 40 },
        'Nothing You Could Do':  { fontSize: 28, lineHeight: 44, penThickness: 0.9, jitter: 45 },
    };

    const fontSelect = document.getElementById('fontFamilySelect');
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            const fontName = e.target.value;
            state.options.fontFamily = fontName;

            // Shrift uchun optimal sozlamalarni qo'llash
            const preset = FONT_PRESETS[fontName];
            if (preset) {
                state.options.fontSize     = preset.fontSize;
                state.options.lineHeight   = preset.lineHeight;
                state.options.penThickness = preset.penThickness;
                state.options.jitter       = preset.jitter;

                if (fontSizeRange)    { fontSizeRange.value    = preset.fontSize;     fontSizeVal.textContent   = preset.fontSize + 'px'; }
                if (lineHeightRange)  { lineHeightRange.value  = preset.lineHeight;   lineHeightVal.textContent = preset.lineHeight + 'px'; }
                if (penThicknessRange){ penThicknessRange.value= preset.penThickness; penThicknessVal.textContent = preset.penThickness.toFixed(1) + 'x'; }
                if (jitterRange)      { jitterRange.value      = preset.jitter;       jitterVal.textContent     = preset.jitter + '%'; }
            }

            // Font preview badge
            const badge = document.getElementById('fontPreviewBadge');
            if (badge) {
                badge.style.fontFamily = `"${fontName}", cursive, sans-serif`;
                badge.textContent = 'Salom, bu ' + fontName + ' dastxati!';
            }

            updatePagination();
        });
    }

    // 5. Ruchka rangi
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            const color = swatch.getAttribute('data-color');
            state.options.inkColor = color;
            const customPicker = document.getElementById('customColorPicker');
            if (customPicker) customPicker.value = color;
            renderCurrentPage();
            renderThumbnails();
        });
    });

    const customColorPicker = document.getElementById('customColorPicker');
    if (customColorPicker) {
        customColorPicker.addEventListener('input', (e) => {
            state.options.inkColor = e.target.value;
            renderCurrentPage();
            renderThumbnails();
        });
    }

    // 6. Ruchka qalinligi
    const penThicknessRange = document.getElementById('penThicknessRange');
    const penThicknessVal = document.getElementById('penThicknessVal');
    if (penThicknessRange) {
        penThicknessRange.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            state.options.penThickness = val;
            if (penThicknessVal) penThicknessVal.textContent = val.toFixed(1) + 'x';
            renderCurrentPage();
        });
    }

    // 7. Shrift o'lchami
    const fontSizeRange = document.getElementById('fontSizeRange');
    const fontSizeVal = document.getElementById('fontSizeVal');
    if (fontSizeRange) {
        fontSizeRange.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            state.options.fontSize = val;
            if (fontSizeVal) fontSizeVal.textContent = val + 'px';
            updatePagination();
        });
    }

    // 8. Qator oralig'i (Line Height)
    const lineHeightRange = document.getElementById('lineHeightRange');
    const lineHeightVal = document.getElementById('lineHeightVal');
    if (lineHeightRange) {
        lineHeightRange.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            state.options.lineHeight = val;
            if (lineHeightVal) lineHeightVal.textContent = val + 'px';
            updatePagination();
        });
    }

    // 9. Varoq turi tanlash
    document.querySelectorAll('.paper-type-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.paper-type-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const type = card.getAttribute('data-paper');
            state.options.paperType = type;

            if (type === 'yellow') {
                state.options.lineHeight = 44;
                state.options.marginTop = 180;
            } else if (type === 'grid') {
                state.options.lineHeight = 32;
                state.options.fontSize = 26;
                if (fontSizeRange) fontSizeRange.value = 26;
                if (fontSizeVal) fontSizeVal.textContent = '26px';
            } else if (type === 'lined') {
                state.options.lineHeight = 44;
                state.options.fontSize = 32;
                if (fontSizeRange) fontSizeRange.value = 32;
                if (fontSizeVal) fontSizeVal.textContent = '32px';
            }
            if (lineHeightRange) lineHeightRange.value = state.options.lineHeight;
            if (lineHeightVal) lineHeightVal.textContent = state.options.lineHeight + 'px';

            updatePagination();
        });
    });

    // 10. Qizil hoshiya chizig'i
    const redMarginSelect = document.getElementById('redMarginSelect');
    if (redMarginSelect) {
        redMarginSelect.addEventListener('change', (e) => {
            state.options.showRedMargin = e.target.value;
            renderCurrentPage();
            renderThumbnails();
        });
    }

    // 11. Inson tebranishi (Jitter)
    const jitterRange = document.getElementById('jitterRange');
    const jitterVal = document.getElementById('jitterVal');
    if (jitterRange) {
        jitterRange.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            state.options.jitter = val;
            if (jitterVal) jitterVal.textContent = val + '%';
            renderCurrentPage();
        });
    }

    // 12. G'ijimlangan qog'oz effekti
    const crumpleCheck = document.getElementById('crumpleCheck');
    if (crumpleCheck) {
        crumpleCheck.addEventListener('change', (e) => {
            state.options.crumpledEffect = e.target.checked;
            renderCurrentPage();
            renderThumbnails();
        });
    }

    // 13. Yoritish effekti (Stol chirog'i / Kamera)
    const lightingSelect = document.getElementById('lightingSelect');
    if (lightingSelect) {
        lightingSelect.addEventListener('change', (e) => {
            state.options.lightingEffect = e.target.value;
            renderCurrentPage();
            renderThumbnails();
        });
    }

    // 14. Spiral va teshiklar
    const spiralsCheck = document.getElementById('spiralsCheck');
    if (spiralsCheck) {
        spiralsCheck.addEventListener('change', (e) => {
            state.options.showSpirals = e.target.checked;
            renderCurrentPage();
            renderThumbnails();
        });
    }

    // 15. Siyoh dog'lari va xatolar
    const inkSmudgesCheck = document.getElementById('inkSmudgesCheck');
    if (inkSmudgesCheck) {
        inkSmudgesCheck.addEventListener('change', (e) => {
            state.options.inkSmudges = e.target.checked;
            renderCurrentPage();
        });
    }

    const mistakesCheck = document.getElementById('mistakesCheck');
    if (mistakesCheck) {
        mistakesCheck.addEventListener('change', (e) => {
            state.options.simulateMistakes = e.target.checked;
            renderCurrentPage();
        });
    }

    // 16. Sana va Mavzu maydonlari
    const dateTextInput = document.getElementById('dateTextInput');
    if (dateTextInput) {
        dateTextInput.value = state.dateText;
        dateTextInput.addEventListener('input', (e) => {
            state.dateText = e.target.value;
            state.options.dateText = e.target.value;
            renderCurrentPage();
        });
    }

    const topicTextInput = document.getElementById('topicTextInput');
    if (topicTextInput) {
        topicTextInput.value = state.topicText;
        topicTextInput.addEventListener('input', (e) => {
            state.topicText = e.target.value;
            state.options.topicText = e.target.value;
            renderCurrentPage();
        });
    }

    // 17. Sahifa navigatsiyasi tugmalari
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (state.currentPageIndex > 0) {
                state.currentPageIndex--;
                updateNavControls();
                renderCurrentPage();
                highlightActiveThumbnail();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            if (state.currentPageIndex < state.pages.length - 1) {
                state.currentPageIndex++;
                updateNavControls();
                renderCurrentPage();
                highlightActiveThumbnail();
            }
        });
    }

    function highlightActiveThumbnail() {
        document.querySelectorAll('.thumbnail-item').forEach((item, idx) => {
            if (idx === state.currentPageIndex) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 18. Masshtab tugmalari
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(state.zoom + 0.15));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(state.zoom - 0.15));
    if (zoomFitBtn) zoomFitBtn.addEventListener('click', fitToScreen);

    // 19. Tayyor Shablonlar (Presets)
    const presetSelect = document.getElementById('presetSelect');
    if (presetSelect) {
        presetSelect.addEventListener('change', (e) => {
            const p = e.target.value;
            if (p === 'school_lined') {
                state.options.paperType = 'lined';
                state.options.fontFamily = 'Caveat';
                state.options.inkColor = '#1a3c7b';
                state.options.lightingEffect = 'desk_photo';
                state.options.showRedMargin = 'left';
            } else if (p === 'math_grid') {
                state.options.paperType = 'grid';
                state.options.fontFamily = 'Neucha';
                state.options.inkColor = '#102454';
                state.options.lightingEffect = 'desk_photo';
                state.options.showRedMargin = 'left';
            } else if (p === 'student_lecture') {
                state.options.paperType = 'college';
                state.options.fontFamily = 'Bad Script';
                state.options.inkColor = '#1a3c7b';
                state.options.lightingEffect = 'desk_photo';
            } else if (p === 'calligraphy') {
                state.options.paperType = 'plain';
                state.options.fontFamily = 'Marck Script';
                state.options.inkColor = '#222226';
                state.options.lightingEffect = 'flat';
            } else if (p === 'vintage') {
                state.options.paperType = 'vintage';
                state.options.fontFamily = 'Homemade Apple';
                state.options.inkColor = '#505256';
                state.options.lightingEffect = 'desk_photo';
            } else if (p === 'indie') {
                state.options.paperType = 'lined';
                state.options.fontFamily = 'Indie Flower';
                state.options.inkColor = '#1b6b33';
                state.options.lightingEffect = 'desk_photo';
            } else if (p === 'just_hand') {
                state.options.paperType = 'plain';
                state.options.fontFamily = 'Just Another Hand';
                state.options.inkColor = '#222226';
                state.options.lightingEffect = 'desk_photo';
            } else if (p === 'reenie') {
                state.options.paperType = 'yellow';
                state.options.fontFamily = 'Reenie Beanie';
                state.options.inkColor = '#102454';
                state.options.lightingEffect = 'desk_photo';
            }

            // Font preset sozlamalarini qo'llash
            const fp = FONT_PRESETS[state.options.fontFamily];
            if (fp) {
                state.options.fontSize     = fp.fontSize;
                state.options.lineHeight   = fp.lineHeight;
                state.options.penThickness = fp.penThickness;
                state.options.jitter       = fp.jitter;
            }

            syncUIWithState();
            updatePagination();
        });
    }

    function syncUIWithState() {
        if (fontSelect) fontSelect.value = state.options.fontFamily;
        if (lineHeightRange) lineHeightRange.value = state.options.lineHeight;
        if (lineHeightVal) lineHeightVal.textContent = state.options.lineHeight + 'px';
        if (fontSizeRange) fontSizeRange.value = state.options.fontSize;
        if (fontSizeVal) fontSizeVal.textContent = state.options.fontSize + 'px';
        if (jitterRange) jitterRange.value = state.options.jitter;
        if (jitterVal) jitterVal.textContent = state.options.jitter + '%';
        if (lightingSelect) lightingSelect.value = state.options.lightingEffect;
        if (redMarginSelect) redMarginSelect.value = state.options.showRedMargin;

        document.querySelectorAll('.paper-type-card').forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-paper') === state.options.paperType);
        });

        document.querySelectorAll('.color-swatch').forEach(s => {
            s.classList.toggle('active', s.getAttribute('data-color') === state.options.inkColor);
        });
    }

    // 20. Eksport tugmalari
    const exportPngBtn = document.getElementById('exportPngBtn');
    if (exportPngBtn) {
        exportPngBtn.addEventListener('click', () => {
            Exporter.downloadPageAsImage(mainCanvas, state.currentPageIndex + 1, 'png');
        });
    }

    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', async () => {
            try {
                showProgress(5, "PDF yaratilmoqda...");
                await Exporter.exportToPDF(
                    state.pages,
                    state.options,
                    paperRenderer,
                    handwritingEngine,
                    (percent, msg) => showProgress(percent, msg)
                );
                hideProgress();
            } catch (err) {
                hideProgress();
                alert("PDF yaratishda xatolik: " + err.message);
            }
        });
    }

    const exportZipBtn = document.getElementById('exportZipBtn');
    if (exportZipBtn) {
        exportZipBtn.addEventListener('click', async () => {
            try {
                showProgress(5, "Sahifalar arxivlanmoqda...");
                await Exporter.exportToZip(
                    state.pages,
                    state.options,
                    paperRenderer,
                    handwritingEngine,
                    (percent, msg) => showProgress(percent, msg)
                );
                hideProgress();
            } catch (err) {
                hideProgress();
                alert("ZIP arxivlashda xatolik: " + err.message);
            }
        });
    }

    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            Exporter.printPages(state.pages, state.options, paperRenderer, handwritingEngine);
        });
    }

    // Progress ko'rsatish
    function showProgress(percent, text) {
        if (!progressModal) return;
        progressModal.style.display = 'flex';
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressStatusText) progressStatusText.textContent = text;
    }

    function hideProgress() {
        if (!progressModal) return;
        setTimeout(() => {
            progressModal.style.display = 'none';
        }, 400);
    }

    // Dastlabki yuklanish
    updatePagination();
    setTimeout(fitToScreen, 150);
    window.addEventListener('resize', fitToScreen);
});
