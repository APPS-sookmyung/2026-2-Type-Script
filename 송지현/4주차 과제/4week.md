
# 16. 인터페이스 1

## 16-1. 인터페이스 정의

`interface`는 객체가 가져야 할 **속성과 타입을 정의**한다.

```ts
interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: "John",
  age: 30
};
```

- 필수 속성이 누락되거나 타입이 다르면 오류 발생
- 객체 리터럴에 정의되지 않은 속성을 추가해도 오류 발생

## 16-2. 선택적 속성

속성 뒤에 `?`를 붙이면 생략할 수 있다.

```ts
interface Product {
  name: string;
  price: number;
  description?: string;
}

const product: Product = {
  name: "Laptop",
  price: 1200
};
```

선택적 속성은 `undefined`일 수 있으므로 확인이 필요하다.

```ts
const desc = product.description ?? "No desc";
```

- `??` : 왼쪽 값이 `null` 또는 `undefined`이면 오른쪽 값을 사용

## 16-3. 읽기 전용 속성

`readonly`는 속성에 새로운 값을 할당하지 못하도록 한다.

```ts
interface Config {
  readonly apiKey: string;
  endpoint: string;
}

const config: Config = {
  apiKey: "abc123",
  endpoint: "/api"
};

config.endpoint = "/new-api"; // ✅
config.apiKey = "xyz";        // ❌
```

단, 참조 자료형의 내부 값까지 보호하지는 않는다.

```ts
interface Demo {
  readonly items: number[];
}

const demo: Demo = { items: [1, 2, 3] };

demo.items.push(4); // ✅
demo.items = [5, 6]; // ❌
```

## 16-4. 함수 타입 인터페이스

인터페이스는 객체뿐 아니라 **함수의 매개변수와 반환 타입**도 정의할 수 있다.

```ts
interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;
```

같은 형태의 함수들을 하나의 타입으로 관리할 수 있다.

```ts
const operations: MathOperation[] = [
  (a, b) => a + b,
  (a, b) => a - b,
  (a, b) => a * b
];
```

객체 속성에 콜백 함수를 정의할 수도 있다.

```ts
interface Button {
  label: string;
  onClick: () => void;
}
```

## 16-5. 인덱스 시그니처

속성 이름을 미리 정하지 않고 **키와 값의 타입만 지정**하는 방법이다.

```ts
interface PhoneBook {
  [name: string]: string;
}

const phones: PhoneBook = {
  Alice: "010-1234-5678",
  Bob: "010-8765-4321"
};

phones.Charlie = "010-1111-2222";
```

값에 여러 타입을 허용할 수도 있다.

```ts
interface Profile {
  [key: string]: string | number | boolean;
}
```

숫자 인덱스도 가능하다.

```ts
interface StringArray {
  [index: number]: string;
}

const fruits: StringArray = ["apple", "banana"];
```

## 16-6. 매핑된 타입(Mapped Type)

**정해진 키 집합을 순회하여 새로운 객체 타입을 생성**한다.

```ts
type AllowedKeys = "English" | "Math" | "Science";

type Scores = {
  [K in AllowedKeys]: number;
};

const scores: Scores = {
  English: 85,
  Math: 90,
  Science: 95
};
```

- `K in AllowedKeys` : 지정된 키들을 순회
- 각 키의 값은 `number` 타입
- 필수 키가 누락되면 오류 발생

---

# 17. 인터페이스 확장과 응용

## 17-1. 인터페이스 상속

`extends`를 사용하면 기존 인터페이스의 속성을 상속받을 수 있다.

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = {
  name: "Charlie",
  breed: "Beagle"
};
```

자식 인터페이스는 부모의 속성과 자신의 속성을 모두 가진다.

### 다중 상속

```ts
interface CanRun {
  run(): void;
}

interface CanBark {
  bark(): void;
}

