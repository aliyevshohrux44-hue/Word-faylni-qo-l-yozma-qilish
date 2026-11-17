/**
 * Exporter - Qo'lyozma sahifalarini PDF, PNG, ZIP va chop etish formati
 * jsPDF va JSZip kutubxonalaridan foydalanadi
 */

class Exporter {
    /**
     * Joriy sahifani yuqori sifatli PNG sifatida yuklab olish
     */
    static downloadPageAsImage(canvas, pageIndex = 1, format = 'png') {
        const link = document.createElement('a');
        const extension = format === 'jpeg' ? 'jpg' : 'png';
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        
        link.download = `qolyozma_sahifa_${pageIndex}.${extension}`;
        link.href = canvas.toDataURL(mimeType, 0.95);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Barcha sahifalarni bitta ko'p sahifali PDF faylga birlashtirish
     * @param {Array} pages - Sahifalar massivi
     * @param {Object} options - Chizish sozlamalari
     * @param {PaperRenderer} paperRenderer
     * @param {HandwritingEngine} handwritingEngine
     * @param {Function} onProgress - Progress bildirishnomasi (0 dan 100 gacha)
     */
    static async exportToPDF(pages, options, paperRenderer, handwritingEngine, onProgress = null) {
        const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || window.jspdf);
        if (!jsPDFClass) {
            throw new Error("jsPDF kutubxonasi topilmadi.");
        }

        // A4 o'lchamli portret PDF (210 x 297 mm)
        const pdf = new jsPDFClass('portrait', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Vaqtinchalik yuqori aniqlikdagi canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = options.canvasWidth || 1400;
        tempCanvas.height = options.canvasHeight || 1980;
        const tempCtx = tempCanvas.getContext('2d');

        const totalPages = pages.length;

        for (let i = 0; i < totalPages; i++) {
            if (onProgress) {
                onProgress(Math.round(((i + 1) / totalPages) * 100), `Sahifa ${i + 1} tayyorlanmoqda...`);
            }

            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

            // 1. Varoq fonini chizish
            paperRenderer.render(tempCanvas, tempCtx, options, i + 1, totalPages);

            // 2. Qo'lyozma matnni chizish
            handwritingEngine.renderPage(tempCanvas, tempCtx, pages[i], options, i + 1);

            // JPEG formati orqali PDF hajmini ixcham va sifatli saqlash
            const imgData = tempCanvas.toDataURL('image/jpeg', 0.92);

            if (i > 0) {
                pdf.addPage('a4', 'portrait');
            }

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

            // Brauzer keshini yengillatish uchun kichik pauza
            await new Promise(r => setTimeout(r, 20));
        }

        const fileName = (options.documentTitle || 'qolyozma_hujjat')
            .replace(/[^a-zA-Z0-9_\-\u0400-\u04FF]/g, '_')
            .substring(0, 30);

        pdf.save(`${fileName}.pdf`);
    }

    /**
     * Barcha sahifalarni ZIP arxiv qilib yuklab olish
     */
    static async exportToZip(pages, options, paperRenderer, handwritingEngine, onProgress = null) {
        if (typeof JSZip === 'undefined') {
            throw new Error("JSZip kutubxonasi topilmadi.");
        }

        const zip = new JSZip();
        const totalPages = pages.length;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = options.canvasWidth || 1400;
        tempCanvas.height = options.canvasHeight || 1980;
        const tempCtx = tempCanvas.getContext('2d');

        for (let i = 0; i < totalPages; i++) {
            if (onProgress) {
                onProgress(Math.round(((i + 1) / totalPages) * 100), `Sahifa ${i + 1} arxivlanmoqda...`);
            }

            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            paperRenderer.render(tempCanvas, tempCtx, options, i + 1, totalPages);
            handwritingEngine.renderPage(tempCanvas, tempCtx, pages[i], options, i + 1);

            const dataUrl = tempCanvas.toDataURL('image/png');
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

            const padNum = String(i + 1).padStart(2, '0');
            zip.file(`sahifa_${padNum}.png`, base64Data, { base64: true });

            await new Promise(r => setTimeout(r, 20));
        }

        if (onProgress) {
            onProgress(100, "ZIP arxiv hosil qilinmoqda...");
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'qolyozma_barcha_sahifalar.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    /**
     * Brauzer orqali to'g'ridan-to'g'ri chop etish oynasini ochish
     */
    static async printPages(pages, options, paperRenderer, handwritingEngine) {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert("Chop etish oynasini ochish bloklandi. Iltimos brauzer ruxsatini bering.");
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Chop etish - Qo'lyozma</title>
                <style>
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background: #fff;
                    }
                    .page-container {
                        width: 100vw;
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        page-break-after: always;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                </style>
            </head>
            <body>
                <p id="loading" style="text-align:center; font-family:sans-serif; margin-top:50px;">
                    Sahifalar chop etishga tayyorlanmoqda, iltimos kuting...
                </p>
                <div id="content"></div>
            </body>
            </html>
        `);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 1400;
        tempCanvas.height = 1980;
        const tempCtx = tempCanvas.getContext('2d');
        const contentDiv = printWindow.document.getElementById('content');

        for (let i = 0; i < pages.length; i++) {
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            paperRenderer.render(tempCanvas, tempCtx, options, i + 1, pages.length);
            handwritingEngine.renderPage(tempCanvas, tempCtx, pages[i], options, i + 1);

            const img = printWindow.document.createElement('img');
            img.src = tempCanvas.toDataURL('image/jpeg', 0.95);

            const wrap = printWindow.document.createElement('div');
            wrap.className = 'page-container';
            wrap.appendChild(img);
            contentDiv.appendChild(wrap);
        }

        const loadingP = printWindow.document.getElementById('loading');
        if (loadingP) loadingP.remove();

        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
}

// Global eksport
window.Exporter = Exporter;
