let pay = [];
let initAmt = 5000;

for(let i =1; i<=100; i++){
    initAmt = initAmt +(initAmt/5);
    pay.push(initAmt);
}

console.log(pay);