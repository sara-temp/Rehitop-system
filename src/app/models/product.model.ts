export class Product {
  Id: number
  image: string
  name: string
  category: Category
  price: number
  describe?: string
  colors?: string
  company?: string

  constructor(
    Id: number,
    image: string,
    name: string,
    category: Category,
    price: number,
    describe?: string,
    colors?: string,
    company?: string
  ) {
    this.Id = Id
    this.image = image
    this.name = name
    this.category = category
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
