
# 1. 배열과 튜플, 객체 기초

## 1-1. 배열(Array)

TypeScript에서는 배열에 들어갈 **요소의 타입을 지정**할 수 있다.

```ts
let numbers: number[] = [1, 2, 3, 4, 5];
let fruits: Array<string> = ['Apple', 'Banana', 'Orange'];

numbers.push(6);      // ✅
numbers.push("six");  // ❌
```

- `number[]` : 숫자 배열
- `Array<string>` : 문자열 배열
- 타입을 명시하지 않아도 초기값을 통해 타입을 추론한다.

### 다차원 배열

`[]`의 개수로 배열의 차원을 표현한다.

```ts
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6]
];

let cube: number[][][] = [
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]]
];
```

- `number[][]` → 2차원 배열
- `number[][][]` → 3차원 배열

---

## 1-2. 배열 메서드

배열에서는 JavaScript의 `map`, `filter`, `find` 등을 그대로 사용할 수 있으며 반환값의 타입도 추론된다.

```ts
const names: string[] = ['Alice', 'Bob', 'Charlie'];

const lengths = names.map(name => name.length);
const longNames = names.filter(name => name.length > 4);
const foundName = names.find(name => name.startsWith('B'));
```

- `map()` : 각 요소를 변환해 새로운 배열 생성
- `filter()` : 조건에 맞는 요소만 반환
- `find()` : 조건에 맞는 첫 요소 반환
  - 값이 없을 수도 있으므로 `string | undefined`

---

## 1-3. 읽기 전용 배열

배열의 값을 읽을 수는 있지만 **수정하지 못하게** 만들 수 있다.

```ts
const nums: ReadonlyArray<number> = [1, 2, 3];
const scores: readonly number[] = [90, 85, 95];

nums[0] = 10; // ❌
```

두 가지 표현이 가능하다.

```ts
ReadonlyArray<number>
readonly number[]
```

새로운 배열로 복사하는 것은 가능하다.

```ts
const newArray = [...nums, 4];
```

---

## 1-4. 튜플(Tuple)

튜플은 배열과 비슷하지만 **각 위치에 들어갈 타입과 순서가 정해져 있다.**

```ts
let person: [string, number] = ['John', 30];

person = [30, 'John'];       // ❌
person = ['John', 30, true]; // ❌
```

구조 분해 할당도 가능하다.

```ts
const [name, age] = person;
```

선택적 요소도 사용할 수 있다.

```ts
type User = [string, number, boolean?];

const user1: User = ['Jane', 25, true];
const user2: User = ['Mike', 40];
```

`?`가 붙은 요소는 생략할 수 있다.

---

## 1-5. 배열과 튜플의 타입 추론

```ts
const array = [1, 'hello'];
// (string | number)[]

const tuple = [1, 'hello'] as const;
// readonly [1, "hello"]
```

`as const`를 사용하면 값과 순서가 고정된 **읽기 전용 튜플**로 추론된다.

수정 가능한 튜플은 타입을 직접 지정한다.

```ts
let tuple: [number, string] = [1, 'hello'];
tuple = [2, 'world']; // ✅
```

---

## 1-6. 객체와 Interface

객체도 각 속성의 타입을 지정할 수 있다.

```ts
const person: {
  name: string;
  age: number;
} = {
  name: "John",
  age: 25
};
```

같은 형태의 객체를 반복해서 사용한다면 `interface`를 이용한다.

```ts
interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

const admin: User = {
  id: 1,
  username: "admin",
  isAdmin: true
};
```

`interface`를 사용하면 객체의 구조와 타입을 한 번 정의해 여러 객체에서 재사용할 수 있다.

---

# 2. 열거형(Enum)

## 2-1. Enum 기본

`enum`은 **관련된 고정 값들을 이름과 함께 관리**하기 위해 사용한다.

```ts
enum UserRole {
  Admin = 0,
  Manager = 1,
  Employee = 2,
  Guest = 3
}

function checkAccess(role: UserRole) {
  return role === UserRole.Admin;
}
```

숫자만 사용하는 것보다 각 값의 의미를 명확하게 표현할 수 있다.

---

## 2-2. 숫자 Enum

값을 지정하지 않으면 `0`부터 자동으로 증가한다.

```ts
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right   // 3
}
```

```ts
Direction.Up; // 0
Direction[0]; // "Up"
```

일부 값만 지정할 수도 있다.

```ts
enum Priority {
  Low = 5,
  Medium,      // 6
  High = 10,
  Critical     // 11
}
```

값이 없는 멤버는 이전 숫자에서 `1`씩 증가한다.

---

## 2-3. 문자열 Enum

Enum의 값으로 문자열도 사용할 수 있다.

```ts
enum Theme {
  Light = "light-theme",
  Dark = "dark-theme",
  System = "system-theme"
}

const theme: Theme = Theme.Dark;
```

