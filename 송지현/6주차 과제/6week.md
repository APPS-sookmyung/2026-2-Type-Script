
## 20. 고급 타입 1

### 20-1. 인터섹션 타입(Intersection Type)

`&` 연산자를 사용하여 **여러 타입을 하나로 결합**한다. 결합된 타입은 모든 속성을 포함해야 한다.

```ts
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

type Staff = Person & Employee;

const alice: Staff = {
  name: "Alice",
  age: 30,
  employeeId: 101,
  department: "HR"
};
```

- 두 타입의 속성을 모두 가져야 한다.
- 메서드가 포함된 타입도 결합할 수 있다.
- `implements`를 통해 클래스에 적용할 수도 있다.

### 20-2. 유니언 타입(Union Type)

`|` 연산자를 사용하여 **여러 타입 중 하나를 허용**한다.

```ts
function printValue(value: string | number) {
  console.log(value);
}

printValue("Hello"); // ✅
printValue(42);      // ✅
```

단, 특정 타입에서만 사용할 수 있는 메서드는 바로 호출할 수 없다.

### 20-3. 타입 가드(Type Guard)

조건문을 이용해 데이터의 타입을 확인하고, 해당 타입에 맞는 작업을 수행한다.

#### typeof 활용

```ts
function processValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

#### in 연산자 활용

```ts
type Dog = { bark: () => void };
type Cat = { meow: () => void };

function makeSound(animal: Dog | Cat) {
  if ("bark" in animal) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

객체의 특정 속성 존재 여부를 확인하여 타입을 구분한다.

### 20-4. 리터럴 타입(Literal Type)

**지정된 값만 허용하는 타입**이다. 문자열, 숫자, 불리언에 사용할 수 있다.

```ts
type ButtonSize = "small" | "medium" | "large";
type RetryCount = 0 | 1 | 2 | 3;
type FeatureToggle = true;

const size: ButtonSize = "medium"; // ✅
const count: RetryCount = 5;      // ❌
```

열거형과 비슷하지만 별도의 런타임 객체 없이 값의 범위를 제한할 수 있다.

#### const와 let의 타입 추론

```ts
const mode1 = "light"; // "light" 리터럴 타입
let mode2 = "light";   // string 타입
```

- `const` : 값이 고정되므로 리터럴 타입으로 추론
- `let` : 재할당이 가능하므로 일반 타입으로 추론

### 20-5. as const

`as const`는 값을 리터럴 타입으로 유지하고 객체 속성이나 배열을 읽기 전용으로 만든다.

```ts
const config = {
  env: "production",
  debug: false
} as const;

config.debug = true; // ❌

const numbers = [1, 2, 3] as const;
numbers[0] = 4; // ❌
```

객체의 속성은 `readonly`, 배열은 읽기 전용 튜플로 추론된다.

---

## 21. 고급 타입 2

### 21-1. 매핑된 타입(Mapped Type)

기존 타입의 속성을 순회하여 **새로운 타입을 생성**한다.

```ts
type User = {
  id: number;
  name: string;
  email: string;
};
```

#### 선택적 속성으로 변경

```ts
type OptionalUser = {
  [K in keyof User]?: User[K];
};

const user: OptionalUser = {
  name: "Alice"
};
```

#### 읽기 전용 속성으로 변경

```ts
type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};
```

- `keyof User` : User의 모든 속성 키
- `User[K]` : 해당 속성의 타입
- `?` : 선택적 속성
- `readonly` : 수정 불가능한 속성

### 21-2. 템플릿 리터럴 타입

문자열 리터럴 타입을 조합하여 **새로운 문자열 타입을 생성**한다.

```ts
type Lang = "en" | "fr" | "sp";
type Locale = `locale-${Lang}`;

// "locale-en" | "locale-fr" | "locale-sp"

const locale: Locale = "locale-en"; // ✅
const invalid: Locale = "locale-ge"; // ❌
```

여러 타입을 조합할 수도 있다.

```ts
type Color = "red" | "blue";
type Shade = "light" | "dark";

type ColorComb = `${Shade}-${Color}`;

// "light-red" | "light-blue"
// "dark-red" | "dark-blue"
```

정해진 형식의 문자열을 안전하게 관리할 때 유용하다.

### 21-3. instanceof 타입 가드

`instanceof`는 객체가 특정 클래스의 인스턴스인지 확인한다.

```ts
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function speak(pet: Dog | Cat) {
  if (pet instanceof Dog) {
    pet.bark();
  } else {
    pet.meow();
  }
}
```

클래스 기반 유니언 타입을 구분할 때 사용한다.

### 21-4. 사용자 정의 타입 가드

타입 검사 로직을 별도의 함수로 만들어 재사용할 수 있다.

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
  return "swim" in pet;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

- `pet is Fish` : 함수가 `true`를 반환하면 해당 값을 `Fish` 타입으로 판단
- 복잡한 타입 검사를 여러 곳에서 사용할 때 유용하다.

### 21-5. 타입 단언(Type Assertion)

`as`를 사용하여 개발자가 특정 값의 타입을 직접 지정한다.

```ts
const input = document.getElementById("myInput")
  as HTMLInputElement;

console.log(input.value);
```

TypeScript가 정확한 타입을 추론하지 못할 때 사용할 수 있다.

하지만 **타입 단언은 실제 값의 타입을 검사하거나 변환하지 않는다.**

```ts
const value = 123 as unknown as string;
value.toUpperCase(); // ⚠️ 런타임 오류
```

따라서 타입이 확실한 경우에만 사용해야 한다.

### 21-6. Non-null 단언 연산자

`!`를 사용하면 값이 `null`이나 `undefined`가 아니라고 TypeScript에 알릴 수 있다.

```ts
type User = {
  name: string;
  age?: number;
};

function printAge(user: User) {
  console.log(user.age!.toFixed(1));
}
```

단, 실제 값이 없다면 런타임 오류가 발생할 수 있다.

가능하면 조건문을 사용하여 안전하게 확인하는 것이 좋다.

```ts
function printAge(user: User) {
  if (user.age !== undefined) {
    console.log(user.age.toFixed(1));
  }
}
```
