const { ethers } = require("hardhat")
const { expect } = require("chai");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require("keccak256");
require("dotenv").config();

async function impersonateAddress(address) {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [address],
    });
    const signer = await ethers.provider.getSigner(address);
    return signer;
}

describe("Merkle Tree Test", function () {
    let owner;
    let user1;
    let user2;
    let user3;
    let usdcHolder;
    let TestMerkleTreeContract;
    let usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    let USDC;

    let AbiCoder = new ethers.AbiCoder();
    const leaves = [
        AbiCoder.encode(["address", "uint256"], ['0x79e2ba942b0e8fdb6ff3d406e930289d10b49ade', ethers.parseUnits('1000', 6)]),
        AbiCoder.encode(["address", "uint256"], ['0x171cda359aa49E46Dec45F375ad6c256fdFBD420', ethers.parseUnits('2000', 6)])
    ].map(x => keccak256(x));
    const MERKLE_TREE = new MerkleTree(leaves, keccak256, {sortPairs: true});
    const root = MERKLE_TREE.getRoot();

    before(async function () {
        let signers = await ethers.getSigners();
        owner = signers[0];
        user1 = await impersonateAddress("0x79e2ba942b0e8fdb6ff3d406e930289d10b49ade");
        user2 = await impersonateAddress("0x171cda359aa49E46Dec45F375ad6c256fdFBD420");
        user3 = await impersonateAddress("0xA7EFAe728D2936e78BDA97dc267687568dD593f3");
        usdcHolder = await impersonateAddress("0xaaef851977578d9CDF0042fB88F4532b9Ef602B2");
        TestMerkleTreeContract = await hre.ethers.getContractFactory('TestMerkleTree');
        TestMerkleTreeContract = await TestMerkleTreeContract.deploy(
            usdcAddress,
            root
        );
        USDC = await hre.ethers.getContractAt('contracts/interfaces/IERC20.sol:IERC20', usdcAddress);

        await USDC.connect(usdcHolder).transfer(TestMerkleTreeContract.target, ethers.parseUnits('10000', 6));
    });

    it("Test user1 VALID claim", async function () {
        const PROOF = MERKLE_TREE.getHexProof(leaves[0]);
        const usdcBalance = await USDC.balanceOf(user1.address);

        const usdcValue = ethers.parseUnits('1000', 6);
        await TestMerkleTreeContract.connect(user1).claim(
            PROOF,
            usdcValue
        );

        const usdcBalanceAfter = await USDC.balanceOf(user1.address);

        expect(usdcBalanceAfter).to.be.greaterThan(usdcBalance);
        expect(BigInt(usdcBalanceAfter)).to.equal(BigInt(usdcBalance) + BigInt(usdcValue));
    });

    it("Test user1 INVALID claim ( trying to claim again after already claiming )", async function () {
        const PROOF = MERKLE_TREE.getHexProof(leaves[0]);
        const usdcBalance = await USDC.balanceOf(user1.address);

        const usdcValue = ethers.parseUnits('1000', 6);
        await TestMerkleTreeContract.connect(user1).claim(
            PROOF,
            usdcValue
        );

        const usdcBalanceAfter = await USDC.balanceOf(user1.address);

        expect(usdcBalanceAfter).to.be.greaterThan(usdcBalance);
        expect(BigInt(usdcBalanceAfter)).to.equal(BigInt(usdcBalance) + BigInt(usdcValue));
    });

    it("Test user2 INVALID claim ( false amount )", async function () {
        const PROOF = MERKLE_TREE.getHexProof(leaves[1]);
        const usdcBalance = await USDC.balanceOf(user2.address);

        const usdcValue = ethers.parseUnits('3000', 6);
        await TestMerkleTreeContract.connect(user2).claim(
            PROOF,
            usdcValue
        );

        const usdcBalanceAfter = await USDC.balanceOf(user2.address);

        expect(usdcBalanceAfter).to.be.greaterThan(usdcBalance);
        expect(BigInt(usdcBalanceAfter)).to.equal(BigInt(usdcBalance) + BigInt(usdcValue));
    });

    it("Test user2 VALID claim", async function () {
        const PROOF = MERKLE_TREE.getHexProof(leaves[1]);
        const usdcBalance = await USDC.balanceOf(user2.address);

        const usdcValue = ethers.parseUnits('2000', 6);
        await TestMerkleTreeContract.connect(user2).claim(
            PROOF,
            usdcValue
        );

        const usdcBalanceAfter = await USDC.balanceOf(user2.address);

        expect(usdcBalanceAfter).to.be.greaterThan(usdcBalance);
        expect(BigInt(usdcBalanceAfter)).to.equal(BigInt(usdcBalance) + BigInt(usdcValue));
    });

    it("Test user3 INVALID claim ( false user )", async function () {
        const PROOF = MERKLE_TREE.getHexProof(leaves[1]);
        const usdcBalance = await USDC.balanceOf(user3.address);

        const usdcValue = ethers.parseUnits('2000', 6);
        await TestMerkleTreeContract.connect(user3).claim(
            PROOF,
            usdcValue
        );

        const usdcBalanceAfter = await USDC.balanceOf(user3.address);

        expect(usdcBalanceAfter).to.be.greaterThan(usdcBalance);
        expect(BigInt(usdcBalanceAfter)).to.equal(BigInt(usdcBalance) + BigInt(usdcValue));
    });
});