test("empty string returns zero", function () {
	equal(calculator.add(""), 0);
});

test("single number returns the number", function () {
    equal(calculator.add("1"), 1);
});