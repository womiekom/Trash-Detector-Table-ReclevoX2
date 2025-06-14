
// Simplified configuration for binary trash detection
export const trashItems = [
  'bottle', 'plastic bottle', 'water bottle',
  'paper', 'tissue', 'napkin', 'newspaper',
  'cup', 'can', 'container', 'food container',
  'wrapper', 'bag', 'plastic bag',
  'package', 'box', 'cardboard',
  'cigarette', 'cigar', 'trash', 'garbage',
  'waste', 'litter', 'rubbish'
];

export const normalItems = [
  'person', 'hand', 'finger', 'face', 'head',
  'hat', 'cap', 'beanie', 'helmet', 'hair',
  'shoe', 'sneaker', 'boot', 'footwear',
  'bag', 'backpack', 'purse', 'handbag', 'suitcase',
  'book', 'notebook', 'books', 'magazine',
  'phone', 'cell phone', 'mobile phone', 'smartphone',
  'keys', 'wallet', 'purse',
  'clothing', 'shirt', 'jacket', 'clothes', 'garment',
  'tie', 'suit', 'dress', 'pants', 'jeans', 'shorts',
  'glasses', 'sunglasses', 'eyewear',
  'watch', 'clock', 'timepiece',
  'laptop', 'computer', 'keyboard', 'mouse', 'tablet'
];

export const isTrashItem = (label: string): boolean => {
  const lowerLabel = label.toLowerCase();
  
  // First check if it's explicitly a normal item - if so, it's NOT trash
  if (isNormalItem(label)) {
    console.log(`✅ "${label}" is classified as NORMAL item`);
    return false;
  }
  
  // Then check for trash items
  const isTrash = trashItems.some(trash => lowerLabel.includes(trash));
  if (isTrash) {
    console.log(`🗑️ "${label}" is classified as TRASH item`);
  }
  return isTrash;
};

export const isNormalItem = (label: string): boolean => {
  const lowerLabel = label.toLowerCase();
  
  // Check for clothing items including hats
  if (lowerLabel.includes('hat') || 
      lowerLabel.includes('cap') || 
      lowerLabel.includes('clothing') || 
      lowerLabel.includes('shirt') || 
      lowerLabel.includes('jacket') ||
      lowerLabel.includes('clothes') ||
      lowerLabel.includes('garment')) {
    console.log(`👕 "${label}" detected as clothing/hat - NORMAL item`);
    return true;
  }
  
  // Check for books
  if (lowerLabel.includes('book')) {
    console.log(`📚 "${label}" detected as book - NORMAL item`);
    return true;
  }
  
  // Check for person/human parts
  if (lowerLabel.includes('person') || 
      lowerLabel.includes('hand') || 
      lowerLabel.includes('face') ||
      lowerLabel.includes('head') ||
      lowerLabel.includes('hair')) {
    console.log(`👤 "${label}" detected as person/body part - NORMAL item`);
    return true;
  }
  
  // Check all normal items
  const isNormal = normalItems.some(normal => lowerLabel.includes(normal));
  if (isNormal) {
    console.log(`✅ "${label}" matched normal items list`);
  }
  return isNormal;
};
