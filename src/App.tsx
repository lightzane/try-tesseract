import { Container } from './components/ui';
import logo from './assets/react.svg';
import UploadComponent from './components/upload.component';
import { useEffect, useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<Image>();

  function handleTextRecognition(text: string, image: Image) {
    setText(text);
    setImage(image);
  }

  useEffect(() => {
    if (loading) {
      setText('');
      setImage(undefined);
    }
  }, [loading]);

  return (
    <div className='h-full'>
      <header className='py-3 border-b-[1px] border-b-dracula-purple'>
        <Container>
          <div className='flex items-center justify-between'>
            <img className='w-7 h-7 animate-spin-slow' src={logo} />
          </div>
        </Container>
      </header>
      <main>
        <Container>
          <UploadComponent
            onTextRecognition={handleTextRecognition}
            loading={(l) => setLoading(l)}
          />

          {loading && (
            <div className='text-lg mt-10 animate-pulse'>Loading...</div>
          )}

          {text && !loading && (
            <pre className='text-lg mt-10 text-dracula-light leading-6 ... opacity-0 animate-enter'>
              {text}
            </pre>
          )}

          {image && (
            <img
              className='mt-10 rounded-lg pb-20 ... opacity-0 animate-enter'
              src={image.src}
              title={image.title}
            />
          )}
        </Container>
      </main>
    </div>
  );
}