interface Dog extends CanRun, CanBark {}
```

여러 인터페이스를 조합할 수 있지만, **같은 속성의 타입이 서로 충돌하면 오류**가 발생한다.

## 17-2. 인터페이스 중첩

인터페이스의 속성 타입으로 다른 인터페이스를 사용할 수 있다.

```ts
interface ContactInfo {
  phone: string;
  email: string;
}

interface Employee {
  name: string;
  contact: ContactInfo;
}

const dev: Employee = {
  name: "Jane",
  contact: {
    phone: "010-1234-5678",
    email: "jane@example.com"
  }
};
```

복잡한 객체 구조를 분리하여 재사용할 수 있다.

## 17-3. 인터페이스 병합

같은 이름의 인터페이스를 여러 번 선언하면 **자동으로 하나의 인터페이스로 병합**된다.

```ts
interface ApiResponse {
  data: any;
  status: number;
}

interface ApiResponse {
  timestamp: Date;
}
```

최종 `ApiResponse`는 `data`, `status`, `timestamp`를 모두 가진다.

단, 무분별한 병합은 구조 파악을 어렵게 할 수 있다.

## 17-4. 클래스에서 인터페이스 구현

`implements`를 사용하면 클래스가 인터페이스의 구조를 따르도록 할 수 있다.

```ts
interface Animal {
  name: string;
  makeSound(): void;
}

class Dog implements Animal {
  constructor(public name: string) {}

  makeSound(): void {
    console.log("Woof!");
  }
}
```

- 인터페이스에 정의된 필수 속성과 메서드를 구현해야 함
- 여러 인터페이스를 동시에 구현할 수도 있음

```ts
class Duck implements Flyer, Swimmer {
  fly(): void {}
  swim(): void {}
}
```

## 17-5. 초과 속성 검사와 타입 단언

TypeScript는 객체 리터럴을 직접 할당할 때 **초과 속성 검사**를 수행한다.

```ts
interface User {
  id: number;
  name: string;
}

const user1: User = {
  id: 1,
  name: "Bob",
  age: 25 // ❌
};
```

변수를 거쳐 할당하면 추가 속성이 있어도 허용될 수 있다.

```ts
const temp = {
  id: 2,
  name: "Charlie",
  age: 40
};

const user2: User = temp; // ✅
```

타입 단언도 가능하다.

```ts
const user3 = {
  id: 3,
  name: "Dana",
  age: 30
} as User;
```

`as`는 개발자가 타입을 단언하는 문법으로, 잘못 사용하면 타입 안정성이 떨어질 수 있다.

## 17-6. Interface와 Type Alias

`type`도 객체 구조를 정의하는 데 사용할 수 있다.

```ts
interface Person {
  name: string;
  age: number;
}

type PersonAlias = {
  name: string;
  age: number;
};
```

두 방식 모두 객체의 타입을 지정할 수 있지만 확장 방식이 다르다.

```ts
// Interface: extends
interface Dog extends Animal {
  breed: string;
}

// Type Alias: 교차 타입(&)
type DogType = AnimalType & {
  breed: string;
};
```

- `interface` : 상속과 선언 병합 지원
- `type` : 유니온, 교차 타입 등 다양한 타입 표현 가능

## 17-7. 매핑된 타입으로 속성 변환

`keyof`와 매핑된 타입을 사용하면 기존 타입을 변형할 수 있다.

```ts
interface Product {
  name: string;
  price: number;
}
```

### 모든 속성을 읽기 전용으로

```ts
type ReadonlyProduct = {
  readonly [K in keyof Product]: Product[K];
};
```

### 모든 속성을 선택적으로

```ts
type PartialProduct = {
  [K in keyof Product]?: Product[K];
};
```

- `keyof Product` : Product의 모든 속성 키
- `Product[K]` : 해당 속성의 타입
- `readonly` : 수정 제한
- `?` : 선택적 속성으로 변경

기존 인터페이스를 바탕으로 새로운 타입을 만들 때 유용하다.
