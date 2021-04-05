jQuery.sap.declare("common.SearchEvalHistory");

common.SearchEvalHistory = {
	PAGEID : "EvalHistory",
	oController : null,
	
	userId : null,
	Appye : null,
	
	_JSONModel : new sap.ui.model.json.JSONModel(),
	
	_BusyDialog : new sap.m.BusyDialog(),
	
	onBeforeOpen : function(oEvent){
		var vData = {
			Data : {
				Appye : new Date().getFullYear() + "",
				Pernr : (common.SearchEvalHistory.userId && common.SearchEvalHistory.userId != "") ? 
							common.SearchEvalHistory.userId : common.SearchEvalHistory.oController.getView().getModel("session").getData().Pernr
			}
		};
		
		common.SearchEvalHistory._JSONModel.setData(vData);
		
		// 테이블 초기화
		var oTable = sap.ui.getCore().byId(common.SearchEvalHistory.PAGEID + "_Table");
			oTable.getModel().setData({Data : []});
			oTable.setVisibleRowCount(1);
		
		var oColumn = oTable.getColumns();
		for(var i=0; i<oColumn.length; i++){
			oColumn[i].setSorted(false);
			oColumn[i].setFiltered(false);
		}
		
	},
	
	onAfterOpen : function(oEvent){
		common.SearchEvalHistory.onSearchUser(oEvent);
		common.SearchEvalHistory.onPressSearch(oEvent);
	},
	
	onSearchUser : function(oEvent){
		var userId = common.SearchEvalHistory._JSONModel.getProperty("/Data/Pernr");
		var oData = {};
		
		new JSONModelHelper().url("/odata/v2/User('" + parseFloat(userId) + "')")
							 .select("userId")
							 .select("nickname")
							 .select("title")
							 .select("custom01")
							 .select("department")
							 .select("division")
							 .select("jobCode")
							 .select("custom01")
							 .select("custom02")
							 .select("custom04")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data){
										data.Appye = common.SearchEvalHistory._JSONModel.getProperty("/Data/Appye");
										
										oData = data;
									}
							 })
							 .attachRequestFailed(function() {
									sap.m.MessageBox.error(arguments);
									return;
							 })
							 .load();

			new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + userId + "' and photoType eq '1'")
								 .select("photo")
								 .setAsync(false)
								 .attachRequestCompleted(function(){
										var data = this.getData().d;
										
										if(data && data.results.length){
											oData.photo = "data:text/plain;base64," + data.results[0].photo;
										} else {
											oData.photo = "images/male.jpg";
										}
								 })
								 .attachRequestFailed(function() {
										sap.m.MessageBox.error(arguments);
										return;
								 })
								 .load();
			 
			common.SearchEvalHistory._JSONModel.setProperty("/Data", oData);
	},
	
	onPressSearch : function(oEvent){
		var oData = common.SearchEvalHistory._JSONModel.getProperty("/Data");
	
		var oTable = sap.ui.getCore().byId(common.SearchEvalHistory.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		// filter, sort 제거
		var oColumn = oTable.getColumns();
		for(var i=0; i<oColumn.length; i++){
			oColumn[i].setSorted(false);
			oColumn[i].setFiltered(false);
		}
		
		var search = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV");
			
			var createData = {TableIn : []};
				createData.IEmpid = oData.userId;
				createData.IAppye = oData.Appye;
				createData.IConType = "3";
				
			oModel.create("/EvalResultsSet", createData, null,
				function(data,res){
					if(data && data.TableIn) {
						if(data.TableIn.results && data.TableIn.results.length){
							for(var i=0; i<data.TableIn.results.length; i++){
								data.TableIn.results[i].Idx = (i+1);
								
								vData.Data.push(data.TableIn.results[i]);
							}
						}
					} 
				},
				function (oError) {
			    	var Err = {};
			    	common.SearchEvalHistory.Error = "E";
			    	
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) common.SearchEvalHistory.ErrorMessage = Err.error.innererror.errordetails[0].message;
						else common.SearchEvalHistory.ErrorMessage = Err.error.message.value;
					} else {
						common.SearchEvalHistory.ErrorMessage = oError.toString();
					}
				}
			);
			
			oTable.setVisibleRowCount((vData.Data.length >= 10 ? 10 : vData.Data.length));
			oJSONModel.setData(vData);
			oTable.bindRows("/Data");
			
			common.SearchEvalHistory._BusyDialog.close();
			
			if(common.SearchEvalHistory.Error == "E"){
				common.SearchEvalHistory.Error = "";
				sap.m.MessageBox.error(common.SearchEvalHistory.ErrorMessage);
				return;
			}
		}
		
		common.SearchEvalHistory._BusyDialog.open();
		setTimeout(search, 100);
	},
	
	onCellClick : function(oEvent){
		var sPath = oEvent.getParameters().rowBindingContext.sPath;
			
		var oTable = sap.ui.getCore().byId(common.SearchEvalHistory.PAGEID + "_Table");
		var oData = oTable.getModel().getProperty(sPath);
		
		if(oData.Appye && (parseFloat(oData.Appye) >= 2020)){
			if(!common.SearchEvalHistory.oController._DetailDialog){
				common.SearchEvalHistory.oController._DetailDialog = sap.ui.jsfragment("fragment.EvalResultAgree", common.SearchEvalHistory.oController);
				common.SearchEvalHistory.oController.getView().addDependent(common.SearchEvalHistory.oController._DetailDialog);
			}
			
			common.SearchEvalResultAgree.Appye = oData.Appye;
			common.SearchEvalResultAgree.userId = oData.Pernr;
			common.SearchEvalResultAgree.Flag = "X";
			
			common.SearchEvalHistory.oController._DetailDialog.setTitle(oBundleText.getText("LABEL_07001")); // 평가이력
			
			common.SearchEvalHistory.oController._DetailDialog.open();
		}
	}
	
};
