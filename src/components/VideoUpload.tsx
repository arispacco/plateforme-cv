import { useRef, useState } from 'react';
import { Video, UploadCloud, X } from 'lucide-react';

const MAX_VIDEO_BYTES = 250 * 1024 * 1024; // 250 MB

interface VideoUploadProps {
  value?: File | Blob | null;
  onChange: (file: File) => void;
  onRemove: () => void;
  onError?: (message: string) => void;
}

export function VideoUpload({ value, onChange, onRemove, onError }: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      const msg = 'File exceeds the 250 MB limit. Please choose a smaller video.';
      setSizeError(msg);
      onError?.(msg);
      return;
    }
    setSizeError(null);
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const hasVideo = !!value;

  return (
    <>
      <div
        className={`video-upload ${dragging ? 'video-upload--dragging' : ''} ${hasVideo ? 'video-upload--has-file' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {hasVideo ? (
          <div className="video-upload-preview">
            <Video size={24} className="video-upload-icon video-upload-icon--success" />
            <span className="video-upload-filename">
              {value instanceof File ? value.name : 'Video pitch uploaded'}
            </span>
            <button
              type="button"
              className="video-upload-remove"
              onClick={onRemove}
              aria-label="Remove video"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud size={36} className="video-upload-icon" />
            <p className="video-upload-title">Upload your Video Pitch (max 250MB)</p>
            <p className="video-upload-subtitle">Drag &amp; drop a video file, or</p>
            <button
              type="button"
              className="btn btn--secondary video-upload-btn"
              onClick={() => inputRef.current?.click()}
            >
              + Select File
            </button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="video-upload-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {sizeError && <p className="video-upload-error">{sizeError}</p>}
    </>
  );
}
