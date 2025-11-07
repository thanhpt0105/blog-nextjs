# Image Upload Strategy Proposal

## Current State

### Database Schema
```prisma
User {
  image: String?  // Profile picture (currently used for OAuth)
}

Post {
  coverImage: String?  // Featured/cover image URL
  content: String  // HTML content (can contain inline images)
}
```

### Current Limitations
- ❌ No image upload functionality
- ❌ TipTap editor only accepts image URLs (manual entry)
- ❌ No file storage solution
- ❌ Cover images require manual URL input
- ❌ Profile pictures only work with OAuth providers

---

## Proposed Solutions

### Option 1: Cloud Storage (Recommended) ⭐

**Best for: Production, Scalability, Performance**

#### Services to Consider:

##### 1. **Cloudinary** (Easiest, Most Feature-Rich)
- ✅ Free tier: 25 GB storage, 25 GB bandwidth/month
- ✅ Automatic image optimization & transformations
- ✅ CDN delivery
- ✅ Direct upload from browser
- ✅ Next.js integration available
- ✅ AI-powered features (auto-crop, background removal)

**Implementation:**
```bash
npm install cloudinary next-cloudinary
```

**Cost:** Free → $89/month (Standard)

##### 2. **Vercel Blob Storage** (Best for Vercel Deployment)
- ✅ Seamless Vercel integration
- ✅ Free tier: 500MB storage
- ✅ Edge CDN delivery
- ✅ Simple API

**Implementation:**
```bash
npm install @vercel/blob
```

**Cost:** Free → $0.15/GB stored + $0.10/GB served

##### 3. **AWS S3 + CloudFront** (Enterprise Grade)
- ✅ Industry standard
- ✅ Highly scalable
- ✅ Pay-as-you-go pricing
- ⚠️ More complex setup

**Implementation:**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Cost:** ~$0.023/GB stored + $0.085/GB transferred

##### 4. **UploadThing** (Developer-Friendly)
- ✅ Built for Next.js
- ✅ Free tier: 2GB storage, 2GB bandwidth
- ✅ Simple API
- ✅ Type-safe

**Implementation:**
```bash
npm install uploadthing @uploadthing/react
```

**Cost:** Free → $10/month (Pro)

---

### Option 2: Self-Hosted Storage

**Best for: Full control, Privacy, Cost predictability**

#### Approaches:

##### 1. **Local File System** (Development Only)
```
public/
  uploads/
    users/
      {userId}/
        profile.jpg
    posts/
      {postId}/
        cover.jpg
        content/
          image1.jpg
```

⚠️ **Issues:**
- Not suitable for production
- Lost on redeployment (Vercel, Netlify)
- No automatic optimization
- No CDN

##### 2. **Separate Storage Server**
- Dedicated server for file storage
- Use MinIO (S3-compatible)
- Serve via Nginx + CDN

**Implementation:**
```bash
# Docker Compose
minio:
  image: minio/minio
  ports:
    - "9000:9000"
  environment:
    MINIO_ROOT_USER: admin
    MINIO_ROOT_PASSWORD: password
```

---

## Recommended Architecture

### Cloudinary Solution (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│                    Image Upload Flow                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Browser    │       │  Next.js API │       │  Cloudinary  │
│              │       │              │       │              │
│  1. Select   │──────▶│  2. Generate │──────▶│              │
│     Image    │       │     Signed   │       │              │
│              │       │     Upload   │       │              │
│              │       │     URL      │       │              │
│              │◀──────│              │       │              │
│              │       │              │       │              │
│  3. Upload   │───────────────────────────▶│  4. Process  │
│     Direct   │                            │     & Store  │
│              │◀───────────────────────────│              │
│              │    5. Return Public URL    │              │
│              │                            │              │
│  6. Save URL │──────▶│  7. Save to  │       │              │
│     to DB    │       │     Database │       │              │
└──────────────┘       └──────────────┘       └──────────────┘
```

### Implementation Plan

#### Phase 1: Setup Cloudinary

1. **Create Account & Get Credentials**
```env
# .env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2. **Create Upload API Route**
```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/lib/auth-server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const type = formData.get('type') as string; // 'profile' | 'cover' | 'content'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `blog/${type}/${session.user.id}`,
          resource_type: 'auto',
          transformation: type === 'profile' 
            ? [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
            : type === 'cover'
            ? [{ width: 1200, height: 630, crop: 'fill' }]
            : [{ width: 1200, quality: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

#### Phase 2: Image Upload Component

```typescript
// components/ImageUpload.tsx
'use client';

