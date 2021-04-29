$.sap.require("common.PickOnlyDatePicker");
jQuery.sap.require("control.ODataFileUploader");
jQuery.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/EmpBasicInfoBox",
	"../../control/ODataFileUploader"
], function (Common, Formatter, PageHelper, EmpBasicInfoBox,ODataFileUploader) {
		var SUB_APP_ID = [$.app.CONTEXT_PATH, "MedApplyDetA100"].join($.app.getDeviceSuffix());
		sap.ui.jsview(SUB_APP_ID, {
			
		getControllerName: function () {
			return SUB_APP_ID;
		}, 
 
		createContent: function (oController) {
			var oRow,oCell,oMat,c=sap.ui.commons;
			for(var i=63;i<87;i++) { 
				window["oLabel"+(i-63)] = oController.getTxtMobiles("LABEL_470"+i,i);
			}
			var oMat=null;

			oMat=new c.layout.MatrixLayout({
				columns:2,
				width:"100%",
				widths:['40%','60%']
			});

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel0});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new common.PickOnlyDatePicker({width:"99%",
			displayFormat: gDtfmt,
			placeholder: gDtfmt,
			value : {
				path : "MedDate", 
				type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
			},
			valueFormat: "yyyy-MM-dd",editable:false})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel1});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Select(oController.PAGEID+"_dSel3",{width:"99%",change:oController.onChange3,selectedKey:"{Gtz51}",editable:{parts:[{path:"Close"},{path:"Status"}],
			formatter:function(fVal,fVal2){
				if(fVal2==""){
					return fVal=="X"?false:true;
				}else{
					return false;
				}
			}}}).addStyleClass("height38px")});
				oRow.addCell(oCell);
				oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel2});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Select(oController.PAGEID+"_dSel4",{width:"99%",selectedKey:"{Gtz51s}",editable:{parts:[{path:"Close"},{path:"Status"}],
			formatter:function(fVal,fVal2){
				if(fVal2==""){
					return fVal=="X"?false:true;
				}else{
					return false;
				}
			}}}).addStyleClass("height38px")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel3});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Select(oController.PAGEID+"_dSel5",{width:"99%",change:oController.onChange5,selectedKey:"{Relation}",editable:{parts:[{path:"Close"},{path:"Status"}],
			formatter:function(fVal,fVal2){
				if(fVal2==""){
					return fVal=="X"?false:true;
				}else{
					return false;
				}
			}}}).addStyleClass("height38px")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel4});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Select(oController.PAGEID+"_dSel6",{width:"99%",selectedKey:"{PatiName}",editable:{parts:[{path:"Close"},{path:"Status"}],
			formatter:function(fVal,fVal2){
				if(fVal2==""){
					return fVal=="X"?false:true;
				}else{
					return false;
				}
			}}}).addStyleClass("height38px")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel5});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new common.PickOnlyDatePicker({width:"99%",
			displayFormat: gDtfmt,
			placeholder: gDtfmt,
			value : {
				path : "Inpdt", 
				type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
			},
			valueFormat: "yyyy-MM-dd",editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
			formatter : function(fVal1, fVal2, fVal3){
				if(fVal1=="X"){
					return false;
				}else{
					if(fVal3==""){
						if(fVal2=="C"||fVal2=="D"){
							return false;
						}else{
							return true;
						}
					}else{
						return false;
					}
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel6});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:3,content:new sap.m.Input({width:"99%",value:"{HospName}",maxLength:50,editable:{parts:[{path:"Close"},{path:"Status"}],
			formatter:function(fVal,fVal2){
				if(fVal2==""){
					return fVal=="X"?false:true;
				}else{
					return false;
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel7});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",value:"{Recno}",maxLength:20,editable:{parts:[{path:"Close"},{path:"Status"}],
			formatter:function(fVal,fVal2){
				if(fVal2==""){
					return fVal=="X"?false:true;
				}else{
					return false;
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[oLabel8]});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:3,content:new sap.m.Input({width:"99%",value:"{DiseName}",maxLength:50,editable:{parts:[{path:"Close"},{path:"Status"}],
			formatter:function(fVal,fVal2){
				if(fVal2==""){
					return fVal=="X"?false:true;
				}else{
					return false;
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[oLabel9]});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"90px",value:"{Pdcnt}",maxLength:3,editable:{parts:[{path:"Close"},{path:"Status"}],
			formatter:function(fVal,fVal2){
				if(fVal2==""){
					return fVal=="X"?false:true;
				}else{
					return false;
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel10});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:3,content:new sap.m.Input({width:"99%",value:"{Remark}",maxLength:100,editable:{parts:[{path:"Close"},{path:"Status"}],
			formatter:function(fVal,fVal2){
				if(fVal2==""){
					return fVal=="X"?false:true;
				}else{
					return false;
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[oLabel11]});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Text({text:{path:"Begda",type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	
//진료비 내역

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.ui.core.HTML({content:"<div style='height:10px;'/>"}),colSpan:2});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.ui.core.HTML({content:"<span style='font-size:14px;font-weight:bold;'>"
			+oController.getBundleText("LABEL_47028")+"</span>"}),colSpan:2});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.ui.core.HTML({content:"<div style='height:10px;'/>"}),colSpan:2});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	//1
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxtMobiles("LABEL_47075")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Ptamt}",
			editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
			formatter : function(fVal1, fVal2, fVal3){
				if(fVal1=="X"){
					return false;
				}else{
					if(fVal3==""){
						if(fVal2=="C"||fVal2=="D"){
							return false;
						}else{
							return true;
						}
					}else{
						return false;
					}
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxtMobiles("LABEL_47076")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Medsp}",
			editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
			formatter : function(fVal1, fVal2, fVal3){
				if(fVal1=="X"){
					return false;
				}else{
					if(fVal3==""){
						if(fVal2=="D"){
							return false;
						}else{
							return true;
						}
					}else{
						return false;
					}
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxtMobiles("LABEL_47077")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Medpp}",
			editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
			formatter : function(fVal1, fVal2, fVal3){
				if(fVal1=="X"){
					return false;
				}else{
					if(fVal3==""){
						if(fVal2=="C"){
							return false;
						}else{
							return true;
						}
					}else{
						return false;
					}
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	//2
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxtMobiles("LABEL_47078")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Oiamt}",
			editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
			formatter : function(fVal1, fVal2, fVal3){
				if(fVal1=="X"){
					return false;
				}else{
					if(fVal3==""){
						if(fVal2=="C"||fVal2=="D"){
							return false;
						}else{
							return true;
						}
					}else{
						return false;
					}
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxtMobiles("LABEL_47079")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Insnp}",
			editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
			formatter : function(fVal1, fVal2, fVal3){
				if(fVal1=="X"){
					return false;
				}else{
					if(fVal3==""){
						if(fVal2=="C"||fVal2=="D"){
							return false;
						}else{
							return true;
						}
					}else{
						return false;
					}
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxtMobiles("LABEL_47080")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znobcm}"
			,editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
			formatter : function(fVal1, fVal2, fVal3){
				if(fVal1=="X"){
					return false;
				}else{
					if(fVal3==""){
						if(fVal2!="C"){
							return false;
						}else{
							return true;
						}
					}else{
						return false;
					}
				}
			}}}),
			new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znobcd}",editable:false})
			]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	//3
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxtMobiles("LABEL_47081")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Medmp}",editable:false})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxtMobiles("LABEL_47082")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Inspp}",editable:false})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxtMobiles("LABEL_47083")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Framt}",editable:false})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.ui.core.HTML({content:"<div style='height:10px;'/>"}),colSpan:2});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.ui.core.HTML({content:"<span style='font-size:14px;font-weight:bold;'>"
			+oController.getBundleText("LABEL_47130")+"</span>"}),colSpan:2});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.ui.core.HTML({content:"<div style='height:10px;'/>"}),colSpan:2});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

	//4
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[oController.getTxtMobiles("LABEL_47084")]});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zdbcrl}",editable:false}),
			new HoverIcon({            
				src: "sap-icon://information",
				hover: function(oEvent) {
					common.Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47009"));
				},
				leave: function(oEvent) {
					common.Common.onPressTableHeaderInformation.call(oController, oEvent);
				}
			})
			.addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue")]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[oController.getTxtMobiles("LABEL_47085")]});
			oRow.addCell(oCell);			
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Ziftrl}",editable:false}),
			new HoverIcon({            
				src: "sap-icon://information",
				hover: function(oEvent) {
					common.Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47010"));
				},
				leave: function(oEvent) {
					common.Common.onPressTableHeaderInformation.call(oController, oEvent);
				}
			})
			.addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue")]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({colSpan:2,content:new sap.ui.core.HTML({content:"<div style='height:10px;' />"})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({colSpan:2,content:fragment.COMMON_ATTACH_FILES.renderer(oController,"008")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	
			var oVert=new sap.ui.commons.layout.VerticalLayout({
				content:[oMat]
			});
	
			var oContent = new sap.m.VBox({
				justifyContent: "Center",
				fitContainer: true,
				items: [oVert]
			}).addStyleClass("vbox-form-mobile");
		
			return new PageHelper({
				idPrefix: "MedApplyDetA100",
                title: "{i18n>LABEL_47001}", // 의료비
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.FlexBox({
                    items: [
						new sap.m.Button({
							press: function(){oController.onSave("A100")},
							text: "{i18n>LABEL_47006}" // 신청
							,visible:{parts:[{path:"Close"},{path:"Status"}],
							formatter:function(fVal,fVal2){
								if(fVal2==""){
									return fVal=="X"?false:true;
								}else{
									return false;
								}
							}}}).addStyleClass("button-light right-custom")
                    ]
                }),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					oContent
				],
			});
		},
		
		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_COMMON_SRV");
			$.app.setModel("ZHR_BENEFIT_SRV");
		}
	});
});
