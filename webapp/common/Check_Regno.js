/* eslint-disable no-redeclare */
$.sap.declare("common.Check_Regno");
//바른 주민번호 = true를 return. 틀린 주민번호 = false를 리턴.
//하이픈 빼고 숫자만 13자리 보내주세요.
common.Check_Regno={
    isValidJuminNo : function(juminno) {
        var jumin1 = juminno.substr(0,6);
        var jumin2 = juminno.substr(6,7);
        var yy     = jumin1.substr(0,2);        // 년도
        var mm     = jumin1.substr(2,2);        // 월
        var dd     = jumin1.substr(4,2);        // 일
        var genda  = jumin2.substr(0,1);        // 성별
        // var msg, ss, cc;
        var cc;
      
        // 숫자가 아닌 것을 입력한 경우
        if (!this.isNumeric(jumin1)) {
           return false;
        }
       
        // 길이가 6이 아닌 경우
        if (jumin1.length != 6) {
              return false;
        }
       
        // 첫번째 자료에서 연월일(YYMMDD) 형식 중 기본 구성 검사
        if (yy < "00"
            || yy > "99"
            || mm < "01"
            || mm > "12"
            || dd < "01"
            || dd > "31") {
          return false;
        }
       
        // 숫자가 아닌 것을 입력한 경우
        if (!this.isNumeric(jumin2)) {
          return false;
        }
      
        // 길이가 7이 아닌 경우
        if (jumin2.length != 7) {
          return false;
        }
       
        // 성별부분이 1 ~ 4 가 아닌 경우
        if (genda < "1" || genda > "4") {
          return false;
        }
       
        // 연도 계산 - 1 또는 2: 1900년대, 3 또는 4: 2000년대
        cc = (genda == "1" || genda == "2") ? "19" : "20";
        // 첫번째 자료에서 연월일(YYMMDD) 형식 중 날짜 형식 검사
        if (this.isValidDate(cc+yy+mm+dd) == false) {
          return false;
        }
       
        // Check Digit 검사
        if (!this.isSSN(jumin1, jumin2)) {
            return false;
        }		  
        return true;
    },

    isSSN: function(s1, s2) {
			var n = 2;
			var sum = 0;
			for (var i=0; i<s1.length; i++)
				sum += parseInt(s1.substr(i, 1)) * n++;
			for (var i=0; i<s2.length-1; i++) {
				sum += parseInt(s2.substr(i, 1)) * n++;
				if (n == 10) n = 2;
			}
			
			var c = 11 - sum % 11;
			if (c == 11) c = 1;
			if (c == 10) c = 0;
			if (c != parseInt(s2.substr(6, 1))) return false;
			else return true;
		},

    isNumeric : function(s) {
        for (var i=0; i<s.length; i++) {
            var c = s.substr(i, 1);
            if (c < "0" || c > "9") return false;
        }
        return true;
    },
      
    isValidDate: function(iDate) {
        if( iDate.length != 8 ) {
            return false;
        }
        
        var oDate = new Date();
        oDate.setFullYear(iDate.substring(0, 4));
        oDate.setMonth(parseInt(iDate.substring(4, 6)) - 1);
        oDate.setDate(iDate.substring(6));
        
        if( oDate.getFullYear()     != iDate.substring(0, 4)
            || oDate.getMonth() + 1 != iDate.substring(4, 6)
            || oDate.getDate()      != iDate.substring(6) ){
            
            return false;
        }			 
        return true;
    }
};