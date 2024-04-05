// utils.js
export const parseABI = (abiArray) => {
    const reads = [], writes = [];
  
    abiArray.forEach((item, index) => {
      if (item.type === 'function') {
        const funcDetail = {
          id: index,
          signature: `${item.name}(${item.inputs.map(input => input.type).join(', ')})`,
          name: item.name,
          inputs: item.inputs,
          stateMutability: item.stateMutability
        };
  
        if (['view', 'pure'].includes(item.stateMutability)) {
          reads.push(funcDetail);
        } else {
          writes.push(funcDetail);
        }
      }
    });
  
    return { reads, writes };
  };
  