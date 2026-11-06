class Animal {
  speak() {
    console.log("동물 소리");
  }
}

class Dog extends Animal {
  override speak() {
    console.log("멍멍");
  }
}