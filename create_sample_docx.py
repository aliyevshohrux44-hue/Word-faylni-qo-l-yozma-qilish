import zipfile
import os

os.makedirs('samples', exist_ok=True)

def create_simple_docx(filename, title, paragraphs):
    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>'''

    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>'''

    p_xml = f'<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>{title}</w:t></w:r></w:p>'
    for p in paragraphs:
        p_xml += f'<w:p><w:r><w:t>{p}</w:t></w:r></w:p>'

    document_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        {p_xml}
    </w:body>
</w:document>'''

    with zipfile.ZipFile(filename, 'w') as docx:
        docx.writestr('[Content_Types].xml', content_types)
        docx.writestr('_rels/.rels', rels)
        docx.writestr('word/document.xml', document_xml)

sample1_paragraphs = [
    "Amir Temur (1336-1405) - buyuk sarkarda va davlat arbobi, markazlashgan davlat asoschisi, ilm-fan va madaniyat homiysi.",
    "U Kesh (hozirgi Shahrisabz) yaqinidagi Xo'ja Ilg'or qishlog'ida tavallud topgan. Yoshligidan harbiy san'at, mantiq va adabiyot ilmlarini puxta egallagan.",
    "Amir Temurning davlatchilik siyosati 'Kuch - adolatdadir' shioriga asoslangan edi. U o'z saltanatida qonun ustuvorligini ta'minladi, savdo-sotiq yo'llarini (Buyuk Ipak yo'li) xavfsiz qildi va mamlakat obodonchiligiga beqiyos hissa qo'shdi.",
    "Samarqand shahrida Go'ri Amir, Bibixonim masjidi, Shohi Zinda kabi betakror me'moriy obidalar bunyod etildi. Bu inshootlar bugungi kunda ham jahon ahlini hayratga solib kelmoqda.",
    "Temur tuzuklari asarida davlatni boshqarish qoidalari, vazirlar va lashkarboshilar vazifalari, adolat mezonlari chuqur yoritilgan. Ushbu asar o'zbek davlatchiligi tarixida bebaho manba hisoblanadi."
]

sample2_paragraphs = [
    "1. Mexanika bo'limining asosiy qonuniyatlari:",
    "Nyutonning birinchi qonuni: Jismga boshqa jismlar ta'sir etmaguncha yoki ularning ta'siri kompensatsiyalanguncha, jism o'zining tinch holatini yoki to'g'ri chiziqli tekis harakatini saqlaydi.",
    "Nyutonning ikkinchi qonuni: Jism olgan tezlanish unga ta'sir etuvchi kuchga to'g'ri mutanosib, massasiga teskari mutanosibdir: F = m * a.",
    "Nyutonning uchinchi qonuni: Ikkita jism bir-biriga miqdor jihatdan teng, yo'nalishi bo'yicha qarama-qarshi kuchlar bilan ta'sir qiladi: F1 = -F2.",
    "2. Energiyaning saqlanish qonuni: Yopiq tizimdagi to'liq mexanik energiya o'zgarmas bo'lib qoladi. Kinetik energiya potensial energiyaga va aksincha aylanishi mumkin, ammo umumiy yig'indi doimiydir."
]

create_simple_docx('samples/Mustaqil_ish_Tarix.docx', "Mavzu: Amir Temurning davlatchilik siyosati", sample1_paragraphs)
create_simple_docx('samples/Fizika_Konspekt.docx', "Fizika fanidan ma'ruza konspekti", sample2_paragraphs)
print("Samples created successfully!")
