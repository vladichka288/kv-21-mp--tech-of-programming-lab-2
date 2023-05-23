function sum(addendA: number, addendB: number) {
  return addendA + addendB;
}

function divide(dividend: number, divisor: number) {
  return dividend / divisor;
}

function logResult(input: string) {
  console.log("result -> ", input);
}

function multiply(multiplierA: number, multiplierB: number) {
  return multiplierA * multiplierB;
}

class Student {
  private name: string | null = null;
  private age: number | null = null;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  public changeName(name: string) {
    this.name = name;
  }
  public changeAge(age: number) {
    this.age = age;
  }
}
const instance = new Student("Vlad", 21);
instance.changeName("Vlad");
instance.changeAge(21);
