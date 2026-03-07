import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const ImageCropper = ({ image, onCropComplete, aspectRatio = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onRotationChange = (rotation) => {
    setRotation(rotation);
  };

  const onCropCompleted = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    onCropComplete(croppedArea, croppedAreaPixels);
  }, [onCropComplete]);

  return React.createElement(
    'div',
    { className: 'w-full' },
    // Crop Container
    React.createElement(
      'div',
      { className: 'relative w-full h-80 bg-gray-900 rounded-2xl overflow-hidden mb-4' },
      React.createElement(Cropper, {
        image: image,
        crop: crop,
        zoom: zoom,
        rotation: rotation,
        aspect: aspectRatio,
        onCropChange: onCropChange,
        onZoomChange: onZoomChange,
        onRotationChange: onRotationChange,
        onCropComplete: onCropCompleted,
        showGrid: true,
        objectFit: 'contain'
      })
    ),

    // Controls
    React.createElement(
      'div',
      { className: 'space-y-4' },
      // Zoom Control
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { className: 'block text-sm font-bold text-gray-700 mb-2' },
          'Zoom'
        ),
        React.createElement(
          'input',
          {
            type: 'range',
            min: '1',
            max: '3',
            step: '0.1',
            value: zoom,
            onChange: (e) => onZoomChange(parseFloat(e.target.value)),
            className: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600'
          }
        )
      ),

      // Rotation Control
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { className: 'block text-sm font-bold text-gray-700 mb-2' },
          `Rotate: ${rotation}°`
        ),
        React.createElement(
          'input',
          {
            type: 'range',
            min: '0',
            max: '360',
            step: '1',
            value: rotation,
            onChange: (e) => onRotationChange(parseFloat(e.target.value)),
            className: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600'
          }
        )
      ),

      // Quick Rotate Buttons
      React.createElement(
        'div',
        { className: 'flex space-x-2' },
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: () => onRotationChange((rotation + 90) % 360),
            className: 'flex-1 py-2 px-4 bg-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-200 transition-colors'
          },
          '↻ Rotate 90°'
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: () => onRotationChange(0),
            className: 'flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors'
          },
          'Reset'
        )
      )
    )
  );
};

export default ImageCropper;
