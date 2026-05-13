const { PDFParse } = require('pdf-parse');
async function test() {
    try {
        const p = new PDFParse(Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF'));
        // The library seems to have a getText method
        console.log('getText type:', typeof p.getText);
        // Let's see if it works
    } catch (e) {
        console.error(e);
    }
}
test();