import { useState } from 'react';
import { Box, Button, CircularProgress, Avatar } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface ImageUploadProps {
  type: 'profile' | 'cover' | 'content';
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  variant?: 'avatar' | 'cover' | 'button';
}

export default function ImageUpload({
  type,
  currentUrl,
  onUploadComplete,
  variant = 'button',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File too large. Max size is 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
      return;
    }

    setUploading(true);

    try {
      // Preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUploadComplete(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (variant === 'avatar') {
    return (
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Avatar
          src={preview}
          sx={{ width: 100, height: 100, cursor: 'pointer' }}
          onClick={() => document.getElementById('avatar-upload')?.click()}
        />
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    );
  }

  if (variant === 'cover') {
    return (
      <Box>
        {preview && (
          <Box
            component="img"
            src={preview}
            sx={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              borderRadius: 2,
              mb: 2,
            }}
          />
        )}
        <Button
          variant="outlined"
          component="label"
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
          disabled={uploading}
          fullWidth
        >
          {uploading ? 'Uploading...' : 'Upload Cover Image'}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>
      </Box>
    );
  }

  return (
    <Button
      variant="outlined"
      component="label"
      startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
      disabled={uploading}
    >
      {uploading ? 'Uploading...' : 'Upload Image'}
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </Button>
  );
}
```

#### Phase 3: Enhanced TipTap Editor with Paste & Upload

```typescript
// components/TiptapEditor.tsx - Enhanced version
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useState } from 'react';

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [uploading, setUploading] = useState(false);

  // Upload function
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'content');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: false, // Disable base64 to force uploads
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
      // Handle paste
      handlePaste(view, event, slice) {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => item.type.indexOf('image') === 0);

        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) {
            handleImageUpload(file);
          }
          return true;
        }
        return false;
      },
      // Handle drop
      handleDrop(view, event, slice, moved) {
        const files = Array.from(event.dataTransfer?.files || []);
        const imageFile = files.find((file) => file.type.indexOf('image') === 0);

        if (imageFile) {
          event.preventDefault();
          handleImageUpload(imageFile);
          return true;
        }
        return false;
      },
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!editor) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const addImageFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleImageUpload(file);
      }
    };
    input.click();
  };

  // ... rest of the component with updated image button
  // Replace the existing image dialog with direct file upload
}
```

#### Phase 4: Update Post Edit Pages

```typescript
// app/admin/posts/[id]/edit/page.tsx
import ImageUpload from '@/components/ImageUpload';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [coverImage, setCoverImage] = useState(post.coverImage || '');

  return (
    <Box>
      {/* Cover Image Upload */}
      <ImageUpload
        type="cover"
        currentUrl={coverImage}
        onUploadComplete={(url) => setCoverImage(url)}
        variant="cover"
      />

      {/* Content Editor with paste support */}
      <TiptapEditor
        content={content}
        onChange={setContent}
      />
    </Box>
  );
}
```

#### Phase 5: User Profile Picture

```typescript
// app/admin/profile/page.tsx
import ImageUpload from '@/components/ImageUpload';

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState(user.image || '');

  const handleSave = async () => {
    await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: profileImage }),
    });
  };

  return (
    <Box>
      <ImageUpload
        type="profile"
        currentUrl={profileImage}
        onUploadComplete={(url) => setProfileImage(url)}
        variant="avatar"
      />
    </Box>
  );
}
```

---

## Feature Comparison

| Feature | Cloudinary | Vercel Blob | AWS S3 | Local Storage |
|---------|-----------|-------------|--------|---------------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Image Optimization** | ✅ Auto | ❌ Manual | ❌ Manual | ❌ Manual |
| **CDN** | ✅ Built-in | ✅ Edge | ⚠️ Extra $ | ❌ None |
| **Transformations** | ✅ On-the-fly | ❌ | ❌ | ❌ |
| **Free Tier** | 25GB/month | 500MB | 5GB/year | Unlimited |
| **Next.js Integration** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Production Ready** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Cost (100GB/month)** | ~$89 | ~$15 | ~$10 | N/A |

---

## Security Considerations

### 1. File Validation
```typescript
// Validate file size
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Validate file type
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Validate dimensions (optional)
const validateImage = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isValid = img.width <= 4000 && img.height <= 4000;
      resolve(isValid);
    };
    img.src = URL.createObjectURL(file);
  });
};
```

### 2. Rate Limiting
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 uploads per hour
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const { success } = await ratelimit.limit(session.user.id);
  
  if (!success) {
    return NextResponse.json({ error: 'Too many uploads' }, { status: 429 });
  }
  // ... upload logic
}
```

