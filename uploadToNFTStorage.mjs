import { NFTStorage, File } from 'nft.storage'
import { getFilesFromPath } from 'files-from-path'

const token = process.env.TOKEN

const detrisMetadata = [
  // DEMO ASSETS
  { type: ["solid", "detris"], quantity: 1 },
  { type: ["solid", "finiam"], quantity: 1 },
  { type: ["solid", "special"], quantity: 1 },
  { type: ["border", "detris"], quantity: 1 },
  { type: ["border", "finiam"], quantity: 1 },
  { type: ["border", "special"], quantity: 1 },
  { type: ["border pieces", "detris"], quantity: 1 },
  { type: ["border pieces", "finiam"], quantity: 1 },
  { type: ["border pieces", "special"], quantity: 1 },
  { type: ["neon", "detris"], quantity: 1 },
  { type: ["neon", "finiam"], quantity: 1 },
  { type: ["neon", "special"], quantity: 1 },
  { type: ["single", "white"], quantity: 1 },
  { type: ["single", "inverted"], quantity: 1 },

  // ASSETS TO DEPLOY FOR A 101 COLLECTION
  // { type: ["solid", "detris"], quantity: 43 },
  // { type: ["solid", "finiam"], quantity: 9 },
  // { type: ["solid", "special"], quantity: 2 },
  // { type: ["border", "detris"], quantity: 20 },
  // { type: ["border", "finiam"], quantity: 4 },
  // { type: ["border", "special"], quantity: 1 },
  // { type: ["border pieces", "detris"], quantity: 9 },
  // { type: ["border pieces", "finiam"], quantity: 2 },
  // { type: ["border pieces", "special"], quantity: 1 },
  // { type: ["neon", "detris"], quantity: 3 },
  // { type: ["neon", "finiam"], quantity: 2 },
  // { type: ["neon", "special"], quantity: 1 },
  // { type: ["single", "white"], quantity: 3 },
  // { type: ["single", "inverted"], quantity: 1 },
]

const themesBitmap = {
  "solid": {
    "detris": 0,
    "finiam": 1,
    "special": 2
  },
  "border": {
    "detris": 3,
    "finiam": 4,
    "special": 5
  },
  "border pieces": {
    "detris": 6,
    "finiam": 7,
    "special": 8
  },
  "neon": {
    "detris": 9,
    "finiam": 10,
    "special": 11
  },
  "single": {
    "white": 12,
    "inverted": 13
  }
}

async function main() {
  const path = process.argv.slice(2)
  let assetId = 1;
  let metadataList = [];

  async function uploadFiles(type, color) {
    const innerPath = `${path}/${type}/${color}`;
    const uniqueFile = new File([`/${type}/${color}; asset id: ${assetId}; v2`], `${color}/game-type.txt`, {type: "text/plain"})
    const files = await getFilesFromPath(innerPath)
    const storage = new NFTStorage({ token })

    console.log(`storing ${files.length} file(s) from ${innerPath}`)
    const cid = await storage.storeDirectory([...files, uniqueFile], {
        pathPrefix: `${color}/`,
    })
    const metadata = {
      image: `https://ipfs.io/ipfs/${cid}/${color}/preview.png`,
      name: `Detris #${assetId}`,
      description: "Detris! A playable nft. Play anywhere, everywhere.",
      animation_url: `https://ipfs.io/ipfs/${cid}/${color}`,
      attributes: [
        {
          trait_type: "Detris Type",
          value: type,
        },
        {
          trait_type: "Color Scheme",
          value: color,
        },
      ]
    }

    metadataList.push(new File([JSON.stringify(metadata)], `${assetId}`, {type: "application/json"}));
    const status = await storage.status(cid)
    console.log(status, "Code status")
    assetId += 1;
  }

  // reference to this stackoverflow answer
  // https://stackoverflow.com/a/2450976/8733796
  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  function buildDetrisMetadataArray() {
    const detrisMetadataArray = [];
    detrisMetadata.map(element => {
      for(let i = 0; i < element.quantity; i++) {
        detrisMetadataArray.push(element.type)
      }
    })

    return detrisMetadataArray
  }

  const typesArray = shuffle(buildDetrisMetadataArray());

  for(let i = 0; i < typesArray.length; i++) {
    const type = typesArray[i];
    await uploadFiles(type[0], type[1])
  }

  const arrayBitmap = typesArray.map(type => themesBitmap[type[0]][type[1]])

  console.log("Array bitmap of themes order by Asset ID")
  console.log(arrayBitmap)

  const storage = new NFTStorage({ token })
  const cid = await storage.storeDirectory(metadataList, {})
  console.log(`Folder CID: ${cid}`)
}

main()
