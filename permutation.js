function heapPermutation(arr) {
  const date0 = new Date();
  let returnArr = [""];
  const helper = () => {
    returnArr = arr.reduce((accu, current) => {
      for (let i = 0; i < returnArr.length; i++) {
        if (!returnArr[i].includes(current)) accu.push(returnArr[i] + current);
      }
      return accu;
    }, []);
  };
  for (let j = 0; j < arr.length; j++) {
    helper();
  }
  return [returnArr.map(e => e.split("").map(f => parseInt(f))), (new Date() - date0) + "ms"];
}


module.exports = heapPermutation