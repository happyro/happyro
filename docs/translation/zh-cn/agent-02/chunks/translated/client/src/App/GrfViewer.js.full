/**
 * App/GrfViewer.js
 *
 * Start GRF Viewer instance using ROBrowser
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import GRFViewer from 'UI/Components/GrfViewer/GrfViewer.js';

export default function init() {
	GRFViewer.append();

	window.onbeforeunload = function () {
		return '确定要退出吗？';
	};
}

init();
