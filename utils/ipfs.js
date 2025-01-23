import axios from "axios";

const NEXT_PUBLIC_PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const NEXT_PUBLIC_PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

export async function uploadToIPFS(data) {
  try {
    const { file, name, description } = data;
    const formData = new FormData();
    formData.append("file", file);
    // formData.append(
    //   "pinataMetadata",
    //   JSON.stringify({
    //     name: new Date().toISOString(),
    //     keyvalues: {
    //       name,
    //       description,
    //     },
    //   })
    // );
    // formData.append(
    //   "pinataMetadata",
    //   '{\n  "name": "haeello",\n  "keyvalues": {\n    "name": "valalall",\n    "jkjkj": "jkjk"\n  }\n}'
    // );
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data`,
          pinata_api_key: NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: NEXT_PUBLIC_PINATA_SECRET_KEY,
        },
      }
    );

    return res.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}

export async function createMetadata(metadata) {
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: NEXT_PUBLIC_PINATA_SECRET_KEY,
        },
      }
    );
    return res.data.IpfsHash;
  } catch (error) {
    console.error("Error creating metadata:", error);
    throw error;
  }
}
