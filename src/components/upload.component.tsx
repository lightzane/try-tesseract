import { useEffect, useRef, useState } from 'react';

import { TesseractService } from '../service';
import { transform } from '../utils';

type Props = {
  onTextRecognition: (text: string, upload: Image) => void;
  loading: (loading: boolean) => void;
};

export default function UploadComponent({ onTextRecognition, loading }: Props) {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    loading(isLoading);
  }, [isLoading]);

  const fileUploadRef = useRef<HTMLInputElement>(null);

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

      const decimal = file.size < 1024 ? 2 : 0;

      const newUpload: Image = {
        id: Date.now().toString(),
        title: file.name,
        src: base64Image,
        size: transform(file.size, decimal),
      };

      new TesseractService()
        .recognize(base64Image)
        .then((text) => onTextRecognition(text, newUpload))
        .finally(() => setLoading(false));

      // toast.success('Uploaded successfully');

      fileUploadRef.current.value = ''; // to be able to re-read the same uploaded file name
    };
  }

  return (
    <div className='text-center'>
      {/* <PhotoIcon
        className='mx-auto h-12 w-12 text-gray-300'
        aria-hidden='true'
      /> */}
      <div className='mt-4 flex text-sm leading-6 text-gray-600'>
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
        {/* <p className='pl-1'>or drag and drop</p> */}
      </div>
      {/* <p className='text-xs leading-5 text-gray-600'>
        PNG, JPG, GIF up to 10MB
      </p> */}
    </div>
  );
}
