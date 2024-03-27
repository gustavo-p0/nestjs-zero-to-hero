function addNumbers(num1, num2) {
  return num1 + num2;
}

describe('Example test', () => {
  it('equal true', () => {
    expect(true).toBeTruthy();
  });

  it(`add two numbers`, () => {
    expect(addNumbers(2, 2)).toEqual(4);
  });
});
