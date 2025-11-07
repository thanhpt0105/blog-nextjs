# Cloudinary Setup Instructions

## Environment Variables

Add the following to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Getting Cloudinary Credentials

1. Sign up for a free account at [Cloudinary](https://cloudinary.com)
2. After logging in, go to the Dashboard
3. You'll find your credentials in the "Account Details" section:
   - **Cloud Name**: Copy this to `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key**: Copy this to `CLOUDINARY_API_KEY`
   - **API Secret**: Copy this to `CLOUDINARY_API_SECRET`

## Free Tier Limits

- 25 GB storage
- 25 GB bandwidth/month
- Automatic image optimization
- CDN delivery

## Features Implemented

### 1. Upload API Route (`/api/upload`)
- File validation (max 5MB, image types only)
- Type-specific transformations:
  - **Profile**: 400x400, face-focused cropping
  - **Cover**: 1200x630, optimized for social media
  - **Content**: 1200px width max, maintain aspect ratio
- Organized storage: `blog/{type}/{userId}/`
- Returns optimized URLs

### 2. ImageUpload Component
Three variants:
- **Avatar**: Circular preview for profile pictures
- **Cover**: Wide preview for cover images
- **Button**: Simple button for inline content

### 3. Enhanced TipTap Editor
- Paste images from clipboard (Ctrl+V / Cmd+V)
- Drag and drop images directly into editor
- Automatic upload and insertion
- Visual upload progress indicator

### 4. Post Editor Integration
- Cover image upload in new/edit post pages
- Replaces manual URL input
- Preview before saving
- Easy remove functionality

## Usage

### In Post Editor (Cover Images)
1. Go to Admin → Posts → New Post
2. Scroll to "Featured Image" section
3. Click to upload or drag & drop an image
4. Image is automatically uploaded and URL is saved

### In TipTap Editor (Content Images)
**Option 1: Paste**
1. Copy an image (from browser, screenshot, etc.)
2. Click in the editor
3. Press Ctrl+V (Windows/Linux) or Cmd+V (Mac)
4. Image uploads and inserts automatically

**Option 2: Drag & Drop**
1. Drag an image file from your computer
2. Drop it into the editor
3. Image uploads at drop position

**Option 3: Button**
1. Click the image icon in toolbar
2. Enter image URL in dialog
3. Click Insert

## Next Steps

To enable profile picture uploads:
- Complete task 6: Create profile edit page
- Add user profile API route
- Integrate ImageUpload component with avatar variant

## Troubleshooting

**Upload fails with "Unauthorized"**
- Make sure you're logged in
- Check that your session is valid

**Upload fails with "Failed to upload image"**
- Verify Cloudinary credentials in `.env.local`
- Check file size (max 5MB)
- Ensure file is an image (JPEG, PNG, GIF, WebP)

**Images don't appear**
- Check browser console for errors
- Verify Cloudinary URLs are accessible
- Check that Next.js image domains are configured
