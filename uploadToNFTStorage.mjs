import { NFTStorage, File } from 'nft.storage'
import { getFilesFromPath } from 'files-from-path'

const token = process.env.TOKEN

const detrisMetadata = [
  // DEMO ASSETS
  { type: ["solid", "detris"], quantity: 4 },
  // { type: ["border", "detris"], quantity: 3 },
  // { type: ["border", "pieces"], quantity: 2 },
  // { type: ["neon", "detris"], quantity: 2 },
  // { type: ["single", "detris"], quantity: 1 },
  // { type: ["inverted", "detris"], quantity: 1 },

  // ASSETS TO DEPLOY FOR A 99 COLLECTION
  // { type: ["solid", "detris"], quantity: 42 },
  // { type: ["solid", "palette76"], quantity: 9 },
  // { type: ["solid", "palette7998"], quantity: 2 },
  // { type: ["border", "detris"], quantity: 19 },
  // { type: ["border", "palette76"], quantity: 4 },
  // { type: ["border", "palette7998"], quantity: 1 },
  // { type: ["border pieces", "detris"], quantity: 9 },
  // { type: ["border pieces", "palette76"], quantity: 2 },
  // { type: ["border pieces", "palette7998"], quantity: 1 },
  // { type: ["neon", "detris"], quantity: 3 },
  // { type: ["neon", "palette76"], quantity: 2 },
  // { type: ["neon", "palette7998"], quantity: 1 },
  // { type: ["single", "white"], quantity: 3 },
  // { type: ["inverted", "black"], quantity: 1 },
]

async function main() {
  const path = process.argv.slice(2)
  let assetId = 0;
  let metadataList = [];

  async function uploadFiles(type, color) {
    const innerPath = `${path}/${type}/${color}`;
    const uniqueFile = new File([`/${type}/${color}; asset id: ${assetId}; v2`], "detris/game-type.txt", {type: "text/plain"})
    const files = await getFilesFromPath(innerPath)
    const storage = new NFTStorage({ token })

    console.log(`storing ${files.length} file(s) from ${innerPath}`)
    const cid = await storage.storeDirectory([...files, uniqueFile], {
        pathPrefix: "detris/",
    })
    const metadata = {
      image: `https://ipfs.io/ipfs/${cid}/detris/preview.png`,
      name: `Detris #${assetId}`,
      description: "Detris! A playable nft. Play anywhere, everywhere.",
      animation_url: `https://ipfs.io/ipfs/${cid}/detris`,
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

  const typesArray = buildDetrisMetadataArray();

  shuffle(typesArray).map(type => uploadFiles(type[0], type[1]))

  const storage = new NFTStorage({ token })
  const cid = await storage.storeDirectory(metadataList, {})
  console.log(`Folder CID: ${cid}`)
}

main()
