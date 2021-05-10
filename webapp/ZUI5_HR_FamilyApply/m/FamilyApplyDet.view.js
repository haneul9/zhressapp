sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/EmpBasicInfoBox",
	"../../control/ODataFileUploader"
], function (Common, Formatter, PageHelper, EmpBasicInfoBox,ODataFileUploader) {
	var SUB_APP_ID = [$.app.CONTEXT_PATH, "FamilyApplyDet"].join($.app.getDeviceSuffix());
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {
			var oRow,oCell,oMat,c=sap.ui.commons;
			for(var i=15;i<30;i++) { 
				window["oLabel"+(i-14)] = oController.getMobileTxt("LABEL_440"+i,i);
			}
			var oLabel15=oController.getMobileTxt("LABEL_44034",30)
			var oSelect1=new sap.m.ComboBox(oController.PAGEID+"_Sel1",{width:"100%",change:oController.onChange,selectedKey:"{Famsa}",editable:{path:"Opener",formatter:function(fVal){
				return fVal=="X"?true:false;
			}}});
			var oSelect2=new sap.m.ComboBox(oController.PAGEID+"_Sel2",{width:"100%",selectedKey:"{Kdsvh}",editable:{path:"Opener",formatter:function(fVal){
				return fVal=="X"?true:false;
			}}});
			var oSelect3=new sap.m.ComboBox(oController.PAGEID+"_Sel3",{width:"100%",selectedKey:"{Fgbld}",editable:{path:"Opener",formatter:function(fVal){
				return fVal=="X"?true:false;
			}}});
			var oSelect4=new sap.m.ComboBox(oController.PAGEID+"_Sel4",{width:"253px",selectedKey:"{Fanat}",editable:{path:"Opener",formatter:function(fVal){
				return fVal=="X"?true:false;
			}}});
			var oSelect5=new sap.m.ComboBox(oController.PAGEID+"_Sel5",{width:"100%",selectedKey:"{Fasar}",editable:{path:"Opener",formatter:function(fVal){
				return fVal=="X"?true:false;
			}}});
			var oRegNo=new sap.m.Input(oController.PAGEID+"_Regno",{width:"80%",value:"{Regnot}",maxLength:14,liveChange:oController.onAutoInputReg,
			customData:new sap.ui.core.CustomData({
				key:"Regno",
				value:"{Regno}"
			}),
			editable:{path:"Opener",formatter:function(fVal){
				return fVal=="X"?true:false;
			}}});
			var oTxt=new sap.m.Text({ text:{path: "Fgbdt",
									type: new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})}});								
			
			oMat=new c.layout.MatrixLayout(oController.PAGEID+"_Mat",{
				columns:2,
				width:"100%",
				widths:['130px']
			});

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel3
			});
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:[new sap.m.Input(oController.PAGEID+"_Lnmhg",{placeholder:oBundleText.getText("LABEL_44040"),width:"30%",value:"{Lnmhg}",editable:{path:"Opener",formatter:function(fVal){
					return fVal=="X"?true:false;
				}}}),new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.Input(oController.PAGEID+"_Fnmhg",{placeholder:oBundleText.getText("LABEL_44041"),width:"60%",value:"{Fnmhg}",editable:{path:"Opener",formatter:function(fVal){
					return fVal=="X"?true:false;
				}}})]
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel1
			});
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:[oSelect1]
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel2
			});
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:[oSelect2]
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel4
			});
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oRegNo
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel5
			});
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oTxt
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel6
			});
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:[new sap.m.DatePicker({width:"70%",
				valueFormat : "yyyy-MM-dd",
				minDate:new Date(1900,1,1),
				maxDate:new Date(),
				displayFormat : gDtfmt,
				editable:{path:"Opener",formatter:function(fVal){
					return fVal=="X"?true:false;
				}},
				value:{path: "Zzbdate",
				type: new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})}}),
				new sap.m.CheckBox(oController.PAGEID+"_Zzclass",{text:oBundleText.getText("LABEL_44033"),selected:{path:"Zzclass",formatter:function(fVal){
					if(fVal&&fVal=="2"){
						return true;
					}else{
						return false;
					}
				}},editable:{path:"Opener",formatter:function(fVal){
					return fVal=="X"?true:false;
				}}})]
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel7
			});
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oSelect3
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel8
			});
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oSelect4
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel9
			});
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oSelect5
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel10
			});
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:new sap.m.Input({maxLength: 20,width:"100%",value:"{Fasin}",editable:{path:"Opener",formatter:function(fVal){
					return fVal=="X"?true:false;
				}}})
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel11
			})
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:new sap.m.CheckBox(oController.PAGEID+"_Dptid",{selected:{path:"Dptid",formatter:function(fVal){
					if(fVal&&fVal=="X"){
						return true;
					}else{
						return false;
					}
				}},editable:{path:"Opener",formatter:function(fVal){
					return fVal=="X"?true:false;
				}}})
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel12
			})
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:new sap.m.CheckBox(oController.PAGEID+"_Livid",{selected:{path:"Livid",formatter:function(fVal){
					if(fVal&&fVal=="X"){
						return true;
					}else{
						return false;
					}
				}},editable:{path:"Opener",formatter:function(fVal){
					return fVal=="X"?true:false;
				}}})
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel13
			})
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:new sap.m.CheckBox(oController.PAGEID+"_Helid",{selected:{path:"Helid",formatter:function(fVal){
					if(fVal&&fVal=="X"){
						return true;
					}else{
						return false;
					}
				}},editable:{path:"Opener",formatter:function(fVal){
					return fVal=="X"?true:false;
				}}})
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel14
			})
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:new sap.m.Input({maxLength: 100,width:"100%",value:"{Emetl}",editable:{path:"Opener",formatter:function(fVal){
					return fVal=="X"?true:false;
				}}})
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new c.layout.MatrixLayoutRow(oController.PAGEID+"_ModLine");
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:oLabel15
			})
			oRow.addCell(oCell);
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Begin",
				content:new sap.m.Input({width:"100%",maxLength:40,value:"{Reqrs}",editable:{path:"Opener",formatter:function(fVal){
					return fVal=="X"?true:false;
				}}})
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			// oRow=new c.layout.MatrixLayoutRow(oController.PAGEID+"_ModLine2");
			var oFileUploader = sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController);

			// oCell=new c.layout.MatrixLayoutCell({
			// 	hAlign:"Begin",
			// 	colSpan:2,
			// 	content:[oFileUploader]
			// });
			// oRow.addCell(oCell);
			// oMat.addRow(oRow);

			var oHBox=new sap.m.HBox(oController.PAGEID+"_ModLine2",{
				alignItems: sap.m.FlexAlignItems.Center,
				items: [
					oFileUploader
				]
			});

			var oContent = new sap.m.VBox({
				justifyContent: "Center",
				fitContainer: true,
				items: [oMat,oHBox]
			}).addStyleClass("vbox-form-mobile");
					
			/////////////////////////////////////////////////////////

			return new PageHelper({ 
				idPrefix: "FamilyApplyDet-",
                title: "{i18n>LABEL_44001}", // 가족사항
                showNavButton: true,
				navBackFunc: oController.navBack,
				contentItems: [
					oContent
				],
				headerButton: new sap.m.FlexBox({
                    items: [
						new sap.m.Button(oController.PAGEID+"_Re",{text:oBundleText.getText("LABEL_44035"),
							press:oController.onRe,visible:{path:"Status",formatter:function(fVal){
								return fVal=="88"?true:false;
						}}}).addStyleClass("button-light right-custom"),

						new sap.m.Button({text:oBundleText.getText("LABEL_44031"),press:oController.onSave,visible:{path:"Opener",formatter:function(fVal){
							return fVal=="X"?true:false;
						}}}).addStyleClass("button-light right-custom")
                    ]
                }),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left"
			});
		},
		
		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_COMMON_SRV");
			$.app.setModel("ZHR_BENEFIT_SRV");
		}
	});
});
