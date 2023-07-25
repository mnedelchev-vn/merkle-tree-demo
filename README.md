# Merkle Tree DEMO

### Project setup commands:
* ```npm install``` - Downloading required packages.

### Before starting make sure to create .env file at the root of the project containing the following data:
```
    MAINNET_NODE=XYZ
```
    
### PURPOSE:
This is a **DEMO** USDC Airdrop project just to test the functionality of OpenZeppelin Merkle Tree. ```contracts/TestMerkleTree.sol``` has a method called ```claim``` which is verifying Merkle tree proofs. Run ```npx hardhat test test/TestMerkleTree.js``` to reproduce validation of the proofs.