// src/utils/url.js
import config from '../config';

export const getApiUrl = (path) => {
  if (!path) return '';
  
  // Remplacer les backslashes par des forward slashes
  let cleanPath = path.replace(/\\/g, '/');
  
  // Vérifier si le chemin est déjà une URL complète
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  
  // Supprimer 'localhost:3000/' s'il est présent dans le chemin
  cleanPath = cleanPath.replace('localhost:3000/', '');
  
  // Construire l'URL complète
  const fullUrl = `${config.API_URL}/${cleanPath}`;
  
  console.log('Original path:', path);
  console.log('Clean path:', cleanPath);
  console.log('Full URL:', fullUrl);
  
  return fullUrl;
};