if (typeof Promise === "undefined") {
	console.log("Promise is undefined. Import polyfill.");
	importScripts("PromisePolyfillNpm.min.js");
}
/*

// ZUI5_SF_EvalComprehensive/Grading.controller.js retrievePhoto function 참고
// ZUI5_SF_EvalAchvCompGradeConfirmApp/delegate/OwnFuntions.js retrieveExceptionSettings function 참고

event.data = {
	url: "",   // URL
	data: {},  // 요청 parameter data
	method: "" // HTTP method
}

event.data = [{
	url: "",   // URL
	data: {},  // 요청 parameter data
	method: "" // HTTP method
}, {
	url: "",   // URL
	data: {},  // 요청 parameter data
	method: "" // HTTP method
},
..., {
	url: "",   // URL
	data: {},  // 요청 parameter data
	method: "" // HTTP method
}]

*/
self.onmessage = function(event) {
	var o = event.data;
	console.log("AjaxWorker", o);


	if (o instanceof Array) {
		var promises = [], responses = [], errors = [];

		o.forEach(function(item) {
			promises.push(new Promise(function(resolve, reject) {

				setTimeout(function() {
					call(
						item,
						function(response) {
							responses.push(response);
							resolve();
						},
						function(response) {
							errors.push(response);
							reject();
						}
					);
				}, 0);

			}));
		});

		Promise.all(promises)
			.then(function() {
				self.postMessage({success: true, responses: responses});
			})
			.catch(function() {
				self.postMessage({success: false, error: errors});
			});
	} else {
		call(
			o,
			function(response) {
				self.postMessage({success: true, response: response});
			},
			function(response) {
				self.postMessage({success: false, error: response});
			}
		);

	}

};

function call(o, success, error) {
	
	var xhr = new XMLHttpRequest(),
	method = o.method || "GET",
	url = o.url + (method === "GET" ? (o.data ? ("?" + o.data) : "") : "");

	xhr.open(method, url, true);

	xhr.onload = function() {
		var response = xhr.responseText ? JSON.parse(xhr.responseText) : {};
		if (o.callbackData) {
			for (var k in o.callbackData) {
				response[k] = o.callbackData[k];
			}
		}
		if (xhr.status === 200) {
			success(response);
		} else {
			error(response);
		}
	};
	xhr.onerror = function() {
		error(xhr.responseText ? JSON.parse(xhr.responseText) : "");
	};

	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Accept-Language", "ko-KR");

	if (typeof o.data === "object") {
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(o.data));
	} else if (typeof o.data === "string" && method !== "GET") {
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(o.data);
	} else {
		xhr.send();
	}
}