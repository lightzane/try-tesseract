# Try Tesseract

Text recognition on images

```bash
npm install tesseract.js
```

```ts
async function recognize(image: Tesseract.ImageLike) {
  const worker = await createWorker('eng');
  const ret = await worker.recognize(image);
  console.log(ret.data.text);
  await worker.terminate();
  return ret.data.text;
}
```

## References

- https://github.com/naptha/tesseract.js#tesseractjs
- https://tesseract.projectnaptha.com/
