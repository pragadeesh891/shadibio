import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageCropper from './ImageCropper';

const ProfilePhotoUpload = ({ formData, updateFormData, biodata }) => {
  const [previewUrl, setPreviewUrl] = useState(formData?.profilePhoto || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  // Compress image to reduce file size (from ~2MB to ~200KB)
  const compressImage = (base64, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  // Auto-save photo to database immediately
  const autoSavePhoto = async (photoData) => {
    if (!biodata?._id) {
      setSaveStatus('💾 Will save when you complete the form');
      return;
    }

    try {
      setSaveStatus('⏳ Saving photo...');
      const response = await fetch(`/api/biodata/${biodata._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ profilePhoto: photoData })
      });

      if (response.ok) {
        setSaveStatus('✅ Photo saved to database! You can now download PDF.');
        setTimeout(() => setSaveStatus(''), 8000);
      } else {
        setSaveStatus('⚠️ Will save with full form submission');
        setTimeout(() => setSaveStatus(''), 5000);
      }
    } catch (err) {
      console.error('Auto-save error:', err);
      setSaveStatus('⚠️ Will save with full form');
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPEG, PNG, JPG, GIF)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setShowCropper(true);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      if (fileRejections.length > 0) {
        setError(fileRejections[0].errors[0]?.message || 'Invalid file');
      }
    }
  });

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    window.cropData = { croppedArea, croppedAreaPixels };
  };

  const applyCrop = async () => {
    if (!imageToCrop || !window.cropData) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const { croppedAreaPixels } = window.cropData;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      const img = new Image();
      img.src = imageToCrop;
      await new Promise(resolve => { img.onload = resolve; });

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(async (blob) => {
        const reader = new FileReader();
        reader.onload = async () => {
          // Compress the image
          const compressed = await compressImage(reader.result);

          setPreviewUrl(compressed);
          updateFormData({ profilePhoto: compressed });

          // Auto-save to database if biodata exists
          await autoSavePhoto(compressed);

          setShowCropper(false);
          setImageToCrop(null);
          window.cropData = null;
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.8);
    } catch (err) {
      setError('Failed to crop image. Please try again.');
    }
  };

  const downloadPhoto = () => {
    if (!previewUrl) return;

    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `profile_photo_${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removePhoto = () => {
    setPreviewUrl(null);
    updateFormData({ profilePhoto: null });
    setError('');
  };

  // Cropping modal
  if (showCropper && imageToCrop) {
    return React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'glass p-8 rounded-3xl shadow-2xl-custom max-w-2xl w-full max-h-[90vh] overflow-y-auto' },
        React.createElement(
          'h3',
          { className: 'text-2xl font-bold gradient-text mb-6 text-center' },
          '✂️ Crop Your Photo'
        ),
        React.createElement(ImageCropper, {
          image: imageToCrop,
          onCropComplete: handleCropComplete,
          aspectRatio: 1
        }),
        React.createElement(
          'div',
          { className: 'flex space-x-4 mt-6' },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => { setShowCropper(false); setImageToCrop(null); },
              className: 'btn-premium btn-glass-dark mb-4'
            },
            'Cancel'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: applyCrop,
              className: 'btn-premium btn-premium-indigo glow-primary'
            },
            'Apply Crop ✓'
          )
        )
      )
    );
  }

  // Main component UI
  return React.createElement(
    'div',
    { className: 'mb-8' },
    // Heading
    React.createElement(
      'div',
      { className: 'text-center mb-8' },
      React.createElement(
        'h3',
        { className: 'text-3xl font-black gradient-text mb-3 flex items-center justify-center' },
        React.createElement('span', { className: 'mr-3 text-4xl' }, '📸'),
        'Profile Photo'
      ),
      React.createElement(
        'p',
        { className: 'text-gray-600' },
        'Upload a clear, recent photograph for your biodata'
      )
    ),

    React.createElement(
      'div',
      { className: 'flex flex-col items-center' },
      previewUrl ? React.createElement(
        'div',
        { className: 'relative mb-6 group' },
        // Beautiful bordered image
        React.createElement('img', {
          src: previewUrl,
          alt: 'Profile preview',
          className: 'w-64 h-64 rounded-full object-cover shadow-2xl-custom transform group-hover:scale-105 transition-all duration-300',
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '6px',
            border: '4px solid white'
          }
        }),

        // Save Status Indicator
        saveStatus && React.createElement(
          'div',
          { className: 'absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-lg border-2 animate-slide-up z-10' },
          React.createElement(
            'span',
            {
              className: `text-sm font-bold ${saveStatus.includes('✅') ? 'text-green-600' :
                  saveStatus.includes('⏳') ? 'text-blue-600' :
                    'text-orange-600'
                }`
            },
            saveStatus
          )
        ),

        // Hover action buttons
        React.createElement(
          'div',
          { className: 'absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300' },
          React.createElement(
            'div',
            { className: 'flex space-x-3 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl' },
            // Download button
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: downloadPhoto,
                className: 'flex flex-col items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-xl transform hover:scale-110 transition-all duration-300 group/btn',
                title: 'Download Photo'
              },
              React.createElement('span', { className: 'text-3xl group-hover/btn:scale-125 transition-transform' }, '⬇️'),
              React.createElement('span', { className: 'text-xs font-semibold mt-1' }, 'Download')
            ),
            // Change button
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: removePhoto,
                className: 'flex flex-col items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-rose-500 text-white rounded-2xl hover:shadow-xl transform hover:scale-110 transition-all duration-300 group/btn',
                title: 'Remove Photo'
              },
              React.createElement('span', { className: 'text-3xl group-hover/btn:scale-125 transition-transform' }, '🗑️'),
              React.createElement('span', { className: 'text-xs font-semibold mt-1' }, 'Remove')
            )
          )
        ),

        // Tooltip
        React.createElement(
          'div',
          { className: 'absolute -bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300' },
          React.createElement(
            'span',
            { className: 'bg-gray-900 text-white text-xs px-4 py-2 rounded-full whitespace-nowrap font-medium shadow-lg' },
            '✨ Hover for actions'
          )
        )
      ) : React.createElement(
        // Upload area
        'div',
        {
          ...getRootProps(),
          className: 'w-64 h-64 rounded-full border-3 border-dashed border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group/upload'
        },
        React.createElement('input', { ...getInputProps() }),
        React.createElement(
          'div',
          { className: 'text-center px-6' },
          // Icon
          React.createElement(
            'div',
            { className: 'mb-4 transform group-hover/upload:scale-110 transition-transform duration-300' },
            React.createElement('span', { className: 'text-6xl' }, '📤')
          ),
          // Text
          isDragActive ?
            React.createElement(
              'p',
              { className: 'text-lg font-bold text-indigo-600 animate-pulse' },
              '🎯 Drop the image here...'
            ) :
            React.createElement(React.Fragment, null,
              React.createElement(
                'p',
                { className: 'text-base font-bold text-gray-700 mb-2' },
                'Click to upload or drag and drop'
              ),
              React.createElement(
                'p',
                { className: 'text-sm text-gray-500' },
                'PNG, JPG, GIF up to 5MB'
              )
            )
        )
      ),

      // Error message
      error && React.createElement(
        'div',
        { className: 'mt-4 bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 max-w-md' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2' },
          React.createElement('span', { className: 'text-xl' }, '❌'),
          React.createElement('p', { className: 'text-red-700 font-semibold text-sm' }, error)
        )
      ),

      // Success tip
      previewUrl && React.createElement(
        'div',
        { className: 'mt-4 bg-green-50 border-2 border-green-200 rounded-2xl px-4 py-3 max-w-md' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2' },
          React.createElement('span', { className: 'text-xl' }, '✅'),
          React.createElement('p', { className: 'text-green-700 font-semibold text-sm' }, 'Photo uploaded successfully! Hover to download or change.')
        )
      )
    ),

    // Additional info
    React.createElement(
      'div',
      { className: 'mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border-2 border-indigo-100' },
      React.createElement(
        'div',
        { className: 'flex items-start space-x-3' },
        React.createElement('span', { className: 'text-2xl' }, '💡'),
        React.createElement(
          'div',
          null,
          React.createElement(
            'h4',
            { className: 'font-bold text-gray-800 mb-1' },
            'Photo Tips:'
          ),
          React.createElement(
            'ul',
            { className: 'text-sm text-gray-600 space-y-1' },
            React.createElement('li', null, '• Recent, clear photograph'),
            React.createElement('li', null, '• Plain background preferred'),
            React.createElement('li', null, '• Good lighting, face visible'),
            React.createElement('li', null, '• Professional appearance')
          )
        )
      )
    )
  );
};

export default ProfilePhotoUpload;
