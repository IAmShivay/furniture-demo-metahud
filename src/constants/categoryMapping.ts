export const categoryImages: Record<string, string> = {
  sofas: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
  chairs: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
  tables: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
  storage: 'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=800',
  lighting: 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=800',
  decor: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
  bedroom: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
  dining: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800',
  office: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800',
};

export const categoryDescriptions: Record<string, string> = {
  sofas: 'Transform your living space with our premium sofas designed for comfort and style.',
  chairs: 'Ergonomic and elegant seating crafted for every room in your home.',
  tables: 'Functional surfaces from coffee tables to dining sets, crafted with precision.',
  storage: 'Smart and beautiful storage solutions to keep your home organized.',
  lighting: 'Designer lighting fixtures to illuminate and elevate every room.',
  decor: 'Curated decorative accessories to add personality and charm to your space.',
  bedroom: 'Create your perfect sanctuary with luxurious beds, wardrobes, and nightstands.',
  dining: 'Gather in style with elegant dining tables, chairs, and storage solutions.',
  office: 'Boost productivity with ergonomic desks, chairs, and workspace solutions.',
};

export const categorySubcategoryTags: Record<string, string[]> = {
  sofas: ['Sectionals', 'Loveseats', 'Sleeper Sofas', 'Recliners'],
  chairs: ['Accent Chairs', 'Armchairs', 'Lounge Chairs', 'Rocking Chairs'],
  tables: ['Coffee Tables', 'Side Tables', 'Console Tables', 'Dining Tables'],
  storage: ['Shelving', 'Cabinets', 'Dressers', 'Bookcases'],
  lighting: ['Floor Lamps', 'Table Lamps', 'Pendants', 'Chandeliers'],
  decor: ['Wall Art', 'Mirrors', 'Vases', 'Rugs'],
  bedroom: ['Beds', 'Wardrobes', 'Nightstands', 'Dressers'],
  dining: ['Dining Tables', 'Dining Chairs', 'Buffets', 'Bar Stools'],
  office: ['Desks', 'Office Chairs', 'Bookcases', 'Filing Cabinets'],
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
