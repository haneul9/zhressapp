sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/AttachFileAction",
	"../common/JSONModelHelper"
	], 
	function (Common, CommonController, AttachFileAction, JSONModelHelper) {
	"use strict"; // 주석

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "List",
		
		TreeModel: new JSONModelHelper(),
		OpenHelpModel: new JSONModelHelper(),
		ManagerModel: new JSONModelHelper(),
		UploadFileModel: new JSONModelHelper(),
		
		gSelectedRoute : {}, //선택한 tree경로 담는 곳
		TreePath : "",
		
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
			
			this.OpenHelpModel.setData({ TopData: {} });
			this.onTableSearch();
			this.getHighlight(this, true);
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
			sendObject.ISelf = "M";
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

							if (o.L4id) {
								var mapId = [o.L1id, o.L2id, o.L3id].join();
								if (treeMap[mapId]) {
									treeMap[mapId].push($.extend(o, {title: o.L4txt}));
								} else {
									treeMap[mapId] = [$.extend(o, {title: o.L4txt})];
								}

							} else if (o.L3id) {
								// eslint-disable-next-line no-redeclare
								var mapId = [o.L1id, o.L2id, ""].join();
								if (treeMap[mapId]) {
									treeMap[mapId].push($.extend(o, {title: o.L3txt}));
								} else {
									treeMap[mapId] = [$.extend(o, {title: o.L3txt})];
								}

								mapId = [o.L1id, o.L2id, o.L3id].join();
								if (!treeMap[mapId]) {
									o.nodes = treeMap[mapId] = [];
								}

							} else if (o.L2id) {
								// eslint-disable-next-line no-redeclare
								var mapId = [o.L1id, "", ""].join();
								if (treeMap[mapId]) {
									treeMap[mapId].push($.extend(o, {title: o.L2txt}));
								} else {
									treeMap[mapId] = [$.extend(o, {title: o.L2txt})];
								}

								mapId = [o.L1id, o.L2id, ""].join();
								if (!treeMap[mapId]) {
									o.nodes = treeMap[mapId] = [];
								}

							} else {
								// eslint-disable-next-line no-redeclare
								var mapId = [o.L1id, "", ""].join();
								o.title = o.L1txt;
								o.nodes = treeMap[mapId] = [];
								tree.push(o);

							}
						});
						oController.TreeModel.setProperty("/Data", tree);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		getHighlight: function(oController, isNew) {
			var oFullData = oController.TreeModel.getProperty("/FullData");
			var oTree = $.app.byId(oController.PAGEID + "_Tree");

			if(isNew) oTree.expandToLevel(4);
			
			oTree.getItems().forEach(function(elem) {
				if(oFullData.some(function(e){ return e.L4txt === elem.getTitle();})){
					if(oController.TreeModel.getProperty(elem.getBindingContextPath()).L4use === "X"){
						oController.TreeModel.setProperty(elem.getBindingContextPath()+"/Gubun","N");
					}else{
						oController.TreeModel.setProperty(elem.getBindingContextPath()+"/Gubun","Y");
					}
				}else if(oFullData.some(function(e){ return e.L4txt !== elem.getTitle() && e.L3txt === elem.getTitle();})){
					if(oController.TreeModel.getProperty(elem.getBindingContextPath()).L3use === "X"){
						oController.TreeModel.setProperty(elem.getBindingContextPath()+"/Gubun","N");
					}else{
						oController.TreeModel.setProperty(elem.getBindingContextPath()+"/Gubun","Y");
					}
				}else if(oFullData.some(function(e){ return e.L4txt !== elem.getTitle() && e.L3txt !== elem.getTitle() && e.L2txt === elem.getTitle();})){
					if(oController.TreeModel.getProperty(elem.getBindingContextPath()).L2use === "X"){
						oController.TreeModel.setProperty(elem.getBindingContextPath()+"/Gubun","N");
					}else{
						oController.TreeModel.setProperty(elem.getBindingContextPath()+"/Gubun","Y");
					}
				}else if(oFullData.some(function(e){ return e.L4txt !== elem.getTitle() && e.L3txt !== elem.getTitle() && e.L2txt !== elem.getTitle() && e.L1txt === elem.getTitle();})){
					if(oController.TreeModel.getProperty(elem.getBindingContextPath()).L1use === "X"){
						oController.TreeModel.setProperty(elem.getBindingContextPath()+"/Gubun","N");
					}else{
						oController.TreeModel.setProperty(elem.getBindingContextPath()+"/Gubun","Y");
					}
				}else {
					oController.TreeModel.setProperty(elem.getBindingContextPath()+"/Gubun","Y");
				}
			});
			
			oTree.getItems().forEach(function(elem) {
				if(oController.TreeModel.getProperty(elem.getBindingContextPath() + "/Gubun") === "N"){
					elem.removeStyleClass("color-info-black");
					elem.addStyleClass("color-signature-blue");
				}else {
					elem.removeStyleClass("color-signature-blue");
					elem.addStyleClass("color-info-black");
				}

				if(isNew && elem.aCustomStyleClasses.toString() !== "color-signature-blue" && oController.TreeModel.getProperty(elem.getBindingContextPath() + "/Gubun") === "Y" && Common.checkNull(!oController.TreeModel.getProperty(elem.getBindingContextPath()).L2id)){
					if(oController.TreeModel.getProperty(elem.getBindingContextPath()).nodes.length !== 0){
						if(oController.TreeModel.getProperty(elem.getBindingContextPath()).nodes.every(function(e) { return e.Gubun === "Y"; })){
							oTree.collapse(Number(elem.sId.slice(elem.sId.lastIndexOf("-")+1)));
						}
					}
				}

				delete oController.TreeModel.getProperty(elem.getBindingContextPath()).Gubun;
			});
		},
		
		onItemPress: function() {
			var oController = this;
			oController.getHighlight(oController, false);
		},

		onTreeSetData: function(Cancel) {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oTree = $.app.byId(oController.PAGEID + "_Tree");
			var vSeletedData = oTree._oSelectedItem.getTitle();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();

			this.onRefresh(false);
			
			if(Cancel === "Cancel") this.getBtnVisible(oController.TreePath);

			this.getTreeRoute(vSeletedData); // 경로 넣어주면 그경로에맞는 Route를 반환함
			$.app.byId(oController.PAGEID + "_MenuScroll").setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(oController.PAGEID + "_FileUploadBox").setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(oController.PAGEID + "_FileUpload").setBusyIndicatorDelay(0).setBusy(true);
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IGubun = "D";
			sendObject.ISelf = "M";
			sendObject.IBukrs = vBukrs2;
			// Navigation property
			sendObject.OpenhelpExport = [];
			sendObject.OpenhelpTableIn1 = [oController.gSelectedRoute];
			sendObject.OpenhelpTableIn2 = [];
			sendObject.OpenhelpTableIn3 = [];
			sendObject.OpenhelpTableIn4 = [];
			sendObject.OpenhelpTableIn5 = [];
			
			oController.OpenHelpModel.setProperty("/Route", oController.gSelectedRoute);

			Common.getPromise(
				function () {
					oModel.create("/OpenhelpImportSet", sendObject, {
						success: function(oData) {
							if (oData) {
								Common.log(oData);
								var rExportData = oData.OpenhelpExport.results[0];
								var rTopData = oData.OpenhelpTableIn2.results[0];
								var rMiddleData = oData.OpenhelpTableIn2.results[1];
								var rBottomData= oData.OpenhelpTableIn2.results[2];
								
								oController.OpenHelpModel.setProperty("/Export", rExportData);
								oController.OpenHelpModel.setProperty("/TopData", rTopData || {});
								oController.OpenHelpModel.setProperty("/MiddleData", rMiddleData || {});
								oController.OpenHelpModel.setProperty("/BottomData", rBottomData || {});
								oController.OpenHelpModel.setProperty("/FileData", oData.OpenhelpTableIn4.results);
								oController.OpenHelpModel.setProperty("/FileData2", oData.OpenhelpTableIn5.results);
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
						}
					});
				}.bind(this)
			).then(function () {
				$.app.byId(oController.PAGEID + "_MenuScroll").setBusyIndicatorDelay(0).setBusy(false);
			});	

			Common.getPromise(
				function () {
					oController.onBeforeOpenDetailDialog();
				}.bind(this)
			).then(function () {
				$.app.byId(oController.PAGEID + "_FileUploadBox").setBusyIndicatorDelay(0).setBusy(false);
			});

			Common.getPromise(
				function () {
					oController.refreshAttachFileList2(oController);
				}.bind(this)
			).then(function () {
				$.app.byId(oController.PAGEID + "_FileUpload").setBusyIndicatorDelay(0).setBusy(false);
			});
		},
		
		onSelectTree: function(oEvent) { //Tree선택
			var oController = $.app.getController();
			var oSaveBtn = $.app.byId(oController.PAGEID + "_SaveBtn"),
				oCanBtn = $.app.byId(oController.PAGEID + "_CancelBtn");
			var oMenuScroll = $.app.byId(oController.PAGEID + "_MenuScroll");
			
			if(Common.checkNull(!oEvent)){
				var vPath = oEvent.mParameters.listItem.getBindingContextPath();
				oController.TreePath = vPath;
			}

			if(!oMenuScroll.getVisible()) oMenuScroll.setVisible(true);

			var onProcessCancel = function (fVal) {
				if (fVal && fVal == "취소") {
					oController.onCancelBtn(oController);
				}else {
					oController.onSaveBtn();
				}
				oSaveBtn.setVisible(false);
				oCanBtn.setVisible(false);
			};
			
			if(oSaveBtn.getVisible()){
				sap.m.MessageBox.confirm(oController.getBundleText("MSG_25002"), {
					title: oController.getBundleText("LABEL_25001"),
					actions: ["저장", "취소"],
					onClose: onProcessCancel
				});
			}else {
				this.onTreeSetData();
				if(Common.checkNull(!oEvent)) this.getBtnVisible(oController.TreePath);
				
			}
		},
		
		getBtnVisible: function(Path) {
			var oController = $.app.getController();
			var oFullData = oController.TreeModel.getProperty("/FullData");
			var oModifiedBtn = $.app.byId(oController.PAGEID + "_ModifiedBtn");
			var oTree = $.app.byId(oController.PAGEID + "_Tree");
			var vSeletedData = oTree._oSelectedItem.getTitle();
			
			oModifiedBtn.setVisible(false);
			
			if(oFullData.some(function(e){ return e.L4txt === vSeletedData;})){
				if(oController.TreeModel.getProperty(Path).L4use === "X"){
					oModifiedBtn.setVisible(true);
				}
			}else if(oFullData.some(function(e){ return e.L4txt !== vSeletedData && e.L3txt === vSeletedData;})){
				if(oController.TreeModel.getProperty(Path).L3use === "X"){
					oModifiedBtn.setVisible(true);
				}
			}else if(oFullData.some(function(e){ return e.L4txt !== vSeletedData && e.L3txt !== vSeletedData && e.L2txt === vSeletedData;})){
				if(oController.TreeModel.getProperty(Path).L2use === "X"){
					oModifiedBtn.setVisible(true);
				}
			}else if(oFullData.some(function(e){ return e.L4txt !== vSeletedData && e.L3txt !== vSeletedData && e.L2txt !== vSeletedData && e.L1txt === vSeletedData;})){
				if(oController.TreeModel.getProperty(Path).L1use === "X"){
					oModifiedBtn.setVisible(true);
				}
			}
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
		
		onSearchBtn: function() { //관리자조회
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vBukrs2 = oController.getUserGubun();
			var L1id, L2id, L3id, L4id = "", oId = {};
			// Data setting
			oController.ManagerModel.setProperty("/Data", {});
			
			L1id = oController.gSelectedRoute.L1id;
			L2id = oController.gSelectedRoute.L2id;
			L3id = oController.gSelectedRoute.L3id;
			L4id = oController.gSelectedRoute.L4id;

			oId = {
				L1id:  L1id, 
				L2id:  L2id, 
				L3id:  L3id,
				L4id:  L4id
			};
			
			var sendObject = {};
			// Header
			sendObject.IGubun = "A";
			sendObject.IBukrs = vBukrs2;
			// Navigation property
			sendObject.OpenhelpExport = [];
			sendObject.OpenhelpTableIn1 = [];
			sendObject.OpenhelpTableIn2 = [oId];
			sendObject.OpenhelpTableIn3 = [];
			sendObject.OpenhelpTableIn4 = [];
			
			oModel.create("/OpenhelpImportSet", sendObject, {
				success: function(oData) {
					if (oData) {
						Common.log(oData);
						var rData = oData.OpenhelpTableIn3.results;
						var dataLength = rData.length;
						
						oController.ManagerModel.setProperty("/Data", rData);
						oController.onManagerDialog();
						var oTable = $.app.byId(oController.PAGEID + "_Table");
						oTable.setVisibleRowCount(dataLength > 5 ? 5 : dataLength);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},
		
		onManagerDialog: function() {
			var	oView = $.app.getView(),
				oController = $.app.getController();
				
			if (!oController._ManagerModel) {
				oController._ManagerModel = sap.ui.jsfragment("ZUI5_HR_OpenHelpRoomHASS.fragment.ManagerSearch", oController);
				oView.addDependent(oController._ManagerModel);
			}
			
			oController._ManagerModel.open();
		},
		
		onRefresh: function(isValue) { //FormData Editable
			var oController = $.app.getController();
			var oTopText = $.app.byId(oController.PAGEID + "_TopText");
			var oMiddleText = $.app.byId(oController.PAGEID + "_MiddleText");
			var oBottomText = $.app.byId(oController.PAGEID + "_BottomText");
			var oModifiedBtn = $.app.byId(oController.PAGEID + "_ModifiedBtn");
			var oSaveBtn = $.app.byId(oController.PAGEID + "_SaveBtn"),
				oCanBtn = $.app.byId(oController.PAGEID + "_CancelBtn");
			
			if(isValue){
				oTopText.setEditable(true);
				oMiddleText.setEditable(true);
				oBottomText.setEditable(true);
				oModifiedBtn.setVisible(false);
				oSaveBtn.setVisible(true);
				oCanBtn.setVisible(true);
			}else{
				oTopText.setEditable(false);
				oMiddleText.setEditable(false);
				oBottomText.setEditable(false);
				oModifiedBtn.setVisible(true);
				oSaveBtn.setVisible(false);
				oCanBtn.setVisible(false);
			}
		},
		
		onCancelBtn: function() { //저장하지않고 다른Tree선택하거나 화면을 벗어날 때
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var L1id, L2id, L3id, L4id = "", oId = {};
			
			L1id = oController.gSelectedRoute.L1id;
			L2id = oController.gSelectedRoute.L2id;
			L3id = oController.gSelectedRoute.L3id;
			L4id = oController.gSelectedRoute.L4id;

			oId = {
				L1id: L1id, 
				L2id: L2id, 
				L3id: L3id,
				L4id: L4id
			};
			
			var sendObject = {};
			// Header
			sendObject.IGubun = "N";
			sendObject.IBukrs = vBukrs2;
			sendObject.IPernr = vPernr;
			// Navigation property
			sendObject.OpenhelpExport = [];
			sendObject.OpenhelpTableIn1 = [];
			sendObject.OpenhelpTableIn2 = [oId];
			sendObject.OpenhelpTableIn3 = [];
			sendObject.OpenhelpTableIn4 = [];
			sendObject.OpenhelpTableIn5 = [];
			
			oModel.create("/OpenhelpImportSet", sendObject, {
				success: function(oData) {
					Common.log(oData);
					oController.onTreeSetData("Cancel");
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		onModifiedBtn: function() { //수정
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var L1id, L2id, L3id, L4id = "", oId = {};
			
			L1id = oController.gSelectedRoute.L1id;
			L2id = oController.gSelectedRoute.L2id;
			L3id = oController.gSelectedRoute.L3id;
			L4id = oController.gSelectedRoute.L4id;

			oId = {
				L1id: L1id, 
				L2id: L2id, 
				L3id: L3id,
				L4id: L4id
			};
			
			var sendObject = {};
			// Header
			sendObject.IGubun = "C";
			sendObject.IBukrs = vBukrs2;
			sendObject.IPernr = vPernr;
			// Navigation property
			sendObject.OpenhelpExport = [];
			sendObject.OpenhelpTableIn1 = [];
			sendObject.OpenhelpTableIn2 = [oId];
			sendObject.OpenhelpTableIn3 = [];
			sendObject.OpenhelpTableIn4 = [];
			sendObject.OpenhelpTableIn5 = [];
			
			oModel.create("/OpenhelpImportSet", sendObject, {
				success: function() {
					oController.onTreeSetData();
					oController.onRefresh(true);
					oController.onBeforeOpenDetailDialog();
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},
		
		onSaveBtn: function() { //저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oTopData = oController.OpenHelpModel.getProperty("/TopData");
			var oMiddleData = oController.OpenHelpModel.getProperty("/MiddleData");
			var oBottomData = oController.OpenHelpModel.getProperty("/BottomData");
			var sendObject = {};
			
			if(!oTopData.Bukrs){
				oTopData.Bukrs = vBukrs2;
				oTopData.L1id = oController.gSelectedRoute.L1id;
				oTopData.L2id = oController.gSelectedRoute.L2id;
				oTopData.L3id = oController.gSelectedRoute.L3id;
				oTopData.L4id = oController.gSelectedRoute.L4id;
			}
			oTopData.InfoCd = "1";

			if(!oMiddleData.Bukrs){
				oMiddleData.Bukrs = vBukrs2;
				oMiddleData.L1id = oController.gSelectedRoute.L1id;
				oMiddleData.L2id = oController.gSelectedRoute.L2id;
				oMiddleData.L3id = oController.gSelectedRoute.L3id;
				oMiddleData.L4id = oController.gSelectedRoute.L4id;
			}
			oMiddleData.InfoCd = "2";

			if(!oBottomData.Bukrs){
				oBottomData.Bukrs = vBukrs2;
				oBottomData.L1id = oController.gSelectedRoute.L1id;
				oBottomData.L2id = oController.gSelectedRoute.L2id;
				oBottomData.L3id = oController.gSelectedRoute.L3id;
				oBottomData.L4id = oController.gSelectedRoute.L4id;
			}
			oBottomData.InfoCd = "3";
			
			$.app.byId(oController.PAGEID + "_MenuScroll").setBusyIndicatorDelay(0).setBusy(true);
			
			// 첨부파일 저장
			sendObject.OpenhelpTableIn4 = [{Appnm: AttachFileAction.uploadFile.call(oController)}];
			sendObject.OpenhelpTableIn5 = [{Appnm: oController.uploadFile2.call(oController)}];
			
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IGubun = "S";
			sendObject.ISelf = "M";
			sendObject.IBukrs = vBukrs2;
			// Navigation property
			sendObject.OpenhelpExport = [];
			sendObject.OpenhelpTableIn1 = [];
			sendObject.OpenhelpTableIn2 = [oTopData, oMiddleData, oBottomData];
			sendObject.OpenhelpTableIn3 = [];
			
			Common.getPromise(
				function () {
					oModel.create("/OpenhelpImportSet", sendObject, {
						success: function() {
							
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
						}
					});
				}
			).then(
				function () {
					oController.onTreeSetData();
					$.app.byId(oController.PAGEID + "_MenuScroll").setBusyIndicatorDelay(0).setBusy(false);
				}
			);
		},
		
		refreshAttachFileList2: function (oController) {
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
				vAppnm = oController.OpenHelpModel.getProperty("/FileData2/0/Appnm"),
				Datas = { Data: [] };
			var oFileUpload= $.app.byId(this.PAGEID + "_FileUpload");
	
			if(!vAppnm) {
				oController.UploadFileModel.setProperty("/PDFFile/Fname", "");
				oFileUpload.setValue("");
				return;
			}
	
			oModel.read("/FileListSet", {
				async: true,
				filters: [
					new sap.ui.model.Filter("Appnm", sap.ui.model.FilterOperator.EQ, vAppnm)
				],
				success: function (data) {
					if (data && data.results.length) {
						data.results[0].New = false;
						data.results[0].Type = data.results[0].Fname.substring(data.results[0].Fname.lastIndexOf(".") + 1);

						Datas.Data.push(data.results[0]);
						oController.UploadFileModel.setProperty("/PDFFile", Datas.Data[0]);
					}
				},
				error: function (res) {
					common.Common.log(res);
				}
			});
		},

		onFileDelBtn: function() {
			var oFileUpload= $.app.byId(this.PAGEID + "_FileUpload");
			
			oFileUpload.setValue("");
		},
		
		onFileChange2: function() {
			var oFileUpload= $.app.byId(this.PAGEID + "_FileUpload"),
				aFileList = [],
				files = jQuery.sap.domById(this.PAGEID + "_FileUpload" + "-fu").files;
	
			if (Common.checkNull(!files[0].name)) {
				files[0].New = true;
				files[0].Fname = files[0].name;
				files[0].Type = files[0].type;

				aFileList.push(files[0]);
	
				this.UploadFileModel.setProperty("/Data", aFileList);
			}else {
				oFileUpload.setValue(files[0].Fname);
			}
		},
		
		callDeleteFileService2: function(fileInfo) {
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
				sPath = oModel.createKey("/FileListSet", {
					Appnm: fileInfo.Appnm,
					Docid: fileInfo.Docid,
					Cntnm: fileInfo.Cntnm
				});
	
			oModel.remove(sPath, {
				success: function () {
				},
				error: function (res) {
	
					var errData = common.Common.parseError(res);
					if(errData.Error && errData.Error === "E") {
						sap.m.MessageBox.error(errData.ErrorMessage, {
							title: this.getBundleText("LABEL_09029")
						});
					}
				}
			});
		},
		
		uploadFile2: function () {
			var oController = $.app.getController();
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
				vAppnm = this.OpenHelpModel.getProperty("/FileData2/0/Appnm"),
				vPernr = this.getUserId(),
				vData = this.UploadFileModel.getProperty("/Data/0") || this.OpenHelpModel.getProperty("/FileData2/0");
			var oDeleteDatas = this.OpenHelpModel.getProperty("/FileData2");
			var oFileUpload= $.app.byId(this.PAGEID + "_FileUpload");
				
			try {
				if(vData.New !== true && Common.checkNull(vAppnm)) return vAppnm;
				
				if(Common.checkNull(oFileUpload.getValue()) || Common.checkNull(vData.Fname)){
					oController.callDeleteFileService2(oDeleteDatas[0]);
					return;
				}

				var _handleSuccess = function (data) {
					if(!vAppnm) vAppnm = $(data).find("content").next().children().eq(7).text();
					
					if(oDeleteDatas.length >= 1){
						oDeleteDatas.forEach(function(elem) {
							oController.callDeleteFileService2(elem);						
						});
					}
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
			var oFileUpload= $.app.byId(oController.PAGEID + "_FileUpload");
			var oSaveBtn = $.app.byId(oController.PAGEID + "_SaveBtn"),
				oFileBtn = $.app.byId(oController.PAGEID + "_FileDelBtn"),
				vAppnm = oController.OpenHelpModel.getProperty("/FileData/0/Appnm") || "";
				
			if(oSaveBtn.getVisible()) {
				oFileUpload.setEnabled(true);
				oFileBtn.setEnabled(true);
			}else {
				oFileUpload.setEnabled(false);
				oFileBtn.setEnabled(false);
			}

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "10",
				Editable: oSaveBtn.getVisible()
			});						
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35128158"}); //35117893 20200154 35132013 35110903 20190108 35128158
		} : null
	});
});