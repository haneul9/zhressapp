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
			ApplyClubModel: new JSONModelHelper(), //모달창에 쓸 모달
			RejectModel: new JSONModelHelper(), //반력 입력창에 쓸 모달
			MemberTableModel: new JSONModelHelper(),
			MemberTableModel2: new JSONModelHelper(),

			getUserId: function() {

				return this.getView().getModel("session").getData().name;
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

			onBeforeShow: function (oEvent) {
				Common.log("onBeforeShow");
			},

			onAfterShow: function (oEvent) {
				this.onTableSearch();
				this.onClubMemberSearch(); 
			},
			
			onTableSearch: function() { //가입되어있는 동호회Table을 가져와서 셋팅하는곳
				var oController = $.app.getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();
				
				var sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IConType = "1";
				sendObject.ILangu = "3";
				// Navigation property
				sendObject.TableIn = [];
				
				oModel.create("/DonghoListSet", sendObject, {
					success: function(oData, oResponse) {
						if (oData && oData.TableIn.results) { //값을 제대로 받아 왔을 때
							var rDatas = oData.TableIn.results;
							oController.TableModel.setData({Data: rDatas}); //직접적으로 화면 테이블에 셋팅하는 작업
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			},
			
			onClubMemberSearch: function() { // 가입되어있는 동호회의 멤버호출
				var oController = $.app.getController();
				var oMemberTable = $.app.byId(oController.PAGEID+"_MemberTable");
				var oMemberTable2 = $.app.byId(oController.PAGEID+"_MemberTable2");
				var oMemberInfoBox= $.app.byId(oController.PAGEID+"_MemberInfoBox");
				var oMemberInfoBox2= $.app.byId(oController.PAGEID+"_MemberInfoBox2");
				var oMemberCount= $.app.byId(oController.PAGEID + "_MemberCount");
				var oMemberCount2= $.app.byId(oController.PAGEID + "_MemberCount2");
				var oMemberInfoLabel = $.app.byId(oController.PAGEID + "_MemberInfoLabel");
				var vPernr = oController.getUserId();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				
				var vMemberCount = oController.getBundleText("LABEL_10031");
	
				if(oController.TableModel.getProperty("/Data") === undefined){
					oMemberInfoBox.setVisible(false);
					oMemberTable.setVisible(false);
					oMemberInfoBox2.setVisible(false);
					oMemberTable2.setVisible(false);
					oMemberInfoLabel.setVisible(false);
					return;
				} 
				
				var sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IConType = "1";
				sendObject.ILangu = "3";
				// Navigation property
				sendObject.TableIn2 = [];
				
				oModel.create("/DonghoMemberSet", sendObject, {
					success: function(oData, oResponse) {
						if (oData && oData.TableIn2.results) { //값을 제대로 받아 왔을 때
							var rDatas = {};
	
							//rDatas 빈배열을 만들어서 elem.Dongho가 안에 없으면 elem.Dongho로 된 키값으로 배열을하나만들고
							//그안에 .push로 갑을 집어넣어줌
							oData.TableIn2.results.forEach(function(elem) {
								if(!(elem.Dongho in rDatas)) rDatas[elem.Dongho] = [];
	
								rDatas[elem.Dongho].push(elem);
							});
							
							Object.keys(rDatas).forEach(function(elem, idx, array) { //rDatas의 key값만 가져온다
								if(idx === 0) {
									oController.MemberTableModel.setData({Data: rDatas[elem]});
								} else if(idx === 1) {
									oController.MemberTableModel2.setData({Data: rDatas[elem]});
								}
							});
	
							var vPlusMember = 0;	//++ Member				
							var vRMemberCount = ""; //동호회 회원수 탈퇴자는 빼고
							var MTableDatas = oController.MemberTableModel.getProperty("/Data");
							var MTableDatas2 = oController.MemberTableModel2.getProperty("/Data");
							var vDate = new Date();
							var vYear = vDate.getFullYear()+".";
							var vMonth = vDate.getMonth()+1+".";
							var vDate = vDate.getDate();
							var vFullDate = vYear+vMonth+vDate;
							
							if(MTableDatas !== undefined){
								MTableDatas.forEach(function(elem, idx, array){
									if(elem.Endda >= new Date(vFullDate)) vPlusMember += 1
								});
								vRMemberCount = vMemberCount.replace("$", vPlusMember);
								oMemberCount.setProperty("text",vRMemberCount);
								vPlusMember = 0;
							}
							
							
							if(MTableDatas2 !== undefined){
								MTableDatas2.forEach(function(elem, idx, array){
									if(elem.Endda >= new Date(vFullDate)) vPlusMember += 1
								});
								vRMemberCount = vMemberCount.replace("$", vPlusMember);
								oMemberCount2.setProperty("text",vRMemberCount);
								vPlusMember = 0;
							}
							
							if(oController.MemberTableModel2.getProperty("/Data") === undefined){
								oMemberInfoBox2.setVisible(false);
								oMemberTable2.setVisible(false);
							}
							
							oController.onDonghoName(); //동호회 이름 Setting
						}
					},
					error: function(oResponse) {
						oMemberInfoBox.setVisible(false);
						oMemberTable.setVisible(false);
						oMemberInfoBox2.setVisible(false);
						oMemberTable2.setVisible(false);
						oMemberInfoLabel.setVisible(false);
					}
				});
			},
			
			onDonghoName: function() { //동호회 이름띄우는곳
				var oController = $.app.getController();
				var oClubView = $.app.byId(oController.PAGEID + "_ClubView");
				var oClubView2 = $.app.byId(oController.PAGEID + "_ClubView2");
				var oClubInfo = oController.TableModel.oData.Data;
					
				if(!oClubInfo) return;
				
				if(oController.MemberTableModel.getProperty("/Data")){
					oClubInfo.forEach(function(e){
						if(e.Dongho === oController.MemberTableModel.getProperty("/Data")[0].Dongho){
							oClubView.setText(e.Donghotx);
						}
					});	
				}
				
				if(oController.MemberTableModel2.getProperty("/Data")){
					oClubInfo.forEach(function(e){
						if(e.Dongho === oController.MemberTableModel2.getProperty("/Data")[0].Dongho){
							oClubView2.setText(e.Donghotx);
						}
					});	
				}
			},
			
			onPressReqBtn: function(oEvent) { //가입신청 버튼 클릭했을때 가입신청 정보화면으로 이동하는곳
				var oView = $.app.getView();
				var	oController = $.app.getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();
							
				if (!oController._ApplyClubModel) {
					oController._ApplyClubModel = sap.ui.jsfragment("ZUI5_HR_ClubApply.m.fragment.ApplyClub", oController);
					oView.addDependent(oController._ApplyClubModel);
				}
				
				oController._ApplyClubModel.open();
				// var sendObject = {};
				// // Header
				// sendObject.IPernr = vPernr;
				// sendObject.ILangu = "3";
				// // Navigation property
				// sendObject.TableIn = [];
				
				// try{
				// 	oModel.create("/DonghoF4Set", sendObject, {
				// 		async: true,
				// 		success: function(oData, oResponse) {
				// 			if (oData && oData.TableIn.results) { //값을 제대로 받아 왔을 때
				// 				var rDatas = oData.TableIn.results;
				// 				oController.ApplyClubModel.setData({MultiBoxData: rDatas}); //직접적으로 화면 테이블에 셋팅하는 작업
								
				// 				var vBergTx = oController.ApplyClubModel.getData().MultiBoxData[0].Betrgtx;
				// 				oController.ApplyClubModel.setProperty("/MultiBoxData/Betrgtx", vBergTx);
				// 				oController._ApplyClubModel.open();
				// 			}
				// 		},
				// 		error: function(oResponse) {
				// 			sap.m.MessageBox.alert(oController.getBundleText("MSG_10009"));
				// 		}
				// 	});
				// } catch (ex) {
				// 	Common.log(ex);
				// }
			},
			
			onPressSecession: function(oEvent) {  //탈퇴버튼
				var oController = $.app.getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vRowPath = oEvent.getSource().getBindingContext().sPath;
				var vPernr = oController.getUserId();
				
				var sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IConType = "4";
				sendObject.ILangu = "3";
				
				// Navigation property
				sendObject.TableIn = [oController.TableModel.getProperty(vRowPath)];
				
				try{
					var onProcessSecession = function (fVal) { //취소 확인클릭시 발생하는 이벤트
						if(fVal && fVal == "탈퇴"){
							BusyIndicator.show(0);
							
							oModel.create("/DonghoListSet", sendObject, {
								async: true,
								success: function(oData, oResponse) {
									sap.m.MessageBox.alert(oController.getBundleText("MSG_10003"), {
										title: oController.getBundleText("LABEL_09030")
									});
									oController.onTableSearch(); //Table Reflesh
									BusyIndicator.hide();
								},
								error: function(oResponse) {
									Common.log(oResponse);
									BusyIndicator.hide();
								}
							});
						}
						BusyIndicator.hide();
					}
				} catch (ex) {
					Common.log(ex);
					BusyIndicator.hide();
				}
				sap.m.MessageBox.confirm(oController.getBundleText("MSG_10004"), { //confirm 탈퇴
					title: oController.getBundleText("LABEL_09029"),
					actions: ["탈퇴", "취소"],
					onClose: onProcessSecession
				});
			},
			
			onSelectedRow: function(oEvent) {
				var	oController = $.app.getController();
				var vPath = oEvent.getSource().getSelectedContexts()[0].sPath;
				var oRowData = oController.TableModel.getProperty(vPath);
				var oRowStatus = oRowData.Status;
				var vPageId = "";
				
				
				switch (oRowStatus) {
					case "9" : 	vPageId = "ClubApplyOut";
					/* 탈퇴 */	break;
					case "1" : 	vPageId = "ClubApplying";
					/* 가입신청 */	break;
					case "4" : 	vPageId = "ClubApplyReturn";
					/* 가입반려 */	break;
					case "8" : 	vPageId = "ClubApplyInfo";
					/* 가입중 */	break;
				}
				sap.ui.getCore().getEventBus().publish("nav", "to", {
                    id: [$.app.CONTEXT_PATH, vPageId].join($.app.getDeviceSuffix()),
					data: oRowData
                });
			},
			
			onPressSecessionCancel: function(oEvent) { //탈퇴취소
				var oController = $.app.getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vRowPath = oEvent.getSource().getBindingContext().sPath;
				var vPernr = oController.getUserId();
				
				var sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IConType = "5";
				sendObject.ILangu = "3";
				
				// Navigation property
				sendObject.TableIn = [oController.TableModel.getProperty(vRowPath)];
				
				try{
					BusyIndicator.show(0);
					
					oModel.create("/DonghoListSet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							sap.m.MessageBox.alert(oController.getBundleText("MSG_10002"), {
								title: oController.getBundleText("LABEL_09030")
							});
							oController.onTableSearch(); //Table Reflesh
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							BusyIndicator.hide();
						}
					});
				} catch (ex) {
					Common.log(ex);
					BusyIndicator.hide();
				}
			},
			
			onPressCancel: function(oEvent) { //가입버튼
				var oController = $.app.getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vRowPath = oEvent.getSource().getBindingContext().sPath;
				var vPernr = oController.getUserId();
				
				var sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IConType = "3";
				sendObject.ILangu = "3";
				
				// Navigation property
				sendObject.TableIn = [oController.TableModel.getProperty(vRowPath)];
				
				try{
					BusyIndicator.show(0);
					
					oModel.create("/DonghoListSet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							sap.m.MessageBox.alert(oController.getBundleText("MSG_10002"), {
								title: oController.getBundleText("LABEL_09030")
							});
							oController.onTableSearch(); //Table Reflesh
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							BusyIndicator.hide();
						}
					});
				} catch (ex) {
					Common.log(ex);
					BusyIndicator.hide();
				}
			},
			
			onPressApplyBtn: function() { //Dialog에서 신청하는 버튼
				var oController = $.app.getController();
				var oTypeBox = $.app.byId(oController.PAGEID + "_Type");
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();
				
				var sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IConType = "2";
				sendObject.ILangu = "3";
				
				// Navigation property
				sendObject.TableIn = [];
				sendObject.TableIn.push({
					Dongho: oTypeBox.getSelectedKey()
				});
	
				try{
					BusyIndicator.show(0);
					
					oModel.create("/DonghoListSet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							sap.m.MessageBox.alert(oController.getBundleText("MSG_10001"), {
								title: oController.getBundleText("LABEL_09030")
							});
							oController._ApplyClubModel.close();
							oController.onTableSearch(); //Table Reflesh
							oController.onClubMemberSearch();
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							BusyIndicator.hide();
						}
					});
				} catch (ex) {
					Common.log(ex);
					BusyIndicator.hide();
				}
			},
			
			onSelectBox: function(oEvent) { //동호회 선택에 따라 바뀌는 회비
				var oController = $.app.getController();
				var oTypeBox = $.app.byId(oController.PAGEID + "_Type");
				var oIndex = oTypeBox.mProperties.selectedItemId.slice(18);
				
				oController.ApplyClubModel.setProperty("/MultiBoxData/Betrgtx",oController.ApplyClubModel.oData.MultiBoxData[oIndex].Betrgtx);
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "9104340"});//9104340 ㅡ 20120137 ㅡ 20001003 ㅡ 20140299
			} : null
		});
	}
);
