/* global Cookies */
function HomeMobileNoticeModal(o) {

	if (o && o.os !== 'aos') {
		return;
	}

	this.options = o;

	this.init();
}

$.extend(HomeMobileNoticeModal.prototype, {

isSuppressed: function() {

	return Cookies.get('ehr.mobile.notice.modal.${os}.suppress'.interpolate(this.options.os)) === 'Y';
	// return localStorage.getItem('ehr.home.popup.suppress') === 'Y';
},

setSuppress: function() {

	Cookies.set('ehr.mobile.notice.modal.${os}.suppress'.interpolate(this.options.os), 'Y', { expires: new Date(2100, 0, 1, 0, 0, 0) });
	// localStorage.setItem('ehr.home.popup.suppress', 'Y');
},

init: function() {

	if (this.isSuppressed()) {
		return;
	}

	$(this.ui()).appendTo('body')
		.on('hidden.bs.modal', function() {

			if ($('#mobile-notice-modal-suppress-reopen').prop('checked')) {
				this.setSuppress();
			}

			$('#mobile-notice-modal').modal('dispose').remove();
		}.bind(this))
		.modal();
},

ui: function() {

	return [
		'<div class="modal fade mobile-notice-modal" style="display:none" aria-hidden="true" data-backdrop="static" tabindex="-1" role="dialog" id="mobile-notice-modal">',
			'<div class="modal-dialog" role="document">',
				'<div class="modal-content">',
					'<div class="modal-header">',
						'<h4 class="modal-title">모바일 앱 업데이트 알림</h4>',
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
					'</div>',
					'<div class="modal-body">',
						// '<div class="text-center"><img src="images/img-android-setting2.png" /></div>',
						'<ol>',
							'<li>',
								'업데이트 사유(기능개선사항)',
								'<ul>',
									'<li>신청시 첨부파일을 사진촬영해 즉시 처리 가능</li>',
									'<li>Hi톡톡 좋아요 기능 적용</li>',
								'</ul>',
							'</li>',
							'<li>',
								'업데이트 방법 : <a href="https://mdm.lottechem.com/">MDM 로그인 (lottechem.com)</a>',
							'</li>',
						'</ol>',
					'</div>',
					'<div class="modal-footer justify-content-between">',
						'<div class="form-check">',
							'<input class="form-check-input" type="checkbox" id="mobile-notice-modal-suppress-reopen" style="width:1.3rem; height:1.3rem; margin-top:.1rem" />',
							'<label class="form-check-label" for="mobile-notice-modal-suppress-reopen" style="margin-left:.5rem">다시 열지 않기</label>',
						'</div >',
						'<button type="button" class="btn btn-primary" data-dismiss="modal">닫기</button>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
}

});