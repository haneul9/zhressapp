jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.EmpBasicInfoBox");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/AttachFileAction",
    "../common/SearchOrg",
    "../common/SearchUser1",
    "../common/OrgOfIndividualHandler",
    "../common/DialogHandler"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_LeaveBoost.List", {

		PAGEID: "ZUI5_HR_LeaveBoostList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : [],
		_Signcheck : "",
		
		_Bukrs : "",
		
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
				
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			var oLoginData = $.app.getModel("session").getData();
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Bukrs : oLoginData.Bukrs,
						Pernr : oLoginData.Pernr,
						Ename : oLoginData.Ename,
						Molga : oLoginData.Molga
						// Begda : new Date(today.getFullYear(), today.getMonth(), 1),
						// Endda : new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth())))
						// Tmdat : dateFormat.format(new Date()),
					}
				};
			
				oController._ListCondJSonModel.setData(vData);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveBoost.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_LeaveBoost.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveBoost.List");
			var oController = oView.getController();
		
		},
		
		onChangeDate : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02047")); // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		setUserInfo : function(Pernr){
			if(!Pernr) return;
			
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveBoost.List");
			var oController = oView.getController();
		
			var oPhoto = "";
			new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + Pernr + "' and photoType eq '1'")
				 .select("photo")
				 .setAsync(true)
				 .attachRequestCompleted(function(){
						var data = this.getData().d;
						
						if(data && data.results.length){
							oPhoto = "data:text/plain;base64," + data.results[0].photo;
						} else {
							oPhoto = "images/male.jpg";
						}
				 })
				 .attachRequestFailed(function() {
						oPhoto = "images/male.jpg";
				 })
				 .load();
				 
			var vData = {};
				vData.photo = oPhoto;
				 
			// var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			// var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
			// var oPath = "/EmpSearchResultSet?$filter=Percod eq '" + encodeURIComponent(common.Common.encryptPernr($.app.getModel("session").getData().Pernr)) + "'";
			// 	oPath += " and Actty eq '" + gAuth + "'";
			// 	oPath += " and Actda eq datetime'" + dateFormat.format(new Date()) + "T00:00:00'";
			// 	oPath += " and Ename eq '" + Pernr + "'";
			// 	oPath += " and Persa eq '0AL1' and Stat2 eq '3'";
			// 	oPath += " and Bukrs eq '" + $.app.getModel("session").getData().Bukrs + "'";
				
			// oModel.read(oPath, null, null, false,
			// 			function(data, oResponse) {
			// 				if(data && data.results.length) {
			// 					data.results[0].nickname = data.results[0].Ename;
			// 					data.results[0].Stext = data.results[0].Fulln;
	  //                      	data.results[0].PGradeTxt = data.results[0].ZpGradetx;
	  //                      	data.results[0].ZtitleT = data.results[0].Ztitletx;
	                        	
			// 					Object.assign(vData, data.results[0]);
			// 				}
			// 			},
			// 			function(Res) {
			// 				oController.Error = "E";
			// 				if(Res.response.body){
			// 					ErrorMessage = Res.response.body;
			// 					var ErrorJSON = JSON.parse(ErrorMessage);
			// 					if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
			// 						oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
			// 					} else {
			// 						oController.ErrorMessage = ErrorMessage;
			// 					}
			// 				}
			// 			}
			// );
			
			oController._ListCondJSonModel.setProperty("/User", vData);
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveBoost.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			oController.setUserInfo(oData.Pernr);
			sap.ui.getCore().byId(oController.PAGEID + "_Content3").destroyContent();
			sap.ui.getCore().byId(oController.PAGEID + "_Content4").destroyContent();
			
			var search = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
				var vData2 = [], oPronm = 0;
				
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				var createData = {LeaveBoostListTab1 : [], LeaveBoostListTab2 : []};
					createData.IPernr = oData.Pernr;
					createData.IEmpid = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.IMolga = oData.Molga;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date()) + ")\/";
					createData.ILangu = $.app.getModel("session").getData().Langu;
					createData.IConType = "1";

				oModel.create("/LeaveBoostListHeaderSet", createData, {
					success: function(data, res){
						if(data){
							if(data.LeaveBoostListTab1 && data.LeaveBoostListTab1.results){
								var data1 = data.LeaveBoostListTab1.results[0];
								if(data1){
									data1.Begda = dateFormat.format(new Date(common.Common.getTime(data1.Begda)));
									data1.Endda = dateFormat.format(new Date(common.Common.getTime(data1.Endda)));
									
									data1.Anzhl = parseFloat(data1.Anzhl);
									data1.Kverb = parseFloat(data1.Kverb);
									data1.Remnm = parseFloat(data1.Remnm);
									data1.Pronm = parseFloat(data1.Pronm);
									
									oPronm = data1.Pronm;
									data1.Pronm2 = data1.Pronm;
									
									data1.Binary = data.EBinary;
									
									switch(data1.Status1){
										case "AA":
											data1.Statustx = oBundleText.getText("LABEL_52009"); // 미작성
											break;
										case "00":
											data1.Statustx = oBundleText.getText("LABEL_52010"); // 저장
											break;
										case "99":
											data1.Statustx = oBundleText.getText("LABEL_52011"); // 확정
											break;
									}
									
									oController._ListCondJSonModel.setProperty("/Data", data1);
									
									// header
									oController._ListCondJSonModel.setProperty("/User/Pernr", data1.Pernr);
									oController._ListCondJSonModel.setProperty("/User/nickname", data1.Ename);
									oController._ListCondJSonModel.setProperty("/User/Btrtx", data1.Name1);
									oController._ListCondJSonModel.setProperty("/User/Stext", data1.Orgtx);
									oController._ListCondJSonModel.setProperty("/User/PGradeTxt", data1.ZpGradet);
									oController._ListCondJSonModel.setProperty("/User/ZtitleT", data1.Zhgradet);
								}
							}
							
							if(data.LeaveBoostListTab2 && data.LeaveBoostListTab2.results){
								var data2 = data.LeaveBoostListTab2.results;
								
								data1.Pronm2 = data2.length;
								
								for(var i=0; i<data2.length; i++){
									data2[i].Zdate = dateFormat.format(new Date(common.Common.getTime(data2[i].Zdate)));
									data2[i].Status1 = oController._ListCondJSonModel.getProperty("/Data/Status1");
									
									vData2.push(data2[i]);
								}
							}
						}
					},
					error: function (oError) {
				    	var Err = {};
				    	oController.Error = "E";
								
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
				});
				
				if(vData2.length == 0){
					oController._ListCondJSonModel.setProperty("/Data/Pronm2", oPronm);
					
					for(var i=0; i<oPronm; i++){
						vData2.push({Status1 : oController._ListCondJSonModel.getProperty("/Data/Status1")});
					}
				}
				
				oController._ListCondJSonModel.setProperty("/Data2", vData2);
				
				// 연차사용계획 layout 생성
				oController.makeMatrix(oPronm);
				
				// 서명 layout 생성
				sap.ui.getCore().byId(oController.PAGEID + "_Content4").addContent(sap.ui.jsfragment("ZUI5_HR_LeaveBoost.fragment.Signature", oController));
				
				if(oController._ListCondJSonModel.getProperty("/Data/Appnm") == ""){
					setTimeout(function(){oController.onSetSignature();}, 100);
				}
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
				}          
				
				oController._BusyDialog.close();
			}
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// oPronm : 생성해야 하는 계획 개수
		makeMatrix : function(oPronm){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveBoost.List");
			var oController = oView.getController();
		
			var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Content3");
			
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				columns : 2,
				width : "100%",
				widths : ["20%", "80%"],
				rows : [new sap.ui.commons.layout.MatrixLayoutRow({
							height : "45px",
							cells : [new sap.ui.commons.layout.MatrixLayoutCell({
										 content : [new sap.m.Text({text : oBundleText.getText("LABEL_52012")}).addStyleClass("sub-title")], // 연차사용계획
										 hAlign : "Begin",
										 vAlign : "Middle",
										 colSpan : 2
									 })],
						})]
			});
			
			oMatrix.setModel(oController._ListCondJSonModel);
			
			if(oPronm == 0){
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_00901")})], // No data found
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : 2
								 }).addStyleClass("Data")]
					})
				);
			} else {
				for(var i=0; i<oPronm; i++){
					oMatrix.addRow(
						new sap.ui.commons.layout.MatrixLayoutRow({
							height : "45px",
							cells : [new sap.ui.commons.layout.MatrixLayoutCell({
										 content : [new sap.m.Text({text : oBundleText.getText("LABEL_52013") + " " + (i+1)}).addStyleClass("font-bold")], // 연차사용계획일
										 hAlign : "Center",
										 vAlign : "Middle"
									 }).addStyleClass("Label2"),
									 new sap.ui.commons.layout.MatrixLayoutCell({
									 	 content : [new sap.m.DatePicker({
													    valueFormat : "yyyy-MM-dd",
											            displayFormat : gDtfmt,
											            value : "{Zdate}",
													    width : "150px",
													    textAlign : "Begin",
													    change : oController.onChangeDate,
												 	    editable : {
												 	 		path : "Status1",
					                               	   		formatter : function(fVal){
					                               	   			return (fVal == "" || fVal == "AA" || fVal == "00") ? true : false;
					                               	   		}
												 	    }
												    })],
										 hAlign : "Begin",
										 vAlign : "Middle"
									 }).addStyleClass("Data")]
						}).bindElement("/Data2/" + i)
					);
				}
			}
			
			oLayout.addContent(oMatrix);
		},
		
		// Flag : S 저장, C 확정
		onPressSave : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveBoost.List");
			var oController = oView.getController();
		
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			var oData2 = oController._ListCondJSonModel.getProperty("/Data2");
			
			var createData = {LeaveBoostListTab1 : [], LeaveBoostListTab2 : []};
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});
			var begda = dateFormat.format(new Date(oData.Begda)) * 1; 
			var endda = dateFormat.format(new Date(oData.Endda)) * 1; 
			
			// validation check
			if(oController._Signcheck == "" && oData.Appnm == ""){
				sap.m.MessageBox.error(oBundleText.getText("MSG_52011")); // 먼저 서명하여 주십시오.
				return;
			}
			
			for(var i=0; i<oData2.length; i++){
				if(!oData2[i].Zdate || oData2[i].Zdate == ""){
					sap.m.MessageBox.error(oBundleText.getText("MSG_52009")); // 연차사용계획일을 모두 입력하여 주십시오.
					return;
				} else {
					var zdate = dateFormat.format(new Date(oData2[i].Zdate)) * 1;
					if(zdate < begda || endda < zdate){
						sap.m.MessageBox.error(oBundleText.getText("MSG_52010")); // 연차사용계획일이 지정가능기간을 벗어난 데이터가 존재합니다.
						return;
					}
				}
				
				var detail = {};
					detail.Bukrs = oData.Bukrs;
					detail.Pernr = oData.Pernr;
					detail.Zyear = new Date(oData2[i].Zdate).getFullYear() + "";
					detail.Seqnr = (i+1) + "";
					detail.Zdate = "\/Date(" + common.Common.getTime(new Date(oData2[i].Zdate)) + ")\/";
				
				createData.LeaveBoostListTab2.push(detail);
			}
			
			var confirmMessage = "", successMessage = "";
			if(Flag == "S"){
				confirmMessage = oBundleText.getText("MSG_00058"); // 저장하시겠습니까?
				successMessage = oBundleText.getText("MSG_00017"); // 저장되었습니다.
			} else {
				confirmMessage = oBundleText.getText("MSG_52007"); // 확정하시겠습니까?
				successMessage = oBundleText.getText("MSG_52008"); // 확정되었습니다.
			}
			
			var onProcess = function(){
				createData.IConType = (Flag == "S" ? "2" : "3");
				createData.IBukrs = oData.Bukrs;
				createData.IMolga = oData.Molga;
				createData.ILangu = $.app.getModel("session").getData().Langu;
				createData.IPernr = oData.Pernr;
				createData.IEmpid = oData.Pernr;
				createData.IBegda = "\/Date(" + common.Common.getTime(new Date()) + ")\/";
				createData.IEndda = "\/Date(" + common.Common.getTime(new Date()) + ")\/";
				
				var detail = {};
					detail.Pernr = oData.Pernr;
					detail.Bukrs = oData.Bukrs;
					detail.Status1 = (Flag == "S" ? "2" : "3");
				
				// 서명 파일 저장
				if(oController._Signcheck == "X"){
					detail.Appnm = oController.uploadFile("signature.png", oController.dataURItoBlob());	
				} else {
					detail.Appnm = oData.Appnm;
				}
				
				createData.LeaveBoostListTab1.push(detail);
				
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				oModel.create("/LeaveBoostListHeaderSet", createData, {
					success: function(data, res){
						if(data){
							
						}
					},
					error: function (oError) {
				    	var Err = {};
				    	oController.Error = "E";
								
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
				});
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				sap.m.MessageBox.success(successMessage, {
					onClose : oController.onPressSearch
				});
				
				// 서명여부 초기화
				oController._Signcheck = "";
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			};
			
			sap.m.MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		// 연차촉진 form
		onOpenForm : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveBoost.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oModel = sap.ui.getCore().getModel("ZHR_LEAVE_APPL_SRV");
			var oPath = "/LeaveBoostFormSet?$filter=Percod eq '" + encodeURIComponent($.app.getModel("session").getData().Percod) + "'";
				oPath += " and Bukrs eq '" + oData.Bukrs + "'";
				oPath += " and Zyear eq '" + new Date().getFullYear() + "'";
					
			if(!oController._FormDialog){
				oController._FormDialog = sap.ui.jsfragment("ZUI5_HR_LeaveBoost.fragment.Form", oController);
				oView.addDependent(oController._FormDialog);
			}
			
			var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_FormLayout");
				oLayout.destroyContent();
			
			oModel.read(oPath, null, null, false,
				function(data, oResponse) {
					if(data && data.results.length){
						if(data.results[0].Zpdf != ""){
							oLayout.addContent(
								new sap.ui.core.HTML({	
										content : ["<iframe id='iWorkerPDF'" +
														   "name='iWorkerPDF' src='data:application/pdf;base64," + data.results[0].Zpdf + "'" +
														   "width='1050px' height='680px'" +
														   "frameborder='0' border='0' scrolling='no'></>"],
									preferDOM : false
								})
							);
						}
					}
				},
				function(Res) {
					oController.Error = "E";
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						} else {
							oController.ErrorMessage = ErrorMessage;
						}
					}
				}
			);
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			oController._FormDialog.open();
		},
		
		// 상태: 저장 clear 버튼 클릭 시 signature canvas 재생성
		resetSignature : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveBoost.List");
			var oController = oView.getController();
			
			oController._ListCondJSonModel.setProperty("/Data/Binary", "");
				
			var oContent = sap.ui.getCore().byId(oController.PAGEID + "_Content4");
				oContent.destroyContent();
				oContent.addContent(sap.ui.jsfragment("ZUI5_HR_LeaveBoost.fragment.Signature", oController));
				
			setTimeout(function(){oController.onSetSignature();}, 100);
		},
		
		// 서명 초기화
		onSetSignature : function(Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveBoost.List");
			var oController = oView.getController();
			
			oController._Signcheck = "";
		
			var canvas = document.getElementById("signature-pad"), vSignYn = false;
			
			var context = canvas.getContext("2d");
			
			if(Flag && Flag == "X"){ // clear 버튼 클릭 시 
				context.clearRect(0, 0, canvas.width, canvas.height);
			}
				canvas.width = 510;
				canvas.height = 200;
				context.fillStyle = "#fff";
				context.strokeStyle = "#444";
				context.lineWidth = 1.5;
				context.lineCap = "round";
				context.fillRect(0, 0, canvas.width, canvas.height);
				
			var disableSave = true;
			var pixels = [];
			var cpixels = [];
			var xyLast = {};
			var xyAddLast = {};
			var calculate = false;
			var empty = false;
			var isIE = (navigator.userAgent.toLowerCase().indexOf("trident") != -1) ? true : false;
			
			var remove_event_listeners = function(){
				canvas.removeEventListener('mousemove', on_mousemove, false);
				canvas.removeEventListener('mouseup', on_mouseup, false);
				canvas.removeEventListener('touchmove', on_mousemove, false);
				canvas.removeEventListener('touchend', on_mouseup, false);

				document.body.removeEventListener('mouseup', on_mouseup, false);
				document.body.removeEventListener('touchend', on_mouseup, false);
			};
			
			var get_coords = function(e){
				var x, y;
				
				if (e.changedTouches && e.changedTouches[0]) {
					var offsety = canvas.offsetTop || 0;
					var offsetx = canvas.offsetLeft || 0;

					x = e.changedTouches[0].pageX - offsetx;
					y = e.changedTouches[0].pageY - offsety;
				} else if (e.layerX || 0 == e.layerX) {
					x = e.layerX;
					y = e.layerY;
				} else if (e.offsetX || 0 == e.offsetX) {
					x = e.offsetX;
					y = e.offsetY;
				}
			
				// IE 인 경우 y 좌표 재설정
				if(isIE == true){
					y = y - 90; // 70
				}
				
				return {
					x : x, y : y
				};
			};
			
			var on_mousedown = function(e){
				e.preventDefault();
				e.stopPropagation();

				canvas.addEventListener('mouseup', on_mouseup, false);
				canvas.addEventListener('mousemove', on_mousemove, false);
				canvas.addEventListener('touchend', on_mouseup, false);
				canvas.addEventListener('touchmove', on_mousemove, false);
				document.body.addEventListener('mouseup', on_mouseup, false);
				document.body.addEventListener('touchend', on_mouseup, false);
				
				empty = false;
				var xy = get_coords(e);
				context.beginPath();
				pixels.push('moveStart');
				context.moveTo(xy.x, xy.y);
				pixels.push(xy.x, xy.y);
				xyLast = xy;
				vSignYn = true;
			};
			
			var on_mousemove = function(e, finish){
				oController._Signcheck = "X";
				e.preventDefault();
				e.stopPropagation();

				var xy = get_coords(e);
				var xyAdd = {
					x : (xyLast.x + xy.x) / 2,
					y : (xyLast.y + xy.y) / 2
				};

				if (calculate) {
					var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
					var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
					pixels.push(xLast, yLast);
				} else {
					calculate = true;
				}

				context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
				pixels.push(xyAdd.x, xyAdd.y);
				context.stroke();
				context.beginPath();
				context.moveTo(xyAdd.x, xyAdd.y);
				xyAddLast = xyAdd;
				xyLast = xy;
			};
			
			var on_mouseup = function(e){
				remove_event_listeners();
				disableSave = false;
				context.stroke();
				pixels.push('e');
				calculate = false;
			};
			
			canvas.addEventListener('touchstart', on_mousedown, false);
			canvas.addEventListener('mousedown', on_mousedown, false);		
		},
		
		dataURItoBlob: function () {
            var dataURI = document.getElementById("signature-pad").toDataURL('image/jpeg');
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {
                type: mimeString
            });
        },
        
        uploadFile: function (fileName, pdfFile) {
  			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveBoost.List");
			var oController = oView.getController();
		
        	var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
                vPernr = oController._ListCondJSonModel.getProperty("/Data/Pernr"),
                ret = "";

            try {
                oModel.refreshSecurityToken();

                var FILE_UPLOAD_URL = "/sap/opu/odata/sap/ZHR_COMMON_SRV/FileAttachSet/";
                var oRequest = oModel._createRequest();
                var oHeaders = {
                    "x-csrf-token": oRequest.headers["x-csrf-token"],
                    "slug": ["", vPernr, encodeURI(fileName), vPernr].join("|")
                };

                jQuery.ajax({
                    type: "POST",
                    async: false,
                    url: $.app.getDestination() + FILE_UPLOAD_URL,
                    headers: oHeaders,
                    cache: false,
                    contentType: "pdf",
                    processData: false,
                    data: pdfFile,
                    success: function (data) {
                        ret = $(data).find("content").next().children().eq(7).text();
                    },
                    error: function () {
                        sap.m.MessageToast.show(oBundleText.getBundleText("MSG_00031"), {
                            my: sap.ui.core.Popup.Dock.CenterCenter,
                            at: sap.ui.core.Popup.Dock.CenterCenter
                        });
                    }.bind(this)
                });
            } catch (error) {
                Common.log(error);
            }

            return ret;
        },
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "35110335"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20130126"});
		} : null
		
	});

});