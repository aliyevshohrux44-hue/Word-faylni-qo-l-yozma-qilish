/**
 * HandwritingEngine - Matnni haqiqiy qo'lyozmaga aylantirish va sahifalash dvigateli
 * Inson qo'li effektlari: mikro-aylanish, sakrash, siyoh singishi, bosim o'zgarishi
 */

class HandwritingEngine {
    constructor() {
        this.measuringCanvas = document.createElement('canvas');
        this.measuringCtx = this.measuringCanvas.getContext('2d');
    }

    // Pseudorandom generator - bir xil matn uchun bir xil tabiiy natija berish
    seededRandom(seed) {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    /**
     * Matnni sahifalarga va qatorlarga ajratish (Pagination)
     * @param {string} fullText - Barcha matn
     * @param {Object} options - Sozlamalar (font, margins, canvas o'lchamlari va h.k.)
     * @returns {Array} - Har bir sahifa uchun qatorlar massivi
     */
    paginate(fullText, options) {
        const w = options.canvasWidth || 1400;
        const h = options.canvasHeight || 1980;

        const marginTop = options.marginTop || 160;
        const marginBottom = options.marginBottom || 120;
        const marginLeft = options.marginLeft || 190;
        const marginRight = options.marginRight || 100;

        const contentWidth = w - marginLeft - marginRight;
        const contentHeight = h - marginTop - marginBottom;

        const lineStep = options.lineHeight || 44;
        const fontSize = options.fontSize || 32;
        const fontFamily = options.fontFamily || 'Caveat';
        const indentSize = options.paragraphIndent !== undefined ? options.paragraphIndent : 40;

        // O'lchash kontekstini sozlash
        this.measuringCtx.font = `${fontSize}px "${fontFamily}", cursive, sans-serif`;

        const paragraphs = fullText.split(/\r?\n/);
        const pages = [];
        let currentPageLines = [];
        let currentY = marginTop + lineStep * 0.75; // Birinchi qator asosi (baseline)

        for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
            const rawPara = paragraphs[pIdx];

            // Bo'sh qator tashlash
            if (rawPara.trim() === '') {
                currentY += lineStep;
                if (currentY + lineStep > h - marginBottom) {
                    pages.push(currentPageLines);
                    currentPageLines = [];
                    currentY = marginTop + lineStep * 0.75;
                }
                continue;
            }

            const words = rawPara.trim().split(/\s+/);
            if (words.length === 0) continue;

            let currentLineWords = [];
            let isFirstLineOfPara = true;

            for (let wIdx = 0; wIdx < words.length; wIdx++) {
                const word = words[wIdx];
                const testWords = [...currentLineWords, word];
                const indent = isFirstLineOfPara ? indentSize : 0;
                
                // Qator uzunligini hisoblash
                const lineString = testWords.join(' ');
                const measuredWidth = this.measuringCtx.measureText(lineString).width + indent;

                if (measuredWidth <= contentWidth || currentLineWords.length === 0) {
                    currentLineWords.push(word);
                } else {
                    // Qator to'ldi, sahifaga qo'shamiz
                    currentPageLines.push({
                        words: currentLineWords,
                        isFirstLine: isFirstLineOfPara,
                        y: currentY,
                        indent: isFirstLineOfPara ? indentSize : 0
                    });

                    isFirstLineOfPara = false;
                    currentLineWords = [word];
                    currentY += lineStep;

                    // Sahifa to'ldimi?
                    if (currentY + lineStep > h - marginBottom) {
                        pages.push(currentPageLines);
                        currentPageLines = [];
                        currentY = marginTop + lineStep * 0.75;
                    }
                }
            }

            // Paragrafning oxirgi qatorini qo'shish
            if (currentLineWords.length > 0) {
                currentPageLines.push({
                    words: currentLineWords,
                    isFirstLine: isFirstLineOfPara,
                    y: currentY,
                    indent: isFirstLineOfPara ? indentSize : 0
                });

                currentY += lineStep;
                if (currentY + lineStep > h - marginBottom) {
                    pages.push(currentPageLines);
                    currentPageLines = [];
                    currentY = marginTop + lineStep * 0.75;
                }
            }
        }

        if (currentPageLines.length > 0 || pages.length === 0) {
            pages.push(currentPageLines);
        }

        return pages;
    }

