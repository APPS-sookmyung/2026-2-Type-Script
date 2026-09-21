>이 포스트는 얄코님의 '가장 쉬운 타입스크립트' 강의를 바탕으로 학습한 내용을 정리한 글입니다. 

## 1. 기본 타입들 (Primitive Types)
### 1-1. 변수 선언 방식과 타입 제한
TypeScript에서는 변수를 선언할 때 타입을 명시하여 허용되는 데이터 종류를 제한 가능하다.

```ts
let age: number = 25;
age = 26; // ✅

const firstName: string = "Alice";
firstName = "Bob"; // ❌ Error: 상수는 재할당 불가

var isOld: boolean = false; // ⚠️ var는 스코프 문제로 권장되지 않음 (let, const 권장)
```
### 1-2. 타입 명시 (Type Annotation)
변수 선언 시 타입을 명시하면 다른 타입의 값이 할당되는 것을 방지한다.

```ts
let score: number = 90;
let studentName: string; // 값 할당 없이 선언만 가능
studentName = "John";

score = 95;   // ✅
score = "95"; // ❌ Error: number 타입 변수에 string 할당 불가
```

### 1-3. 타입 추론 (Type Inference)
타입을 명시하지 않아도, 초기 할당된 값을 기반으로 TypeScript가 타입을 자동으로 추론한다.

```ts
let score = 90; // number로 자동 추론

score = 95;   // ✅
score = "95"; // ❌ Error: 이미 number 타입으로 추론됨
```
### 1-4.  암묵적 any
초기값과 타입을 모두 명시하지 않으면 undefined 값과 any 타입을 갖게 된다.

```ts
let score; // type: any

score = 95;   // ✅
score = "95"; // ✅
```
⚠️ any 타입은 타입 검사를 무력화시키므로 지양해야 한다.

### 1-5. 기본 타입 사용 예시
`string` (문자열): 템플릿 리터럴 포함

```ts
const name = 'Alice';
const age = 30;
const message = `My name is ${name} and I am ${age} years old.`;
````
`number` (숫자): 정수, 실수, 특수 숫자값(Infinity, NaN), 다양한 진법 지원

```ts
const intNum = 42;
const floatNum = 3.14;
const result = intNum / 0; // Infinity (오류 아님)

// 진법 표현
let hexadecimal: number = 0xf00d; // 16진수
let binary: number = 0b1010;     // 2진수
let octal: number = 0o744;        // 8진수
boolean (불리언): 참/거짓 값
```
```ts
const isAdult: boolean = true;
const hasPermission = false;
bigint (큰 정수): number.MAX_SAFE_INTEGER를 초과하는 큰 정수 처리

```
```ts
const bigIntNumber = 1234567890123456789012345678901234567890n;
const anotherBigInt = BigInt("987654321987654321987654321987654321");
console.log(bigIntNumber + anotherBigInt);
```

## 2. any vs unknown 타입
`any`: "모르니까 신경 끄자" (타입 검사 비활성화)

`unknown`: "모르니까 조심하자" (타입 검사 강제)

### 2-1. any 타입
모든 값을 허용하는 가장 느슨한 타입

```ts
let anyValue: any = 10;
anyValue = "Hello";
anyValue = true;
```
any 사용 시 주의점 (컴파일 오류 미발생 문제)

```ts
let anyString: any = 123; // 숫자를 할당했음에도

console.log(anyString.toUpperCase());         // 런타임에 에러 발생! (컴파일 시점 검출 불가)
console.log(anyString.nonExistentMethod());   // 존재하지 않는 메서드여도 컴파일을 통과함
```
> **any가 유용한 경우**
서드파티 라이브러리나 외부 API처럼 타입을 예측하기 힘든 구조에서 옵셔널 체이닝`(?.)`과 함께 사용할 수 있다.

```ts
function processData(data: any) {
  return data.someProperty?.someMethod?.() || data;
}
```

### 2-2. unknown 타입
알 수 없는 타입을 나타내며, any보다 훨씬 안전하다. 타입 검사(타입 가드) 없이는 다른 변수에 할당하거나 메서드를 호출할 수 없다.

```ts
let anyVar: any = 10;
let unknownVar: unknown = 10;

