"use strict";

$(function() {

	// set terminal element height to full viewport hight minus
	// the size of the sticky h1 label at the top
	$('#xterm').height($(window).height() - $('h1').outerHeight());

	var term = new Terminal();
	term.open(document.getElementById('xterm'));
	term.write("Connecting to server...\n\r\n\r");

	// MSIE says "SyntaxError" on the :port part
	//var ws = new WebSocket('wss://' + window.location.hostname + ':' + window.location.port + '/shell/term/?ex=' + pmem_ex);
	// pmem_ws is either 'wss' (for internet) or 'ws' (for intranet/testing)
	var ws = new WebSocket(pmem_ws + '://' + window.location.hostname + '/shell/term/?ex=' + pmem_ex);
	ws.binaryType = "arraybuffer";
	function ab2str(buf) {
		return String.fromCharCode.apply(null, new Uint8Array(buf));
	}
	ws.onmessage = function(evt) {
		if (evt.data instanceof ArrayBuffer) {
			term.write(ab2str(evt.data));
		} else {
			console.log(evt.data)
		}
	};
	ws.onopen = function(evt) {
		term.on('data', function(data) {
			ws.send(new TextEncoder().encode("\x00" + data));
		});
		term.on('title', function(title) {
			document.title = title;
		});
		term.on('resize', function(size) {
			ws.send(new TextEncoder().encode("\x01" +
				JSON.stringify({cols: size.cols, rows: size.rows})))
		});
		term.fit();
	}
	ws.onclose = function(evt) {
		term.write("\n\r\n\rTerminal session terminated.\n\r");
		//term.destroy();
	}
	ws.onerror = function(evt) {
		if (typeof console.log == "function") {
			console.log(evt)
		}
	}

	// debounced resize listened for the window
	var resizeTimer;
	$(window).on('resize', function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			// resizing has "stopped"
			$('#xterm').height($(window).height() - $('h1').outerHeight());
			term.fit();
		}, 250);
	});

}); // document ready
