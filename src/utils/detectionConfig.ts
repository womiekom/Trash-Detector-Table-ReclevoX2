
export const trashItems = [
  'bottle', 'plastic bag', 'food wrapper', 'paper', 'cup', 'can', 
  'cigarette', 'tissue', 'candy wrapper', 'food container', 'trash'
];

export const normalItems = [
  'hat', 'cap', 'clothing', 'shirt', 'pants', 'shoe', 'bag', 'backpack',
  'book', 'notebook', 'pencil', 'pen', 'jacket', 'sweater'
];

export const isTrashItem = (label: string): boolean => {
  const lowerLabel = label.toLowerCase();
  return trashItems.some(trash => lowerLabel.includes(trash));
};

export const isNormalItem = (label: string): boolean => {
  const lowerLabel = label.toLowerCase();
  return normalItems.some(normal => lowerLabel.includes(normal));
};
