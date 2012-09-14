#A test runner for QUnit#

It runs in the browser and will auto refresh your tests every 1 second (configurable) so that you do not have to a) focus to the browser or b) refresh the browser to see when tests are failing.

*NOTE:* This is written by me for me and in it's current state has some issues. It only works/has been testing in Chrome (my default browser) and is very experimental. I'm still making changes to this as it can sometimes be a little jumpy when there are lots of tests accessing DOM elements.

You can see a video of this being used here: https://vimeo.com/49378433

For more information see: http://www.contentedcoder.com/2012/09/javascript-test-runner-for-qunit.html

##Roadmap##

* Support other browsers e.g. IE *
* Ensure working with the DOM is reliable


\\* I have performed some basic testing and made some changes that make this more stable in IE.