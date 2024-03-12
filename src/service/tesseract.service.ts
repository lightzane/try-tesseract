import Tesseract, { createWorker } from 'tesseract.js';

export class TesseractService {
  async recognize(image: Tesseract.ImageLike) {
    const worker = await createWorker('eng');
    const ret = await worker.recognize(image);
    // console.log(ret.data.text);
    await worker.terminate();
    return ret.data.text;
  }
}
