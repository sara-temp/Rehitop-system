export class Product {
  Id: string
  image: string
  name: string
  categories: SubCategory[]
  price: number
  describe?: string
  company?: Company 
  colors?: string

  constructor(
    Id: string,
    image: string,
    name: string,
    categories: SubCategory[],
    price: number,
    describe?: string,
    company?: Company
  ) {
    this.Id = Id
    this.image = image
    this.name = name
    this.categories = categories
    this.price = price
    this.describe = describe
    this.company = company
    this.colors = company?.colors
  }
}

interface Company {
  name: string;
  colors: string;
}

export const companies: Company[] = [
  { name: "Company A", colors: "#FF0000" },
  { name: "Company B", colors: "https://www.google.com/search?q=%D7%AA%D7%A8%D7%92%D7%95%D7%9D%2C&rlz=1C1VDKB_iwIL1061IL1061&oq=%D7%AA%D7%A8&gs_lcrp=EgZjaHJvbWUqBggBEEUYOzIGCAAQRRg5MgYIARBFGDsyBggCEEUYOzIGCAMQRRg7MgYIBBBFGD0yBggFEEUYPDIGCAYQRRg80gEIMTQxN2owajeoAgCwAgA&sourceid=chrome&ie=UTF-8" },
];


export enum Categories {
  SALON = 'ריהוט סלוני',
  BEDROOMS = 'חדרי שינה',
  MATTRESSES = 'מזרונים',
  CHILDRENSROOMS = 'חדרי ילדים',
  CLOSETS = 'ארונות',
  DININGAREAS = 'פינות אוכל למטבח',
  OFFICE = 'משרדי',
  PLASTER = 'קל גבס',
  SALES = 'מבצעים'
}
export enum Salon {
  TABLES_CHAIRS = 'שולחנות וכסאות',
  LIBRARIES = 'ספריות קודש',
  SOFAS = 'ספות ומערכות ישיבה',
  COMPLEMENTARY_FURNITURE = 'ריהוט משלים לסלון',
}
export enum Tables_Chairs {
  TREE = 'עץ',
  MODERN = 'מודרני'
}
export enum Libraries {
  STANDART = 'סטנדרט',
  PLASTER_LIKE = 'דמוי גבס',
  CARPENTRY = 'נגרות',
  COLUMNS = 'עמודונים'
}
export enum Sofas {
  ARE_OPENED = 'נפתחות',
  RECLINERS = 'ריקליינרים',
  SEATING_SYSTEMS = 'מערכות ישיבה'
}
export enum Bedrooms {
  CARPENTRY = 'עבודת נגר',
  PADDED = 'מרופדים',
  FORMICA = 'פורמייקה'
}
export enum Padded {
  STANDART = 'סטנדרט',
  PRESTIGIOUS = 'יוקרתי'
}
export enum Mattresses {
  DRSHIDRA = 'ד"ר שידרה',
  POLIRON = 'פולירון'
}
export enum ChildrensRoom {
  YOUTHBEDS = 'מיטות נוער',
  DESKS = 'מכתביות'
}
export enum Youthbeds {
  FORMICA = 'פורמייקה',
  REMOVABLE = 'הירייזר מזרונים נשלפים',
  FIXED = 'הירייזר מזרונים קבועים',
  TWO_STORIES = 'מיטות קומותיים',
  CARPENTER = 'עבודת נגר'
}
export enum Desks {
  STANDARD = 'סטנדרט',
  PERSONALDESIGN = 'עיצוב אישי'
}
export enum Closets {
  OPENINGCLOSETS = 'ארונות פתיחה',
  SILDINGCLOSETS = 'ארונות הזזה'
}
export enum Openingclosets {
  STANDARD = 'סטנדרט',
  PERSONALDESIGN = 'עיצוב אישי'
}
export enum Sildingclosets {
  STANDARD = 'סטנדרט',
  PERSONALDESIGN = 'עיצוב אישי'
}
export enum DiningAreas {
  KITCHEN_TABLES_CHAIRS = 'סטים',
  KITCHEN_TABLES = 'שולחנות מטבח',
  KITCHEN_CHAIRS = 'כסאות מטבח',
  CHAIRS_BAR = 'כסאות בר'
}
export enum Office {
  CHAIRS = 'כסאות משרדיים',
  TABLES = 'שולחנות משרדיים'
}
export enum Sales {
  HOUSING_UNITS = 'יחידות דיור',
  ITEMS = 'פריטים במבצע'
}

