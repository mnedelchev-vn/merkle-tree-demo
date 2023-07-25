// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "./interfaces/IERC20.sol";
import "./libs/MerkleProof.sol";

contract TestMerkleTree {
    error InvalidClaim();
    error AlreadyClaimed();

    address public immutable token;
    bytes32 public immutable MERKLE_ROOT;
    mapping(address => uint) public claimed;

    constructor(address token_, bytes32 MERKLE_ROOT_) {
        token = token_;
        MERKLE_ROOT = MERKLE_ROOT_;
    }

    function claim(
        bytes32[] calldata proof,
        uint256 amount
    ) external {
        if (claimed[msg.sender] != 0) revert AlreadyClaimed();
        bytes32 leaf = keccak256(abi.encode(msg.sender, amount));
        if (!MerkleProof.verifyCalldata(proof, MERKLE_ROOT, leaf)) revert InvalidClaim();

        claimed[msg.sender] = 1;
        IERC20(token).transfer(msg.sender, amount);
    }
}