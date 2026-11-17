
# 23. 제네릭 기초

## 23-1. 제네릭(Generic)이란?

제네릭은 함수, 인터페이스, 클래스에서 **타입을 미리 고정하지 않고 사용하는 시점에 지정**하는 기능이다.

```ts
function identity<T>(arg: T): T {
  return arg;
}

const a = identity<string>("hello");
const b = identity<number>(123);
```

- `<T>` : 타입을 전달받는 타입 매개변수
- 여러 타입에 같은 코드를 재사용할 수 있음
- 타입을 생략하면 TypeScript가 추론할 수도 있음

## 23-2. 함수에서 제네릭 사용

배열이나 여러 매개변수에도 적용할 수 있다.

```ts
function getArrayLength<T>(arr: T[]): number {
  return arr.length;
}

getArrayLength([1, 2, 3]); // 3
getArrayLength(["a", "b"]); // 2
```

여러 타입을 사용하려면 `<T, U>`처럼 작성한다.

```ts
function merge<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}

const result = merge("age", 30);
// [string, number] 튜플
```

## 23-3. 타입 별칭과 제네릭

`type`에도 제네릭을 적용하여 다양한 타입의 함수를 정의할 수 있다.

```ts
type Mapper<T> = (input: T) => T;

const stringEcho: Mapper<string> = msg => msg.toUpperCase();
const numberEcho: Mapper<number> = num => num * 2;
```

하나의 함수 타입 정의를 여러 자료형에서 재사용할 수 있다.

## 23-4. 인터페이스와 제네릭

인터페이스의 속성 타입도 제네릭으로 지정할 수 있다.

```ts
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 123 };
const stringBox: Box<string> = { value: "hello" };
```

### 여러 타입 사용

```ts
interface Result<T, E> {
  success: boolean;
  data?: T;
  error?: E;
}

const result: Result<string, null> = {
  success: true,
  data: "Success"
};
```

### 인덱스 시그니처와 상속

```ts
interface Dictionary<T> {
  [key: string]: T;
}

const scores: Dictionary<number> = {
  math: 90,
  english: 85
};
```

```ts
interface BaseResponse {
  success: boolean;
}

interface DataResponse<T> extends BaseResponse {
  data: T;
}
```

## 23-5. 클래스와 제네릭

클래스에서도 제네릭을 사용하여 다양한 타입의 인스턴스를 생성한다.

```ts
class Container<T> {
  constructor(private value: T) {}

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const num = new Container<number>(100);
const str = new Container<string>("TypeScript");
```

여러 타입을 함께 사용할 수도 있다.

```ts
class KeyValuePair<K, V> {
  constructor(public key: K, public value: V) {}
}

const pair = new KeyValuePair<string, number>("age", 30);
```

---

# 24. 제네릭 제약과 조건부 타입

## 24-1. 제네릭 제약(extends)

`extends`를 사용하면 **특정 조건을 만족하는 타입만 전달**할 수 있다.

```ts
function printLength<T extends { length: number }>(value: T) {
  console.log(value.length);
}

printLength("Hello");   // ✅
printLength([1, 2, 3]); // ✅
printLength(42);        // ❌
```

인터페이스를 제약 조건으로 사용할 수도 있다.

```ts
interface Named {
  name: string;
}

function greet<T extends Named>(person: T) {
  console.log(person.name);
}

greet({ name: "Alice", age: 30 }); // ✅
```

여러 조건은 교차 타입 `&`로 결합할 수 있다.

## 24-2. keyof를 이용한 제약

`keyof`는 객체 타입의 **속성 키들을 유니언 타입으로 추출**한다.

```ts
function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

const product = { id: 1, name: "Phone", price: 500 };

getProperty(product, "name");   // ✅
getProperty(product, "weight"); // ❌
```

- `keyof T` : 객체 T의 속성 키
- `K extends keyof T` : 실제 존재하는 키만 허용
- `T[K]` : 해당 키가 가진 값의 타입

## 24-3. 조건부 타입(Conditional Type)

조건에 따라 **서로 다른 타입을 선택**하는 기능이다.

```ts
type IsNumber<T> =
  T extends number ? "Number" : "Not Number";

type A = IsNumber<number>; // "Number"
type B = IsNumber<string>; // "Not Number"
```

기본 문법은 다음과 같다.

`T extends 조건 ? 참일_때_타입 : 거짓일_때_타입`

특정 타입을 제외할 수도 있다.

```ts
type MyNonNullable<T> =
  T extends null | undefined ? never : T;
```

- `never` : 가질 수 있는 값이 없는 타입
- 위 예제는 `null`과 `undefined`를 제외하는 데 사용

## 24-4. infer 키워드

`infer`는 조건부 타입에서 **타입의 일부를 추론하여 추출**하는 기능이다.

### 함수 반환 타입 추출

