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

			TableModel: new JSONModelHelper(),
			DetailModel: new JSONModelHelper(),

			getUserId: function() {
				return this.getView().getModel("session").getData().name;
			},
			
			getUserGubun: function() {

				return this.getView().getModel("session").getData().Bukrs;
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

			getVisibleBotton: function() {
				var oController = $.app.getController();

				return 	new sap.m.FlexBox({
					justifyContent: "Center",
					items: [
						new sap.ui.commons.TextView({ //처리결과에 결재완료
							text : "{StatusText}", 
							textAlign : "Center",
							visible : {
								path : "Status", 
								formatter : function(fVal){
									if(fVal === "99") return true;
									else return false;
								}
							}
						})
						.addStyleClass("font-14px font-regular mt-7px"),
						new sap.m.FlexBox({
							justifyContent: "Center",
							items: [
								new sap.ui.commons.TextView({ //처리결과에 Text
									text : "{StatusText}", 
									textAlign : "Center"
								})
								.addStyleClass("font-14px font-regular mt-7px"),
								new sap.m.Button({ //처리결과에 삭제 버튼
									text: "{i18n>LABEL_08003}",
									press : oController.onPressCancel
								})
								.addStyleClass("ml-10px button-light-sm")
							],
							visible : {
								path : "Status", 
								formatter : function(fVal){
									if(fVal !== "99") return true;
									else return false;
								}
							}
						})
					]
				});
			},
			
			onTableSearch: function () {
				//데이터를 가져와서 셋팅하는곳
				var oController = $.app.getController();
				var oTable = $.app.byId(oController.PAGEID + "_Table");
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();

				var sendObject = {};
				
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IConType = "1";
				sendObject.ILangu = "3";
				sendObject.IBukrs = "1000";

				// Navigation property
				sendObject.TableIn = [];

				BusyIndicator.show(0);
				
				oModel.create("/CongratulationApplySet", sendObject, {
					async: true,
					success: function (oData, oResponse) {
						if (oData && oData.TableIn.results) {
							//값을 제대로 받아 왔을 때
							var rDatas = oData.TableIn.results;
							var dataLength = rDatas.length;
							oController.TableModel.setData({ Data: rDatas }); //직접적으로 화면 테이블에 셋팅하는 작업
						}else oController.TableModel.setData({Data: []});
						
						oTable.setVisibleRowCount(dataLength > 10 ? 10 : rDatas.length); //rowcount가 10개 미만이면 그 갯수만큼 row적용
						BusyIndicator.hide();
					},
					error: function (oResponse) {
						Common.log(oResponse);
						BusyIndicator.hide();
					}
				});
			},
			
			onPressNew: function (oEvent) { //신청버튼으로 화면을 접근했을 때
				
				sap.ui.getCore().getEventBus().publish("nav", "to", {
                    id: [$.app.CONTEXT_PATH, "CongratulationDetail"].join($.app.getDeviceSuffix())
                });
			},
			
			onPressCancel: function (oEvent) {
				//삭제 버튼 클릭시 발생하는 이벤트
				var oController = $.app.getController();
				var vDatas = oController.TableModel.getData().Data;
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var oRowIndex = oEvent.getSource().getParent().getParent().getParent().getRowBindingContext().sPath.slice(6);
				var vPernr = oController.getUserId();
				
				var onProcessDelete = function (fVal) {
					//삭제 확인클릭시 발생하는 이벤트
					if (fVal && fVal == "삭제") {
						var vDelDatas = vDatas.splice(oRowIndex, 1); //해당 rowdml 칼럼을 제거해줌
						var sendObject = {
							IConType: "4",
							IPernr: vPernr,
							IBukrs: "1000",
							TableIn: vDelDatas //넘길 값들을 담아놓음
						};
						BusyIndicator.show(0);
						
						oModel.create("/CongratulationApplySet", sendObject, {
							//삭제 통신
							async: true,
							success: function (oData, oResponse) {
								//값을 제대로 받아 왔을 때
								oController.onTableSearch(); //다시 한번 화면 호출
								sap.m.MessageBox.alert(oController.getBundleText("LABEL_08003") + oController.getBundleText("LABEL_08023")); //삭제되었습니다 alert표시
								Common.log(oData);
								BusyIndicator.hide();
							},
							error: function (oResponse) {
								Common.log(oResponse);
								BusyIndicator.hide();
							}
						});
					}
				};

				sap.m.MessageBox.confirm(oController.getBundleText("MSG_02040"), {
					//confirm 삭제
					title: oController.getBundleText("LABEL_08022"),
					actions: ["삭제", "취소"],
					onClose: onProcessDelete
				});
			},
			
			onSelectedRow: function (oEvent) { //CellClick Event
				var oController = $.app.getController();
				var oContext = oEvent.mParameters.rowIndex;
				var oRowData = oController.TableModel.getProperty("/Data/" + oContext);
				
				sap.ui.getCore().getEventBus().publish("nav", "to", {
                    id: [$.app.CONTEXT_PATH, "CongratulationDetail"].join($.app.getDeviceSuffix()),
					data: oRowData
                });
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "20130217"});
			} : null
			 
		});
	}
);
