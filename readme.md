# Surugaya API (scraper)

## Examples

.then:

```js
const surugaya = require("surugaya")
surugaya.search("東方 ふもふも").then(results => console.log(results))
/* returns an array of objects like
  productURL: string
  imageURL: string
  productName: string
  price: number
  productCode: string
  availability: string
  */
```

async/await:

```js
const surugaya = require("surugaya")
async function getStuff() {
  const results = surugaya.search("東方 ふもふも")
  console.log(results)
  /* returns an array of objects like
  productURL: string
  imageURL: string
  productName: string
  price: number
  productCode: string
  availability: string
  */
}
```
