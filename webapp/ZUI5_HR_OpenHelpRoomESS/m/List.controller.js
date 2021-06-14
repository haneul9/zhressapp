sap.ui.define(
	[
		"../../common/Common",
		"../../common/CommonController",
		"../../common/JSONModelHelper",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/unified/library"
	],
	function (Common, CommonController, JSONModelHelper, BusyIndicator, MessageBox, unifiedLibrary) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "List",

			TreeModel: new JSONModelHelper(),

            gSelectedRoute : {}, //선택한 tree경로 담는 곳

			getUserId: function() {
				return this.getView().getModel("session").getData().name;
			},
			
			getUserGubun: function() {

				return this.getView().getModel("session").getData().Bukrs2;
			},

			onInit: function () {
				this.setupView();

				this.getView()
					.addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);

				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function () {
				Common.log("onBeforeShow");
			},

			onAfterShow: function () {
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
                    success: function(oData, oResponse) {
                        if (oData && oData.OpenhelpTableIn1) { //값을 제대로 받아 왔을 때
                            Common.log(oData);
                            var rDatas1 = oData.OpenhelpTableIn1.results;
                            var tree = [], treeMap = {};
                            
                            oController.TreeModel.setProperty("/FullData", rDatas1);
                            
                            $.each(rDatas1, function(i, o) {
                                delete o.__metadata;
    
                                if (o.L4id && o.L4use === "X") {
                                    var mapId = [o.L1id, o.L2id, o.L3id].join();
                                    if (treeMap[mapId]) {
                                        treeMap[mapId].push($.extend(o, {title: o.L4txt}));
                                    } else {
                                        treeMap[mapId] = [$.extend(o, {title: o.L4txt})];
                                    }
    
                                } else if (o.L3id && o.L3use === "X") {
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
    
                                } else if (o.L2id && o.L2use === "X") {
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
    
                                } else if (o.L1id && Common.checkNull(o.L2id)) {
                                    var mapId = [o.L1id, "", ""].join();
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
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },
            
			onSelectTree: function (oEvent) { //CellClick Event
                var	oController = this.getView().getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oTree = $.app.byId(oController.PAGEID + "_Tree");
                var vSeletedData = oTree._oSelectedItem.getTitle();
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var oSendData = {};
                
                
                this.getTreeRoute(vSeletedData); // 경로 넣어주면 그경로에맞는 Route를 반환함
                
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
                    success: function(oData, oResponse) {
                        if (oData.OpenhelpTableIn2.results.length !== 0) {
                            Common.log(oData);
                            var rTopData = oData.OpenhelpTableIn2.results[0];
                            var rMiddleData = oData.OpenhelpTableIn2.results[1];
                            var rBottomData= oData.OpenhelpTableIn2.results[2];
                            
                            oSendData.title = vSeletedData;
                            oSendData.TopData = rTopData;
                            oSendData.MiddleData = rMiddleData;
                            oSendData.BottomData = rBottomData;
                            oSendData.FileData = oData.OpenhelpTableIn4.results;
                            oSendData.Url = "http://" + oController.gSelectedRoute.Url;

                            sap.ui.getCore().getEventBus().publish("nav", "to", {
                                id: [$.app.CONTEXT_PATH, "OpenHelpRoomDetail"].join($.app.getDeviceSuffix()),
                                data: oSendData,
                            });
                        };
                        
                        // if(Common.checkNull(!oController.gSelectedRoute.Url)){
                        //     window.open("http://" + oController.gSelectedRoute.Url);
                        // }
                    },
                    error: function(oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
                
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
                    return ele.L4txt === vSeletedData && oController.TreeModel.getProperty(oTree._aSelectedPaths.toString()).L4id === ele.L4id
                })){
                    delete oCopyData.nodes;
                    delete oCopyData.title;
                    
                    oController.gSelectedRoute = oCopyData;
                }
                
                if(oDetailData.some(function(ele) {
                    oCopyData = "";
                    oCopyData = ele;
                    return ele.L3txt === vSeletedData && oController.TreeModel.getProperty(oTree._aSelectedPaths.toString()).L3id === ele.L3id
                })){
                    delete oCopyData.nodes;
                    delete oCopyData.title;
                    
                    oController.gSelectedRoute = oCopyData;
                }
                
                if(oDetailData.some(function(ele) {
                    oCopyData = "";
                    oCopyData = ele;
                    return ele.L2txt === vSeletedData && oController.TreeModel.getProperty(oTree._aSelectedPaths.toString()).L2id === ele.L2id
                })){
                    delete oCopyData.nodes;
                    delete oCopyData.title;
                    
                    oController.gSelectedRoute = oCopyData;
                }
                
                if(oDetailData.some(function(ele) {
                    oCopyData = "";
                    oCopyData = ele;
                    return ele.L1txt === vSeletedData && oController.TreeModel.getProperty(oTree._aSelectedPaths.toString()).L1id === ele.L1id
                })){
                    delete oCopyData.nodes;
                    delete oCopyData.title;
                    
                    oController.gSelectedRoute = oCopyData;
                }
            },
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "20200154"});
			} : null
			 
		});
	}
);
