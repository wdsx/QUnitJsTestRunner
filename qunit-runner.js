(function () {

    var testResult = {
        Tests: [],
        Reset: function () {
            this.Tests = [];
        }
    },
		test = {
		    TestName: "",
		    Tests: []
		},
		totalTests = 0,
        testsAreRunning = false;

    QUnit.begin(function () {
        testsAreRunning = true;
        testResult.Reset();
    });

    QUnit.testStart(function (details) {
        test = {};
        test.TestName = details.name;
        test.Tests = [];
        totalTests++;
    });

    QUnit.testDone(function (details) {
        if (!details.result) {
            testResult.Tests.push(test);
        }
    });

    QUnit.log(function (details) {
        test.Tests.push(details);
    });

    QUnit.done(function (details) {
        testResult.Total = details.total;
        testResult.Failed = details.failed;
        testResult.Passed = details.passed;
        testResult.RunTime = details.runtime;

        if (testResult.Tests[0]) {
            renderResults();
        }

        testsAreRunning = false;
    });

    function getOutputDiv() {
        var outputDiv = document.getElementById("output");

        if (!outputDiv) {
            outputDiv = document.createElement("div");
            outputDiv.id = "output";
            document.body.appendChild(outputDiv);
        } else {
            outputDiv.innerHTML = "";
        }

        return outputDiv;
    }

    function setTestsSummary(outputDiv) {
        var statusBar = outputDiv.appendChild(document.createElement('div')),
			summary = outputDiv.appendChild(document.createElement('h1')),
			status = (testResult.Failed === 0) ? "ok" : "ko";

        if (testResult.Total > 0) {
            statusBar.setAttribute("class", status);
        } else {
            statusBar.setAttribute("hide", status);
        }

        summary.innerText = "Tests: " + testResult.Total + ", Passed: " + testResult.Passed + ", Failed: " + testResult.Failed;
    }

    function displayFailingTests(outputDiv) {

        var failingTests = outputDiv.appendChild(document.createElement('ul'));

        for (var i = 0; i < testResult.Tests.length; i++) {
            var test = testResult.Tests[i],
				testIndex = 1,
				first = true,
				li = {};

            for (var j = 0; j < test.Tests.length; j++) {
                var innerTest = test.Tests[j];

                if (!innerTest.result) {

                    if (first) {
                        li = failingTests.appendChild(document.createElement('li'));
                        li.innerText = test.TestName;
                        first = false;
                    }

                    var innerUl = li.appendChild(document.createElement('ul')),
						innerLi = innerUl.appendChild(document.createElement('li')),
						jsSource = "",
						jsMessage = "";

                    if (innerTest.source) {
                        jsSource = ", Source: " + innerTest.source.split("?")[0];
                    }

                    if (innerTest.message) {
                        jsMessage = "Message: " + innerTest.message + ", ";
                    }

                    innerLi.innerText = testIndex + ". " + jsMessage + "Actual: " + innerTest.actual + ", Expected: " + innerTest.expected + jsSource;
                }

                testIndex++;
            }
        }
    }

    function renderResults() {
        var outputDiv = getOutputDiv();
        setTestsSummary(outputDiv);
        displayFailingTests(outputDiv);
    }

    setInterval(function () {

        if (!testsAreRunning) {

            window.QUnit.init();
	    //window.Qunit.reset();
            window.QUnit.load();

	    var scripts = document.getElementsByTagName('head')[0].getElementsByTagName('script'),
		   		toReload = [],
		   		ticks = new Date().getTime(),
		   		head = document.getElementsByTagName('head')[0];
            
            for(var j=0; j < scripts.length; j++) {
            	if(scripts[j].getAttribute("data-reload") == "true") toReload.push(scripts[j]);
            }
            
            for(var j=0; j < toReload.length; j++) {
            	head.removeChild(toReload[j]);
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = toReload[j].src.split("?")[0] + "?t=" + ticks;
                script.setAttribute("data-reload", "true");
                head.appendChild(script);
            }


        }
    }, 1000); // default to reload every 1 second

} ());
