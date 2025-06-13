
// Simplified configuration for binary trash detection
export const trashItems = [
  'bottle', 'plastic bottle', 'water bottle',
  'paper', 'tissue', 'napkin',
  'cup', 'can', 'container',
  'wrapper', 'bag', 'plastic bag',
  'food container', 'package',
  'cigarette', 'cigar'
];

export const normalItems = [
  'person', 'hand', 'finger',
  'shoe', 'sneaker', 'boot',
  'bag', 'backpack', 'purse',
  'book', 'notebook', 'books',
  'phone', 'cell phone', 'mobile phone',
  'keys', 'wallet',
  'clothing', 'shirt', 'jacket'
];

export const isTrashItem = (label: string): boolean => {
  const lowerLabel = label.toLowerCase();
  
  // More specific matching for trash items
  if (lowerLabel.includes('bottle') || 
      lowerLabel.includes('paper') || 
      lowerLabel.includes('tissue') ||
      lowerLabel.includes('cup') ||
      lowerLabel.includes('can') ||
      lowerLabel.includes('wrapper') ||
      lowerLabel.includes('container')) {
    return true;
  }
  
  return trashItems.some(trash => lowerLabel.includes(trash));
};

export const isNormalItem = (label: string): boolean => {
  const lowerLabel = label.toLowerCase();
  
  // Don't classify bottles/containers as normal items
  if (lowerLabel.includes('bottle') || lowerLabel.includes('container')) {
    return false;
  }
  
  // Specifically check for books
  if (lowerLabel.includes('book')) {
    return true;
  }
  
  return normalItems.some(normal => lowerLabel.includes(normal));
};
