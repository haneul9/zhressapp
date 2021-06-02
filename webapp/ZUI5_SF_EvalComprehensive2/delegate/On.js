sap.ui.define([
	"../../common/Common",
	"../../common/SearchEmpProfile",
	"../../common/SearchEvalResult",
	"sap/m/MessageBox"
], function(Common, SearchEmpProfile, SearchEvalResult, MessageBox) {
"use strict";

var On = { // 종합평가 event handler

	// GridContainer drop event handler
	drop: function(oInfo) {

		/*
		 * 1. 등급 조정 가능 범위 체크
		 * 2. 선택된 등급 저장
		 * 3. Drag 영역 itempressEvalResultDialogIcon 제거
		 * 4. Drop 영역 item 추가
		 * 5. Drag 및 Drop 영역 items 정렬
		 * 6. Drag 및 Drop 영역 model refresh : rerender
		 * 7. 리스트 정렬 및 refresh
		 */
		var
		oDragged = oInfo.getParameter("draggedControl"),
		oDropped = oInfo.getParameter("droppedControl"),

		oDragContainer = oDragged.getParent(),
		oDropContainer = oInfo.getSource().getParent(),

		oDragModel = oDragContainer.getModel(),
		oDropModel = oDropContainer.getModel(),
		oDragModelData = oDragModel.getData(),
		oDropModelData = oDropModel.getData(),

		iDragPosition = oDragContainer.indexOfItem(oDragged),
		iDropPosition = oDropContainer.indexOfItem(oDropped);

		if (oDragged.hasStyleClass("employee-evaluation-card-guideline")) {
			return;
		}

		var oController = $.app.getController(this.getControllerName()),
		oItem = oDragModelData.list[iDragPosition];

		if (!On.isProperGradeChange(oItem.Pegrade, oDropModelData.group)) {
			MessageBox.error(oController.getBundleText("MSG_11005")); // 등급조정 가능범위를 초과하였습니다.
			return;
		}

		// remove the item
		oDragModelData.list.splice(iDragPosition, 1);

		if (oDragModel === oDropModel && iDragPosition < iDropPosition) {
			iDropPosition--;
		}

		if (oDropModelData.list.length === 1 && !oDropModelData.list[0].Pernr) {
			// oDropModelData.list.pop();
		} else {
			if (oInfo.getParameter("dropPosition") === "After") {
				iDropPosition++;
			}
		}

		oItem.Cograde = oDropModelData.group;
		oItem.Pvgrade = oItem.Cograde;

		setTimeout(function() {
			$.map(oController.sort(oController.GradeListModel.getProperty("/Gradings")), function(o, i) {
				o.No = i + 1;
			});
			oController.GradeListModel.refresh();
			oController.calculate();
		}, 0);

		// insert the control in target aggregation
		oDropModelData.list.splice(iDropPosition, 0, oItem);
		oController.sort(oDropModelData.list);

		if (oDragModel !== oDropModel) {
			oDragModel.setData(oDragModelData);
			oDropModel.setData(oDropModelData);
		} else {
			oDropModel.setData(oDropModelData);
		}
	},

	// Table 종합평가 ComboBox change event handler
	changeCogradeComboBox: function(oEvent) {
		Common.log("changeCogradeComboBox", {prev: oEvent.getSource()._sValue, selected: oEvent.getSource()._lastValue});

		/*
		 * 1. 등급 조정 가능 범위 체크
		 * 2. 선택된 등급 저장
		 * 3. Drag 영역 item 제거
		 * 4. Drop 영역 item 추가
		 * 5. Drag 및 Drop 영역 items 정렬
		 * 6. Drag 및 Drop 영역 model refresh : rerender
		 * 7. 리스트 정렬 및 refresh
		 */
		var oController = this,
		combobox = oEvent.getSource(),
		property = combobox.getBindingContext().getProperty(),
		selectedValue = combobox.getSelectedKey(),
		previousValue = property.Pvgrade;

		setTimeout(function() {
			if (!On.isProperGradeChange(property.Pegrade, selectedValue)) {
				MessageBox.error(oController.getBundleText("MSG_11005"), { // 등급조정 가능범위를 초과하였습니다.
					onClose: function() {
						combobox.setSelectedKey(previousValue);
					}
				});
				return;
			}

			property.Pvgrade = selectedValue;

			var
			oDragModel = oController["Grade${previousValue}Model".interpolate(previousValue)],
			oDropModel = oController["Grade${selectedValue}Model".interpolate(selectedValue)],
			oDragModelData = oDragModel.getData(),
			oDropModelData = oDropModel.getData(),

			iDragPosition = $.map(oDragModelData.list, function(o) { return o.Pernr; }).indexOf(property.Pernr);

			oDragModelData.list.splice(iDragPosition, 1);
			oDropModelData.list.unshift(property);
			oController.sort(oDropModelData.list);

			oDragModel.refresh();
			oDropModel.refresh();

			setTimeout(function() {
				oController.sort(oController.GradeListModel.getProperty("/Gradings"));
				oController.GradeListModel.refresh();
				oController.calculate();
			}, 0);
		}, 0);
	},

	// // Table 평가결과 column icon click event handler
	// pressEvalResultDialogIcon: function(oEvent) {
	// 	Common.log("pressEvalResultDialogIcon", oEvent.getSource().getBindingContext().getProperty());

	// 	if (!this.EvalResultDialog) {
	// 		this.EvalResultDialog = sap.ui.jsfragment("fragment.EvalResult2", this);
	// 		this.getView().addDependent(this.EvalResultDialog);
	// 	}

	// 	var data = oEvent.getSource().getBindingContext().getProperty();
	// 	SearchEvalResult.oController = this;
	// 	SearchEvalResult.Year = data.Appye;
	// 	SearchEvalResult.Grade5 = data.Cograde;
	// 	SearchEvalResult.userId = data.Pernr;

	// 	this.EvalResultDialog.open();
	// },
	
	// Table 평가결과 column icon click event handler
	pressEvalResultDialogIcon: function(oEvent) {
		var data = oEvent.getSource().getBindingContext().getProperty();
		localStorage.setItem('item1', data.Appye);
		localStorage.setItem('item2', data.Pernr);
		var vUrl = "../webapp/EvalDialog.html"; 
		// var vUrl = "../webapp/indexTest.html"; 
		window.open(vUrl, "pop", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1250,height=900, top=top, left=left");
	},

	// Table 인사기록카드 column icon click event handler
	pressEmpProfileDialogIcon: function(oEvent) {
		Common.log("pressEmpProfileDialogIcon", oEvent.getSource().getBindingContext().getProperty());

		if (!this.EmpProfileDialog) {
			this.EmpProfileDialog = sap.ui.jsfragment("fragment.EmpProfile", this);
			this.getView().addDependent(this.EmpProfileDialog);
		}

		SearchEmpProfile.oController = this;
		SearchEmpProfile.userId = oEvent.getSource().getBindingContext().getProperty().Pernr;

		this.EmpProfileDialog.open();
	},

	// 등급조정 가능범위 확인
	isProperGradeChange: function(Pegrade, dropGrade) {

		var map = {
			S: ["S", "A"],
			A: ["S", "A", "B"],
			B: ["A", "B", "C", "D"],
			C: ["B", "C", "D"],
			D: ["C", "D"]
		};
		return $.inArray(dropGrade, map[Pegrade]) > -1;
	}

};

return On;

});