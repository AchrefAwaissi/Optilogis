import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const FurniturePlacement: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('sk-v8IV8Sh86ea2F64kzIofgRIs1Kk');
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [placement, setPlacement] = useState({ x: 270, y: 70, w: 103, h: 297 });
  const [area, setArea] = useState({ x: 0, y: 0, w: 10, h: 10 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomImageInputRef = useRef<HTMLInputElement>(null);
  const productImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (roomImage && productImage) {
      drawImages();
    }
  }, [roomImage, productImage, placement, area]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const drawImages = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !roomImage || !productImage) return;

    const roomImg = new Image();
    roomImg.onload = () => {
      canvas.width = roomImg.width;
      canvas.height = roomImg.height;
      ctx.drawImage(roomImg, 0, 0, canvas.width, canvas.height);

      const productImg = new Image();
      productImg.onload = () => {
        ctx.drawImage(productImg, placement.x, placement.y, placement.w, placement.h);
        
        // Draw blue rectangle around the product
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(placement.x, placement.y, placement.w, placement.h);

        // Draw area rectangle
        ctx.strokeStyle = 'green';
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(area.x, area.y, area.w, area.h);
        ctx.setLineDash([]);
      };
      productImg.src = productImage;
    };
    roomImg.src = roomImage;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlacement(prev => ({
      ...prev,
      x: x,
      y: y
    }));
  };

  const handlePlacementChange = (key: keyof typeof placement, value: string) => {
    setPlacement(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleAreaChange = (key: keyof typeof area, value: string) => {
    setArea(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handlePlaceFurniture = async () => {
    if (!roomImage || !productImage) {
      setError("Please upload both room and product images before continuing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://api.spacely.ai/api/v1/generate/furniture-placement',
        {
          imageUrl: roomImage,
          productImageUrl: productImage,
          placement,
          area
        },
        {
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      setResultImage(response.data.resultImageUrl);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error: ${err.response?.status} - ${err.response?.statusText}`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Spacely AI Furniture Placement</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Room Image:</label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors h-64 flex items-center justify-center overflow-y-auto"
            onClick={() => roomImageInputRef.current?.click()}
          >
            {roomImage ? (
              <img src={roomImage} alt="Room" className="max-w-full max-h-full object-contain" />
            ) : (
              <p>Click to upload room image</p>
            )}
          </div>
          <input 
            type="file" 
            ref={roomImageInputRef}
            onChange={(e) => handleImageChange(e, setRoomImage)}
            className="hidden" 
            accept="image/*"
          />
        </div>
        <div>
          <label className="block mb-2">Product Image:</label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors h-64 flex items-center justify-center overflow-y-auto"
            onClick={() => productImageInputRef.current?.click()}
          >
            {productImage ? (
              <img src={productImage} alt="Product" className="max-w-full max-h-full object-contain" />
            ) : (
              <p>Click to upload product image</p>
            )}
          </div>
          <input 
            type="file" 
            ref={productImageInputRef}
            onChange={(e) => handleImageChange(e, setProductImage)}
            className="hidden" 
            accept="image/*"
          />
        </div>
      </div>
  
      <div className="mb-4">
        <label className="block mb-2">Placement (x, y, w, h):</label>
        <div className="grid grid-cols-4 gap-2">
          {(['x', 'y', 'w', 'h'] as const).map((key) => (
            <input
              key={key}
              type="number"
              value={placement[key]}
              onChange={(e) => handlePlacementChange(key, e.target.value)}
              className="w-full p-2 border rounded"
              placeholder={key.toUpperCase()}
            />
          ))}
        </div>
      </div>
  
      <div className="mb-4">
        <label className="block mb-2">Area (x, y, w, h):</label>
        <div className="grid grid-cols-4 gap-2">
          {(['x', 'y', 'w', 'h'] as const).map((key) => (
            <input
              key={key}
              type="number"
              value={area[key]}
              onChange={(e) => handleAreaChange(key, e.target.value)}
              className="w-full p-2 border rounded"
              placeholder={key.toUpperCase()}
            />
          ))}
        </div>
      </div>
  
      <div className="mb-4 overflow-y-auto" style={{ height: '400px' }}>
        <label className="block mb-2">Placement Preview:</label>
        <canvas 
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="border rounded-lg w-full h-96 object-contain cursor-crosshair"
        />
        <p className="text-sm text-gray-600 mt-1">Click to move the furniture. Green rectangle shows the area constraint.</p>
      </div>
  
      <div className="flex justify-center mb-4">
        <button 
          onClick={handlePlaceFurniture} 
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Generate
        </button>
      </div>
      
      {loading && <p className="text-center mt-4">Loading...</p>}
      
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
  
      {resultImage && (
        <div className="mt-8 overflow-y-auto" style={{ height: '400px' }}>
          <h3 className="text-xl font-bold mb-2">Result:</h3>
          <img src={resultImage} alt="Placement Result" className="w-full border rounded-lg" />
        </div>
      )}
    </div>
  );
  
}

export default FurniturePlacement;