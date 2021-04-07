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
		var SUB_APP_ID = [$.app.CONTEXT_PATH, "MedApplyDet"].join($.app.getDeviceSuffix());
		sap.ui.jsview(SUB_APP_ID, {
			
			getControllerName: function () {
				return SUB_APP_ID;
			},

			createContent: function (oController) {
			var oRow,oCell,oMat,c=sap.ui.commons;
			for(var i=17;i<56;i++) { 
				window["oLabel"+(i-17)] = oController.getTxt("LABEL_470"+i,i);
			}
			var oLabel39=oController.getTxt("LABEL_47087",56);
			var oSelector1=new sap.m.Select(oController.PAGEID+"_dSel1",{width:"80%",selectedKey:"{Relation}",change:oController.changeSel,editable:{parts:[{path:"Close"},{path:"Status"}],
							formatter:function(fVal,fVal2){
								if(fVal2==""){
									return fVal=="X"?false:true;
								}else{
									return false;
								}
							}}})
			,oSelector2=new sap.m.Select(oController.PAGEID+"_dSel2",{width:"80%",selectedKey:"{HospType}",editable:{parts:[{path:"Close"},{path:"Status"}],
							formatter:function(fVal,fVal2){
								if(fVal2==""){
									return fVal=="X"?false:true;
								}else{
									return false;
								}
							}}});

			oMat=new c.layout.MatrixLayout(oController.PAGEID+"_Mat",{
				columns:2,
				width:"100%",
				widths:['40%','60%']
			}).setModel(oController._DataModel);
			
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({colSpan:2,
				hAlign:"Right",content:new sap.m.Button({
				press: function(){oController.onSave("1000")},
				text: "{i18n>LABEL_47006}" // 신청
				,visible:{parts:[{path:"Close"},{path:"Status"}],
				formatter:function(fVal,fVal2){
					if(fVal2==""){
						return fVal=="X"?false:true;
					}else{
						return false;
					}
				}}}).addStyleClass("button-light")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);			

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel0});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new common.PickOnlyDatePicker({width:"80%",
			displayFormat: gDtfmt,
			placeholder: gDtfmt,
			value : {
				path : "MedDate", 
				type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
			},
			valueFormat: "yyyy-MM-dd",editable:{parts:[{path:"Close"},{path:"Status"}],
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
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel1});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oSelector1});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel2});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"80%",editable:false,maxLength:13,value:"{RelationTx}",
			customData:new sap.ui.core.CustomData({key:"Rel",value:"{Relation}"}),editable:false})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel3});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oSelector2});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel4});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({showValueHelp: true,
				width:"80%",
	            valueHelpOnly: true,
				value:"{HospName}",
	            valueHelpRequest: oController.onSearchMed,editable:{parts:[{path:"Close"},{path:"Status"}],
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
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel5});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"80%",editable:false,maxLength:13,value:"{Comid}",editable:false})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel6});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"80%",editable:{parts:[{path:"Close"},{path:"Status"}],
			formatter:function(fVal,fVal2){
				if(fVal2==""){
					return fVal=="X"?false:true;
				}else{
					return false;
				}
			}},maxLength:13,value:"{DiseName}"})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel7});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.ui.commons.TextView({
				text : {
					path : "Begda", 
					type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
				},
				textAlign : "Begin"
			}).addStyleClass("FontFamily")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[oLabel8]});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.CheckBox(oController.PAGEID+"_Chk1",
			{selected:"{Chk1}",select:oController.onChk1,editable:{parts:[{path:"Close"},{path:"Status"}],
					formatter:function(fVal,fVal2){
						if(fVal2==""){
							return fVal=="X"?false:true;
						}else{
							return false;
						}
					}}}),new HoverIcon({            
							src: "sap-icon://information",
							hover: function(oEvent) {
								common.Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47002"));
							},
							leave: function(oEvent) {
								common.Common.onPressTableHeaderInformation.call(oController, oEvent);
							}
			})
			.addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue")]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[oLabel9]});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.CheckBox(oController.PAGEID+"_Chk2",
			{selected:"{Chk2}",select:oController.onChk2,editable:{parts:[{path:"Close"},{path:"Status"}],
						formatter:function(fVal,fVal2){
							if(fVal2==""){
								return fVal=="X"?false:true;
							}else{
								return false;
							}
						}}}),new HoverIcon({            
				src: "sap-icon://information",
				hover: function(oEvent) {
					common.Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47003"));
				},
				leave: function(oEvent) {
					common.Common.onPressTableHeaderInformation.call(oController, oEvent);
				}
			}).addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue")]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel10});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"90%",value:"{Remark}",maxLength:100,editable:{parts:[{path:"Close"},{path:"Status"}],
					formatter:function(fVal,fVal2){
						if(fVal2==""){
							return fVal=="X"?false:true;
						}else{
							return false;
						}
					}}})});
						oRow.addCell(oCell);
						oMat.addRow(oRow);
	//급여 내역
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxt("LABEL_47102"),colSpan:2});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel20});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input(oController.PAGEID+"_Inp1",{width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zkibbm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}}),new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zkiobd}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel39});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input(oController.PAGEID+"_Inp2",{width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zkijbm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}}),new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zkijbd}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	//비급여 내역
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxt("LABEL_47103"),colSpan:2});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel21});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input(oController.PAGEID+"_Inp3",{width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znijcm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}}),new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znijcd}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel22});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input(oController.PAGEID+"_Inp4",{width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zniiwm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}}),new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zniiwd}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel23});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input(oController.PAGEID+"_Inp5",{width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znisdm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}}),new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znisdd}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel24});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input(oController.PAGEID+"_Inp6",{width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znoctm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}}),new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znoctd}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel25});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input(oController.PAGEID+"_Inp7",{width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znomrm}",editable:{parts:[{path:"Close"},{path:"Status"}],
					formatter:function(fVal,fVal2){
						if(fVal2==""){
							return fVal=="X"?false:true;
						}else{
							return false;
						}
					}}}),new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znomrd}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel26});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input(oController.PAGEID+"_Inp8",{width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znocum}",editable:{parts:[{path:"Close"},{path:"Status"}],
					formatter:function(fVal,fVal2){
						if(fVal2==""){
							return fVal=="X"?false:true;
						}else{
							return false;
						}
					}}}),new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znocud}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel27});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input(oController.PAGEID+"_Inp9",{width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znobcm}",editable:{parts:[{path:"Close"},{path:"Status"}],
					formatter:function(fVal,fVal2){
						if(fVal2==""){
							return fVal=="X"?false:true;
						}else{
							return false;
						}
					}}}),new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znobcd}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);


			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel31});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Mycharge}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel32});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{BaseAmt}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel33});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:[new sap.m.Input({width:"45%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{SuppAmt}",editable:false})]});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:2,content:new sap.m.Button({text:oBundleText.getText("LABEL_47051"),
			press:function(){oController.onCal("1000")},visible:{parts:[{path:"Close"},{path:"Status"}],
					formatter:function(fVal,fVal2){
						if(fVal2==""){
							return fVal=="X"?false:true;
						}else{
							return false;
						}
					}}}).addStyleClass("button-light")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel35});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"Right",
			editable:false,maxLength:13,value:{path:"Zmedrl",formatter:function(fVal){
				if(fVal!=""&&fVal!=null){
					return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel36});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"Right",
			editable:false,maxLength:13,value:{path:"Zfvcrl",formatter:function(fVal){
				if(fVal!=""&&fVal!=null){
					return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel37});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"Right",
			editable:false,maxLength:13,value:{path:"Ziftrl",formatter:function(fVal){
				if(fVal!=""&&fVal!=null){
					return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
	
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel38});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"45%",textAlign:"Right",
			editable:false,maxLength:13,value:{path:"Zdbcrl",formatter:function(fVal){
				if(fVal!=""&&fVal!=null){
					return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
				}
			}}})});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxt("LABEL_47104"),colSpan:2});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxt("LABEL_47037")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"003")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxt("LABEL_47041")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"004")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxt("LABEL_47042")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"005")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxt("LABEL_47043")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"006")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxt("LABEL_47044")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"007")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxt("LABEL_47107")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"001")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oController.getTxt("LABEL_47105")});
			oRow.addCell(oCell);
			oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"002")});
			oRow.addCell(oCell);
			oMat.addRow(oRow);

			// oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel30}).addStyleClass("LabelCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:2,content:fragment.COMMON_ATTACH_FILES.renderer(oController,"003")}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"004")}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"005")}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"006")}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"007")}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oMat2.addRow(oRow);

			// oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel31}).addStyleClass("LabelCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"90%",textAlign:"Begin",
			// editable:false,maxLength:13,value:{path:"Mycharge",formatter:function(fVal){
			//     if(fVal!=""&&fVal!=null){
			//         return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
			//     }else{
			//         return fVal;
			//     }
			// },editable:{path:"Close",
			// formatter:function(fVal){
			//     return fVal=="X"?false:true;
			// }}}})}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel32}).addStyleClass("LabelCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"90%",textAlign:"Begin",
			// editable:false,maxLength:13,value:{path:"BaseAmt",formatter:function(fVal){
			//     if(fVal!=""&&fVal!=null){
			//         return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
			//     }
			// },editable:{path:"Close",
			// formatter:function(fVal){
			//     return fVal=="X"?false:true;
			// }}}})}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel33}).addStyleClass("LabelCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"90%",textAlign:"Begin",
			// editable:false,maxLength:13,value:{path:"SuppAmt",formatter:function(fVal){
			//     if(fVal!=""&&fVal!=null){
			//         return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
			//     }
			// },editable:{path:"Close",
			// formatter:function(fVal){
			//     return fVal=="X"?false:true;
			// }}}})}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({colSpan:4}).addStyleClass("LabelCell");
			// oRow.addCell(oCell);
			// oMat2.addRow(oRow);
	
			// var oMat3=new sap.ui.commons.layout.MatrixLayout({
			//     columns:9,
			//     widths:['140px']
			// });
			// oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Button({text:oBundleText.getText("LABEL_47051"),
			//     press:function(){oController.onCal("1000")},visible:{path:"Close",
			//     formatter:function(fVal){
			//         return fVal=="X"?false:true;
			//     }}}).addStyleClass("button-light")});
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel35}).addStyleClass("LabelCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"90%",textAlign:"Begin",
			// editable:false,maxLength:13,value:{path:"NsuppAmt",formatter:function(fVal){
			//     if(fVal!=""&&fVal!=null){
			//         return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
			//     }
			// }}})}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel36}).addStyleClass("LabelCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"90%",textAlign:"Begin",
			// editable:false,maxLength:13,value:{path:"Zfvcrl",formatter:function(fVal){
			//     if(fVal!=""&&fVal!=null){
			//         return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
			//     }
			// }}})}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel37}).addStyleClass("LabelCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"90%",textAlign:"Begin",
			// editable:false,maxLength:13,value:{path:"Ziftrl",formatter:function(fVal){
			//     if(fVal!=""&&fVal!=null){
			//         return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
			//     }
			// }}})}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oLabel38}).addStyleClass("LabelCell");
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"90%",textAlign:"Begin",
			// editable:false,maxLength:13,value:{path:"Zdbcrl",formatter:function(fVal){
			//     if(fVal!=""&&fVal!=null){
			//         return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
			//     }
			// }}})}).addStyleClass("DataCell");
			// oRow.addCell(oCell);
			// oMat3.addRow(oRow);


					// var miniMat=new sap.ui.commons.layout.MatrixLayout({
			//     columns:2,
			//     widths:['20%']
			// }); 
			// oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			//     content:new sap.m.CheckBox(oController.PAGEID+"_Chk1",{selected:"{Chk1}",select:oController.onChk1,editable:{path:"Close",
			//     formatter:function(fVal){
			//         return fVal=="X"?false:true;
			//     }}})
			// });
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			//     content:fragment.COMMON_ATTACH_FILES.renderer(oController,"001")
			// });
			// oRow.addCell(oCell);
			// miniMat.addRow(oRow);

			// var miniMat2=new sap.ui.commons.layout.MatrixLayout({
			//     columns:2,
			//     widths:['20%']
			// }); 
			// oRow=new sap.ui.commons.layout.MatrixLayoutRow();
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			//     content:new sap.m.CheckBox(oController.PAGEID+"_Chk2",{selected:"{Chk2}",select:oController.onChk2,editable:{path:"Close",
			//     formatter:function(fVal){
			//         return fVal=="X"?false:true;
			//     }}})
			// });
			// oRow.addCell(oCell);
			// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			//     content:fragment.COMMON_ATTACH_FILES.renderer(oController,"002")
			// });
			// oRow.addCell(oCell);
			// miniMat2.addRow(oRow);

			// var oPanel2 = new sap.m.Panel({
			// 	headerToolbar : [new sap.m.Toolbar({content:[new sap.ui.core.HTML({content:"<span style='font-size:16px;font-weight:bold;'>"+oBundleText.getText("LABEL_47028")+"</span>"}),
			//                     new sap.m.ToolbarSpacer({width:"20px"}),new sap.ui.core.HTML({content:"<span style='font-size:13px;color:red;'>"+oBundleText.getText("LABEL_47029")+"</span>"})]})],
			// 	expanded:true,
			// 	expandable:false,
			// 	content:[oMat2,new sap.ui.core.HTML({content:"<div style='height:5px;'/>"}),oMat3]
			// });

			var oVert=new sap.ui.commons.layout.VerticalLayout({
				content:[oMat]
			});

			var oContent = new sap.m.FlexBox({
				justifyContent: "Center",
				fitContainer: true,
				items: [oVert]
			}).addStyleClass("paddingbody");
				/////////////////////////////////////////////////////////
				
			return new PageHelper({
				idPrefix: "MedApplyDet",
                title: "{i18n>LABEL_47001}", // 의료비
                showNavButton: true,
				navBackFunc: oController.navBack,
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile",
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
