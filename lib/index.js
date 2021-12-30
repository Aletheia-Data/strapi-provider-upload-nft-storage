'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _nft = require("nft.storage");

/* eslint-disable no-unused-vars */
module.exports = {
  provider: 'nft-storage',
  name: 'Strapi NFT Storage',
  init: (config) => {

    const client = new _nft.NFTStorage({
      token: config.apiKey
    });

    return {
      upload: async (file) => {
        
        const ipfs = await client.storeBlob(new _nft.Blob([file.buffer]));
        const status = await client.status(ipfs)
        
        file.cid = ipfs;
        file.url = `https://${ipfs}.ipfs.dweb.link/`
        
        return Promise.resolve();

      },
      delete: async (file) => {

        if (file.formats){
          const thumbnail = file.formats.thumbnail ? file.formats.thumbnail.cid : null;
          const large = file.formats.large ? file.formats.large.cid : null;
          const medium = file.formats.medium ? file.formats.medium.cid : null;
          const small = file.formats.small ? file.formats.small.cid : null;
          
          // remove
          thumbnail ? await client.delete(thumbnail) : null
          large ? await client.delete(large) : null
          medium ? await client.delete(medium) : null
          small ? await client.delete(small) : null
        }

        return Promise.resolve()
      }
    };
  }
};