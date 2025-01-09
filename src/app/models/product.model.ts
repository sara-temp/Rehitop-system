export class Product {
  Id: string
  image: string
  name: string
  categories: SubCategory[]
  price: number
  describe?: string
  colors?: string
  company?: string

  constructor(
    Id: string,
    image: string,
    name: string,
    categories: SubCategory[],
    price: number,
    describe?: string,
    colors?: string,
    company?: string
  ) {
    this.Id = Id
    this.image = image
    this.name = name
    this.categories = categories
    this.price = price
    this.describe = describe
    this.colors = colors
    this.company = company
  }
}

export enum Categories {
  SALON = 'ריהוט סלוני',
  BEDROOMS = 'חדרי שינה',
  MATTRESSES = 'מזרונים',
  CHILDRENSROOMS = 'חדרי ילדים',
  CLOSETS = 'ארונות',
  DININGAREAS = 'פינות אוכל',
  OFFICE = 'משרדי'
}
export enum Salon {
  TABLES_CHAIRS = 'שולחנות וכסאות לסלון',
  LIBRARIES = 'ספריות קודש',
  SOFAS = 'ספות ומערכות ישיבה',
  TABLES_BUFFETS = 'שולחנות סלוניים ומזנונים',
}
export enum Mattresses {
  POLIRON = 'פולירון',
  DRSHIDRA = 'ד"ר שידרה'
}
export enum ChildrensRoom {
  YOUTHBEDS = 'מיטות נוער',
  DESKS = 'מכתביות'
}
export enum Desks {
  STANDARD = 'סטנדרט',
  PERSONALDESIGN = 'עיצוב אישי'
}
export enum Closets {
  OPENINGCLOSETS = 'ארונות פתיחה',
  SILDINGCLOSETS = 'ארונות הזזה'
}
export enum DiningAreas {
  SALON_TABLES_CHAIRS = 'שולחנות וכסאות לסלון',
  KITCHEN_TABLES_CHAIRS = 'שולחנות וכסאות למטבח',
  KITCHEN_CHAIRS = 'כסאות מטבח',
  CHAIRS_BAR = 'כסאות בר'
}
export enum Office {
  CHAIRS = 'כסאות משרדיים',
  TABLES = 'שולחנות משרדיים'
}

export type Schema = {
  [Categories.SALON]: typeof Salon,
  [Categories.BEDROOMS]: never,
  [Categories.MATTRESSES]: typeof Mattresses,
  [Categories.CHILDRENSROOMS]: typeof ChildrensRoom,
  [Categories.CLOSETS]: typeof Closets,
  [Categories.DININGAREAS]: typeof DiningAreas,
  [Categories.OFFICE]: typeof Office
}

export type MainCategory = keyof Schema;
export type SubCategory =
  | Categories.SALON
  | Categories.MATTRESSES
  | Categories.BEDROOMS
  | Categories.CHILDRENSROOMS
  | Categories.CLOSETS
  | Categories.DININGAREAS
  | Categories.OFFICE
  | Salon.TABLES_CHAIRS
  | Salon.SOFAS
  | Salon.LIBRARIES
  | Salon.TABLES_BUFFETS
  | Mattresses.POLIRON
  | Mattresses.DRSHIDRA
  | ChildrensRoom.YOUTHBEDS
  | ChildrensRoom.DESKS
  | Desks.PERSONALDESIGN
  | Desks.STANDARD
  | Closets.OPENINGCLOSETS
  | Closets.SILDINGCLOSETS
  | DiningAreas.SALON_TABLES_CHAIRS
  | DiningAreas.KITCHEN_TABLES_CHAIRS
  | DiningAreas.KITCHEN_CHAIRS
  | DiningAreas.CHAIRS_BAR
  | Office.CHAIRS
  | Office.TABLES;
