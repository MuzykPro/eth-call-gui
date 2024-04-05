import React, { useState } from 'react';
import axios from 'axios';
import FunctionSection from './FunctionSection';
import { parseABI } from './utils';
import './AppStyles.css';
function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [readFunctions, setReadFunctions] = useState([]);
  const [writeFunctions, setWriteFunctions] = useState([]);
  const [useProxy, setUseProxy] = useState(false);
  const [proxyAddress, setProxyAddress] = useState('');
  const [resetIndicator, setResetIndicator] = useState(false);
  const [blockNumber, setBlockNumber] = useState('');


  const loadABI = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/getABI/${contractAddress}`);
      const { reads, writes } = parseABI(response.data.abi);
      setReadFunctions(reads);
      setWriteFunctions(writes);
      // Toggle resetIndicator to signal a response reset
      setResetIndicator(prev => !prev);
    } catch (error) {
      console.error('Error fetching ABI:', error);
      alert('Failed to fetch ABI. Check console for more details.');
    }
  };

  const handleQuery = (funcName) => {
    // Placeholder for function query logic
    alert(`Querying ${funcName}... (functionality to be implemented)`);
  };

  return (
    <div>
      <div>
        <label htmlFor="contractAddress">Contract Address:</label>
        <input
          id="contractAddress"
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <button onClick={loadABI}>Load ABI</button>
      </div>

      <div>
        <label htmlFor="useProxy">
          <input
            id="useProxy"
            type="checkbox"
            checked={useProxy}
            onChange={(e) => setUseProxy(e.target.checked)}
            style={{ marginRight: '10px' }}
          />
          Use proxy
        </label>
      </div>

      {useProxy && (
        <div>
          <label htmlFor="proxyAddress">Proxy Address:</label>
          <input
            id="proxyAddress"
            type="text"
            value={proxyAddress}
            onChange={(e) => setProxyAddress(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
        </div>
      )}
      <div>
        <label htmlFor="blockNumber">Block Number:</label>
        <input
          id="blockNumber"
          type="text"
          value={blockNumber}
          onChange={(e) => setBlockNumber(e.target.value)}
          placeholder="Latest (optional)"
          style={{ marginBottom: '10px' }}
        />
      </div>

      <FunctionSection title="Read Functions" functions={readFunctions} onQuery={handleQuery} contractAddress={contractAddress} useProxy={useProxy} proxyAddress={proxyAddress} resetIndicator={resetIndicator} blockNumber={blockNumber} />
      <FunctionSection title="Write Functions" functions={writeFunctions} onQuery={handleQuery} contractAddress={contractAddress} useProxy={useProxy} proxyAddress={proxyAddress} resetIndicator={resetIndicator} blockNumber={blockNumber} />
    </div>
  );
}

export default App;
