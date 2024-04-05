import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FunctionSection = ({ title, functions, contractAddress, useProxy, proxyAddress, resetIndicator, blockNumber }) => {
  const [inputValues, setInputValues] = useState({});
  const [responses, setResponses] = useState({}); // New state for storing responses

  useEffect(() => {
    // Clear the function responses when resetIndicator prop changes
    setResponses({});
  }, [resetIndicator]);

  const handleInputChange = (funcName, paramName, value) => {
    setInputValues({
      ...inputValues,
      [funcName]: { ...inputValues[funcName], [paramName]: value },
    });
  };

  const handleQuery = async (func) => {
    const paramValues = Object.values(inputValues[func.name] || {}).map(value => value.trim());

    try {
      const response = await axios.post('http://localhost:5000/callContract', {
        contractAddress,
        functionName: func.name,
        paramValues, // No need for paramTypes anymore
        proxyAddress: useProxy ? proxyAddress : undefined, // Include this only if using a proxy
        blockNumber: blockNumber || 'latest', // Include the blockNumber, defaulting to 'latest' if not specified
      });
      // Update the specific function response
      setResponses({
        ...responses,
        [func.name]: response.data.result || 'No result', // Fallback message
      });
    } catch (error) {
      console.error('Error querying contract function:', error);
      setResponses({
        ...responses,
        [func.name]: 'Error querying contract function.',
      });
    }
  };

  const renderResponse = (response) => {
    // Assume comma-separated values for simplicity; adjust as needed
    const items = response.split(',');
    return items.map((item, index) => (
      <div key={index}>{item.trim()}</div>
    ));
  };

  return (
    <div className="function-section">
      <h3>{title}</h3>
      {functions.map((func, index) => (
        <div key={`${title}-${index}`}>
          <h4>{`${index + 1}. ${func.signature}`}</h4>
          {func.inputs.map((input, inputIndex) => (
            <div key={`${title}-input-${index}-${inputIndex}`}>
              <label>{`${input.name} (${input.type}):`}</label>
              <input
                type="text"
                placeholder={`Enter ${input.name}`}
                onChange={e => handleInputChange(func.name, input.name, e.target.value)}
                style={{ margin: '5px' }}
              />
            </div>
          ))}
          {responses[func.name] && <div className="function-response">{renderResponse(responses[func.name].toString())}</div>}
          <button onClick={() => handleQuery(func)}>Query</button>
        </div>
      ))}
    </div>
  );
};

export default FunctionSection;
