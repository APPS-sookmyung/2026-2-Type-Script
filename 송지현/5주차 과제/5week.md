
# 19. 클래스 기본 문법

## 19-1. 클래스와 생성자

`class`는 객체를 생성하기 위한 설계도이며, `new`로 인스턴스를 생성한다.

```ts
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  describe(): string {
    return `${this.name} is ${this.age} years old.`;
  }
}

const john = new Person("John", 30);
john.describe();
```

- `constructor` : 인스턴스 생성 시 자동 실행
- `this` : 현재 인스턴스를 가리킴
- `new` : 클래스를 바탕으로 인스턴스 생성
- 메서드는 별도 지정이 없으면 `public`

## 19-2. 생성자 매개변수

생성자도 일반 함수처럼 **기본값, 선택적 매개변수, 나머지 매개변수**를 사용할 수 있다.

```ts
class Book {
  constructor(
    public title: string = "Untitled",
    public pages: number = 100
  ) {}
}

new Book();                // 기본값 사용
new Book("TypeScript", 300);
```

```ts
class Logger {
  constructor(prefix?: string, ...messages: string[]) {
    console.log(prefix ?? "Log", ...messages);
  }
}
```

- `?` : 생략 가능한 매개변수
- `=` : 기본값 지정
- `...` : 여러 인자를 배열로 받음

## 19-3. 접근 제어자

클래스의 속성과 메서드에 대한 접근 범위를 제한한다.

```ts
class User {
  public id: number;
  private password: string;
  protected email: string;

  constructor(id: number, pw: string, email: string) {
    this.id = id;
    this.password = pw;
    this.email = email;
  }
}
```

| 접근 제어자 | 접근 범위 |
|---|---|
| `public` | 클래스 내부·외부 모두 |
| `private` | 해당 클래스 내부만 |
| `protected` | 해당 클래스 및 자식 클래스 내부 |

접근 제어자를 생략하면 기본적으로 `public`이 적용된다.

## 19-4. 생성자 단축 문법

생성자 매개변수에 접근 제어자를 붙이면 **속성 선언과 초기화를 동시에** 처리한다.

```ts
class User {
  constructor(
    public id: number,
    public name: string
  ) {}
}

const user = new User(1, "Alice");
console.log(user.name);
```

별도의 속성 선언이나 `this.name = name` 작성이 필요하지 않다.

## 19-5. 읽기 전용 속성

`readonly`는 초기화 이후 속성에 새로운 값을 할당하지 못하도록 한다.

```ts
class Config {
  constructor(
    readonly appName: string,
    public version: string = "1.0.0"
  ) {}
}

const config = new Config("MyApp");

config.version = "2.0.0"; // ✅
config.appName = "Other"; // ❌
```

`readonly`는 생성자에서 초기화할 수 있지만 이후에는 재할당할 수 없다.

---

# 20. 클래스와 객체지향 개념

## 20-1. 클래스 상속

`extends`를 사용하면 부모 클래스의 속성과 메서드를 자식 클래스가 물려받는다.

```ts
class Animal {
  constructor(public name: string) {}

  move(): void {
    console.log(`${this.name} moves.`);
  }
}

class Bird extends Animal {
  fly(): void {
    console.log(`${this.name} flies.`);
  }
}

const bird = new Bird("Sparrow");
bird.move(); // 부모 메서드
bird.fly();  // 자식 메서드
```

상속은 기존 기능을 재사용하면서 새로운 기능을 추가할 때 사용한다.

## 20-2. 메서드 오버라이딩과 super

**오버라이딩(Overriding)** 은 부모 클래스의 메서드를 자식 클래스에서 재정의하는 것이다.

```ts
class Animal {
  speak(): void {
    console.log("Sound");
  }
}

class Dog extends Animal {
  override speak(): void {
    console.log("Woof!");
  }
}
```

`super`는 부모 클래스의 생성자나 메서드에 접근할 때 사용한다.

```ts
class Person {
  constructor(public name: string) {}

  greet(): void {
    console.log(`Hello, ${this.name}`);
  }
}

class Employee extends Person {
  constructor(name: string, public department: string) {
    super(name);
  }

  override greet(): void {
    super.greet();
    console.log(this.department);
  }
}
```

- `super()` : 부모 생성자 호출
- `super.greet()` : 부모 메서드 호출
- 오버로딩은 매개변수에 따른 여러 호출 형태를 정의하는 것으로, 오버라이딩과 다르다.

## 20-3. 다형성

같은 부모 타입으로 여러 자식 객체를 다루면서 **각 객체에 맞는 동작을 실행**하는 개념이다.

```ts
class Animal {
  speak(): void {}
}

class Cat extends Animal {
  override speak(): void {
    console.log("Meow");
  }
}

class Dog extends Animal {
  override speak(): void {
    console.log("Woof");
  }
}

const animals: Animal[] = [
  new Cat(),
  new Dog()
];

animals.forEach(animal => animal.speak());
```

같은 `speak()`를 호출해도 실제 인스턴스에 따라 다른 결과가 나온다.

## 20-4. 추상 클래스

`abstract class`는 **직접 인스턴스를 생성할 수 없는 클래스**이다.

```ts
abstract class Animal {
  constructor(public name: string) {}

  abstract speak(): void;

  move(): void {
    console.log(`${this.name} moves.`);
  }
}

class Cat extends Animal {
  speak(): void {
    console.log("Meow");
  }
}
```

- `abstract class` : 직접 인스턴스 생성 불가
- `abstract` 메서드 : 구현 없이 선언만 작성
- 일반 자식 클래스는 추상 메서드를 반드시 구현해야 함
- 일반 메서드와 생성자도 함께 가질 수 있음

추상 클래스는 공통 구조를 강제하면서 일부 기능을 공유할 때 사용한다.

## 20-5. 추상 클래스와 인터페이스

인터페이스는 `implements`로 클래스에 적용한다.

```ts
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}
```

| 구분 | 추상 클래스 | 인터페이스 |
|---|---|---|
| 적용 | `extends` | `implements` |
| 생성자 | 가능 | 불가능 |
| 메서드 구현 | 가능 | 구현 코드 작성 불가 |
| 여러 개 적용 | 클래스 상속은 하나만 | 여러 인터페이스 가능 |
| 직접 인스턴스 생성 | 불가능 | 불가능 |

추상 클래스는 **공통 기능과 구조를 함께 제공**하고, 인터페이스는 **클래스가 따라야 할 구조를 정의**한다.

## 20-6. 정적 멤버(static)

`static`은 인스턴스를 만들지 않고 **클래스 자체에서 사용하는 속성이나 메서드**이다.

```ts
class MathUtil {
  static PI = 3.14159;

  static square(x: number): number {
    return x * x;
  }
}

MathUtil.PI;
MathUtil.square(5);
```

정적 속성은 여러 인스턴스가 공유하는 값을 관리할 때도 사용한다.

```ts
class Counter {
  static count = 0;

  constructor() {
    Counter.count++;
  }
}

new Counter();
new Counter();

console.log(Counter.count); // 2
```

- 인스턴스 멤버 : 각 객체에 속함
- 정적 멤버 : 클래스 자체에 속함
