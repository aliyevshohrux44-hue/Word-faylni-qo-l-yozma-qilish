/**
 * PaperRenderer - Varoq va qog'oz turlarini chizish moduli
 * Turli xil daftar varoqlari: Chiziqli, Katakli, Konspekt, Oq A4, Sariq bloknot, Vintage
 */

class PaperRenderer {
    constructor() {
        this.noiseCanvas = null;
        this.createNoiseCanvas();
    }

    // Qog'oz teksturasi uchun mayda tola/shovqin naqshini yaratish
    createNoiseCanvas() {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(size, size);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            const val = Math.floor(240 + Math.random() * 15);
            data[i] = val;     // R
            data[i + 1] = val; // G
            data[i + 2] = val; // B
            data[i + 3] = Math.floor(Math.random() * 20); // A (juda nozik)
        }
        ctx.putImageData(imgData, 0, 0);
        this.noiseCanvas = canvas;
    }

    render(canvas, ctx, options, pageIndex = 1, totalPages = 1) {
        const w = canvas.width;
        const h = canvas.height;

        ctx.save();

        // 1. Asosiy qog'oz foni
        this.drawBasePaper(ctx, w, h, options);

        // 2. Qog'oz turi bo'yicha chiziqlar va kataklar
        switch (options.paperType) {
            case 'lined':
                this.drawLinedNotebook(ctx, w, h, options);
                break;
            case 'grid':
                this.drawGridNotebook(ctx, w, h, options);
                break;
            case 'college':
                this.drawCollegeNotebook(ctx, w, h, options);
                break;
            case 'yellow':
                this.drawYellowPad(ctx, w, h, options);
                break;
            case 'vintage':
                this.drawVintagePaper(ctx, w, h, options);
                break;
            case 'plain':
            default:
                this.drawPlainPaper(ctx, w, h, options);
                break;
        }

        // 3. Spiral / teshiklar (agar yoqilgan bo'lsa)
        if (options.showSpirals) {
            this.drawBinderHolesOrSpirals(ctx, w, h, options.spiralType || 'holes');
        }

        // 4. Yuqori sarlavha va sana (Header)
        if (options.showHeader) {
            this.drawHeader(ctx, w, h, options, pageIndex, totalPages);
        }

        // 5. Sahifa raqami (Footer)
        if (options.showPageNumber) {
            this.drawPageNumber(ctx, w, h, options, pageIndex, totalPages);
        }

        // 6. G'ijimlanish (Crumple) effekti
        if (options.crumpledEffect && options.crumpleIntensity > 0) {
            this.drawCrumpleOverlay(ctx, w, h, options.crumpleIntensity);
        }

        // 7. Yoritish effekti (Stol chirog'i yoki telefon kamerasi soyasi)
        if (options.lightingEffect === 'desk_photo') {
            this.drawDeskPhotoLighting(ctx, w, h);
        } else if (options.lightingEffect === 'scanner') {
            this.drawScannerEffect(ctx, w, h);
        }

        ctx.restore();
    }

    drawBasePaper(ctx, w, h, options) {
        let baseColor = '#fcfbf7'; // Maktab daftari rangi

        if (options.paperType === 'yellow') {
            baseColor = '#fff8db';
        } else if (options.paperType === 'vintage') {
            baseColor = '#f5eedb';
        } else if (options.paperType === 'plain') {
            baseColor = '#fafaf8';
        }

        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);

        // Qog'oz teksturasi (shovqin)
        if (this.noiseCanvas) {
            const pattern = ctx.createPattern(this.noiseCanvas, 'repeat');
            ctx.fillStyle = pattern;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, 0, w, h);
            ctx.globalAlpha = 1.0;
        }

        // Qog'oz chetidagi nozik soya (3D qog'oz effekti)
        const edgeShadow = ctx.createLinearGradient(0, 0, 15, 0);
        edgeShadow.addColorStop(0, 'rgba(0,0,0,0.06)');
        edgeShadow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = edgeShadow;
        ctx.fillRect(0, 0, 15, h);

        const rightShadow = ctx.createLinearGradient(w - 15, 0, w, 0);
        rightShadow.addColorStop(0, 'rgba(0,0,0,0)');
        rightShadow.addColorStop(1, 'rgba(0,0,0,0.05)');
        ctx.fillStyle = rightShadow;
        ctx.fillRect(w - 15, 0, 15, h);
    }

    // O'quvchi daftari - Chiziqli
    drawLinedNotebook(ctx, w, h, options) {
        const top = options.marginTop || 160;
        const bottom = h - (options.marginBottom || 120);
        const lineStep = options.lineHeight || 44;
        const lineColor = options.lineColor || '#adc7e5';
        const redLineX = options.redMarginX || (options.marginLeft - 20) || 160;

        ctx.save();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1.0;

        // Gorizontal chiziqlar
        for (let y = top; y <= bottom; y += lineStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Qizil hoshiya chizig'i
        if (options.showRedMargin !== 'none') {
            const marginPos = options.showRedMargin === 'right' ? (w - redLineX) : redLineX;
            ctx.strokeStyle = '#e65c5c';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(marginPos, 0);
            ctx.lineTo(marginPos, h);
            ctx.stroke();
        }

        ctx.restore();
    }

    // O'quvchi daftari - Katakli (5x5mm)
    drawGridNotebook(ctx, w, h, options) {
        const top = options.marginTop || 140;
        const bottom = h - (options.marginBottom || 100);
        const gridSize = options.gridSize || 32;
        const gridColor = options.lineColor || '#bedbf7';
        const redLineX = options.redMarginX || (options.marginLeft - 15) || 160;

        ctx.save();
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.9;

        // Gorizontal katak chiziqlari
        for (let y = top; y <= bottom; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Vertikal katak chiziqlari
        for (let x = 0; x <= w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.stroke();
        }

        // Qizil hoshiya chizig'i (Daftar chekkasi)
        if (options.showRedMargin !== 'none') {
            const marginPos = options.showRedMargin === 'right' ? (w - redLineX) : redLineX;
            ctx.strokeStyle = '#e65c5c';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(marginPos, 0);
            ctx.lineTo(marginPos, h);
            ctx.stroke();
        }

        ctx.restore();
    }

    // Konspekt daftari (College Ruled)
    drawCollegeNotebook(ctx, w, h, options) {
        const top = options.marginTop || 180;
        const bottom = h - (options.marginBottom || 120);
        const lineStep = options.lineHeight || 38;
        const lineColor = '#b8cde3';
        const redLineX = options.redMarginX || 170;

        ctx.save();

        // Yuqori sarlavha uchun ikki chiziq (Double top line)
        ctx.strokeStyle = '#e07a7a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, top - 12);
        ctx.lineTo(w, top - 12);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, top - 6);
        ctx.lineTo(w, top - 6);
        ctx.stroke();

        // Gorizontal yozuv chiziqlari
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1.0;
        for (let y = top; y <= bottom; y += lineStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Qizil chiziq
        if (options.showRedMargin !== 'none') {
            ctx.strokeStyle = '#e65c5c';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(redLineX, 0);
            ctx.lineTo(redLineX, h);
            ctx.stroke();
        }

        ctx.restore();
    }

    // Sariq bloknot (Legal Yellow Pad)
    drawYellowPad(ctx, w, h, options) {
        const top = options.marginTop || 190;
        const bottom = h - (options.marginBottom || 110);
        const lineStep = options.lineHeight || 42;
        const lineColor = '#9bc5ec';
        const redLineX1 = 150;
        const redLineX2 = 156;

        ctx.save();

        // Yuqori qora/to'q jigarrang teshikli qismi (binding strip)
        const headerGrad = ctx.createLinearGradient(0, 0, 0, 60);
        headerGrad.addColorStop(0, '#5a4632');
        headerGrad.addColorStop(1, '#3d2e20');
        ctx.fillStyle = headerGrad;
        ctx.fillRect(0, 0, w, 55);

        // Perforatsiya (yirtilish chizig'i)
        ctx.strokeStyle = '#c4b28d';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 65);
        ctx.lineTo(w, 65);
        ctx.stroke();
        ctx.setLineDash([]);

        // Moviy chiziqlar
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1.0;
        for (let y = top; y <= bottom; y += lineStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Ikkita qizil vertikal hoshiya
        ctx.strokeStyle = '#e86161';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(redLineX1, 65);
        ctx.lineTo(redLineX1, h);
        ctx.moveTo(redLineX2, 65);
        ctx.lineTo(redLineX2, h);
        ctx.stroke();

        ctx.restore();
    }

    // Vintage / Qadimiy qog'oz
    drawVintagePaper(ctx, w, h, options) {
        const top = options.marginTop || 160;
        const bottom = h - (options.marginBottom || 120);
        const lineStep = options.lineHeight || 44;

        ctx.save();

        // Chetlarining sarg'ayib qorayishi (Vignette)
        const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.75);
        grad.addColorStop(0, 'rgba(245, 238, 219, 0)');
        grad.addColorStop(0.7, 'rgba(196, 168, 127, 0.25)');
        grad.addColorStop(1, 'rgba(148, 115, 75, 0.55)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Dog'lar va eski qog'oz dog'lari
        ctx.fillStyle = 'rgba(160, 120, 70, 0.08)';
        ctx.beginPath();
        ctx.arc(w * 0.2, h * 0.3, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w * 0.82, h * 0.75, 120, 0, Math.PI * 2);
        ctx.fill();

        // Nozik jigarrang chiziqlar (ixtiyoriy)
        if (options.showVintageLines) {
            ctx.strokeStyle = 'rgba(150, 120, 85, 0.35)';
            ctx.lineWidth = 1.0;
            for (let y = top; y <= bottom; y += lineStep) {
                ctx.beginPath();
                ctx.moveTo(options.marginLeft || 120, y);
                ctx.lineTo(w - (options.marginRight || 80), y);
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    // Oq qog'oz (A4)
    drawPlainPaper(ctx, w, h, options) {
        // Agar foydalanuvchi nozik ko'rinmas qator chizg'ichlarini xohlasa
        if (options.showFaintGuides) {
            const top = options.marginTop || 160;
            const bottom = h - (options.marginBottom || 120);
            const lineStep = options.lineHeight || 44;

            ctx.save();
            ctx.strokeStyle = 'rgba(210, 220, 235, 0.45)';
            ctx.setLineDash([2, 5]);
            ctx.lineWidth = 0.8;
            for (let y = top; y <= bottom; y += lineStep) {
                ctx.beginPath();
                ctx.moveTo(options.marginLeft || 120, y);
                ctx.lineTo(w - (options.marginRight || 100), y);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    // Spiral va teshiklar
    drawBinderHolesOrSpirals(ctx, w, h, type) {
        ctx.save();
        const holeX = 55;
        const holeRadius = 16;
        const count = 18;
        const spacing = (h - 160) / (count - 1);

        for (let i = 0; i < count; i++) {
            const holeY = 80 + i * spacing;

            if (type === 'spiral') {
                // Metall halqa / spiral
                ctx.fillStyle = '#444';
                ctx.beginPath();
                ctx.ellipse(holeX, holeY, 20, 6, -0.2, 0, Math.PI * 2);
                ctx.fill();

                // Spiral simi
                ctx.strokeStyle = '#bbb';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(holeX - 10, holeY, 14, -Math.PI / 2, Math.PI / 2);
                ctx.stroke();
            } else {
                // Punch holes (teshiklar va ularning ichki soyasi)
                ctx.fillStyle = '#3a3a3a';
                ctx.beginPath();
                ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
                ctx.fill();

                // Ichki soya
                const innerShadow = ctx.createRadialGradient(holeX - 2, holeY - 2, holeRadius * 0.4, holeX, holeY, holeRadius);
                innerShadow.addColorStop(0, 'rgba(0,0,0,0.85)');
                innerShadow.addColorStop(1, 'rgba(30,30,30,0.4)');
                ctx.fillStyle = innerShadow;
                ctx.beginPath();
                ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
                ctx.fill();

                // Oq halqa cheti
                ctx.strokeStyle = 'rgba(255,255,255,0.7)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(holeX, holeY, holeRadius, Math.PI * 0.5, Math.PI * 1.5);
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    // Sahifa yuqorisidagi sarlavha (Sana, Mavzu)
    drawHeader(ctx, w, h, options, pageIndex, totalPages) {
        ctx.save();
        const font = options.handwritingFont || 'Caveat';
        ctx.font = `24px "${font}", cursive, sans-serif`;
        ctx.fillStyle = options.inkColor || '#1a3c7b';

        const topY = (options.marginTop || 160) - 40;

        if (options.dateText) {
            ctx.textAlign = 'right';
            ctx.fillText(options.dateText, w - (options.marginRight || 100), topY);
        }

        if (options.topicText && pageIndex === 1) {
            ctx.textAlign = 'center';
            ctx.font = `bold 28px "${font}", cursive, sans-serif`;
            ctx.fillText(options.topicText, w / 2, topY - 30);
        }

        ctx.restore();
    }

    // Sahifa raqami
    drawPageNumber(ctx, w, h, options, pageIndex, totalPages) {
        ctx.save();
        const font = options.handwritingFont || 'Caveat';
        ctx.font = `22px "${font}", cursive, sans-serif`;
        ctx.fillStyle = options.inkColor || '#1a3c7b';
        ctx.globalAlpha = 0.85;

        // Sahifa raqami formati (masalan, "1-bet" yoki "1")
        const text = `${pageIndex}`;

        if (options.pageNumberPosition === 'top-right') {
            ctx.textAlign = 'right';
            ctx.fillText(text, w - 80, 70);
        } else {
            // Pastki markazda yoki pastki o'ngda
            ctx.textAlign = 'right';
            ctx.fillText(`- ${text} -`, w - 120, h - 50);
        }

        ctx.restore();
    }

    // G'ijimlangan qog'oz (Crumpled paper) overlay
    drawCrumpleOverlay(ctx, w, h, intensity) {
        ctx.save();
        ctx.globalAlpha = Math.min(0.45, intensity * 0.35);

        // Bir nechta nozik yorug'lik va soya burmalari (polygon creases)
        const creases = [
            [[0, 0], [w * 0.45, h * 0.35], [w * 0.15, h * 0.85], [0, h * 0.6]],
            [[w * 0.35, 0], [w, h * 0.25], [w * 0.65, h * 0.65], [w * 0.45, h * 0.35]],
            [[w * 0.15, h * 0.85], [w * 0.65, h * 0.65], [w * 0.85, h], [w * 0.25, h]],
            [[w * 0.65, h * 0.65], [w, h * 0.25], [w, h], [w * 0.85, h]]
        ];

        creases.forEach((pts, idx) => {
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i][0], pts[i][1]);
            }
            ctx.closePath();

            const isDark = idx % 2 === 0;
            const grad = ctx.createLinearGradient(pts[0][0], pts[0][1], pts[2][0], pts[2][1]);
            if (isDark) {
                grad.addColorStop(0, 'rgba(0,0,0,0.18)');
                grad.addColorStop(0.5, 'rgba(0,0,0,0.02)');
                grad.addColorStop(1, 'rgba(255,255,255,0.15)');
            } else {
                grad.addColorStop(0, 'rgba(255,255,255,0.22)');
                grad.addColorStop(0.5, 'rgba(255,255,255,0.03)');
                grad.addColorStop(1, 'rgba(0,0,0,0.14)');
            }
            ctx.fillStyle = grad;
            ctx.fill();

            // Qatlam chizig'i
            ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        });

        ctx.restore();
    }

    // Stol chirog'i va telefon soyasi effekti (Desk photo lighting)
    drawDeskPhotoLighting(ctx, w, h) {
        ctx.save();
        // Yuqori chapdan tushayotgan iliq stol chirog'i nuri
        const lightGrad = ctx.createRadialGradient(w * 0.2, h * 0.15, 50, w * 0.5, h * 0.5, w * 0.95);
        lightGrad.addColorStop(0, 'rgba(255, 250, 230, 0.18)');
        lightGrad.addColorStop(0.5, 'rgba(255, 245, 220, 0.05)');
        lightGrad.addColorStop(1, 'rgba(30, 25, 20, 0.22)');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, w, h);

        // Pastki o'ng burchakdagi qo'l/telefon soyasi
        const shadowGrad = ctx.createLinearGradient(w, h, w * 0.65, h * 0.65);
        shadowGrad.addColorStop(0, 'rgba(20, 20, 30, 0.25)');
        shadowGrad.addColorStop(1, 'rgba(20, 20, 30, 0)');
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(w * 0.5, h * 0.5, w * 0.5, h * 0.5);

        ctx.restore();
    }

    // Skaner effekti (Toza, yuqori kontrastli skan)
    drawScannerEffect(ctx, w, h) {
        ctx.save();
        // Chetlaridagi nozik skaner nuri qirrasi
        const edgeGlow = ctx.createLinearGradient(0, 0, 0, 10);
        edgeGlow.addColorStop(0, 'rgba(255,255,255,0.4)');
        edgeGlow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = edgeGlow;
        ctx.fillRect(0, 0, w, 10);
        ctx.restore();
    }
}

// Global eksport
window.PaperRenderer = PaperRenderer;
