# detris-upload-ipfs
Repository with a Node script to upload Detris data to IPFS using NFT.Storage.

## Setup

Run

```
asdf install
yarn
cp .envrc.sample .envrc
```

And then setup the `.envrc` with the correct variables.

## Run the script

This script takes as input the path for a base folder that contains a structure of types of attributes we want to have, and each folder will have the compiled code for that Detris version and a preview image called `preview.png`.

First you need to create a structure of folders that matches the path under `detrisMetadata`. The script will look inside each of them and upload it's content to IPFS. Example:

```
├── border
│   ├── detris
│   │  ├── ...
│   │  └── preview.png
│   ├── palette76
│   │   ├── ...
│   │   └── preview.png
│   └── palette7998
│       ├── ...
│       └── preview.png
├── border pieces
│   ├── detris
│   │   ├── ...
│   │   └── preview.png
│   ├── palette76
│   │   ├── ...
│   │   └── preview.png
│   └── palette7998
│       ├── ...
│       └── preview.png
├── inverted
│   └── detris
│       ├── ...
│       └── preview.png
├── neon
│   ├── detris
│   │   ├── ...
│   │   └── preview.png
│   ├── palette76
│   │   ├── ...
│   │   └── preview.png
│   └── palette7998
│       ├── ...
│       └── preview.png
├── single
│   └── detris
│       ├── ...
│       └── preview.png
├── solid
│   ├── detris
│   │   ├── ...
│   │   └── preview.png
│   ├── palette76
│   │   ├── ...
│   │   └── preview.png
│   └── palette7998
│       ├── ...
│       └── preview.png
└─
```

Then run `node --trace-warnings uploadToNFTStorage.mjs <path/to/base/directory/of/folder/structure>`

The final output represents the CID for the directory that holds the metadata for your collection. Opening `ipfs.io/ipfs/<cid>` should show you the contents of that directory.
