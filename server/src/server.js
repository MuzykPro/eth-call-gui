require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { ethers } = require('ethers');
const cors = require('cors');
const app = express();
const port = 5000;

const ETHERSCAN_API_TOKEN = process.env.ETHERSCAN_API_TOKEN;
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;

const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);

app.use(cors());
app.use(express.json());

const abiCache = {};

// New route to fetch contract ABI from Etherscan
app.get('/getABI/:contractAddress', async (req, res) => {
  const { contractAddress } = req.params;

  // Check if ABI is already in cache
  if (abiCache[contractAddress]) {
    return res.json({ abi: abiCache[contractAddress] });
  }

  // If not in cache, fetch from Etherscan
  const apiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_TOKEN}`;
  try {
    const response = await axios.get(apiUrl);
    if (response.data.status === "1") {
      const abi = JSON.parse(response.data.result);
      // Store ABI in cache
      abiCache[contractAddress] = abi;
      res.json({ abi });
    } else {
      res.status(400).json({ error: 'Failed to fetch ABI from Etherscan.' });
    }
  } catch (error) {
    console.error('Error fetching ABI from Etherscan:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



app.post('/callContract', async (req, res) => {
  const { contractAddress, functionName, paramValues, proxyAddress, blockNumber } = req.body;

  let targetAddress = contractAddress;
  // If a proxy address is provided, use it as the target address for the call
  if (proxyAddress) {
    targetAddress = proxyAddress;
  }

  try {
    let contractABI = abiCache[contractAddress];

    if (!contractABI) {
      // Fetch ABI from Etherscan if not in cache
      const abiResponse = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_TOKEN}`);
      if (abiResponse.data.status !== "1") {
        return res.status(400).json({ error: 'Failed to fetch ABI from Etherscan.' });
      }

      contractABI = JSON.parse(abiResponse.data.result);
      // Store ABI in cache
      abiCache[contractAddress] = contractABI;
    }
    const contract = new ethers.Contract(targetAddress, contractABI, provider);

       // Encoding the function call is not necessary with ethers.js
    // as it abstracts away the encoding step for you
    const callResult = await contract[functionName](...paramValues, {
      blockTag: blockNumber === 'latest' ? blockNumber : Number(blockNumber)
    });

    res.json({ result: callResult.toString() });
  } catch (error) {
    console.error('Error making contract call:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
