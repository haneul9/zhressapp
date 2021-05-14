/* global Promise:true */
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/JSONModelRequest",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel"
], function(Common, CommonController, JSONModelHelper, JSONModelRequest, MessageBox, BusyIndicator, JSONModel) {
"use strict";

var SUB_APP_ID = [$.app.CONTEXT_PATH, "Grading"].join(".");

return CommonController.extend(SUB_APP_ID, { // 종합평가 : 수행

	HeaderModel: new JSONModelHelper(),
	AggregateTableModel: new JSONModelHelper(),
	GradeListModel: new JSONModelHelper(),
	GradeSModel: new JSONModelHelper(),
	GradeAModel: new JSONModelHelper(),
	GradeBModel: new JSONModelHelper(),
	GradeCModel: new JSONModelHelper(),
	GradeDModel: new JSONModelHelper(),

	onInit: function () {
		Common.log("onInit");

		this.setupView()
			.getView().addEventDelegate({
				onBeforeShow: this.onBeforeShow,
				onAfterShow: this.onAfterShow
			}, this);
	},

	onBeforeShow: function() {
		Common.log("onBeforeShow");

		this.HeaderModel.setData({});
		this.AggregateTableModel.setData({Aggregate: [], DepartmentMap: {}});
		this.GradeListModel.setData({Gradings: [], ComboBoxItems: [], GradePointMap: {}});
		this.GradeSModel.setData([]);
		this.GradeAModel.setData([]);
		this.GradeBModel.setData([]);
		this.GradeCModel.setData([]);
		this.GradeDModel.setData([]);

		Common.adjustVisibleRowCount($.app.byId("AggregateTable").setBusy(false), 2, 2);
	},

	onAfterShow: function(oEvent) {
		Common.log("onAfterShow");

		this.onLoadDetailSet(this, oEvent.data);
	},

	onLoadDetailSet: function(oController, oParam) {

		BusyIndicator.show(0);

		var oModel = $.app.getModel("ZHR_APPRAISAL_SRV"),
			Evstaus = oParam.Evstaus || "",
			editable = Number(oParam.Evstaus || 0) < 20,
			oPayload = {};

		Common.removeProperties(oParam, "__metadata", "No", "IOdkey");

		// Set header
		oPayload.IOdkey = "000";
		oPayload.IConType = $.app.ConType.READ;
		oPayload.IEvstaus = Evstaus;
		oPayload.IPclog = Common.getPCLogStructure();
		oPayload.IInput = oParam;

		// Set navigation
		oPayload.Export = [];
		oPayload.TableIn1 = [];
		oPayload.TableIn2 = [];
		oPayload.TableIn3 = [];

		oModel.create("/CollEvaDetailSet", oPayload, {
			success: function(data) {
				var promises = [];
				promises.push(Common.getPromise(function() {
					if (data.Export) {
						Common.log("data.Export.results", data.Export.results);

						oController.HeaderModel.setData(data.Export.results[0]);
					}
				}));
				promises.push(Common.getPromise(function() {
					// 부서별 평가등급 현황
					if (data.TableIn1) {
						Common.log("data.TableIn1.results", data.TableIn1.results);

						var list = data.TableIn1.results || [],
						total = {
							Sumorgtx: oController.getBundleText("LABEL_11317"), // 합계
							Empcnt1: 0, Empcnt2: 0, Empcnt3: 0, Empcnt4: 0, Empcnt5: 0, Empcnt6: 0,
							Evapnt1: 0, Evapnt2: 0, Evapnt3: 0, Evapnt4: 0, Evapnt5: 0, Evapnt6: 0
						},
						map = {};

						$.each(list, function(i, o) {
							if (!map[o.Sumorg]) {
								map[o.Sumorg] = o;
							}
							total.Empcnt1 += o.Empcnt1; total.Evapnt1 += o.Evapnt1;
							total.Empcnt2 += o.Empcnt2; total.Evapnt2 += o.Evapnt2;
							total.Empcnt3 += o.Empcnt3; total.Evapnt3 += o.Evapnt3;
							total.Empcnt4 += o.Empcnt4; total.Evapnt4 += o.Evapnt4;
							total.Empcnt5 += o.Empcnt5; total.Evapnt5 += o.Evapnt5;
							total.Empcnt6 += o.Empcnt6; total.Evapnt6 += o.Evapnt6;
						});
						list.push(total);

						oController.AggregateTableModel.setData({
							Aggregate: list,
							DepartmentMap: map
						});

						Common.adjustVisibleRowCount($.app.byId("AggregateTable"), 5, list.length);
					}
				}));
				promises.push(Common.getPromise(function() {
					// 개인별 평가등급 현황 : Drag and Drop 영역
					if (data.TableIn2) {
						Common.log("data.TableIn2.results", data.TableIn2.results);

						var EvalYear = new Date().getFullYear(),
						list = data.TableIn2.results || [],
						guideline = {styleClass: "employee-evaluation-card-guideline"},
						map = {
							S: editable ? [guideline] : [],
							A: editable ? [guideline] : [],
							B: editable ? [guideline] : [],
							C: editable ? [guideline] : [],
							D: editable ? [guideline] : []
						};

						setTimeout(function() {
							this.retrievePhoto(list);
						}.bind(oController), 0);

						$.map(list, function(o, i) {
							if (Common.isLOCAL() && !o.Pegrade) {
								o.Pegrade = (function() { var r = Math.random() + 0.3; return r > 0.8 ? "A" : r > 0.7 ? "B" : "C"; })();
							}

							o.No = i + 1;
							o.Pyear1 = EvalYear - 1;
							o.Pyear2 = EvalYear - 2;
							o.Pyear3 = EvalYear - 3;
							o.Pernr = o.Pernr.replace(/^0+/, "");
							o.Cograde = o.Cograde || o.Pegrade;
							o.Pvgrade = o.Cograde; // ComboBox 등급 직전 선택값 저장
							o.dragable = editable;

							if (o.Cograde) {
								map[o.Cograde].unshift(o);
							}
							if (o.Evstaus === "40") {
								o.styleClass = "employee-evaluation-card-demurrer";
							}
						});

						$.map(oController.sort(list), function(o, i) {
							o.No = i + 1;
						});
						oController.GradeListModel.setProperty("/Gradings", list);

						setTimeout(oController.calculate.bind(oController), 0);

						Common.adjustVisibleRowCount($.app.byId("GradingTable"), 10, list.length);

						$.map(map, function(l, k) {
							var gridContainer = $.app.byId("GridContainer" + k);
							if (!gridContainer) {
								return;
							}

							gridContainer.removeAllDragDropConfig();

							if (editable) {
								var oView = oController.getView(), configs = oView.getDnDConfigs(oView);
								gridContainer.addDragDropConfig(configs[0]).addDragDropConfig(configs[1]);
							}
						});

						oController.GradeSModel.setData({group: "S", list: oController.sort(map.S)});
						oController.GradeAModel.setData({group: "A", list: oController.sort(map.A)});
						oController.GradeBModel.setData({group: "B", list: oController.sort(map.B)});
						oController.GradeCModel.setData({group: "C", list: oController.sort(map.C)});
						oController.GradeDModel.setData({group: "D", list: oController.sort(map.D)});
					}
				}));
				promises.push(Common.getPromise(function() {
					// 평가등급별 점수현황 : 평가리스트 종합평가 ComboBox items
					if (data.TableIn3) {
						Common.log("data.TableIn3.results", data.TableIn3.results);

						var list = data.TableIn3.results || [], map = {};
						$.map(list, function(o) {
							map[o.Cograde] = Number(o.Evapnt);
						});
						oController.GradeListModel.setProperty("/ComboBoxItems", list);
						oController.GradeListModel.setProperty("/GradePointMap", map);
					}
				}));

				Promise.all(promises)
					.then(function() {
						Common.log("sapMTabStripContainer");
						setTimeout(function() {
							// $(".sapMTabStripContainer").append("<div class=\"custom-tab-container-legend\"><img src=\"images/grade-n-icon-legend.png\" /></div>");
							$(".sapMTabStripContainer").append([
								"<div class=\"custom-tab-container-legend\">",
									"<span class=\"sapMLabel sapUiSelectable sapMLabelMaxWidth prev-grade-s\"><span class=\"sapMLabelTextWrapper\"><bdi>S</bdi></span></span>",
									"<span class=\"sapMLabel sapUiSelectable sapMLabelMaxWidth prev-grade-a\"><span class=\"sapMLabelTextWrapper\"><bdi>A</bdi></span></span>",
									"<span class=\"sapMLabel sapUiSelectable sapMLabelMaxWidth prev-grade-b\"><span class=\"sapMLabelTextWrapper\"><bdi>B</bdi></span></span>",
									"<span class=\"sapMLabel sapUiSelectable sapMLabelMaxWidth prev-grade-c\"><span class=\"sapMLabelTextWrapper\"><bdi>C</bdi></span></span>",
									"<span class=\"sapMLabel sapUiSelectable sapMLabelMaxWidth prev-grade-d\"><span class=\"sapMLabelTextWrapper\"><bdi>D</bdi></span></span>",
									"<span class=\"legend-text\">", oController.getBundleText("LABEL_11428"), "</span>", // 직전 평가등급
									"<div class=\"sapUiIcon sapUiIconMirrorInRTL sapUiIconPointer\" data-sap-ui-icon-content=\"\"></div>",
									"<span class=\"legend-text\">", oController.getBundleText("LABEL_11429"), "</span>", // 평가결과
									"<div class=\"sapUiIcon sapUiIconMirrorInRTL sapUiIconPointer\" data-sap-ui-icon-content=\"\"></div>",
									"<span class=\"legend-text\">", oController.getBundleText("LABEL_11430"), "</span>", // 인사기록카드
									"<div class=\"employee-evaluation-card-demurrer\"></div>",
									"<span class=\"legend-text\">", oController.getBundleText("LABEL_11431"), "</span>", // 이의제기
								"</div>"
							].join(""));
						}, 0);

						BusyIndicator.hide();
					});
			},
			error: function(res) {
				var errData = Common.parseError(res);
				if (errData.Error === "E") {
					MessageBox.error(errData.ErrorMessage, {
						title: oController.getBundleText("LABEL_00150") // 안내
					});
				}

				BusyIndicator.hide();
			}
		});
	},

	calculate: function() {

		var ColNameMap = {S: "1", A: "2", B: "3", C: "4", D: "5"},
		DepartmentMap = this.AggregateTableModel.getProperty("/DepartmentMap"),
		GradePointMap = this.GradeListModel.getProperty("/GradePointMap"),
		Gradings = this.GradeListModel.getProperty("/Gradings"),
		Bgtpnt = Number(this.HeaderModel.getProperty("/Bgtpnt")),
		Total = {
			Sumorgtx: this.getBundleText("LABEL_11317"), // 합계
			Empcnt1: 0, Empcnt2: 0, Empcnt3: 0, Empcnt4: 0, Empcnt5: 0, Empcnt6: 0,
			Evapnt1: 0, Evapnt2: 0, Evapnt3: 0, Evapnt4: 0, Evapnt5: 0, Evapnt6: 0
		};

		$.each(DepartmentMap, function(k, o) {
			$.extend(o, {
				Empcnt1: 0, Empcnt2: 0, Empcnt3: 0, Empcnt4: 0, Empcnt5: 0, Empcnt6: 0,
				Evapnt1: 0, Evapnt2: 0, Evapnt3: 0, Evapnt4: 0, Evapnt5: 0, Evapnt6: 0
			});
		});
		$.each(Gradings, function(i, o) {
			var department = DepartmentMap[o.Sumorg],
			n = ColNameMap[o.Cograde],
			p = GradePointMap[o.Cograde],
			Empcnt = "Empcnt" + n,
			Evapnt = "Evapnt" + n;

			o.Evapnt = p;
			++department.Empcnt6;
			++department[Empcnt];
			++Total.Empcnt6;
			++Total[Empcnt];
			department.Evapnt6 += p;
			department[Evapnt] += p;
			Total.Evapnt6 += p;
			Total[Evapnt] += p;
		});

		$.app.byId("total-evapnt").toggleStyleClass("color-darkgreen", Total.Evapnt6 <= Bgtpnt).toggleStyleClass("color-red", Total.Evapnt6 > Bgtpnt);
		this.HeaderModel.setProperty("/Evapnt", Total.Evapnt6);
		this.AggregateTableModel.setProperty("/Aggregate/" + Object.keys(DepartmentMap).length, Total);
		this.AggregateTableModel.refresh();
	},

	onPressSave: function() {

		var Evapnt = Number(this.HeaderModel.getProperty("/Evapnt") || 0);
		if (Evapnt === 0) {
			MessageBox.error(this.getBundleText("MSG_11007")); // 평가점수 정보가 없습니다.
			return;
		}

		this.save("10", "MSG_00017"); // 저장되었습니다.
	},

	onPressConfirm: function() {

		var Bgtpnt = Number(this.HeaderModel.getProperty("/Bgtpnt") || 0),
		Evapnt = Number(this.HeaderModel.getProperty("/Evapnt") || 0);
		if (Evapnt === 0) {
			MessageBox.error(this.getBundleText("MSG_11007")); // 평가점수 정보가 없습니다.
			return;
		}
		if (Evapnt > Bgtpnt) {
			MessageBox.error(this.getBundleText("MSG_11004")); // 평가점수는 Budget점수를 초과할 수 없습니다.
			return;
		}

		var oController = this;
		MessageBox.confirm(this.getBundleText("MSG_11002"), { // 평가완료 처리하시겠습니까?
			onClose: function(oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					oController.save.bind(oController)("20", "MSG_11003"); // 평가완료 처리되었습니다.
				} else {
					BusyIndicator.hide();
				}
			}
		});
	},

	save: function(IEvstaus, successMessageCode) {

		BusyIndicator.show(0);

		var oController = this,
		oModel = $.app.getModel("ZHR_APPRAISAL_SRV"),
		oPayload = {
			IConType: $.app.ConType.UPDATE,
			IEvstaus: IEvstaus, // 진행중
			IPclog: Common.getPCLogStructure(),
			IInput: Common.copyByMetadata("ZHR_APPRAISAL_SRV", "complexType", "IInput", oController.HeaderModel.getData()),
			TableIn2: $.map(oController.GradeListModel.getProperty("/Gradings"), function(o) {
				var data = Common.copyByMetadata("ZHR_APPRAISAL_SRV", "entityType", "CollEvaDetailTableIn2", o);
				delete data.Photo;
				return data;
			})
		};

		oModel.create("/CollEvaDetailSet", oPayload, {
			success: function() {
				MessageBox.success(oController.getBundleText(successMessageCode), {
					onClose: function() {
						BusyIndicator.hide();

						if (IEvstaus === "20") {
							sap.ui.getCore().getEventBus().publish("nav", "to", {
								id: [$.app.CONTEXT_PATH, "List"].join(".")
							});
						}
					}
				});
			},
			error: function(res) {
				var errData = Common.parseError(res);
				if (errData.Error === "E") {
					MessageBox.error(errData.ErrorMessage, {
						title: oController.getBundleText("LABEL_00150") // 안내
					});
				}

				BusyIndicator.hide();
			}
		});
	},

	getSortScore: function(o) {

		var CogradePriority = {S: 5000000, A: 4000000, B: 3000000, C: 2000000, D: 1000000},
			PegradePriority = {A: 300000, B: 200000, C: 100000};
		return (CogradePriority[o.Cograde] || 0) + (PegradePriority[o.Pegrade] || 0) - (10000 - Number(o.Pepnt || 0)) - (1000 - Number(o.Cepnt || 0)) - Number(o.Mepnt || 0);
	},

	sort: function(list) {

		var oController = this;
		list.sort(function(o1, o2) {
			return oController.getSortScore(o2) - oController.getSortScore(o1);
		});
		return list;
	},

	retrievePhoto: function(list) {

		var oController = this,
		worker = new Worker("common/AjaxWorker.js"); // Worker instance 생성
		worker.onmessage = function(event) { // Worker로 조회한 결과를 받는 callback binding
			var map = {};
			$.map(list, function(o) {
				map[o.Pernr] = o;
			});

			setTimeout(function() {
				var workerMessage = event.data;
				if (workerMessage.success) {
					$.map(workerMessage.responses, function(o) {
						var results = (o.d || {}).results || [];
						if (results.length) {
							var photoData = results[0];
							map[photoData.userId].Photo = "data:${photoData.mimeType};base64,${photoData.photo}".interpolate(photoData.mimeType, photoData.photo);
						}
					});
					oController.GradeSModel.refresh();
					oController.GradeAModel.refresh();
					oController.GradeBModel.refresh();
					oController.GradeCModel.refresh();
					oController.GradeDModel.refresh();
				}
			}, 0);

			worker.terminate();
			worker = undefined;
		};
		worker.postMessage(
			$.map(list || [], function(o) { // Worker 작업 실행
				return {
					url: "/odata/v2/Photo",
					data: new JSONModelRequest()
						.select("userId")
						.select("mimeType")
						.select("photo")
						.filter("userId eq '${userId}'".interpolate(o.Pernr))
						.filter("photoType eq 1")
						.getEncodedQueryString()
				};
			})
		);
	},
	onPrint : function(){
		  //var svg =  document.getElementById('UIComp_0').querySelector( "svg" );
		//   var svg =  document.getElementById('__section0-innerGrid').querySelector( "svg" );
		  var svg =  document.getElementById('EvalResult_Chart').querySelector( "svg" );
		  var svgData = new XMLSerializer().serializeToString( svg );
		  var canvas = document.createElement( "canvas" );
		  var svgSize = svg.getBoundingClientRect();
		  canvas.width = svgSize.width * 3;
		  canvas.height = svgSize.height * 3;
		  canvas.style.width = svgSize.width;
		  canvas.style.height = svgSize.height;
		  var ctx = canvas.getContext( "2d" );
		  ctx.scale(3,3);
		//   var doc = new jsPDF('l', 'mm', [4, 2]);

		  var doc = new jsPDF({
			orientation: "portrait",
			//format: "a4"
			format: [400, 200]
		  });
		
		doc.autoTable({
			headStyles:  { halign: 'center', valign: 'middle' },  //헤더 부분 옵션
			startX: 0, 
			startY: 0,
			margin: {  left : 2, top : 2, right : 2  },  //여백
			tableWidth : 400,
			styles : { font : 'malgun', fontStyle :'normal'},  //폰트적용
			head: ['헤더1', '헤더2', '헤더3'],
			body : [
				[   
					{content: '데이터1', rowSpan: 6, styles: {halign: 'center'}},  //여러 속성들, content는 내용입니다.
					{content: '데이터2', styles: {halign: 'center', fillColor: [ 252, 252, 252 ]}},
					{content: '데이터3', styles: {halign: 'center'}}
				]
			]
		});

		// 화면 전체 ( 단 보이는 곳만 출력됨)
		//   html2canvas(document.getElementById("EvalResultObjectPageLayout"), {
		// 		// scale based on quality value input
		// 		scale: 1,
		// 		// logging for debugging
		// 		logging: true,
		// 		letterRendering: 1,
		// 		// allows for cross origin images
		// 		allowTaint: true,
		// 		useCORS: true
		// 	}).then(function (canvas) {
		// 		setTimeout(function () {
		// 			var img = canvas.toDataURL('image/png');
		// 			doc.addImage(img, 'PNG', 2, 2, 120, 200);
		// 			doc.save('file-name.pdf');
		// 		}, 3000);
		// 	}
		//   );	

		// 절대 삭제 금지 (그래프 다운로드)
		//   var img = document.createElement( "img" );
		//   img.setAttribute( "src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))) );
		
		//   img.onload = function() {
		//       ctx.drawImage( img, 0, 0 );
		//       var canvasdata = canvas.toDataURL("image/png",1);

		//       //var pngimg = '<img src="'+canvasdata+'">';
		//       //d3.select("#pngdataurl").html(pngimg);
		
		//       //var a = document.createElement("a");
		//       //a.download = "download_img"+".png";
		//       //a.href = canvasdata;
		//       //document.body.appendChild(a);
		//       //a.click();
		// 	//   var doc = new jsPDF('l', 'mm', 'a4');
		// 	//   var position = 0;
	    //       doc.addImage(canvasdata, "PNG", 150, 20, 120, 100);  // 시작 x, 시작 y, 넓이, 높이
	    //       doc.save('file-name.pdf')
		//   };


		



		  
		  //var doc = new jsPDF('p', 'mm');
		  //var position = 0;
    //       doc.addImage(img, "PNG", 0, position, "1000px", "600px");
    //       doc.save('file-name.pdf')
           
		
	},
	
	// onPrint : function(){
	// 	  //var svg =  document.getElementById('UIComp_0').querySelector( "svg" );
	// 	  var svg =  document.getElementById('__section0-innerGrid').querySelector( "svg" );
	// 	  var svgData = new XMLSerializer().serializeToString( svg );
	// 	  var canvas = document.createElement( "canvas" );
	// 	  var svgSize = svg.getBoundingClientRect();
	// 	  canvas.width = svgSize.width * 3;
	// 	  canvas.height = svgSize.height * 3;
	// 	  canvas.style.width = svgSize.width;
	// 	  canvas.style.height = svgSize.height;
	// 	  var ctx = canvas.getContext( "2d" );
	// 	  ctx.scale(3,3);
		
	// 	  var img = document.createElement( "img" );
	// 	  img.setAttribute( "src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))) );
		
	// 	  img.onload = function() {
	// 	      ctx.drawImage( img, 0, 0 );
	// 	      var canvasdata = canvas.toDataURL("image/png",1);
		
	// 	      var pngimg = '<img src="'+canvasdata+'">';
	// 	      d3.select("#pngdataurl").html(pngimg);
		
	// 	      var a = document.createElement("a");
	// 	      a.download = "download_img"+".png";
	// 	      a.href = canvasdata;
	// 	      document.body.appendChild(a);
	// 	      a.click();
 // 		  };
	// },
	
	// onPrint : function(){
	// 	// Converts canvas to an image
	//     var convertCanvasToImage = function(canvas) {
	//         var image = new Image();
	//         image.src = canvas.toDataURL("image/png");
	//         return image;
	//     };
		
	// 	var convertImageToCanvas = function(image){
	//         var canvas = document.createElement("canvas");
	//         canvas.width = image.width;
	//         canvas.height = image.height;
	//         canvas.getContext("2d").drawImage(image, 0, 0);
	//         return canvas;
	//     };
		
	// 	var downloadPNGFromAnyImageSrc = function(src){
	// 	      var img = new Image;
	// 		  //when image loaded (to know width and height)
	// 		  img.onload = function(){
	// 		    //drow image inside a canvas
	// 		    var canvas = convertImageToCanvas(img);
	// 		    //get image/png from convas
	// 		    var pngImage =  convertCanvasToImage(canvas);
	// 		    //download
	// 		    var anchor = document.createElement('a');
	// 		    anchor.setAttribute('href', pngImage.src);
	// 		    anchor.setAttribute('download', 'image.png');
	// 		    anchor.click();
	// 		  };
			  
	// 		  img.src = src;
	// 	};
		
	// 	var wrapper = document.getElementById('UIComp_0');
	// 	  //dom to image
	// 	  domtoimage.toSvg(wrapper).then(function (svgDataUrl) {
	// 	  //download function    
	// 	  downloadPNGFromAnyImageSrc(svgDataUrl);
	// 	 });
		
	// },
	
	// onPrint : function(){
	// 	// gets the quality based on the value that is input in the field
 //       // window.devicePixelRatio = 2; 
 //           html2canvas(document.getElementById("__dialog2-cont"), {
 //               // scale based on quality value input
 //               scale: 1,
 //               // logging for debugging
 //               logging: true,
 //               letterRendering: 1,
 //               // allows for cross origin images
 //               allowTaint: true,
 //               useCORS: true
 //           }).then(function (canvas) {
 //               setTimeout(function () {
 //                   var img = canvas.toDataURL('image/png');
 //                   var doc = new jsPDF('l', 'mm', 'a4');
 //                   // const imgProps = doc.getImageProperties(img);
 //                   const pdfWidth = "600px";
 //                   const pdfHeight = "1000px"
 //                   doc.addImage(img, 'PNG', 2, 2, pdfWidth, pdfHeight);
 //                   doc.save('generatedPDF.pdf');
 //               }, 3000);
 //           });	
		
	// },
	
	// onPrint : function(){
	// 	var svgElements = $('#__dialog2-cont').find('svg');
	// 	svgElements.each(function () {
	// 		 var canvas, xml;
	
	//         canvas = document.createElement("canvas");
	//         canvas.className = "screenShotTempCanvas";
	
	//         console.log('width: ' + $(this).parent().width());
	//         console.log('height: ' + $(this).parent().height());
	
	//         canvas.width = $(this).parent().width();
	//         canvas.height = $(this).parent().height();
	
	//         //convert SVG into a XML string
	//         xml = (new XMLSerializer()).serializeToString(this);
	
	//         // Removing the name space as IE throws an error
	//         xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
	
	//         //draw the SVG onto a canvas
	//         canvg(canvas, xml);
	
	//         $(canvas).insertAfter(this);
	
	//         //hide the SVG element
	//         this.className = "tempHide";
	//         $(this).hide();
	//     });
	    
	//     var imgData;
	//     html2canvas($("#__dialog2-cont"), {
	//         useCORS: true,
	//         onrendered: function (canvas) {
	//             imgData = canvas.toDataURL('image/png');
	//             var doc = new jsPDF('p', 'pt', 'a4');
	//             doc.addImage(imgData, 'PNG', 0, 0);
	//             doc.save('sample-file.pdf');
	//             //window.open(imgData);
	//         }
	//     });
		
	// },
	
	
	// onPrint : function(){
	// 	var doc = new jsPDF('portrait', 'pt', 'a4', true);    
	//     var elementHandler = {    
	//         '#ignorePDF': function(element, renderer) {    
	//             return true;    
	//         }    
	//     };    
	    
	//     var source = document.getElementById("__dialog2-cont");    
	//     doc.fromHTML(source, 15, 15, {    
	//         'width': 560,    
	//         'elementHandlers': elementHandler    
	//     });    
	    
	//     var svg = document.querySelector('svg');    
	//     var canvas = document.createElement('canvas');    
	    
 //       canvas.width = "100%";
 //       canvas.height = "100%";
        
	    
	//     var context = canvas.getContext('2d');    
	// 	var data = (new XMLSerializer()).serializeToString(svg);    
 //       // Removing the name space as IE throws an error
 //       data = data.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');

 //       //draw the SVG onto a canvas
 //       canvg(canvas, data);
	//     var svgBlob = new Blob([data], {    
	//         type: 'image/svg+xml;charset=utf-8'    
	//     });    
	    
	//     var url = canvas.toDataURL(svgBlob);//DOMURL.createObjectURL(svgBlob);    
	    
	//     var img = new Image();    
	//     img.onload = function() {    
	//         context.canvas.width = $('#UIComp_0').find('svg').width();;    
	//         context.canvas.height = $('#UIComp_0').find('svg').height();;    
	//         context.drawImage(img, 0, 0);    
	//         // freeing up the memory as image is drawn to canvas    
	//         //DOMURL.revokeObjectURL(url);    
	    
	//         var dataUrl = canvas.toDataURL('image/jpeg');    
	//         doc.addImage(dataUrl, 'JPEG', 20, 365, 560, 350); // 365 is top     
	    
	//         var bottomContent = document.getElementById("bottom-content");    
	//         doc.fromHTML(bottomContent, 15, 750, {   //700 is bottom content top  if you increate this then you should increase above 365    
	//             'width': 560,    
	//             'elementHandlers': elementHandler    
	//         });    
	    
	//         setTimeout(function() {    
	//             doc.save('HTML-To-PDF-Dvlpby-Bhavdip.pdf');    
	//         }, 2000);    
	//     };    
	//     img.src = url;    
	// },
	
	// onPrint : function(){
		
	// 	var toPrint = function(){
	// 		html2canvas($('#__dialog2-cont'),{ 
	// 		// html2canvas($('#UIComp_0'),{
	// 			logging: true,
	// 	        profile: true,
	// 	        useCORS: true,
	// 	        allowTaint: true,
	//             height: window.outerHeight + window.innerHeight,
	//             windowHeight: window.outerHeight + window.innerHeight,
	//             onrendered: function(canvas) {
	// 	          var a = document.createElement('a');
	// 	          // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
	// 	          a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
	// 	          a.download = 'screenshot.jpg';
	// 	          a.click();
	// 		 	}
	//         });
	// 	}; 
		
	// 	setTimeout(function() {
	// 		toPrint();
	// 	}, 100);
	// },
	
	// onPrint : function(){
	// 	var svg = document.getElementById('EvalResult_Chart').innerHTML;
	
	//   if (svg)
	//     svg = svg.replace(/\r?\n|\r/g, '').trim();
	    
	//     var canvas = document.createElement('canvas');
	// 	canvg(canvas, svg);
		
	// 	var imgData = canvas.toDataURL('image/png');
	// 	  // Generate PDF
	// 	  var doc = new jsPDF('p', 'pt', 'a4');
	// 	  doc.addImage(imgData, 'PNG', 40, 40, 75, 75);
	// 	  doc.save('test.pdf');
	// },
	
	// onPrint : function(){
	// 		 //Get svg markup as string
	// 	  var svg = document.getElementById('EvalResult_Chart').innerHTML;
		
	// 	  if (svg)
	// 	    svg = svg.replace(/\r?\n|\r/g, '').trim();
		
	// 	  var canvas = document.createElement('canvas');
	// 	  var context = canvas.getContext('2d');
		
		
	// 	  context.clearRect(0, 0, canvas.width, canvas.height);
	// 	  svg.width = canvas.width;
	// 	  canvg(canvas, svg);
		
	// 	  var imgData = canvas.toDataURL('image/png');
		
	// 	  // Generate PDF
	// 	  var doc = new jsPDF('p', 'pt', 'a4');
	// 	  doc.addImage(imgData, 'PNG', 40, 40, 200, 400);
	// 	  doc.save('test.pdf');
	// },
	
            
	// onPrint : function(){
	// 	html2canvas($('#__dialog2-cont'),{ 
	// 	// html2canvas($('#UIComp_0'),{
	// 		allowTaint: false,
	// 		letterRendering : 1,
 //           useCORS: true,
 //           logging: false,
 //           height: window.outerHeight + window.innerHeight,
 //           windowHeight: window.outerHeight + window.innerHeight
 //       }).then(function(canvas) {
	//         function getOffset(el) {
 //              el = el.getBoundingClientRect();
 //              return {
 //                 left: el.left + window.scrollX,
 //                 top: el.top + window.scrollY
 //              }
 //           }
 //           var cachedCanvas = canvas;
 //           var ctx = canvas.getContext('2d');
 //           var svgs = document.querySelectorAll('svg');
 //           svgs.forEach(function(svg) {
 //              var svgWidth = svg.width.baseVal.value;
 //              var svgHeight = svg.height.baseVal.value;
 //              var svgLeft = getOffset(svg).left - 40;
 //              var svgTop = getOffset(svg).top - 62;
 //              var offScreenCanvas = document.createElement('canvas');
 //              offScreenCanvas.width = svgWidth;
 //              offScreenCanvas.height = svgHeight;
 //              canvg(offScreenCanvas, svg.outerHTML);
 //              ctx.drawImage(cachedCanvas, 0, 0);
 //              ctx.drawImage(offScreenCanvas, svgLeft, svgTop);
 //           });
            
 //           var imgData = canvas.toDataURL("image/png");
	//         var imgWidth = 210;
	//         var pageHeight =  imgWidth * 1.414;
	//         var imgHeight = canvas.height * imgWidth / canvas.width;
	//         var heightLeft = imgHeight;
	//         var doc = new jsPDF('p', 'mm');
	//         var position = 0;
            
	//         doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
 //           heightLeft -= pageHeight;

 //            // 한 페이지 이상일 경우 루프 돌면서 출력
 //           while (heightLeft >= 20) {
 //                position = heightLeft - imgHeight;
 //                doc.addPage();
 //                doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
 //                heightLeft -= pageHeight;
 //           }
                
	//         doc.save('file-name.pdf')
	// 	});
	// },
	

	// onPrint : function(){
	// 	var canvas = document.createElement("canvas");
	// 	// canvg('canvas', $("#UIComp_0").html());
	// 	// var canvas = document.getElementById("canvas");
	// 	// var img = canvas.toDataURL("image/png");
	// 	html2canvas($('#EvalResultObjectPageLayout'),{ 
	// 	// html2canvas($('#UIComp_0'),{
	// 		allowTaint: false,
	// 		letterRendering : 1,
 //           useCORS: true,
 //           logging: false,
 //           height: window.outerHeight + window.innerHeight,
 //           windowHeight: window.outerHeight + window.innerHeight
 //       }).then(function(canvas) {
	// 		var imgData = canvas.toDataURL("image/png");
	//         var imgWidth = 210;
	//         var pageHeight =  imgWidth * 1.414;
	//         var imgHeight = canvas.height * imgWidth / canvas.width;
	//         var heightLeft = imgHeight;
	//         var doc = new jsPDF('p', 'mm');
	//         var position = 0;
	        
	//         doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
 //           heightLeft -= pageHeight;

 //            // 한 페이지 이상일 경우 루프 돌면서 출력
 //           while (heightLeft >= 20) {
 //                position = heightLeft - imgHeight;
 //                doc.addPage();
 //                doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
 //                heightLeft -= pageHeight;
 //           }
                
	//         doc.save('file-name.pdf')
		
	// 	});
	// },
	
	// onPrint : function(){
	// 	console.log("asdfasdfasdfasdfasdfasdfasdfasdf");	
		
	// 	html2canvas($('#__dialog2-cont')[0]).then(function (canvas) { 
	// 	// html2canvas($('#UIComp_0')[0]).then(function (canvas) { 
	// 		width: canvas.width,
 //        	height : document.getElementById("FormContent").parentNode.offsetHeight,
 //        	scrollY: document.getElementById("FormContent").parentNode.offsetHeight,
 //           onrendered: function (canvas) {
 //           	var imgData = canvas.toDataURL("image/png");
 //           	var IMAGE_WIDTH = 210; // 이미지 가로 길이(mm) A4 기준
 //               var PAGE_HEIGHT = IMAGE_WIDTH * 1.414; // 출력 페이지 세로 길이 계산 A4 기준
 //               var imgHeight = (canvas.height * IMAGE_WIDTH) / canvas.width;
 //               var heightLeft = imgHeight;
 //               var doc = new jsPDF("p", "mm", "a4");
 //               var position = 0;

 //                // 첫 페이지 출력
 //               doc.addImage(imgData, "PNG", 0, position, IMAGE_WIDTH, imgHeight);
 //               heightLeft -= PAGE_HEIGHT;
 //               var filename = 'FILENAME_' + Date.now() + '.pdf'; 
 //               doc.addImage(imgData, 'PNG', 0, 0); 
	// 			doc.save(filename); 
 //           }.bind(this)
	// 	});
	// },
	
	getLocalSessionModel: Common.isLOCAL() ? function() {
		// return new JSONModel({name: "20090028"}); // 00981011
		// return new JSONModel({name: "926020"});
		return new JSONModel({name: "9001023"});
	} : null

});

});