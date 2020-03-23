"use strict";

// apparently MSIE doesn't support endsWith, see if it is defined
if (!String.prototype.endsWith) {
	// this version isn't fully compliant but meets our needs
	String.prototype.endsWith = function(pattern) {
		var d = this.length - pattern.length;
		return d >= 0 && this.lastIndexOf(pattern) === d;
	};
}

// based on the file name, select the most appropriate ace mode
function aceMode(fileName) {
	if (fileName.endsWith('.c') ||
			fileName.endsWith('.cpp') ||
			fileName.endsWith('.c++') ||
			fileName.endsWith('.cxx') ||
			fileName.endsWith('.hpp') ||
			fileName.endsWith('.h')) {
		return 'c_cpp';
	}

	if (fileName.endsWith('.java')) {
		return 'java';
	}

	if (fileName.endsWith('.js')) {
		return 'javascript';
	}

	if (fileName.endsWith('.sh')) {
		return 'sh';
	}

	if (fileName == 'Makefile') {
		return 'makefile';
	}

	return 'text';
}

$(function() {
	// try to make sticky headings work on old browsers
	$('section h1').stickybits();

	// click to show menu, click anywhere to hide it
	$("body").click(function() {
		$("#dropdown").hide();
	});
	$("#dropdown").click(function(e) {
		$("#dropdown").hide();
		e.stopPropagation();
	});
	$('#menu').click(function(e) {
		$('#dropdown').toggle();
		e.stopPropagation();
	});

	// for each tabset, find all the edit panes
	// and configure their editors
	var runNum = 0;		// keep count of run buttons
	var buildNum = 0;	// keep count of build buttons
	$('div.etabs').each(function(etabsIndex) {
		// ID for the tabset, actually not used as an ID for
		// the surrounding div, which just has class="etabs".
		// this ID is used as the name for the set of radio
		// buttons (drawn as tabs at the top).  for example:
		//	<input type="radio" name="etabs0" id="etabs0_0">
		var etabsID = 'etabs' + etabsIndex;

		// keep track of which tab has focus
		var focusID;

		// info.<tabID>.editor is the ace.edit object for a tab
		// info.<tabID>.revert is the original file contents
		var info = {};

		// find all the edit panes in this tabset
		$(this).find('label').each(function(etabIndex) {

			// file being edited, pulled from the label text
			var fileName = $(this).text();

			// start up the editor and configure it
			var editor = ace.edit('editor_e' + etabsIndex + '_' + etabIndex);
			editor.setTheme('ace/theme/crimson_editor');
			editor.setFontSize(14);
			editor.session.setMode('ace/mode/' + aceMode(fileName));
			editor.session.setUseWrapMode(true);

			var tabID = etabsID + '_' + etabIndex;
			info[tabID] = {};
			info[tabID].editor = editor;

			// save the intial content for revert button
			info[tabID].revert = editor.getValue();

			// save fileName for the posting changes
			info[tabID].fileName = fileName;

		}); // foreach edit pane

		// function to check which tab is currently on top
		var checkFocus = function() {
			focusID = $('input[name="' + etabsID + '"]:checked').attr('id');
			info[focusID].editor.resize();
		}

		// call it to initialize focusID the first time
		checkFocus();

		// actions we take each time a tab is clicked
		$('input[name="' + etabsID + '"]').change(function() {
			// resize on firefox has problems
			// next three lines are workaround
			var container = $(this).next().next();
			container.css('width', container.parent().css('width'));
			container.css('height', container.parent().css('height'));
			// on all browsers, trigger redraw
			// and track who has focus
			checkFocus();
		});

		// setup the undo/redo/revert buttons, which are three
		// divs wrapped in a div with an id like "etabs0_urr"
		var urrID = etabsID + '_urr';

		// undo
		$('#' + urrID + ' div:nth-of-type(1)').click(function() {
			info[focusID].editor.undo();
		});

		// redo
		$('#' + urrID + ' div:nth-of-type(2)').click(function() {
			info[focusID].editor.redo();
		});

		// revert
		$('#' + urrID + ' div:nth-of-type(3)').click(function() {
			if (confirm('Revert back to original file? [cannot be undone]')) {
				info[focusID].editor.setValue(info[focusID].revert);
				info[focusID].editor.moveCursorTo(0, 0);
				info[focusID].editor.getSession().setUndoManager(new ace.UndoManager())
			}
		});

		// although not within the etabs div, each tabset
		// optionally has a build/run button and results pane
		// associated with it.  the button will have an id
		// like "run0" when it is a "run" button associated with
		// the tabset "etabs0"
		var runID = 'run' + etabsIndex;
		var runCmdID = 'cmd' + etabsIndex;

		$('button#' + runID).click(function() {

			// ignore clicks while already running
			if ($(this).hasClass("in-progress")) {
				return;
			}
			// use css to show it is running
			$(this).addClass("in-progress");
			$('pre#' + runID).html('<font style="color: #cd6155">Loading run results...</font>');
			// write all files
			var postData = {};
			postData.type = 'run';
			postData.num = runNum++;
			postData.command = $('div#' + runCmdID).text();
			postData.files = {};
			for (var id in info) {
				postData.files[info[id].fileName] =
					info[id].editor.getValue();
			}
			var that = this;
			$.ajax({
				method: 'POST',
				url: window.location.href,
				data: JSON.stringify(postData)
			})
			.done(function(data) {
				$(that).removeClass("in-progress");
				$('pre#' + runID).text(data);
			})
			.fail(function(jqXHR, textStatus) {
				$(that).removeClass("in-progress");
				$('pre#' + runID).html('<font style="color: #cd6155">Error contacting server: ' + textStatus + '</font>');
			});

		});

		// same as above, but for "build" buttons
		var buildID = 'build' + etabsIndex;
		var buildCmdID = 'cmd' + etabsIndex;

		$('button#' + buildID).click(function() {

			// ignore clicks while already running
			if ($(this).hasClass("in-progress")) {
				return;
			}
			// use css to show it is running
			$(this).addClass("in-progress");
			$('pre#' + buildID).html('<font style="color: #cd6155">Loading build results...</font>');
			// write all files
			var postData = {};
			postData.type = 'build';
			postData.num = buildNum++;
			postData.command = $('div#' + runCmdID).text();
			postData.files = {};
			for (var id in info) {
				postData.files[info[id].fileName] =
					info[id].editor.getValue();
			}
			var that = this;
			$.ajax({
				method: 'POST',
				url: window.location.href,
				data: JSON.stringify(postData)
			})
			.done(function(data) {
				$(that).removeClass("in-progress");
				$('pre#' + buildID).text(data);
			})
			.fail(function(jqXHR, textStatus) {
				$(that).removeClass("in-progress");
				$('pre#' + buildID).html('<font style="color: #cd6155">Error contacting server: ' + textStatus + '</font>');
			});

		});

	}); // foreach etabs

	// foreach output area, highlight any patterns
	$('.pat').each(function() {
		var re = new RegExp($(this).text(), 'g');
		var ohtml = $(this).parent().html();
		$(this).parent().html(ohtml.replace(re, function(match) {
			return '<code class="highlight">' + match + '</code>';
		}));
	});

}); // document ready
