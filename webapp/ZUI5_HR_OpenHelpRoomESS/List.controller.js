sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/AttachFileAction",
	"../common/JSONModelHelper",
	"sap/m/MessageBox"
	], 
	function (Common, CommonController, AttachFileAction, JSONModelHelper, MessageBox) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "List",
		
		TreeModel: new JSONModelHelper(),
		OpenHelpModel: new JSONModelHelper(),
		UploadFileModel: new JSONModelHelper(),
		
		gSelectedRoute : {}, //선택한 tree경로 담는 곳
		
		getUserId: function() {

			return this.getView().getModel("session").getData().name;
		},
		
		getUserGubun  : function() {

			return this.getView().getModel("session").getData().Bukrs2;
		},
		
		onInit: function () {

			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this);
		},
		
		onBeforeShow: function() {
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			
			this.onTableSearch();
		},
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IGubun = "T";
			sendObject.ISelf = "E";
			sendObject.IBukrs = vBukrs2;
			sendObject.ILangu =  oController.getView().getModel("session").getData().Langu;
			// Navigation property
			sendObject.OpenhelpExport = [];
			sendObject.OpenhelpTableIn1 = [];
			sendObject.OpenhelpTableIn2 = [];
			sendObject.OpenhelpTableIn3 = [];
			sendObject.OpenhelpTableIn4 = [];
			sendObject.OpenhelpTableIn5 = [];
			
			oModel.create("/OpenhelpImportSet", sendObject, {
				success: function(oData) {
					if (oData && oData.OpenhelpTableIn1) { //값을 제대로 받아 왔을 때
						Common.log(oData);
						var rDatas1 = oData.OpenhelpTableIn1.results;
						var tree = [], treeMap = {};
						
						oController.TreeModel.setProperty("/FullData", rDatas1);
						
						$.each(rDatas1, function(i, o) {
							delete o.__metadata;

							var mapId = null;

							if (o.L4id && o.L4use === "X") {
								mapId = [o.L1id, o.L2id, o.L3id].join();
								if (treeMap[mapId]) {
									treeMap[mapId].push($.extend(o, {title: o.L4txt}));
								} else {
									treeMap[mapId] = [$.extend(o, {title: o.L4txt})];
								}

							} else if (o.L3id && o.L3use === "X") {
								mapId = [o.L1id, o.L2id, ""].join();
								if (treeMap[mapId]) {
									treeMap[mapId].push($.extend(o, {title: o.L3txt}));
								} else {
									treeMap[mapId] = [$.extend(o, {title: o.L3txt})];
								}

								mapId = [o.L1id, o.L2id, o.L3id].join();
								if (!treeMap[mapId]) {
									o.nodes = treeMap[mapId] = [];
								}

							} else if (o.L2id && o.L2use === "X") {
								mapId = [o.L1id, "", ""].join();
								if (treeMap[mapId]) {
									treeMap[mapId].push($.extend(o, {title: o.L2txt}));
								} else {
									treeMap[mapId] = [$.extend(o, {title: o.L2txt})];
								}

								mapId = [o.L1id, o.L2id, ""].join();
								if (!treeMap[mapId]) {
									o.nodes = treeMap[mapId] = [];
								}

							} else if (o.L1id && Common.checkNull(o.L2id)) {
								mapId = [o.L1id, "", ""].join();
								o.title = o.L1txt;
								o.nodes = treeMap[mapId] = [];
								tree.push(o);
							}
						});
						oController.TreeModel.setProperty("/Data", tree[0].nodes);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},
		
		onSelectTree: function() { //Tree선택
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oTree = $.app.byId(oController.PAGEID + "_Tree");
			var oMenuScroll = $.app.byId(oController.PAGEID + "_MenuScroll");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var vSeletedData = oTree._oSelectedItem.getTitle();
			
			if(!oMenuScroll.getVisible()) oMenuScroll.setVisible(true);

			this.getTreeRoute(vSeletedData); // 경로 넣어주면 그경로에맞는 Route를 반환함

			oController.OpenHelpModel.setData({TopData: []});
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IGubun = "D";
			sendObject.ISelf = "E";
			sendObject.IBukrs = vBukrs2;
			// Navigation property
			sendObject.OpenhelpExport = [];
			sendObject.OpenhelpTableIn1 = [oController.gSelectedRoute];
			sendObject.OpenhelpTableIn2 = [];
			sendObject.OpenhelpTableIn3 = [];
			sendObject.OpenhelpTableIn4 = [];
			sendObject.OpenhelpTableIn5 = [];
			
			oModel.create("/OpenhelpImportSet", sendObject, {
				success: function(oData) {
					if (oData) {
						Common.log(oData);
						var rExportData = oData.OpenhelpExport.results[0];
						var rTopData = oData.OpenhelpTableIn2.results[0];
						var rMiddleData = oData.OpenhelpTableIn2.results[1];
						var rBottomData= oData.OpenhelpTableIn2.results[2];
						
						// var oNoDataBox = $.app.byId(oController.PAGEID + "_NoDataBox");
						if(Common.checkNull(rTopData) && Common.checkNull(rMiddleData) && Common.checkNull(rBottomData) && Common.checkNull(oData.OpenhelpTableIn4.results[0]) && Common.checkNull(oData.OpenhelpTableIn5.results[0])){
							// oNoDataBox.setVisible(true);
							oController.OpenHelpModel.setProperty("/TopData/Zcomment", "");
							oController.OpenHelpModel.setProperty("/MiddleData", []);
							oController.OpenHelpModel.setProperty("/BottomData", []);
							oController.OpenHelpModel.setProperty("/FileData", []);
							oController.OpenHelpModel.setProperty("/PDFData", []);

						}else{
							jQuery.sap.addUrlWhitelist("https", "clri-ltc.ca");
							jQuery.sap.addUrlWhitelist("https", "esslddev.lottechem.com");
							jQuery.sap.addUrlWhitelist("https", "essprd.lottechem.com");
							jQuery.sap.addUrlWhitelist("blob");
							// jQuery.sap.addUrlWhitelist("http", "ssvess1d", "7097");

							// oNoDataBox.setVisible(false);
							oController.OpenHelpModel.setProperty("/Export", rExportData);
							oController.OpenHelpModel.setProperty("/TopData", rTopData);
							oController.OpenHelpModel.setProperty("/MiddleData", rMiddleData);
							oController.OpenHelpModel.setProperty("/BottomData", rBottomData);
							oController.OpenHelpModel.setProperty("/FileData", oData.OpenhelpTableIn4.results);
							oController.OpenHelpModel.setProperty("/PDFData", []);
							
							// 외부망 - binary파일로 대체
							if(Common.isExternalIP()) {
								oController.displayBinaryPDF(oData.OpenhelpTableIn5.results[0]);
							} else {
								oController.OpenHelpModel.setProperty("/PDFData", oData.OpenhelpTableIn5.results[0]);
							}
						}
						oController.onBeforeOpenDetailDialog();
						
						if(Common.checkNull(!oController.gSelectedRoute.Url)){
							window.open("http://" + oController.gSelectedRoute.Url);
						}
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		openPDF: function(oController) {
			var vUrl = oController.OpenHelpModel.getProperty("/PDFData/Url");
			
			if(!vUrl) return;

			setTimeout(function() {
				var width = 1000, height = screen.availHeight * 0.9,
				left = (screen.availWidth - width) / 2,
				top = (screen.availHeight - height) / 2,
				popup = window.open(vUrl, "hi-pdf-popup", [
					"width=" + width,
					"height=" + height,
					"left=" + left,
					"top=" + top,
					"status=yes,resizable=yes,scrollbars=yes"
				].join(","));

				setTimeout(function() {
					popup.focus();
				}, 500);
			}, 0);
		},

		displayBinaryPDF: function(vPdfInfo) {
			if(!vPdfInfo.Appnm || !vPdfInfo.Url) {
				return;
			}

			var oPdfViewer = $.app.byId(this.PAGEID + "_PDFBox");

			this.OpenHelpModel.setProperty("/PDFData/Url", "https://clri-ltc.ca/files/2018/09/TEMP-PDF-Document.pdf");
			oPdfViewer.setBusyIndicatorDelay(0).setBusy(true);

			Common.getPromise(true, function(resolve, reject) {
				$.app.getModel("ZHR_COMMON_SRV").read("/FileListSet", {
					async: true,
					filters: [ new sap.ui.model.Filter("Appnm", sap.ui.model.FilterOperator.EQ, vPdfInfo.Appnm) ],
					success: function (data) {
						resolve(data);
					},
					error: function (res) {
						Common.log(res);
						reject(res);
					}
				});
			}).then(function(data) {
				if(data.results.length) {
					var vFiledata = data.results[0],
					sampleArr = Common.base64ToArrayBuffer(vFiledata.Mresource);

					this.OpenHelpModel.setProperty("/PDFData/Url", Common.getBlobURL(vFiledata.Mimetype, sampleArr));
				}

				oPdfViewer.setBusy(false);
			}.bind(this));
		},

		getPDFView: function() {
			var oController = $.app.getController();
			var oPDFView = $.app.byId(oController.PAGEID + "_PDFView");

			var vDataURL = oController.OpenHelpModel.getProperty("/PDFData/Url");
			oPDFView.setSource(vDataURL);	
		},
		
		getTreeRoute: function(vSeletedData) {
			var oController = $.app.getController();
			var oFullData = oController.TreeModel.getProperty("/FullData");
			var oTree = $.app.byId(oController.PAGEID + "_Tree");
			var oDetailData = {},
				oCopyData = {};
			oController.gSelectedRoute = "";
			
			oDetailData = JSON.parse(JSON.stringify(oFullData));
			
			if(oDetailData.some(function(ele) {
				oCopyData = "";
				oCopyData = ele;
				return ele.L4txt === vSeletedData && oController.TreeModel.getProperty(oTree._aSelectedPaths.toString()).L4id === ele.L4id;
			})){
				delete oCopyData.nodes;
				delete oCopyData.title;
				
				oController.gSelectedRoute = oCopyData;
			}
			
			if(oDetailData.some(function(ele) {
				oCopyData = "";
				oCopyData = ele;
				return ele.L3txt === vSeletedData && oController.TreeModel.getProperty(oTree._aSelectedPaths.toString()).L3id === ele.L3id;
			})){
				delete oCopyData.nodes;
				delete oCopyData.title;
				
				oController.gSelectedRoute = oCopyData;
			}
			
			if(oDetailData.some(function(ele) {
				oCopyData = "";
				oCopyData = ele;
				return ele.L2txt === vSeletedData && oController.TreeModel.getProperty(oTree._aSelectedPaths.toString()).L2id === ele.L2id;
			})){
				delete oCopyData.nodes;
				delete oCopyData.title;
				
				oController.gSelectedRoute = oCopyData;
			}
			
			if(oDetailData.some(function(ele) {
				oCopyData = "";
				oCopyData = ele;
				return ele.L1txt === vSeletedData && oController.TreeModel.getProperty(oTree._aSelectedPaths.toString()).L1id === ele.L1id;
			})){
				delete oCopyData.nodes;
				delete oCopyData.title;
				
				oController.gSelectedRoute = oCopyData;
			}
		},
		
		refreshAttachFileList2: function (oController) {
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
				vAppnm = oController.OpenHelpModel.getProperty("/FileData2/0/Appnm"),
				Datas = { Data: [] };

			if(!vAppnm) {
				oController.UploadFileModel.setProperty("/Data", []);
				return;
			}
	
			oModel.read("/FileListSet", {
				async: false,
				filters: [
					new sap.ui.model.Filter("Appnm", sap.ui.model.FilterOperator.EQ, vAppnm)
				],
				success: function (data) {
					if (data && data.results.length) {
						data.results[0].New = false;
						data.results[0].Type = data.results[0].Fname.substring(data.results[0].Fname.lastIndexOf(".") + 1);

						Datas.Data.push(data.results[0]);
					}
				},
				error: function (res) {
					common.Common.log(res);
				}
			});
	
			oController.UploadFileModel.setProperty("/PDFFile", Datas.Data[0]);
		},
		
		uploadFile2: function () {
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
				vAppnm = this.UploadFileModel.getProperty("/Data/0/Appnm") || "",
				vPernr = this.getUserId(),
				vData = this.UploadFileModel.getProperty("/Data/0");
				
			try {
				var _handleSuccess = function (data) {
					if(!vAppnm) vAppnm = $(data).find("content").next().children().eq(7).text();
					
					common.Common.log(this.getBundleText("MSG_00034") + ", " + data);
				};
				var _handleError = function (data) {
					vAppnm = null;
					var errorMsg = this.getBundleText("MSG_00031");
	
					common.Common.log("Error: " + data);
					sap.m.MessageToast.show(errorMsg, { my: "center center", at: "center center"});
				};
	
	
				oModel.refreshSecurityToken();
				var oRequest = oModel._createRequest();
				var oHeaders = {
					"x-csrf-token": oRequest.headers["x-csrf-token"],
					"slug": [vAppnm, vPernr, encodeURI(vData.Fname), vPernr].join("|")
				};

				common.Common.log(oHeaders.slug);
				
				jQuery.ajax({
					type: "POST",
					async: false,
					url: $.app.getDestination() + "/sap/opu/odata/sap/ZHR_COMMON_SRV/FileAttachSet/",
					headers: oHeaders,
					cache: false,
					contentType: vData.type,
					processData: false,
					data: vData,
					success: _handleSuccess.bind(this),
					error: _handleError.bind(this)
				});
			} catch (oException) {
				jQuery.sap.log.error("File upload failed:\n" + oException.message);
			}
	
			return vAppnm;
		},
		
		onBeforeOpenDetailDialog: function() {
			var oController = $.app.getController();
			var vAppnm = oController.OpenHelpModel.getProperty("/FileData/0/Appnm") || "";
			var oFileUploadBox = $.app.byId(oController.PAGEID + "_FileUploadBox");
				
			if(Common.checkNull(vAppnm)) oFileUploadBox.setVisible(false);
			else oFileUploadBox.setVisible(true);

			oController.refreshAttachFileList2(oController);
			
			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "10",
				Editable: false
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20090028"});
		} : null
	});
});