// יצירת אובייקט ריצה
export const SCHEMA_RUNTIME: Schema = {
  [Categories.SALON]: {
    [Salon.TABLES_CHAIRS]: Tables_Chairs,
    [Salon.LIBRARIES]: Libraries,
    [Salon.SOFAS]: Sofas,
    [Salon.COMPLEMENTARY_FURNITURE]: {}
  },
  [Categories.BEDROOMS]: {
    [Bedrooms.CARPENTRY]: {},
    [Bedrooms.PADDED]: Padded,
    [Bedrooms.FORMICA]: {}
  },
  [Categories.MATTRESSES]: Mattresses,
  [Categories.CHILDRENSROOMS]: {
    [ChildrensRoom.YOUTHBEDS]: Youthbeds,
    [ChildrensRoom.DESKS]: Desks,
  },
  [Categories.CLOSETS]: {
    [Closets.OPENINGCLOSETS]: Openingclosets,
    [Closets.SILDINGCLOSETS]: Sildingclosets
  },
  [Categories.DININGAREAS]: DiningAreas,
  [Categories.OFFICE]: Office,
  [Categories.PLASTER]: {} as never,
  [Categories.SALES]: Sales
};

export type Schema = {
  [Categories.SALON]: {
    [Salon.TABLES_CHAIRS]: typeof Tables_Chairs,
    [Salon.LIBRARIES]: typeof Libraries,
    [Salon.SOFAS]: typeof Sofas,
    [Salon.COMPLEMENTARY_FURNITURE]: {}
  },
  [Categories.BEDROOMS]: {
    [Bedrooms.CARPENTRY]: {},
    [Bedrooms.PADDED]: typeof Padded,
    [Bedrooms.FORMICA]: {}
  },
  [Categories.MATTRESSES]: typeof Mattresses,
  [Categories.CHILDRENSROOMS]:  {
    [ChildrensRoom.YOUTHBEDS]: typeof Youthbeds;
    [ChildrensRoom.DESKS]: typeof Desks;
  },
  [Categories.CLOSETS]: {
    [Closets.OPENINGCLOSETS]: typeof Openingclosets,
    [Closets.SILDINGCLOSETS]: typeof Sildingclosets
  },
  [Categories.DININGAREAS]: typeof DiningAreas,
  [Categories.OFFICE]: typeof Office,
  [Categories.PLASTER]: never,
  [Categories.SALES]: typeof Sales
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
  | Categories.PLASTER
  | Categories.SALES
  | Salon.TABLES_CHAIRS
  | Tables_Chairs.MODERN
  | Tables_Chairs.TREE
  | Salon.SOFAS
  | Sofas.ARE_OPENED
  | Sofas.RECLINERS
  | Sofas.SEATING_SYSTEMS
  | Salon.LIBRARIES
  | Libraries.CARPENTRY
  | Libraries.COLUMNS
  | Libraries.PLASTER_LIKE
  | Libraries.STANDART
  | Salon.COMPLEMENTARY_FURNITURE
  | Mattresses.POLIRON
  | Mattresses.DRSHIDRA
  | Bedrooms.CARPENTRY
  | Bedrooms.FORMICA
  | Bedrooms.PADDED
  | Padded.PRESTIGIOUS
  | Padded.STANDART
  | ChildrensRoom.YOUTHBEDS
  | Youthbeds.CARPENTER
  | Youthbeds.FIXED
  | Youthbeds.FORMICA
  | Youthbeds.REMOVABLE
  | Youthbeds.TWO_STORIES
  | ChildrensRoom.DESKS
  | Desks.PERSONALDESIGN
  | Desks.STANDARD
  | Closets.OPENINGCLOSETS
  | Openingclosets.PERSONALDESIGN
  | Openingclosets.STANDARD
  | Closets.SILDINGCLOSETS
  | Sildingclosets.PERSONALDESIGN
  | Sildingclosets.STANDARD
  | DiningAreas.KITCHEN_TABLES_CHAIRS
  | DiningAreas.KITCHEN_TABLES
  | DiningAreas.KITCHEN_CHAIRS
  | DiningAreas.CHAIRS_BAR
  | Office.CHAIRS
  | Office.TABLES
  | Sales.HOUSING_UNITS
  | Sales.ITEMS;
