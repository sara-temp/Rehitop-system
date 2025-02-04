export class Product {
  Id: string
  image: string
  name: string
  categories: SubCategory[]
  price: number
  describe?: string
  sizes?: string
  company?: Company
  colors?: string
  count_priority:number

  constructor(
    Id: string,
    image: string,
    name: string,
    categories: SubCategory[],
    price: number,
    describe?: string,
    sizes?:string,
    company?: Company
  ) {
    this.Id = Id
    this.image = image
    this.name = name
    this.categories = categories
    this.price = price
    this.describe = describe
    this.sizes = sizes
    this.company = company
    this.colors = company?.colors
    this.count_priority = 0;
  }
}

export interface Company {
  name: string;
  colors: string;
}

export const companies: Company[] = [
  { name: "בלנדורה", colors: "" },
  { name: "גן נוי", colors: "http://localhost:3001/assets/colors-files/גן נוי.pdf" },
  { name: "דניאל", colors: "" },
  { name: 'ד"ר שדרה', colors: "" },
  { name: "חרבאואי", colors: "לאתר של חרבאואי יש שמה ראשי מיטה ובסיסי מיטה ובדים לפנות למוכרת" },
  { name: "טיב העץ", colors: "פנה למוכרת" },
  { name: "מרכז", colors: "http://localhost:3001/assets/colors-files/מרכז.pdf" },
  { name: "משרדנו", colors: "http://localhost:3001/assets/colors-files/תבי.pdf" },
  { name: "נגר", colors: "פנה למוכרת" },
  { name: "נועם אלי", colors: "https://forbirman.co.il/" },
  { name: "ניו קומפורט", colors: "http://localhost:3001/assets/colors-files/ניו-קומפורט.jpg" },
  { name: "ספות המלך", colors: "פנה למוכרת" },
  { name: "פולירון", colors: "" },
  { name: "קומותיים", colors: "http://localhost:3001/assets/colors-files/קומותיים.jpeg" },
  { name: "קוקטייל", colors: "אתר" },
  { name: "קחטן", colors: "http://localhost:3001/assets/colors-files/קחטן.jpg" },
  { name: "רהיטי הארבעה", colors: "https://forbirman.co.il/" },
  { name: "רויה אקסלוסיב", colors: "" },
  { name: "שולחנות נגר", colors: "פנה למוכרת" },
  { name: "תבי", colors: "http://localhost:3001/assets/colors-files/תבי.pdf" },
];

