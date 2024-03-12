import { useEffect, useRef, useState } from 'react';

import { TesseractService } from '../service';
// import { transform } from '../utils';
import Tesseract from 'tesseract.js';

type Props = {
  onTextRecognition: (text: string, image: Pick<Image, 'src'>) => void;
  loading: (loading: boolean) => void;
};

export default function UploadComponent({ onTextRecognition, loading }: Props) {
  const [isLoading, setLoading] = useState(false);

  const fileUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handlePaste = (event: ClipboardEvent) => {
    setLoading(true);

    const items = (
      event.clipboardData || (event as any).originalEvent.clipboardData
    ).items;

    // Loop through all items, looking for images
    for (const item of items) {
      if (item.kind === 'file' && item.type.includes('image')) {
        const blob = item.getAsFile();

        // Convert the blob to a data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!e.target) {
            return;
          }
          const imageDataUrl = e.target.result as string;
          handleTextRecognition(imageDataUrl);
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleClick = () => {
    setLoading(true);
    navigator.clipboard.read().then((clipboardItems) => {
      clipboardItems.forEach((clipboardItem) => {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            clipboardItem.getType(type).then((blob) => {
              // Convert the blob to a data URL
              const reader = new FileReader();
              reader.onload = (event) => {
                const imageDataUrl = event.target!.result as string;
                handleTextRecognition(imageDataUrl);
              };
              reader.readAsDataURL(blob);
            });
            return; // Exit loop after first image found
          }
        }
      });
    });
  };

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setLoading(true);

    const totalMaxAllowedSize = 5 * 1000 * 1024; // -> mb * KB * bytes

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
    ];

    const { currentTarget } = e;
    const { files } = currentTarget;

    if (!files || !fileUploadRef.current) {
      setLoading(false);
      return;
    }

    const file: File = files[0];

    // ! Invalid file type
    if (!allowedTypes.includes(file.type)) {
      // toast.error('Please select a valid image (JPEG, PNG, GIF, SVG)');
      setLoading(false);
      return;
    }

    // ! File exceeds
    if (file.size > totalMaxAllowedSize) {
      // toast.error(
      //   `Image exceeds maximum size of ${StorageUtil.transform(
      //     totalMaxAllowedSize,
      //     0
      //   )}`
      // );

      fileUploadRef.current.value = ''; // to be able to re-read the same uploaded file name
      setLoading(false);
      return;
    }

    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = (fileLoadedEvent) => {
      if (!fileLoadedEvent.target || !fileUploadRef.current) {
        setLoading(false);
        return;
      }

      const base64Image = fileLoadedEvent.target.result as string;

      // const decimal = file.size < 1024 ? 2 : 0;

      // const newUpload: Image = {
      //   id: Date.now().toString(),
      //   title: file.name,
      //   src: base64Image,
      //   size: transform(file.size, decimal),
      // };

      handleTextRecognition(base64Image);

      // toast.success('Uploaded successfully');

      fileUploadRef.current.value = ''; // to be able to re-read the same uploaded file name
    };
  }

  function handleTextRecognition(image: Tesseract.ImageLike) {
    new TesseractService()
      .recognize(image)
      .then((text) => onTextRecognition(text, { src: image as string }))
      .finally(() => setLoading(false));
  }

  return (
    <div className='text-center'>
      {/* <PhotoIcon
        className='mx-auto h-12 w-12 text-gray-300'
        aria-hidden='true'
      /> */}
      <div className='mt-4 flex items-center text-sm leading-6 text-dracula-light'>
        <label
          htmlFor='file-upload'
          className='relative cursor-pointer rounded-lg font-semibold bg-dracula-cyan hover:bg-dracula-cyan/90 text-dracula-darker py-3 px-6 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-dracula-darker focus-within:ring-dracula-cyan'>
          <span>Upload an image</span>
          <input
            ref={fileUploadRef}
            id='file-upload'
            name='file-upload'
            type='file'
            accept='image/*'
            className='sr-only'
            onChange={onFileSelect}
            onClick={(e) => {
              if (isLoading) {
                e.preventDefault();
              }
            }}
          />
        </label>
        <span
          className='pl-3 text-dracula-cyan hover:underline cursor-pointer font-semibold'
          onClick={handleClick}>
          or paste from clipboard
        </span>
        {/* <p className='pl-1'>or drag and drop</p> */}
      </div>
      {/* <p className='text-xs leading-5 text-gray-600'>
        PNG, JPG, GIF up to 10MB
      </p> */}
    </div>
  );
}
