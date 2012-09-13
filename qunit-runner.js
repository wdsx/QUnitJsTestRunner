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
		totalTests = 0;

    QUnit.testStart(function (details) {
        test = {};
        test.TestName = details.name;
        test.Tests = [];
        totalTests++;
    });

    QUnit.testStart(function (details) {
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
        renderResults();
        testResult.Reset();
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
        var scripts = document.getElementsByTagName('head')[0].getElementsByTagName('script'),
		   		i = scripts.length,
		   		toReload = [],
		   		ticks = new Date().getTime(),
		   		head = document.getElementsByTagName('head')[0],
                loadFiles = true;

        while (i--) {
            if (loadFiles) {
                // when we hit the qunit-runner, do not re-load any more files
                loadFiles = (scripts[i].src.indexOf("qunit-runner.js") == -1)

                if (!loadFiles)
                    continue;

                toReload.push(scripts[i].src.split("?")[0]);
                scripts[i].parentNode.removeChild(scripts[i]);
            }
        }

        i = toReload.length;

        while (i--) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = toReload[i] + "?t=" + ticks;
            head.appendChild(script);

            console.log(toReload[i]);
        }

        window.QUnit.init();
        window.QUnit.load();
    }, 1000); // default to reload every 1 second

} ());