import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const traceabilitySchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  status: z.string().min(1, 'Status is required'),
  notes: z.string().optional(),
});

function FarmToForkPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(traceabilitySchema),
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setMessage('Error getting location. Please enable location services.');
        }
      );
    }

    // Access camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('Error accessing camera:', err);
          setMessage('Error accessing camera. Please allow camera access.');
        });
    }
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      setImage(canvasRef.current.toDataURL('image/png'));
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      setMessage('Please log in to submit traceability data.');
      return;
    }
    if (!image) {
      setMessage('Please capture an image.');
      return;
    }
    if (!location) {
      setMessage('Location data is not available.');
      return;
    }

    try {
      const response = await api.post('/api/traceability/record', {
        userId: user.id,
        productName: data.productName,
        status: data.status,
        notes: data.notes,
        image: image, // Base64 encoded image
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(),
      });
      setMessage('Traceability record submitted successfully!');
      reset();
      setImage(null);
    } catch (error) {
      console.error('Error submitting traceability record:', error);
      setMessage('Failed to submit traceability record. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">{t('farmToFork.title')}</h1>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <p className="text-lg text-gray-700 mb-6 text-center">{t('farmToFork.description')}</p>

        <div className="mb-6 text-center">
          <img src="/home/ubuntu/upload/1000024655.jpg" alt="Farm to Fork Traceability" className="mx-auto rounded-lg shadow-md" style={{ maxWidth: '600px', height: 'auto' }} />
          <p className="text-sm text-gray-500 mt-2">{t('farmToFork.imageCaption')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="productName" className="block text-lg font-medium text-gray-700">{t('farmToFork.productNameLabel')}</label>
            <input
              type="text"
              id="productName"
              {...register('productName')}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-lg"
            />
            {errors.productName && <p className="mt-2 text-sm text-red-600">{errors.productName.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-lg font-medium text-gray-700">{t('farmToFork.statusLabel')}</label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-lg"
            >
              <option value="">{t('farmToFork.selectStatus')}</option>
              <option value="planting">{t('farmToFork.statusOptions.planting')}</option>
              <option value="growing">{t('farmToFork.statusOptions.growing')}</option>
              <option value="flowering">{t('farmToFork.statusOptions.flowering')}</option>
              <option value="pre-harvest">{t('farmToFork.statusOptions.preHarvest')}</option>
              <option value="harvesting">{t('farmToFork.statusOptions.harvesting')}</option>
              <option value="post-harvest">{t('farmToFork.statusOptions.postHarvest')}</option>
              <option value="processing">{t('farmToFork.statusOptions.processing')}</option>
              <option value="packaging">{t('farmToFork.statusOptions.packaging')}</option>
              <option value="distribution">{t('farmToFork.statusOptions.distribution')}</option>
              <option value="retail">{t('farmToFork.statusOptions.retail')}</option>
            </select>
            {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-lg font-medium text-gray-700">{t('farmToFork.notesLabel')}</label>
            <textarea
              id="notes"
              {...register('notes')}
              rows="3"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-lg"
            ></textarea>
          </div>

          <div className="flex flex-col items-center">
            <label className="block text-lg font-medium text-gray-700 mb-2">{t('farmToFork.cameraLabel')}</label>
            <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg shadow-md mb-4"></video>
            <button
              type="button"
              onClick={captureImage}
              className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              {t('farmToFork.captureImageButton')}
            </button>
            {image && (
              <div className="mt-4 text-center">
                <img src={image} alt="Captured" className="w-full max-w-md rounded-lg shadow-md" />
                <p className="mt-2 text-sm text-gray-600">{t('farmToFork.imageCaptured')}</p>
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </div>

          {location && (
            <div className="text-center text-gray-600 mt-4">
              <p>{t('farmToFork.locationLabel')}: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
            </div>
          )}

          {message && (
            <p className="mt-4 text-center text-lg font-medium text-green-600">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            {t('farmToFork.submitButton')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FarmToForkPage;


