import { jsPDF } from 'jspdf';
import { writeFileSync, mkdirSync } from 'node:fs';

const doc = new jsPDF();
doc.setFontSize(18);
doc.text('Ornek Ders Notu - Placeholder', 20, 30);
doc.setFontSize(12);
doc.text('Bu PDF, gercek icerik eklenene kadar yer tutucudur.', 20, 45);
doc.text('hakanmulayim.com', 20, 55);
mkdirSync('public/pdf/notes', { recursive: true });
writeFileSync(
  'public/pdf/notes/limit-kavrami-ap-calculus.pdf',
  Buffer.from(doc.output('arraybuffer'))
);
console.log('PDF_OK');
