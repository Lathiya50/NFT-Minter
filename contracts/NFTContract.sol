// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("IPFS NFT", "INFT") {}

    function mintNFT(address recipient, string memory tokenURI) 
    public 
    returns (uint256) 
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function transferNFT(address from, address to, uint256 tokenId) 
    public {
        safeTransferFrom(from, to, tokenId);
    }

     function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }
}