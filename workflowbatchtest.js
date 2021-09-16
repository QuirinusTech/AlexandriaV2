async function workFlowTicketParser(arg) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
      console.log(arg)
      return arg;
    }, 2000*arg);
  });
}

const data = [1, 2, 3, 4, 5, 6, 7, 8];

async function WorkFlowBatch() {
  const asyncFunctions = data.map(entry => workFlowTicketParser(entry));
  // stolen code
  const results = await Promise.all(asyncFunctions)
  return results
}

let result = WorkFlowBatch()
console.log(result);
