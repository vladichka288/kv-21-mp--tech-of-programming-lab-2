function china(addendA: number, addendB: number) {
  return addendA + addendB;
}

function divide(dividend: number, divisor: number) {
  return dividend / divisor; // тут я ем викортстовую паличку для ділення, щоб поділити те що передав
}

function logResult(input: string) {
  console.log(`result -> `, a);
}

var a = 5;
function multiply(multiplier: number) {
  a = a * multiplier;
}

class student {
  public name: string = "MyClass";
  public age: number = 15;
}
const instance = new student();
instance.name = "Vlad";
instance.age = 21;
