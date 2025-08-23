/**
 * Utility functions for blockchain-related operations in the application
 */

import { ethers } from 'ethers';

/**
 * Converts Wei to Ether
 * @param {string|number} wei - Amount in Wei
 * @returns {string} - Amount in Ether
 */
export const weiToEth = (wei) => {
  if (!wei) return '0';
  
  return ethers.utils.formatEther(wei.toString());
};

/**
 * Converts Ether to Wei
 * @param {string|number} eth - Amount in Ether
 * @returns {string} - Amount in Wei
 */
export const ethToWei = (eth) => {
  if (!eth) return '0';
  
  return ethers.utils.parseEther(eth.toString()).toString();
};

/**
 * Formats a gas price in Gwei
 * @param {string|number} gasPrice - Gas price in Wei
 * @returns {string} - Formatted gas price in Gwei
 */
export const formatGasPrice = (gasPrice) => {
  if (!gasPrice) return '0';
  
  const gweiValue = ethers.utils.formatUnits(gasPrice.toString(), 'gwei');
  return parseFloat(gweiValue).toFixed(2);
};

/**
 * Checks if a string is a valid Ethereum address
 * @param {string} address - Ethereum address to check
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidAddress = (address) => {
  if (!address) return false;
  
  try {
    return ethers.utils.isAddress(address);
  } catch (error) {
    return false;
  }
};

/**
 * Gets a shortened version of an Ethereum address
 * @param {string} address - Ethereum address
 * @param {number} prefixLength - Number of characters to keep at the start (default: 6)
 * @param {number} suffixLength - Number of characters to keep at the end (default: 4)
 * @returns {string} - Shortened address
 */
export const shortenAddress = (address, prefixLength = 6, suffixLength = 4) => {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength + 3) return address;
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

/**
 * Calculates transaction fee (gas used * gas price)
 * @param {number|string} gasUsed - Gas used for the transaction
 * @param {number|string} gasPrice - Gas price in Wei
 * @returns {string} - Transaction fee in Ether
 */
export const calculateTransactionFee = (gasUsed, gasPrice) => {
  if (!gasUsed || !gasPrice) return '0';
  
  const fee = ethers.BigNumber.from(gasUsed).mul(ethers.BigNumber.from(gasPrice));
  return ethers.utils.formatEther(fee);
};

/**
 * Estimates gas for a transaction
 * @param {Object} transactionParams - Transaction parameters
 * @param {ethers.providers.Provider} provider - Ethers provider
 * @returns {Promise<string>} - Estimated gas
 */
export const estimateGas = async (transactionParams, provider) => {
  if (!transactionParams || !provider) {
    throw new Error('Transaction parameters and provider are required');
  }
  
  try {
    const gasEstimate = await provider.estimateGas(transactionParams);
    return gasEstimate.toString();
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw error;
  }
};

/**
 * Gets the current network ID
 * @param {ethers.providers.Provider} provider - Ethers provider
 * @returns {Promise<number>} - Network ID
 */
export const getNetworkId = async (provider) => {
  if (!provider) {
    throw new Error('Provider is required');
  }
  
  try {
    const network = await provider.getNetwork();
    return network.chainId;
  } catch (error) {
    console.error('Error getting network ID:', error);
    throw error;
  }
};

/**
 * Gets network name from chain ID
 * @param {number} chainId - Blockchain network chain ID
 * @returns {string} - Network name
 */
export const getNetworkName = (chainId) => {
  const networks = {
    1: 'Ethereum Mainnet',
    3: 'Ropsten Testnet',
    4: 'Rinkeby Testnet',
    5: 'Goerli Testnet',
    42: 'Kovan Testnet',
    56: 'Binance Smart Chain',
    97: 'BSC Testnet',
    137: 'Polygon (Matic)',
    80001: 'Mumbai Testnet',
    43114: 'Avalanche',
    43113: 'Avalanche Fuji Testnet',
    250: 'Fantom Opera',
    4002: 'Fantom Testnet',
    42161: 'Arbitrum One',
    421611: 'Arbitrum Rinkeby',
    10: 'Optimism',
    69: 'Optimism Kovan',
    1337: 'Local Development Chain',
    31337: 'Hardhat Network'
  };
  
  return networks[chainId] || `Unknown Network (${chainId})`;
};

/**
 * Checks if MetaMask is installed
 * @returns {boolean} - True if installed, false otherwise
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

/**
 * Requests account access from MetaMask
 * @returns {Promise<Array<string>>} - Array of accounts
 */
export const requestAccounts = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  } catch (error) {
    console.error('Error requesting accounts:', error);
    throw error;
  }
};

