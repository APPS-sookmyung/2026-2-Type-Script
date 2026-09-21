function handleValue(x: string | number | boolean) {
  if (typeof x === "string") {
    console.log("It's a string:", x.toUpperCase());
  } else if (typeof x === "number") {
    console.log("It's a number:", x.toFixed(2));
  } else if (typeof x === "boolean") {
    console.log("It's a boolean:", x ? "true" : "false");
  } else {
    const unreachable: never = x;
    throw new Error(`Unexpected type: ${x}`);
  }
}