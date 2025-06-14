
// Simplified configuration for binary trash detection
export const trashItems = [
  'bottle', 'plastic bottle', 'water bottle',
  'paper', 'tissue', 'napkin',
  'cup', 'can', 'container',
  'wrapper', 'bag', 'plastic bag',
  'food container', 'package',
  'cigarette', 'cigar', 'trash', 'garbage',
  'waste', 'litter'
];

export const normalItems = [
  'person', 'hand', 'finger',
  'hat', 'cap', 'beanie', 'helmet',
  'shoe', 'sneaker', 'boot',
  'bag', 'backpack', 'purse', 'handbag',
  'book', 'notebook', 'books',
  'phone', 'cell phone', 'mobile phone',
  'keys', 'wallet',
  'clothing', 'shirt', 'jacket', 'clothes',
  'tie', 'suit', 'dress', 'pants', 'jeans',
  'glasses', 'sunglasses',
  'watch', 'clock',
  'laptop', 'computer', 'keyboard', 'mouse'
];

export const isTrashItem = (label: string): boolean => {
  const lowerLabel = label.toLowerCase();
  
  // First check if it's explicitly a normal item - if so, it's NOT trash
  if (isNormalItem(label)) {
    return false;
  }
  
  // Then check for trash items
  return trashItems.some(trash => lowerLabel.includes(trash));
};

export const isNormalItem = (label: string): boolean => {
  const lowerLabel = label.toLowerCase();
  
  // Check for clothing items including hats
  if (lowerLabel.includes('hat') || 
      lowerLabel.includes('cap') || 
      lowerLabel.includes('clothing') || 
      lowerLabel.includes('shirt') || 
      lowerLabel.includes('jacket') ||
      lowerLabel.includes('clothes')) {
    return true;
  }
  
  // Check for books
  if (lowerLabel.includes('book')) {
    return true;
  }
  
  // Check all normal items
  return normalItems.some(normal => lowerLabel.includes(normal));
};
