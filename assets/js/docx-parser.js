/**
 * DocxParser - Word (.docx) va matnli fayllardan ma'lumotlarni o'qish moduli
 * Mammoth.js kutubxonasi yordamida brauzerda to'g'ridan-to'g'ri ishlaydi
 */

class DocxParser {
    /**
     * Foydalanuvchi yuklagan faylni o'qish
     * @param {File} file 
     * @returns {Promise<{text: string, title: string, wordCount: number, charCount: number}>}
     */
    static async parseFile(file) {
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.docx')) {
            return await DocxParser.parseDocx(file);
        } else if (fileName.endsWith('.txt')) {
            return await DocxParser.parseTxt(file);
        } else if (fileName.endsWith('.doc')) {
            // Eski formatdagi .doc fayllar uchun ogohlantirish va oddiy matn chiqarishga urinish
            throw new Error("Eski '.doc' formati aniqlandi. Iltimos, faylni Word dasturida ochib, '.docx' yoki '.txt' sifatida saqlab qayta yuklang.");
        } else {
            throw new Error("Faqat .docx yoki .txt formatdagi fayllarni yuklash mumkin.");
        }
    }

    // .docx faylini mammoth.js orqali o'qish
    static async parseDocx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;

                try {
                    if (typeof mammoth === 'undefined') {
                        reject(new Error("Mammoth kutubxonasi yuklanmagan."));
                        return;
                    }

                    // Raw text olish
                    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
                    let text = result.value || '';

                    // Matnni tozalash va formatlash
                    text = DocxParser.cleanText(text);

                    // Sarlavhani aniqlash (birinchi qisqa qatordan)
                    const title = DocxParser.extractTitle(text);
                    const stats = DocxParser.countStats(text);

                    resolve({
                        text: text,
                        title: title,
                        fileName: file.name,
                        wordCount: stats.wordCount,
                        charCount: stats.charCount
                    });
                } catch (err) {
                    reject(new Error("Word faylini o'qishda xatolik yuz berdi: " + err.message));
                }
            };

            reader.onerror = () => {
                reject(new Error("Faylni o'qib bo'lmadi."));
            };

            reader.readAsArrayBuffer(file);
        });
    }

    // .txt faylini to'g'ridan-to'g'ri o'qish
    static async parseTxt(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                let text = e.target.result || '';
                text = DocxParser.cleanText(text);
                const title = DocxParser.extractTitle(text);
                const stats = DocxParser.countStats(text);

                resolve({
                    text: text,
                    title: title,
                    fileName: file.name,
                    wordCount: stats.wordCount,
                    charCount: stats.charCount
                });
            };

            reader.onerror = () => {
                reject(new Error("Matn faylini o'qib bo'lmadi."));
            };

            reader.readAsText(file, 'UTF-8');
        });
    }

    // Matnni tozalash va tartibga keltirish
    static cleanText(rawText) {
        if (!rawText) return '';

        let text = rawText
            // Har xil g'alati bo'shliqlarni almashtirish
            .replace(/\u00A0/g, ' ')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            // Keraksiz ko'p bo'sh qatorlarni qisqartirish (maksimal 2 ta qator)
            .replace(/\n{3,}/g, '\n\n')
            // Har bir qator boshidagi va oxiridagi bo'shliqlarni tozalash
            .split('\n')
            .map(line => line.trim())
            .join('\n');

        return text.trim();
    }

    // Sarlavhani ajratib olish (agar birinchi qator qisqa va sarlavhaga o'xshasa)
    static extractTitle(text) {
        const firstLine = text.split('\n')[0] || '';
        if (firstLine.length > 3 && firstLine.length < 80) {
            return firstLine.replace(/^(mavzu:|reja:)/i, '').trim();
        }
        return '';
    }

    // So'z va belgilar sonini hisoblash
    static countStats(text) {
        if (!text || text.trim() === '') {
            return { wordCount: 0, charCount: 0 };
        }
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        return {
            wordCount: words.length,
            charCount: text.length
        };
    }
}

// Global eksport
window.DocxParser = DocxParser;
