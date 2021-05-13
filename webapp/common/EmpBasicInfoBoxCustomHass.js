jQuery.sap.declare("common.EmpBasicInfoBoxCustomHass");
jQuery.sap.require("common.EmployeeModel");
common.EmpBasicInfoBoxCustomHass={
	_Header:null,
	_Img:null,
	renderHeader:function(){
		var oImg=new sap.m.Image({
			src:"images/photoNotAvailable.gif",
			width: "55px",
			height: "55px"
		}).addStyleClass("tm-employee-basic-info-photo");
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
								new sap.m.Text({text: "{Ename}"}).addStyleClass("tm-employee-basic-info-nickname"),
								new sap.m.Text({text: "({Pernr})"}).addStyleClass("tm-employee-basic-info-title ml-5px")
							]
						}),
						new sap.m.HBox({
							items: [
								new sap.m.Text({text: "{Pbtxt} / {Stext} / {PGradeTxt} / {ZtitleT}"}).addStyleClass("tm-employee-basic-info-department")
							]
						})
					]
				})
				.addStyleClass("ml-10px")
			]
		}).addStyleClass("tm-employee-basic-info-box");	

		this._Header=oFlexBox;
		return oFlexBox;
	},
	setHeader:function(Pernr){
		var oModel=$.app.getModel("ZHR_COMMON_SRV");
		var vPernr=common.Common.encryptPernr(Pernr);
		var oFilter="?$filter=Lpmid%20eq%20%27HACTA%27%20and%20Percod%20eq%20%27"+vPernr+"%27";
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
		oJSON.getProperty("/User")[0].Pbtxt==""?this._Header.getModel().setProperty("/User/0/Pbtxt",$.app.geti18nResource().getText("LABEL_47145")):null;
		oJSON.getProperty("/User")[0].Stext==""?this._Header.getModel().setProperty("/User/0/Stext",$.app.geti18nResource().getText("LABEL_47146")):null;
		oJSON.getProperty("/User")[0].PGradeTxt==""?this._Header.getModel().setProperty("/User/0/PGradeTxt",$.app.geti18nResource().getText("LABEL_47147")):null;
		oJSON.getProperty("/User")[0].ZtitleT==""?this._Header.getModel().setProperty("/User/0/ZtitleT",$.app.geti18nResource().getText("LABEL_47148")):null;
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
				common.EmpBasicInfoBoxCustomHass._Header.bindElement("/User/0");	
				common.EmpBasicInfoBoxCustomHass._Img.setSrc("data:image/jpeg;base64,"+data.d.results[0].photo);					
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