문자열 Enum은 `Theme.Dark`처럼 **멤버 이름으로 접근하여 사용하는 것이 기본**이다.

숫자와 문자열을 하나의 Enum에 섞을 수도 있지만 가독성이 떨어질 수 있어 일반적으로 분리해서 사용한다.

---

## 2-4. const enum

```ts
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

const dir = Direction.Up;

const enum FastDirection {
  Up,
  Down,
  Left,
  Right
}

const fastDir = FastDirection.Up;
```
![](https://velog.velcdn.com/images/jihyun418/post/e5d3ba63-72ba-4405-b3fa-de4b773713aa/image.png)
-> 컴파일된 파일

일반 `enum`은 컴파일 후 JavaScript에서 객체로 만들어지지만, `const enum`은 값을 코드에 직접 넣는 **인라인 방식**으로 처리된다.

- 별도의 Enum 객체를 만들지 않음
- 컴파일 결과를 줄일 수 있음
- 대신 역방향 접근이 불가능하고 디버깅이 불편할 수 있음

---

## 2-5. Enum의 대안: Union Type(유니온 타입)

고정된 값만 허용하고 싶다면 유니온 타입을 사용할 수도 있다.

```ts
type CardSuit = "clubs" | "diamonds" | "hearts" | "spades";

function displaySuit(suit: CardSuit) {
  console.log(suit);
}

displaySuit("hearts"); // ✅
displaySuit("joker");  // ❌
```
[](https://velog.velcdn.com/images/jihyun418/post/42e5ad08-5ab8-411e-a450-431ba0985b05/image.png)


### 차이 정리

| 방식 | 특징 |
|---|---|
| `enum` | 값과 이름을 함께 관리 |
| `const enum` | Enum 값을 인라인하여 사용 |
| Union Type | 단순한 고정 값들을 타입으로 제한 |

단순한 값의 집합만 제한하고 싶다면 Union Type을 활용할 수 있다.

---

# 3. 함수(Function)

## 3-1. 함수 타입 지정

TypeScript에서는 **매개변수와 반환값의 타입**을 지정한다.

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

기본적인 함수 작성 방식은 JavaScript와 동일하다.

```ts
// 함수 표현식
const farewell = function(name: string): string {
  return `Goodbye, ${name}!`;
};

// 화살표 함수
const add = (a: number, b: number): number => {
  return a + b;
};
```

---

## 3-2. 선택적 매개변수

`?`를 붙이면 전달하지 않아도 되는 매개변수를 만들 수 있다.

```ts
function greet(name?: string): string {
  return name ? `Hello, ${name}!` : 'Hello!';
}

greet("World"); // ✅
greet();        // ✅
```

`name`의 타입은 실제로 다음과 같다.

```ts
string | undefined
```

따라서 값이 없는 경우도 고려해야 한다.

또한 선택적 매개변수는 필수 매개변수보다 뒤에 위치해야 한다.

---

## 3-3. 기본값 매개변수

매개변수에 기본값을 지정할 수도 있다.

```ts
function greeting(name: string = "Guest"): string {
  return `Hello, ${name}!`;
}

greeting();            // Hello, Guest!
greeting("Developer"); // Hello, Developer!
```

선택적 매개변수와 달리 값이 전달되지 않으면 `undefined` 대신 **지정된 기본값**을 사용한다.

---

## 3-4. 나머지 매개변수

`...`을 사용하면 여러 개의 인자를 하나의 배열로 받을 수 있다.

```ts
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, cur) => acc + cur, 0);
}

sum(1, 2, 3);
sum(10, 20, 30, 40);
sum();
```

일반 매개변수와 함께 사용할 수도 있다.

```ts
function sumItem(item: string, ...nums: number[]) {
  return `${item}: ${nums.reduce((a, b) => a + b, 0)}`;
}
```

**나머지 매개변수는 항상 마지막에 위치해야 한다.**

---

## 3-5. 함수 오버로딩

함수 오버로딩은 **같은 함수가 매개변수 타입에 따라 다른 타입을 반환하도록 정의하는 것**이다.

```ts
function processInput(value: string): string;
function processInput(value: number): number;

function processInput( value: string | number): string | number {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }

  return value * 2;
}
```

```ts
processInput("hello"); // "HELLO"
processInput(5);       // 10
processInput(true);    // ❌
```

오버로드 시그니처를 작성하면 **입력 타입에 따른 반환 타입을 TypeScript가 정확하게 판단**할 수 있다.

---

## 3-6. 콜백 함수 타입

함수를 매개변수로 전달할 때도 타입을 지정할 수 있다.

```ts
function fetchData(
  url: string,
  callback: (data: string) => void
): void {
  const data = `Data from ${url}`;
  callback(data);
}
```

```ts
callback: (data: string) => void
```

의 의미는 **문자열을 매개변수로 받고 반환값은 없는 함수**이다.

즉, TypeScript에서는 일반 값뿐만 아니라 **함수 자체에도 타입을 지정할 수 있다.**