```ts
type MyReturnType<T> =
  T extends (...args: any[]) => infer R ? R : never;

type A = MyReturnType<() => string>;   // string
type B = MyReturnType<() => number[]>; // number[]
```

### 배열 요소 타입 추출

```ts
type ElementType<T> =
  T extends (infer U)[] ? U : T;

type A = ElementType<string[]>; // string
type B = ElementType<number[]>; // number
```

### 함수 매개변수 타입 추출

```ts
type MyParameters<T> =
  T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number) {
  return { name, age };
}

type Params = MyParameters<typeof createUser>;
// [name: string, age: number]
```

- `infer R` : 반환 타입 추론
- `infer P` : 매개변수 타입 추론
- `infer U` : 배열 요소 타입 추론

---

# 25. 내장 제네릭 타입과 유틸리티 타입

## 25-1. 내장 제네릭 타입

TypeScript에서 기본으로 제공하는 제네릭 타입이다.

| 타입 | 역할 |
|---|---|
| `Array<T>` | T 타입 요소를 가진 배열 |
| `ReadonlyArray<T>` | 요소 수정이 제한된 배열 |
| `Map<K, V>` | 키와 값으로 데이터 저장 |
| `Set<T>` | 중복을 허용하지 않는 값의 집합 |
| `WeakMap<K, V>` | 객체를 키로 사용하는 약한 참조 컬렉션 |
| `WeakSet<T>` | 객체를 약하게 참조하는 집합 |
| `Promise<T>` | 비동기 작업의 결과 타입 |

```ts
const numbers: Array<number> = [1, 2, 3];
const readonlyNums: ReadonlyArray<number> = [1, 2, 3];

const userMap: Map<number, string> = new Map();
userMap.set(1, "Alice");

const numberSet: Set<number> = new Set();
numberSet.add(10);
```

## 25-2. Promise 제네릭

`Promise<T>`는 비동기 작업이 성공했을 때 반환할 값의 타입을 지정한다.

```ts
interface User {
  id: number;
  name: string;
}

function fetchUser(id: number): Promise<User> {
  return Promise.resolve({ id, name: "Alice" });
}

async function getUserInfo() {
  const user = await fetchUser(1);
  console.log(user.name);
}
```

- `Promise<User>` : 비동기 결과가 User 타입
- `await` : Promise의 결과를 기다려 사용

## 25-3. 객체를 변형하는 유틸리티 타입

유틸리티 타입은 기존 타입을 **재사용하거나 변형**할 때 사용하는 내장 제네릭이다.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
```

| 유틸리티 타입 | 기능 |
|---|---|
| `Partial<T>` | 모든 속성을 선택적으로 변경 |
| `Required<T>` | 모든 속성을 필수로 변경 |
| `Readonly<T>` | 모든 속성을 읽기 전용으로 변경 |
| `Pick<T, K>` | 지정한 속성만 선택 |
| `Omit<T, K>` | 지정한 속성을 제외 |
| `Record<K, V>` | 키와 값의 타입을 지정하여 객체 생성 |

```ts
type OptionalUser = Partial<User>;
type RequiredUser = Required<User>;
type ReadonlyUser = Readonly<User>;

type UserPreview = Pick<User, "id" | "name">;
type UserWithoutEmail = Omit<User, "email">;
```

### Record 예제

```ts
type Role = "admin" | "user" | "guest";

const descriptions: Record<Role, string> = {
  admin: "Administrator",
  user: "Regular User",
  guest: "Guest User"
};
```

## 25-4. 유니언 타입을 조작하는 유틸리티

| 타입 | 기능 |
|---|---|
| `Exclude<T, U>` | T에서 U에 해당하는 타입 제외 |
| `Extract<T, U>` | T와 U의 공통 타입 추출 |
| `NonNullable<T>` | null과 undefined 제외 |

```ts
type Colors = "red" | "green" | "blue";

type A = Exclude<Colors, "green">;
// "red" | "blue"

type B = Extract<Colors, "green" | "yellow">;
// "green"

type C = NonNullable<string | null | undefined>;
// string
```

## 25-5. 함수와 클래스 타입 추출

함수나 클래스의 기존 타입 정보를 가져올 수 있다.

| 유틸리티 타입 | 기능 |
|---|---|
| `Parameters<T>` | 함수의 매개변수 타입 추출 |
| `ReturnType<T>` | 함수의 반환 타입 추출 |
| `ConstructorParameters<T>` | 클래스 생성자의 매개변수 타입 추출 |

```ts
function createUser(name: string, age: number) {
  return { name, age };
}

type Params = Parameters<typeof createUser>;
// [name: string, age: number]

type Result = ReturnType<typeof createUser>;
// { name: string; age: number }
```

```ts
class Person {
  constructor(public name: string, public age: number) {}
}

type PersonArgs = ConstructorParameters<typeof Person>;
// [name: string, age: number]

const args: PersonArgs = ["John", 30];
const person = new Person(...args);
```


