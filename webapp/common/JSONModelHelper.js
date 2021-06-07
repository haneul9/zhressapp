sap.ui.define([
	"common/JSONModelRequest",
	"sap/ui/model/json/JSONModel"
], function(
	JSONModelRequest,
	JSONModel
) {
	"use strict";

	// Multiple requests sample : ZUI5_SF_EvalAchvCompItemCleanApp/Page.controller.js -> successHrReports function 참고

	function getDefaultLoadDataArguments() {

		return {
			aRequests: [new JSONModelRequest()],
			sURL: null,
			sType: "GET",
			bAsync: true,
			bMerge: false,
			bCaching: false,
			mHeaders: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Accept-Language": "ko-KR"
			}
		};
	}

	var c = JSONModel.extend("JSONModelHelper", {

		constructor: function() {

			JSONModel.apply(this, arguments);

			this.__promise = null;   // loadData function이 반환하는 promise 저장 변수, 아래 promise function을 호출하여 사용
			this.__count = null;     // loadData 후 getData 호출로 얻을 수 있는 data의 d.__count 를 저장해놓는 변수, 아래 getInlinecount function을 호출하여 사용
			this.result = null;      // loadData 후 getData 호출로 얻을 수 있는 data의 d 를 저장해놓는 변수, 아래 getResult function을 호출하여 사용
			this.results = null;     // loadData 후 getData 호출로 얻을 수 있는 data의 d.results 를 저장해놓는 변수, 아래 getResults function을 호출하여 사용
			this.resultsMap = null;  // Multiple requests의 경우 비동기로 호출되므로 결과 results의 orderby를 유지할 수 있도록 호출한 순서를 map의 key값으로 저장해둠
			this.contextData = null; // JSONModel 내에 저장하고 싶은 임의의 JSON data를 저장, loadData 호출 전후 적절한 시점에 data를 저장해놓고(165행 setContextData) 필요한 시점에 사용(아래 getContextData function)
			this.loadDataArguments = getDefaultLoadDataArguments(); // loadData 호출시 넘겨주는 parameter들을 임시로 저장하는 변수
		}

	});

	$.extend(c.prototype, {

		setParameter: function(key, value) {

			var args = this.loadDataArguments;
			if (!args) {
				this.loadDataArguments = getDefaultLoadDataArguments();
			}
			if (!args.aRequests || !args.aRequests.length) {
				args.aRequests = [new JSONModelRequest()];
			}

			$.map(args.aRequests, function(r) {
				r.setParameter(key, value);
			});
			return this;
		},

		getParameter: function(key) {

			var args = this.loadDataArguments;
			if (!args) {
				this.loadDataArguments = getDefaultLoadDataArguments();
			}
			if (!args.aRequests || !args.aRequests.length) {
				args.aRequests = [new JSONModelRequest()];
			}

			return args.aRequests[0].getParameter(key);
		},

		url: function(sURL) {

			var args = this.loadDataArguments;
			if (!args) {
				this.loadDataArguments = getDefaultLoadDataArguments();
			}
			if (!args.aRequests || !args.aRequests.length) {
				args.aRequests = [new JSONModelRequest()];
			}

			$.map(args.aRequests, function(r) {
				r.url(sURL);
			});
			return this;
		},

		requests: function(requests) {

			this.loadDataArguments.aRequests = requests instanceof Array ? requests : [requests];
			return this;
		},

		setAsync: function(bAsync) {

			this.loadDataArguments.bAsync = bAsync;
			return this;
		},

		setGet: function() {

			this.loadDataArguments.sType = "GET";
			this.loadDataArguments.mHeaders.Accept = "application/json";
			return this;
		},

		setPost: function() {

			this.loadDataArguments.sType = "POST";
			this.loadDataArguments.mHeaders.Accept = "application/json";
			return this;
		},

		setDelete: function() {

			this.loadDataArguments.sType = "DELETE";
			this.loadDataArguments.mHeaders.Accept = "text/plain";
			return this;
		},

		top: function(value) {

			return this.setParameter("top", value);
		},

		skip: function(value) {

			return this.setParameter("skip", value);
		},

		select: function(value) {

			var args = this.loadDataArguments;
			if (!args) {
				this.loadDataArguments = getDefaultLoadDataArguments();
			}
			if (!args.aRequests || !args.aRequests.length) {
				args.aRequests = [new JSONModelRequest()];
			}

			$.map(args.aRequests, function(r) {
				r.select(value);
			});
			return this;
		},

		filter: function(value) {

			var args = this.loadDataArguments;
			if (!args) {
				this.loadDataArguments = getDefaultLoadDataArguments();
			}
			if (!args.aRequests || !args.aRequests.length) {
				args.aRequests = [new JSONModelRequest()];
			}

			$.map(args.aRequests, function(r) {
				r.filter(value);
			});
			return this;
		},

		expand: function(value) {

			var args = this.loadDataArguments;
			if (!args) {
				this.loadDataArguments = getDefaultLoadDataArguments();
			}
			if (!args.aRequests || !args.aRequests.length) {
				args.aRequests = [new JSONModelRequest()];
			}

			$.map(args.aRequests, function(r) {
				r.expand(value);
			});
			return this;
		},

		orderby: function(value) {

			var args = this.loadDataArguments;
			if (!args) {
				this.loadDataArguments = getDefaultLoadDataArguments();
			}
			if (!args.aRequests || !args.aRequests.length) {
				args.aRequests = [new JSONModelRequest()];
			}

			$.map(args.aRequests, function(r) {
				r.orderby(value);
			});
			return this;
		},

		inlinecount: function(b) {

			var args = this.loadDataArguments;
			if (!args) {
				this.loadDataArguments = getDefaultLoadDataArguments();
			}
			if (!args.aRequests || !args.aRequests.length) {
				args.aRequests = [new JSONModelRequest()];
			}

			$.map(args.aRequests, function(r) {
				r.inlinecount(b);
			});
			return this;
		},

		getInlinecount: function() {

			if (this.__count) {
				return this.__count;
			}

			var args = this.loadDataArguments;
			if (args.aRequests[0].isInlinecount()) {
				this.__count = (this.getData().d || {}).__count || 0;
			}
			return this.__count;
		},

		getLoadDataArgumentsObject: function() {

			return this.loadDataArguments;
		},

		getLoadDataArguments: function() {

			var args = this.loadDataArguments, requests = args.aRequests;
			return requests.length === 1
				// single request
				? [requests[0].getURL(), requests[0].getParameterMap(), args.bAsync, args.sType, args.bMerge, args.bCaching, args.mHeaders]
				// multiple requests
				: (function() {
					var a = [];
					$.map(requests, function(r) {
						a.push([r.getURL(), r.getParameterMap(), args.bAsync, args.sType, args.bMerge, args.bCaching, args.mHeaders]);
					});
					return a;
				})();
		},

		getEncodedURL: function() {

			return $.map(this.loadDataArguments.aRequests, function(r) {
				return r.getEncodedURL(r.getParameterMap());
			});
		},

		getDecodedURL: function() {

			return $.map(this.loadDataArguments.aRequests, function(r) {
				return r.getDecodedURL(r.getParameterMap());
			});
		},

		load: function() {

			try {
				var parent = this, args = this.getLoadDataArguments();

				// multiple requests
				if (this.loadDataArguments.aRequests.length > 1) {
					this.resultsMap = {};
					this.__promise = Promise.all($.map(args, function(arg, i) {
						var model = new JSONModel()
							.attachRequestCompleted(function() {
								if ($.app.LOG.ENABLE_SUCCESS) common.Common.log("success", i, arguments);

								var data = this.getData().d || {};
								parent.resultsMap[i] = data.results || [];

								if (data.__next) {
									common.Common.log("Request success but it has more data to retrieve.", i, data.__next);
								}
							})
							.attachRequestFailed(function() {
								if ($.app.LOG.ENABLE_FAILURE) common.Common.log("failure", i, arguments);
							});

						return model.loadData.apply(model, arg);
					}))
					.then(function() {
						return parent.loadData("common/empty.json", null, true, "GET", false, false, args.mHeaders);
					})
					.catch(function() {
						common.Common.log("loadDatas error", arguments);
					});
				}
				// single request
				else {
					this.__promise = this.loadData.apply(this, args);
					if (args[2] === true) {
						this.__promise.catch(function() {
							common.Common.log("loadData error", arguments);
						});
					}
				}
			} catch(e) {
				common.Common.log("loadData throws", e);
				throw e;
			}

			return this;
		},

		promise: function() {

			return this.__promise;
		},

		getResult: function() {

			if (this.result) {
				return this.result;
			}

			// single request 이어야만 results 변수가 없음
			this.result = this.getData().d || {};
			return this.result;
		},

		getResults: function() {

			if (this.results) {
				return this.results; // 최초 호출이 아니면 저장된 결과가 있으므로 그 결과를 바로 반환
			}

			// multiple requests인 경우
			if (this.loadDataArguments.aRequests.length > 1) {
				var results = [], resultsMap = this.resultsMap;
				$.each(new Array(Object.keys(resultsMap).length), function(i) { // orderby를 유지하기 위해 저장된 순서대로 결과를 조합
					results = results.concat(resultsMap[i]);
				});
				this.results = results;
			}
			// single request인 경우
			else {
				this.results = (this.getData().d || {}).results || [];
			}
			return this.results;
		},

		setResults: function() {

			this.getData().Data = this.getResults();
			return this;
		},

		setContextData: function(o, value) {

			if ($.isPlainObject(o)) {
				this.contextData = o;
			} else {
				if (!this.contextData) {
					this.contextData = {};
				}
				this.contextData[o] = value;
			}
			return this;
		},

		getContextData: function() {

			return this.contextData;
		},

		getController: function(id) {

			return $.app.getController(id);
		},

		getView: function(id) {

			return $.app.getView(id);
		}

	});

	return c;
});