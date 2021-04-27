﻿/* global AbstractPortlet moment */
function WorkstimeStatusPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-workstimeStatusPortlet-list';
}

WorkstimeStatusPortlet.prototype = Object.create(AbstractPortlet.prototype);
WorkstimeStatusPortlet.prototype.constructor = WorkstimeStatusPortlet;

$.extend(WorkstimeStatusPortlet.prototype, {

ui: function() {

	var cardHeader = this.hideTitle() ? '' : [
		'<div class="card-header">',
			'<h6>${title}</h6>'.interpolate(this.title()),
			'<div>',
				this.dismissButton(),
				this.link(true),
			'</div>',
		'</div>'
	].join('');

	return [
		'<div class="card portlet portlet-${size}h portlet-bbs" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="list-group" id="portlet-workstimeStatusPortlet-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},

lpad: function (d, width) {
    d = d + '';
    return d.length >= width ? d : new Array(width - d.length + 1).join('0') + d;
},

checkNull: function (v) {
    return v === undefined || v === null || v == "" ? true : false;
},

fill: function() {

	var url = 'ZHR_FLEX_TIME_SRV/FlexworktimeSummarySet';
    var vFullYear = String(new Date().getFullYear()),
        vMonth = String(new Date().getMonth()+1);
    var oEmpInfo = this._gateway.loginInfo();
    vMonth = this.lpad(vMonth, 2);

	return this._gateway.post({
		url: url,
		data: {
			Werks: oEmpInfo.Persa,
			Pernr: this._gateway.pernr(),
			Zyymm: vFullYear + vMonth,
			Langu: "KO",
			Prcty: "1",
            FlexWorktime2Nav : []
		},
		success: function(data) {
			this._gateway.prepareLog('WorkstimeStatusPortlet.fill ${url} success'.interpolate(url), arguments).log();

			var list = this.$(),
                oWorkData = data.d;
            var vCtrnm = oWorkData.Ctrnm, // 소정근로시간
                vWrktm = oWorkData.Wrktm, // 근무시간(평일)
                vExttm = oWorkData.Exttm, // 연장근로
                vTottm = oWorkData.Tottm; // 총 근로시간

            vCtrnm = vCtrnm.split(":"),
            vWrktm = vWrktm.split(":"),
            vExttm = vExttm.split(":"),
            vTottm = vTottm.split(":");

            var vCtrnmH = vCtrnm[0] !== "00" ? vCtrnm[0] + "시간" : "",
                vCtrnmM = vCtrnm[1] !== "00" ? vCtrnm[1] + "분" : "",
                vWrktmH = vWrktm[0] !== "00" && this.checkNull(!vWrktm[0]) ? vWrktm[0] + "시간" : (this.checkNull(vWrktm[1]) ? "0시간" : ""),
                vWrktmM = vWrktm[1] !== "00" ? (this.checkNull(vWrktm[1]) ? "" : vWrktm[1] + "분") : "",
                vExttmH = vExttm[0] !== "00" && this.checkNull(!vExttm[0]) ? vExttm[0] + "시간" : (this.checkNull(vExttm[1]) ? "0시간" : ""),
                vExttmM = vExttm[1] !== "00" ? (this.checkNull(vExttm[1]) ? "" : vExttm[1] + "분") : "",
                vTottmH = vTottm[0] !== "00" && this.checkNull(!vTottm[0]) ? vTottm[0] + "시간" : (this.checkNull(vTottm[1]) ? "0시간" : ""),
                vTottmM = vTottm[1] !== "00" ? (this.checkNull(vTottm[1]) ? "" : vTottm[1] + "분") : "";
                
            var vWorkTime = parseInt(vTottm[0]+vTottm[1]) / parseInt(vCtrnm[0]+vCtrnm[1]) * 80;

			list.append([
                '<div style="display: flex; align-items: flex-end;">',
                    '<div style="font-size: 14px; font-weight: bold; margin-right: 5px; margin-bottom: 2px;">',
                        "오늘의 근태",
                    '</div>',
                    '<div style="font-size: 20px; font-weight: bold; color: rgb(13,122,246);">',
                        "정상근무(09:00~18:00)",
                    '</div>',
                '</div>',
                '<div style="background-color: rgb(236,244,253); margin-top: 10px;">',
                    '<div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 15px;">',
                        '<div style="font-size: 14px; font-weight: bold; color: rgb(4,62,127);">',
                            "총 근로시간",
                        '</div>',
                        '<div style="font-size: 32px; font-weight: bold; color: rgb(4,62,127);">',
                            vTottmH + vTottmM,
                        '</div>',
                    '</div>',
                '</div>',
                '<div style="display: flex; flex-direction: column; align-items: center; width: 100%; margin-top: 10px;">',
                    '<div class="progress" style="height: 20px; width: 100%; display: flex; position: relative;">',
                        '<div style="height: 100%; position: absolute;" class="progress-bar bg-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">',
                        '</div>',
                        '<div style="height: 100%; position: absolute; background-color: transparent; border-right: solid; width: 80%;">',
                        '</div>',
                    '</div>',
                    '<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">',
                        '<div style="font-size: 14px; color: rgb(145,149,155)">',
                            "0h",
                        '</div>',
                        '<div style="font-size: 14px; color: rgb(145,149,155); margin-right: 55px;">',
                            (vCtrnmH + vCtrnmM).split("시간")[0] + "h",
                        '</div>',
                    '</div>',
                '</div>',
                '<div style="display: flex; flex-direction: column; width: 100%; margin-top: 45px;">',
                    '<div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgb(236 236 236); padding-bottom: 5px;">',
                        '<div style="font-size: 14px; color: rgb(108,111,115);">',
                            "소정 근로시간 한도",
                        '</div>',
                        '<div style="font-size: 18px; font-weight: bold;">',
                            vCtrnmH + vCtrnmM,
                        '</div>',
                    '</div>',
                    '<div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 5px; border-bottom: 1px solid rgb(236 236 236); padding-bottom: 5px;">',
                        '<div style="font-size: 14px; color: rgb(108,111,115);">',
                            "평일근로시간",
                        '</div>',
                        '<div style="font-size: 18px; font-weight: bold;">',
                            vWrktmH + vWrktmM,
                        '</div>',
                    '</div>',
                    '<div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 5px; border-bottom: 1px solid rgb(236 236 236); padding-bottom: 5px;">',
                        '<div style="font-size: 14px; color: rgb(108,111,115);">',
                            "연장근로시간",
                        '</div>',
                        '<div style="font-size: 18px; font-weight: bold;">',
                            vExttmH + vExttmM,
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''));

            $('.progress-bar').animate({ width: vWorkTime + '%' }, 2000);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'WorkstimeStatusPortlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
onceAfter: function() {

	var list = this.$();
	if (!list.data('jsp') && !this._gateway.isMobile()) {
		list.jScrollPane({
			resizeSensor: true,
			verticalGutter: 0,
			horizontalGutter: 0
		});
	}
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
},
itemUrl: function(o) {

	return [
		' data-popup-menu-url="${url}?Sdate=${Sdate}&Skey=${Skey}"'.interpolate(this.url(), o.Sdate, o.Skey),
		' data-menu-id="${menu-id}"'.interpolate(this.mid())
	].join('');
},
clearResource: function() {

	return new Promise(function(resolve) {
		setTimeout(function() {
			this.$().data('jsp').destroy();
			resolve();
		}.bind(this), 0);
	}.bind(this));
}

});