/**
 * Creates a transaction object with proper formatting
 * @param {Object} txParams - Transaction parameters
 * @returns {Object} - Formatted transaction object
 */
export const createTransaction = (txParams) => {
  const { to, from, value, data, gasLimit, gasPrice } = txParams;
  
  const tx = {
    to,
    from
  };
  
  if (value) {
    tx.value = ethers.utils.parseEther(value.toString()).toHexString();
  }
  
  if (data) {
    tx.data = data;
  }
  
  if (gasLimit) {
    tx.gasLimit = ethers.BigNumber.from(gasLimit).toHexString();
  }
  
  if (gasPrice) {
    tx.gasPrice = ethers.BigNumber.from(gasPrice).toHexString();
  }
  
  return tx;
};

/**
 * Converts a hex string to a decimal number
 * @param {string} hex - Hex string
 * @returns {string} - Decimal number as string
 */
export const hexToDecimal = (hex) => {
  if (!hex || typeof hex !== 'string') return '0';
  
  try {
    return ethers.BigNumber.from(hex).toString();
  } catch (error) {
    console.error('Error converting hex to decimal:', error);
    return '0';
  }
};

/**
 * Converts a decimal number to a hex string
 * @param {number|string} decimal - Decimal number
 * @returns {string} - Hex string
 */
export const decimalToHex = (decimal) => {
  if (!decimal) return '0x0';
  
  try {
    return ethers.BigNumber.from(decimal).toHexString();
  } catch (error) {
    console.error('Error converting decimal to hex:', error);
    return '0x0';
  }
};

/**
 * Checks if a user is connected to a specific network
 * @param {number} requiredChainId - Required chain ID
 * @param {ethers.providers.Provider} provider - Ethers provider
 * @returns {Promise<boolean>} - True if on correct network, false otherwise
 */
export const isOnCorrectNetwork = async (requiredChainId, provider) => {
  if (!provider) {
    throw new Error('Provider is required');
  }
  
  try {
    const network = await provider.getNetwork();
    return network.chainId === requiredChainId;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

/**
 * Attempts to switch the network in MetaMask
 * @param {number} chainId - Target chain ID
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export const switchNetwork = async (chainId) => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  const hexChainId = `0x${chainId.toString(16)}`;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }]
    });
    return true;
  } catch (error) {
    console.error('Error switching network:', error);
    return false;
  }
};

/**
 * Add a new token to MetaMask
 * @param {Object} tokenData - Token data
 * @param {string} tokenData.address - Token contract address
 * @param {string} tokenData.symbol - Token symbol
 * @param {number} tokenData.decimals - Token decimals
 * @param {string} tokenData.image - Token image URL (optional)
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export const addTokenToWallet = async (tokenData) => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  const { address, symbol, decimals, image } = tokenData;
  
  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals,
          image
        }
      }
    });
    return true;
  } catch (error) {
    console.error('Error adding token to wallet:', error);
    return false;
  }
};

/**
 * Gets the current gas price
 * @param {ethers.providers.Provider} provider - Ethers provider
 * @returns {Promise<string>} - Gas price in Gwei
 */
export const getCurrentGasPrice = async (provider) => {
  if (!provider) {
    throw new Error('Provider is required');
  }
  
  try {
    const gasPrice = await provider.getGasPrice();
    return formatGasPrice(gasPrice);
  } catch (error) {
    console.error('Error getting gas price:', error);
    throw error;
  }
};

/**
 * Gets the ETH balance of an address
 * @param {string} address - Ethereum address
 * @param {ethers.providers.Provider} provider - Ethers provider
 * @returns {Promise<string>} - Balance in Ether
 */
export const getEthBalance = async (address, provider) => {
  if (!address || !provider) {
    throw new Error('Address and provider are required');
  }
  
  try {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting ETH balance:', error);
    throw error;
  }
};

/**
 * Gets the token balance of an address
 * @param {string} address - Ethereum address
 * @param {string} tokenAddress - Token contract address
 * @param {ethers.providers.Provider} provider - Ethers provider
 * @returns {Promise<string>} - Token balance
 */
export const getTokenBalance = async (address, tokenAddress, provider) => {
  if (!address || !tokenAddress || !provider) {
    throw new Error('Address, token address, and provider are required');
  }
  
  // ERC20 token balance function
  const ABI = ['function balanceOf(address owner) view returns (uint256)'];
  
  try {
    const contract = new ethers.Contract(tokenAddress, ABI, provider);
    const balance = await contract.balanceOf(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
}; 