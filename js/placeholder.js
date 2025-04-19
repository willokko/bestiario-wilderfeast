/* Placeholder image - Base64 encoded simple placeholder */
const canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#e0e0e0';
ctx.fillRect(0, 0, 200, 200);

// Border
ctx.strokeStyle = '#999999';
ctx.lineWidth = 2;
ctx.strokeRect(5, 5, 190, 190);

// Text
ctx.fillStyle = '#666666';
ctx.font = '16px Arial';
ctx.textAlign = 'center';
ctx.fillText('Imagem não disponível', 100, 90);
ctx.fillText('WilderFeast', 100, 110);

// Export as PNG
const placeholderImage = canvas.toDataURL('image/png');
document.getElementById('placeholder-export').src = placeholderImage;