### 3. Virus Scanning (Production)
- Cloudinary has built-in malware detection
- For S3: Use AWS Lambda + ClamAV
- For other services: Integrate with VirusTotal API

---

## Migration Path

### For Existing Posts with External Images
```typescript
// scripts/migrate-images.ts
// Optional: Download and reupload existing external images

async function migratePostImages(postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return;

  const content = post.content;
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  let updatedContent = content;

  while ((match = imgRegex.exec(content)) !== null) {
    const oldUrl = match[1];
    
    // Skip if already on Cloudinary
    if (oldUrl.includes('cloudinary.com')) continue;

    try {
      // Download image
      const response = await fetch(oldUrl);
      const blob = await response.blob();
      
      // Upload to Cloudinary
      const newUrl = await uploadToCloudinary(blob);
      
      // Replace in content
      updatedContent = updatedContent.replace(oldUrl, newUrl);
    } catch (error) {
      console.error(`Failed to migrate image: ${oldUrl}`, error);
    }
  }

  // Update post
  await prisma.post.update({
    where: { id: postId },
    data: { content: updatedContent },
  });
}
```

---

## Recommended Implementation Order

### Week 1: Foundation
1. ✅ Choose cloud provider (Cloudinary recommended)
2. ✅ Set up account and get credentials
3. ✅ Create `/api/upload` route
4. ✅ Test with Postman/cURL

### Week 2: Core Features
1. ✅ Create ImageUpload component
2. ✅ Add cover image upload to post editor
3. ✅ Test file validation and error handling

### Week 3: Advanced Features
1. ✅ Enhance TipTap with paste support
2. ✅ Add drag & drop support
3. ✅ Implement progress indicators

### Week 4: User Features
1. ✅ Add profile picture upload
2. ✅ Create user profile edit page
3. ✅ Update navbar to show profile pictures

### Week 5: Polish & Deploy
1. ✅ Add rate limiting
2. ✅ Optimize image sizes
3. ✅ Add loading states
4. ✅ Write tests
5. ✅ Deploy to production

---

## Cost Estimation (Monthly)

### Small Blog (< 1000 posts, < 100 users)
- **Cloudinary Free**: $0 (25GB bandwidth)
- **Vercel Blob**: $0 (500MB storage)
- **AWS S3**: ~$2 (2GB storage + 10GB transfer)

### Medium Blog (5000 posts, 1000 users)
- **Cloudinary Standard**: $89/month
- **Vercel Blob**: ~$50/month
- **AWS S3**: ~$15/month

### Large Blog (50000 posts, 10000 users)
- **Cloudinary Advanced**: $249/month
- **Vercel Blob**: ~$200/month
- **AWS S3 + CloudFront**: ~$80/month

---

## Final Recommendation

### For Your Blog: **Cloudinary** ⭐

**Why:**
1. ✅ Free tier is generous (25GB/month)
2. ✅ Automatic image optimization saves development time
3. ✅ Built-in transformations (resize, crop, format conversion)
4. ✅ Excellent Next.js integration
5. ✅ Can upgrade as you grow
6. ✅ Less code to maintain

**Start with:**
1. Cloudinary free tier
2. Cover image upload
3. TipTap paste/upload support
4. Profile picture upload

**Later add:**
5. AI features (auto-tagging, background removal)
6. Responsive images
7. Video support
8. Advanced transformations

---

## Need Help Implementing?

I can help you implement any of these solutions. Just let me know which option you'd like to proceed with!
