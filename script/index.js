const ethers = require("ethers");
const ensData = require("./data/ens_twitter.json");
const fs = require("fs");

const ALCHEMY_KEY = "MkaW-uIlmxwqRBFWH8fqQ5rO-ZPyzXZr";
const CHARS =
  "abcdefghijklmnopqrstuvwxyz0123456789-_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DOM = ".eth";

const extractEns = (username) => {
  if (!username) return null;
  if (!username.includes(DOM)) return null;
  const ens = username.split(DOM)[0];
  if (ens.length < 3 || ens.length > 32) return null;
  for (let i = ens.length - 1; i >= 0; i--) {
    if (!CHARS.includes(ens[i])) {
      if (i > ens.length - 4) return null;
      return ens.substring(i + 1) + DOM;
    }
  }
  return ens + DOM;
};

const getAddresses = async () => {
  let content = "Username,Address";
  const provider = new ethers.providers.AlchemyProvider(1, ALCHEMY_KEY);

  console.log(ensData.length);
  for (let i = 0; i < ensData.length; i++) {
    const ens = ensData[i];
    if (!ens.handle || !ens.name) continue;
    const ensExtracted = extractEns(ens.name);
    if (!ensExtracted) continue;
    try {
      const address = await provider.resolveName(ensExtracted);
      if (!address) continue;
      content += `\n${ens.handle},${address}`;
      console.log(`${ens.handle} - ${ensExtracted} - ${address}`);
      console.log(`${i} / ${ensData.length}`);
    } catch (e) {
      console.log(e);
    }
  }

  fs.writeFile("./data.csv", content, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

getAddresses();
