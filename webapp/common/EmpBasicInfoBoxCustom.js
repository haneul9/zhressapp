jQuery.sap.declare("common.EmpBasicInfoBoxCustom");
jQuery.sap.require("common.EmployeeModel");
common.EmpBasicInfoBoxCustom={
	_Header:null,
	_Img:null,
	renderHeader:function(){
		var oImg=new sap.m.Image({
			src:"images/photoNotAvailable.gif",
			width: "34px",
			height: "34px"
		}).addStyleClass("employee-basic-info-photo");
		this._Img=oImg;
		var oFlexBox= new sap.m.FlexBox({
			alignItems: sap.m.FlexAlignItems.Center,
			items: [
				oImg,
				new sap.m.VBox({
					items: [
						new sap.m.HBox({
							alignItems: sap.m.FlexAlignItems.End,
							items: [
								new sap.m.Text({text: "{Ename}"}).addStyleClass("employee-basic-info-ename"),
								new sap.m.Text({text: "({Pernr})"}).addStyleClass("employee-basic-info-title ml-5px"),
								new sap.m.Text({text: "{Pbtxt} / {Stext} / {PGradeTxt} / {ZtitleT}"}).addStyleClass("employee-basic-info-department")
							]
						})
						// new sap.m.HBox({
						// 	items: [
						// 		new sap.m.Text({text: "{Pbtxt} / {Stext} / {PGradeTxt} / {ZtitleT}"}).addStyleClass("employee-basic-info-department")
						// 	]
						// })En
					]
				})
				.addStyleClass("ml-10px")
			]
		}).addStyleClass("employee-basic-info-box");	

		this._Header=oFlexBox;
		return oFlexBox;
	},
	setHeader:function(Pernr){
		var oModel=$.app.getModel("ZHR_COMMON_SRV");
		var vPernr=common.Common.encryptPernr(Pernr);
		var oFilter="?$filter=Lpmid%20eq%20%27HACTA%27%20and%20Percod%20eq%20%27"+vPernr+"%27"
		var oJSON=new sap.ui.model.json.JSONModel();
		var sData={User:[]};
		oModel.read("/EmpLoginInfoSet"+oFilter,null,null,false,function(data){
			if(data&&data.results.length){
				sData.User.push(data.results[0]);
			}
		},function(res){
			common.Common.log(res);
		});
		oJSON.setData(sData);
		this._Header.setModel(null);
		this._Header.setModel(oJSON);
		this._Header.bindElement("/User/0");	
		var ePernr=this.exceptZeroPernr(Pernr);
		oJSON.getProperty("/User")[0].Photo==""?oJSON.getProperty("/User")[0].Photo="images/photoNotAvailable.gif":null;
		$.ajax({
			url:"/odata/v2/Photo?$filter=userId%20eq%20%27"+ePernr+"%27%20and%20photoType%20eq%20%2701%27&customPageSize="+1000,
			method:"get",
			dataType: "json",
			async:true
		}).done(function(data){
			if(data&&data.d.results.length){				
				oJSON.getProperty("/User")[0].Photo="data:image/jpeg;base64,"+data.d.results[0].photo;	
				common.EmpBasicInfoBoxCustom._Header.bindElement("/User/0");	
				common.EmpBasicInfoBoxCustom._Img.setSrc("data:image/jpeg;base64,"+data.d.results[0].photo);					
			}
		}).fail(function(res) {
			common.Common.log(res);
		});
	},
	exceptZeroPernr:function(Pernr){
		Pernr=parseInt(Pernr);
		return Pernr+"";
	}
};