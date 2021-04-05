if (typeof Promise === "undefined") {
	console.log("Promise undefined. Import polyfill.");
	importScripts("PromisePolyfillNpm.min.js");
}

self.onmessage = function(event) {

/*
// ZUI5_SF_EvalComprehensive/Grading.controller.js retrievePhoto function 참고
// ZUI5_SF_EvalAchvCompGradeConfirmApp/delegate/OwnFuntions.js retrieveExceptionSettings function 참고

event.data = {
 	list: [
 		{
 			url: "",   // URL
 			data: {},  // 요청 parameter data
 			method: "" // HTTP method
 		},
 		...
 	]
}
 */
	var o = event.data;
	console.log("AjaxWorker", o);

	var promises = [], results = [], errors = [];

	(o.list || []).forEach(function(item) {
		promises.push(new Promise(function(resolve, reject) {

			setTimeout(function() {
				call(
					item,
					function(data) {
						results.push(data);
						resolve();
					},
					function(data) {
						errors.push(data);
						reject();
					}
				);
			}, 0);

		}));
	});

	Promise.all(promises)
		.then(function() {
			self.postMessage({
				success: true,
				results: results
			});
		})
		.catch(function() {
			self.postMessage({
				success: false,
				errors: errors
			});
		});
};

function call(o, success, error) {
	
	var xhr = new XMLHttpRequest(),
	method = o.method || "GET",
	url = o.url + (method === "GET" ? (o.data ? ("?" + o.data) : "") : "");

	xhr.open(method, url, true);

	xhr.onload = function() {
		if (xhr.status === 200) {
			success(xhr.responseText ? JSON.parse(xhr.responseText) : "");
		} else {
			error(xhr.responseText ? JSON.parse(xhr.responseText) : "");
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