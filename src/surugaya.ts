import Xray from "x-ray"
import qs from "qs"

const x = Xray({
  filters: {
    trim: value => (typeof value === "string" ? value.trim() : value),

    priceFind: value =>
      typeof value === "string" ? value.replace(/[^0-9]/g, "") : value,

    parseInt: value => (typeof value === "string" ? Number(value) : value),

    parseAvailability: value => {
      if (typeof value !== "string") {
        return value
      }
      const match = value.match(/(.*)：/)
      if (!match) return value

      return match[1]
    },

    parseProductCode: value => {
      if (typeof value !== "string") {
        return value
      }
      const rightSlash = value.lastIndexOf("/")
      return value.slice(rightSlash + 1)
    },

    formImageUrl: productCode =>
      `https://www.suruga-ya.jp/pics/boxart_m/${productCode}m.jpg`,
  },
})

type Options = {
  maxPages: number
}

const defaultOptions = {
  maxPages: Infinity,
}

export async function search(
  query: string,
  options: Options = defaultOptions
): Promise<Item[]> {
  const queryString = qs.stringify({
    search_word: query,
    rankBy: "price:descending",
  })
  const results: any[] = await x(
    `https://www.suruga-ya.jp/search?${queryString}`,
    ".item",
    [
      {
        productName: ".title a",
        productURL: ".thum a@href",
        productCode: ".thum a@href | parseProductCode",
        imageURL: ".thum a@href | parseProductCode | formImageUrl",
        availability: [".price_teika | parseAvailability | trim"],
        prices: [".price_teika | priceFind | parseInt"],
      },
    ]
  )
    .paginate("li.next a@href")
    .limit(options.maxPages)

  return results.flatMap(result =>
    result.prices.map((price, idx) => ({
      productName: result.productName,
      productURL: result.productURL,
      productCode: result.productCode,
      imageURL: result.imageURL,
      price: price,
      availability: result.availability[idx],
    }))
  )
}

type Item = {
  productURL: string
  imageURL: string
  productName: string
  price: number
  productCode: string
  availability: string
}