let anyNumber: number = anyVar; // ✅
anyVar.toFixed(2);              // ✅

let unknownNumber: number = unknownVar; // ❌ Error
unknownVar.toFixed(2);                  // ❌ Error
```
>**unknown 활용 방법**
타입 가드 (Type Guard): if문과 typeof로 타입을 narrowing(축소)하여 사용

```ts
function processValue(val: unknown): string {
  if (typeof val === 'string') {
    return val.toUpperCase(); // ✅ string 확인됨
  }
  if (typeof val === 'number') {
    return val.toFixed(2);    // ✅ number 확인됨
  }
  return String(val);
}
```
**타입 단언 (Type Assertion): as 키워드로 개발자가 타입을 보장**

```ts
let unknownValue: unknown = "Hello, TypeScript!";

// 개발자가 string임을 확신할 때 사용
let stringLength = (unknownValue as string).length;
```
unknown과 any 조합 객체 검사 예시

```ts
function processUserData(user: unknown): string {
  if (typeof user === 'object' && user !== null) {
    if ('name' in user && typeof (user as any).name === 'string') {
      return `User: ${(user as any).name}`;
    }
  }
  return 'Invalid user data';
}
```

## 3. null, undefined, void, never 타입
### 3-1. null & undefined
`null`: 의도적으로 비어있는 상태

`undefined`: 변수가 선언되었으나 값이 할당되지 않은 상태

> tsconfig.json에서 strictNullChecks: true 설정 시, 다른 기본 타입에 null이나 undefined를 직접 할당할 수 없다.

```ts
let nullValue: null = null;
let undefinedValue: undefined = undefined;

let stringValue: string = null; // ❌ Error (strictNullChecks)

// 해결방법: 유니언 타입(|) 사용
let optionalString: string | null = "Hello";
optionalString = null; // ✅
```
### 3-2. void 타입
함수/메서드가 반환값(return value)을 갖지 않음을 의미

`void`: 만나도 선물을 주지 않는 산타 (실행은 되지만 반환값은 없음)

```ts
function printLength(text: string | null): void {
  if (text === null) {
    console.log('No text provided');
    return; // 반환값 없음
  }
  console.log(`Text length: ${text.length}`);
}

// void 함수는 undefined 반환을 허용함
function logMessage(message: string): void {
  console.log(message);
  // return undefined; // ✅ 허용
  // return null;      // ❌ Error
}
```
### 3-3. never 타입
함수가 절대 값을 반환하지 않고 종료되지 않는 경우 또는 발생할 수 없는 값의 타입을 의미

`never`: 절대 만날 수 없는 산타 (정상적으로 함수 종료에 도달 불가)

- 예외 던지기 (Exception Throw)

```ts
function throwError(message: string): never {
  throw new Error(message); // 정상 종료되지 않음
}
```

- 무한 루프 (Infinite Loop)
```ts
function infiniteLoop(): never {
  while (true) {
    // 무한 반복
  }
}
```
- 철저한 타입 검사 (Exhaustiveness Check)
모든 분기를 처리했는지 검증하는 안전장치로 활용할 수 있다.

```ts
function handleValue(x: string | number | boolean) {
  if (typeof x === "string") {
    console.log("It's a string:", x.toUpperCase());
  } else if (typeof x === "number") {
    console.log("It's a number:", x.toFixed(2));
  } else if (typeof x === "boolean") {
    console.log("It's a boolean:", x ? "true" : "false");
  } else {
    // 위 조건에서 모든 타입이 걸러졌으므로 이 시점의 x는 never 타입
    // 만약 나중에 유니언 타입이 추가되고 else if 분기를 추가하지 않으면 컴파일 에러 발생!
    const unreachable: never = x;
    throw new Error(`Unexpected type: ${x}`);
  }
}
```


