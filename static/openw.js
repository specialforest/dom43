function Wopen(url, width, height, scrol_bars, status_bar, i_url) {
	var today = new Date();
	var millisecond = today.getTime();
	var sw = screen.availWidth, sh = screen.availHeight;
	var w = width, h = height;
	if (w > sw || !w) w = sw;
	if (h > sh || !h) h = sh;
	var l = (sw - w) / 2, t = (sh - h) / 2;
	var prop = "";
	prop += "width=" + w + ", height=" + h;

	var wSBars, wStatus;
	if ( scrol_bars != 'yes' && scrol_bars != 'no' ) 
		wSBars = 'no';
	else 
		wSBars = scrol_bars;

	prop += ", scrollbars=" + wSBars;

	if ( status_bar != 'yes' && status_bar != 'no' ) 
		wStatus = 'no';
	else 
		wStatus = status_bar;

	prop += ", status=" + wStatus;

	prop += ", resizable=yes";
        
        img_url = 'show_full_img?img_path='+url;
        if (i_url != '') img_url += '&i_url=' + i_url;
	window_2_open = open(img_url, millisecond, prop);
	window_2_open.moveTo(l, t);
}

function Wopen2() {
	var today = new Date();
	var millisecond = today.getTime();
	var sw = screen.availWidth, sh = screen.availHeight;
	var w = arguments[1], h = arguments[2];
	if (w > sw || !w) w = sw;
	if (h > sh || !h) h = sh;
	var l = (sw - w) / 2, t = (sh - h) / 2;
	window2Open = open(arguments[0], 'nw', "left=" + l + ", top=" + t + ", width=" + w + ", height=" + h + ", scrollbars=" + arguments[3]);
	window2Open.focus();
}

function Sutki_Photo(url, width, height, scrol_bars, status_bar, i_url) {
	var today = new Date();
	var millisecond = today.getTime();
	var sw = screen.availWidth, sh = screen.availHeight;
	var w = width, h = height;
	if (w > sw || !w) w = sw;
	if (h > sh || !h) h = sh;
	var l = (sw - w) / 2, t = (sh - h) / 2;
	var prop = "";
	prop += "width=" + w + ", height=" + h;

	var wSBars, wStatus;
	if ( scrol_bars != 'yes' && scrol_bars != 'no' ) 
		wSBars = 'no';
	else 
		wSBars = scrol_bars;

	prop += ", scrollbars=" + wSBars;

	if ( status_bar != 'yes' && status_bar != 'no' ) 
		wStatus = 'no';
	else 
		wStatus = status_bar;

	prop += ", status=" + wStatus;

	prop += ", resizable=yes";
        
        img_url = 'sutki_photo?img_path='+url;
        if (i_url != '') img_url += '&i_url=' + i_url;
	window_2_open = open(img_url, millisecond, prop);
	window_2_open.moveTo(l, t);
}

function Wopen3() {
	var today = new Date();
	var millisecond = today.getTime();
	var sw = screen.availWidth, sh = screen.availHeight;
	var w = arguments[1], h = arguments[2];
	if (w > sw || !w) w = sw;
	if (h > sh || !h) h = sh;
	var l = (sw - w) / 2, t = (sh - h) / 2;
	var prop = "";
	prop += "width=" + w + ", height=" + h;

	var wSBars, wStatus;
	if ( arguments[3] != 'yes' && arguments[3] != 'no' ) 
		wSBars = 'no';
	else 
		wSBars = arguments[3];

	prop += ", scrollbars=" + wSBars;

	if ( arguments[4] != 'yes' && arguments[4] != 'no' ) 
		wStatus = 'no';
	else 
		wStatus = arguments[4];

	prop += ", status=" + wStatus;

	prop += ", resizable=yes";

	window_2_open = open(arguments[0], millisecond, prop);
	window_2_open.moveTo(l, t);
}