export enum Categories {
  SALON = 'ריהוט סלוני',
  BEDROOMS = 'חדרי שינה',
  CHILDRENSROOMS = 'חדרי ילדים',
  CLOSETS = 'ארונות',
  DININGAREAS = 'פינות אוכל למטבח',
  OFFICE = 'משרדי',
  MATTRESSES = 'מזרונים',
  CHESTS_DRESSERS ='שידות וקומודות',
  PLASTER = 'קל גבס',
  SALES = 'מבצעים'
}
export enum Salon {
  TABLES_SALON = 'שולחנות סלון',
  CHAIRS_SALON = 'כיסאות סלון',
  LIBRARIES = 'ספריות קודש',
  SOFAS = 'ספות ומערכות ישיבה',
  COMPLEMENTARY_FURNITURE = 'ריהוט משלים לסלון',
}
export enum Tables_Salon {
  TREE_TABLE = 'שולחנות עץ',
  MODERN_TABLE = 'שולחנות מודרנים'
}
export enum  Chairs_Salon{
  TREE_CHAIR = 'כסאות עץ מלא',
  MODERN_CHAIR = 'כסאות מודרניים'
}
export enum Libraries {
  STANDART = 'ספריות קודש סטנדרט',
  PLASTER_LIKE = 'דמוי גבס',
  CARPENTRY = 'נגרות',
  CARPENTRY_PLASTER_LIKE = 'נגרות דמוי גבס',
  COLUMNS = 'עמודונים'
}
export enum Sofas {
  ARE_OPENED = 'נפתחות',
  RECLINERS = 'ריקליינרים',
  SEATING_SYSTEMS = 'מערכות ישיבה'
}
export enum Bedrooms {
  CARPENTRY = 'חדרי שינה עבודת נגר',
  PADDED = 'חדרי שינה מרופדים',
  FORMICA = 'חדרי שינה פורמייקה'
}
export enum Padded {
  STANDART = 'מרופדים סטנדרט',
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
  FORMICA = 'מיטות נוער פורמייקה',
  REMOVABLE = 'הירייזר מזרונים נשלפים',
  FIXED = 'הירייזר מזרונים קבועים',
  TWO_STORIES = 'מיטות קומותיים',
  CARPENTER = 'מיטות נוער עבודת נגר',
  YOUTHBEDS_PADDED = 'מיטות נוער מרופדים'
}
export enum Desks {
  STANDARD = 'מכתביות סטנדרט',
  PERSONALDESIGN = 'מכתביות עיצוב אישי'
}
export enum Closets {
  OPENINGCLOSETS = 'ארונות פתיחה',
  SILDINGCLOSETS = 'ארונות הזזה',
  CORNERCLOSETS = 'ארונות פינתיים'
}
export enum Openingclosets {
  STANDARD = 'ארונות פתיחה סטנדרט',
  PERSONALDESIGN = 'ארונות פתיחה עיצוב אישי'
}
export enum Sildingclosets {
  STANDARD = 'ארונות הזזה סטנדרט',
  PERSONALDESIGN = 'ארונות הזזה עיצוב אישי'
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
    [Salon.TABLES_SALON]: Tables_Salon,
    [Salon.CHAIRS_SALON]: Chairs_Salon,
    [Salon.LIBRARIES]: Libraries,
    [Salon.SOFAS]: Sofas,
    [Salon.COMPLEMENTARY_FURNITURE]: {}
  },
  [Categories.BEDROOMS]: {
    [Bedrooms.CARPENTRY]: {},
    [Bedrooms.PADDED]: Padded,
    [Bedrooms.FORMICA]: {}
  },
  [Categories.CHILDRENSROOMS]: {
    [ChildrensRoom.YOUTHBEDS]: Youthbeds,
    [ChildrensRoom.DESKS]: Desks,
  },
  [Categories.CLOSETS]: {
    [Closets.OPENINGCLOSETS]: Openingclosets,
    [Closets.SILDINGCLOSETS]: Sildingclosets,
    [Closets.CORNERCLOSETS]: {}
  },
  [Categories.DININGAREAS]: DiningAreas,
  [Categories.OFFICE]: Office,
  [Categories.MATTRESSES]: Mattresses,
  [Categories.CHESTS_DRESSERS]: {} as never,
  [Categories.PLASTER]: {} as never,
  [Categories.SALES]: Sales
};

export type Schema = {
  [Categories.SALON]: {
    [Salon.TABLES_SALON]: typeof Tables_Salon,
    [Salon.CHAIRS_SALON]: typeof Chairs_Salon,
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
  [Categories.CHILDRENSROOMS]: {
    [ChildrensRoom.YOUTHBEDS]: typeof Youthbeds;
    [ChildrensRoom.DESKS]: typeof Desks;
  },
  [Categories.CLOSETS]: {
    [Closets.OPENINGCLOSETS]: typeof Openingclosets,
    [Closets.SILDINGCLOSETS]: typeof Sildingclosets,
    [Closets.CORNERCLOSETS]: {}
  },
  [Categories.DININGAREAS]: typeof DiningAreas,
  [Categories.OFFICE]: typeof Office,
  [Categories.PLASTER]: never,
  [Categories.CHESTS_DRESSERS]:never,
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
  | Categories.CHESTS_DRESSERS
  | Categories.SALES
  | Salon.TABLES_SALON
  | Tables_Salon.MODERN_TABLE
  | Tables_Salon.TREE_TABLE
  | Salon.CHAIRS_SALON
  | Chairs_Salon.MODERN_CHAIR
  | Chairs_Salon.TREE_CHAIR
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
  | Youthbeds.YOUTHBEDS_PADDED
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
  | Closets.CORNERCLOSETS
  | DiningAreas.KITCHEN_TABLES_CHAIRS
  | DiningAreas.KITCHEN_TABLES
  | DiningAreas.KITCHEN_CHAIRS
  | DiningAreas.CHAIRS_BAR
  | Office.CHAIRS
  | Office.TABLES
  | Sales.HOUSING_UNITS
  | Sales.ITEMS;
