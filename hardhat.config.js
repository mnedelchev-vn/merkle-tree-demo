require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.19",
    defaultNetwork: 'hardhat',
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    solidity: {
        compilers: [
            {
                version: '0.8.19',
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    }
                }
            },
            {
                version: '0.8.17',
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    }
                }
            },
            {
                version: '0.8.15',
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    }
                }
            },
            {
                version: '0.8.0',
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    }
                }
            },
            {
                version: '0.7.6',
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    }
                }
            }
        ]
    },
    networks: {
        hardhat: {
            forking: {
                live: false,
                saveDeployments: false,
                accounts: [process.env.PRIVATE_KEY_OWNER, process.env.USER_PRIVATE_KEY],
                url: process.env.MAINNET_NODE || "https://rpc.ankr.com/eth"
            }
        },
        mainnet: {
            url: process.env.MAINNET_NODE || "https://rpc.ankr.com/eth",
            accounts: [process.env.PRIVATE_KEY_OWNER],
            tags: ['prod'],
            gasMultiplier: 1.2,
            maxFeePerGas: 25,
            maxPriorityFeePerGas: 0.8
        }
    },
    mocha: {
         timeout: 60000
    }
};