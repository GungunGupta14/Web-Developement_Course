console.log('chaliye suru krte  hai')

// obejct create 
// let rectangle={
//     length:1,
//     breadth:2,

//     draw: function() {
//         console.log('drawing rectangle');
//     }
// }

// factory funtion 

// function createRectangle(len,bre){
//     return rectangle={
//         length:len,
//         breadth:bre,

//         // draw: function() {
//         //     console.log('drawing rectangle');
//         // }
//         draw() {
//             console.log('drawing rectangle');
//         }
//     };
// }

// let rectangle_1=createRectangle(5,4);
// let rectangle_2=createRectangle(2,3);
// let rectangle_3=createRectangle(7,9);

// // Camelcase-> numberofstudents
// // constructor funtion -> pascal Notation -> first letter of every letter is capital-> NumberOfStudents

// function Rectangle(len,bre){
//     this.length=len;
//     this.breadth=bre;
//     this.draw=function(){
//         console.log('drawing');
//     }
// }
// // obejct reaction using constructor funtion 
// let rectangleObject=new Rectangle(4,6);
// rectangleObject.color='yellow';
// console.log(rectangleObject)

// delete rectangleObject.color;
// console.log(rectangleObject)

// let rectangle1=new Function(
//     'length','breadth',
//     `this.length=len;
//     this.breadth=bre;
//     this.draw=funtion(){
//         console.log(''drawing');
// }`); 

// let rect= new rectangle1(2,3);

// rect.length
// console.log(rect)

// let a=10;
// let b=a;

// a++;
// console.log(a)
// console.log(b)

// let a={ value:10};
// let b=a;

// a.value++;
// console.log(a.value)
// console.log(b.value)

// let a = 10;

// function inc(a) {
//     a++;
// }
// inc(a);
// console.log(a);

let rectangle = {
    length: 2,
    breadth: 3
};

// for (let key in rectangle) {
//     console.log(key, rectangle[key]);
// }
// for (let key of Object.entries(rectangle)) {
//     console.log(key);
// }
// if ('color' in rectangle) {
//     console.log('present')
// } else {
//     console.log('absent')
// }
let src = {
    a: 10,
    b: 20,
    c: 30
};
// let dest = {};
// for (let key in src) {
//     dest[key] = src[key];
// };
// console.log(dest);
// src.a++;
// console.log(dest);
// let src2 = {
//     value: 25
// }
// let dest = Object.assign({}, src, src2);
// console.log(dest);
// src.a++;
// console.log(dest);
let dest = {...src };
console.log(dest);
src.a++;
console.log(dest);