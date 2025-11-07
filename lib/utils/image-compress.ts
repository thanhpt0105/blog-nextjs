/**
 * Image compression utility
 * Compresses images on the client-side before upload
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  mimeType?: string;
}

/**
 * Compress an image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed image as Blob
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Compress image for site icon/favicon
 * Optimized for small icon sizes
 */
export async function compressSiteIcon(file: File): Promise<Blob> {
  return compressImage(file, {
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.9,
    mimeType: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
  });
}

/**
 * Compress image for post cover/featured image
 * Optimized for larger display sizes
 */
export async function compressPostImage(file: File): Promise<Blob> {
  return compressImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    mimeType: 'image/jpeg',
  });
}

/**
 * Compress image for post content
 * Optimized for inline content images
 */
export async function compressContentImage(file: File): Promise<Blob> {
  return compressImage(file, {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    mimeType: 'image/jpeg',
  });
}

/**
 * Get compressed file size info
 */
export function getCompressionInfo(originalSize: number, compressedSize: number) {
  const reduction = ((originalSize - compressedSize) / originalSize) * 100;
  return {
    originalSize: formatFileSize(originalSize),
    compressedSize: formatFileSize(compressedSize),
    reduction: `${reduction.toFixed(1)}%`,
  };
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