    /**
     * Berilgan sahifadagi qatorlarni canvasga qo'lda yozilgandek chizish
     */
    renderPage(canvas, ctx, pageLines, options, pageIndex = 1) {
        if (!pageLines) return;

        const marginLeft = options.marginLeft || 190;
        const fontSize = options.fontSize || 32;
        const fontFamily = options.fontFamily || 'Caveat';
        const inkColor = options.inkColor || '#1a3c7b';
        const penThickness = options.penThickness || 1.1;
        const jitterLevel = (options.jitter !== undefined ? options.jitter : 40) / 100; // 0.0 - 1.0
        const pageSlant = (options.pageSlant || 0) * (Math.PI / 180); // Butun sahifaning qiyaligi

        ctx.save();

        // Butun sahifa biroz qiya burilishi (ixtiyoriy)
        if (pageSlant !== 0) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(pageSlant);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        ctx.font = `${fontSize}px "${fontFamily}", cursive, sans-serif`;
        ctx.fillStyle = inkColor;
        ctx.textBaseline = 'alphabetic';

        // Siyohning qog'oz tolasiga singish effekti (Ink Bleed shadow)
        if (options.inkBleed !== false) {
            ctx.shadowColor = inkColor;
            ctx.shadowBlur = 0.6;
            ctx.shadowOffsetX = 0.15;
            ctx.shadowOffsetY = 0.15;
        }

        let wordSeed = pageIndex * 997;

        for (let lIdx = 0; lIdx < pageLines.length; lIdx++) {
            const line = pageLines[lIdx];
            let startX = marginLeft + (line.indent || 0);
            const lineBaseY = line.y;

            // Qatorning tabiiy egilishi (harakat charchog'i / tabiiy qo'l harakati)
            const lineDrift = (this.seededRandom(wordSeed++) - 0.5) * 2.0 * jitterLevel;

            for (let wIdx = 0; wIdx < line.words.length; wIdx++) {
                const word = line.words[wIdx];
                wordSeed++;

                // So'z parametrlaridagi tabiiy inson tebranishlari
                const rotJitter = (this.seededRandom(wordSeed * 3) - 0.5) * 0.06 * jitterLevel;
                const yJitter = (this.seededRandom(wordSeed * 7) - 0.5) * 2.5 * jitterLevel;
                const pressure = 0.9 + this.seededRandom(wordSeed * 11) * 0.15; // Bosim o'zgarishi
                const spaceExtra = (this.seededRandom(wordSeed * 13) - 0.5) * 4.0 * jitterLevel;

                const wordX = startX;
                const wordY = lineBaseY + lineDrift + yJitter;

                ctx.save();
                ctx.translate(wordX, wordY);
                ctx.rotate(rotJitter);
                ctx.globalAlpha = Math.min(1.0, Math.max(0.85, pressure));

                // Qalinroq ruchka uchun ikki marta mikro-siljish bilan chizish
                if (penThickness > 1.2) {
                    ctx.fillText(word, 0, 0);
                    ctx.fillText(word, 0.3 * (penThickness - 1.0), 0.2 * (penThickness - 1.0));
                } else {
                    ctx.fillText(word, 0, 0);
                }

                ctx.restore();

                // Keyingi so'zga siljish
                const wordWidth = this.measuringCtx.measureText(word).width;
                const spaceWidth = this.measuringCtx.measureText(' ').width + spaceExtra;
                startX += wordWidth + spaceWidth;

                // Ixtiyoriy: xatolik ustidan chizish (crossed-out mistake simulation)
                if (options.simulateMistakes && this.seededRandom(wordSeed * 19) < 0.015) {
                    this.drawCrossedOutWord(ctx, wordX, wordY, wordWidth, inkColor);
                }
            }

            // Ixtiyoriy: mayda siyoh dog'i (ink blotch)
            if (options.inkSmudges && this.seededRandom(wordSeed * 23) < 0.035) {
                const blotchX = marginLeft + this.seededRandom(wordSeed * 29) * (canvas.width - marginLeft - 120);
                const blotchY = lineBaseY + (this.seededRandom(wordSeed * 31) - 0.5) * 20;
                this.drawInkBlotch(ctx, blotchX, blotchY, inkColor);
            }
        }

        ctx.restore();
    }

    // Xato so'z ustidan tezda chizib tashlash effekti
    drawCrossedOutWord(ctx, x, y, width, inkColor) {
        ctx.save();
        ctx.strokeStyle = inkColor;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = 0.85;

        ctx.beginPath();
        ctx.moveTo(x - 2, y - 8);
        ctx.lineTo(x + width + 3, y - 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x + width + 2, y - 6);
        ctx.stroke();

        ctx.restore();
    }

    // Mayda tasodifiy siyoh tomchisi
    drawInkBlotch(ctx, x, y, inkColor) {
        ctx.save();
        ctx.fillStyle = inkColor;
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        const r = 1.2 + Math.random() * 1.5;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Global eksport
window.HandwritingEngine = HandwritingEngine;
