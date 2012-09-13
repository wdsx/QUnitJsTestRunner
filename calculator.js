var calculator = function () {
	
	// private functions
	function add(numbers) {
		return (numbers) ? parseInt(numbers) : 0;
	}
	
	// Reveal public pointers to
	// private functions and properties
	return {
		add: add
	};
	
}();