const contentElement = document.getElementById("content");
contentElement.textContent = "Hello World";
console.log("Hello World");

console.log("While loop (1 to 10): ");

let i = 1;
while (i <= 10) {
    if (i % 3 === 0) {
        console.log(i);
    }
    i++;
}

console.log("Do While loop (10 to 1): ");

i = 10;
do {
    if (i % 3 === 0) {
        console.log(i);
    }
    i--;
} while (i > 0);

console.clear();
testCoercion(2, 1, "+");
testCoercion("2", 1, "+");
testCoercion(1, "2", "+");
testCoercion("a", 1, "+");
testCoercion(2, 1, "-");
testCoercion(1, "2", "-");
testCoercion("2", 1, "-");
testCoercion("a", 1, "-");

let values = [
  "a",
  "1",
  0,
  3,
  3.14,
  4n,
  true,
  false,
  null,
  undefined,
  [6, "7"],
  { a: 1 },
];

let operators = ["+", "-", "*", "/"];

operators.forEach((operator) => {
  values.forEach((left) => {
    values.forEach((right) => {
      testCoercion(left, right, operator);
    });
  });
});

// Exercise 4: Function scope and block scope
function testScope() {
  console.log("testing Scope");
  var x = 1;
  let y = 2;
  const z = 3;

  if (true) {
    var x = 4;
    let y = 5;
    const z = 6;
    var newX = 7;
    let newY = 8;
    const newZ = 9;
    console.log(x, y, z);
    console.log(newX, newY, newZ);
  }

  console.log(x, y, z);
  console.log(newX);
  console.log(newY);
  console.log(newZ);
}

function getTypeStringOf(value) {
  let type = typeof value;
  if (type === "object") {
    type = Array.isArray(value) ? "array" : value === null ? "null" : "object";
  }
  return type;
}

function testCoercion(left, right, operator = "+") {
  let result;
  try {
    switch (operator) {
      case "+":
        result = left + right;
        break;
      case "-":
        result = left - right;
        break;
      case "*":
        result = left * right;
        break;
      case "/":
        result = left / right;
        break;
      case "===":
        result = left === right;
        break;
      case "!==":
        result = left !== right;
        break;
      case "==":
        result = left == right;
        break;
      case "!=":
        result = left != right;
        break;
      case "??":
        result = left ?? right;
        break;
      case "||":
        result = left || right;
        break;
    }
    console.log(`\
${left} (${getTypeStringOf(left)})\
${operator} \
${right} (${getTypeStringOf(right)}) = \
${result} (${getTypeStringOf(result)})`);
  } catch (e) {
    console.log(`\
${left} (${getTypeStringOf(left)})\
${operator} \
${right} (${getTypeStringOf(right)}) = \
Error: ${e.message}`);
  }
}
