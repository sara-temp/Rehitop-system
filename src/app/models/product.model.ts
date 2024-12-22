export class Product {
  Id: string
  image: string
  name: string
  categories: [Category]
  price: number
  describe?: string
  colors?: string
  company?: string

  constructor(
    Id: string,
    image: string,
    name: string,
    categories: [Category],
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


export enum Category {
  Sofas = 'ספות',
  Beds = 'מיטות',
  Closets = 'ארונות חדר ילדים',
  Chairs = 'כיסאות'

}
