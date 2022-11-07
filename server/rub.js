let pay = [];
let initAmt = 2000;


for(let i =1; i<=100; i++){
    initAmt = initAmt +(initAmt/6);
    pay.push(initAmt);
}

console.log(pay);


// const items = [
//     {name: 'Bike', price:100},
//     {name: 'TV', price:200},
//     {name: 'Album', price:10},
//     {name: 'Book', price:5},
//     {name: 'Phone', price:500},
//     {name: 'Computer', price:1000},
//     {name: 'Keyboard', price:25}
// ]

// const total = items.forEach((item)=>{
//    console.log(item.price);
// })

// console.log(total)

// map, reduce, includes, filter, find, forEach, some, every