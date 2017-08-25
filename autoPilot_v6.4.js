/*
Change log: v6.4
- Excluded codes/response functionality
- other specify functions: autoSpecifyCoded, autoSpecifyVerb
Change log: v6.3
- removed autopopulate if question is excluded
Change log: v6.3
- will not autopopulate if question is excluded
Change log: v6.2
- function fn_getProjectID returns undefined value on V22
- fixed for iframe X-Frame-Options security errors.

NOTE: rather than .prop() to populate responses, .click() event is used to
simulate respondent taking the survey and to trigger other custom javascript
implementations/validations within the survey.
 */

function autoPilot() {
	var bodyid = "_autobody_" + fn_getProjectID();
	var autoNext;
	var apforms = fn_getForms();
	//console.log("log 1.1: exclude boolean : " + fn_autoExcludeSettings(apforms));
	if (!fn_autoExcludeSettings(apforms)) {
		//console.log("log 2: included forms : inside");
		autoNext = setTimeout(function () {
				if ($('#ScreenInfo_text').length > 0) {
					//console.log("log 3: terminate, going back...");
					$('#' + bodyid + ' #backbutton').click();
				} else {
					for (var i = 0; i < apforms.length; i++) {
						//console.log("log 1: populating form : "+apforms[i]);
						fn_autoPopulate(apforms[i])
					}
					//console.log("log 4: qualify, going forward...");
					$('#' + bodyid + ' #forwardbutton').click();
				}
			}, 2000);
	}
	$(window).keydown(function (event) {
		if (event.keyCode == 36) {
			//console.log("log 5: Paused...");
			autoPause(autoNext);
		}
	});
}
function autoPause(localNext) {
	clearTimeout(localNext);
}
function fn_injectExcluded() {
	var __settings = fn_auto__settings(__form_name);
	var excludeRowtxt = "" + __settings[12]; //v.6.4
	var excludeRow = excludeRowtxt.split('*'); //v.6.4


}
function fn_autoPopulate(__form_name) {
	var __settings = fn_auto_settings(__form_name);
	var _sBlank = __settings[1];
	var _sRate = __settings[2];
	var _sMin = __settings[3];
	var _sMax = __settings[4];
	var _sWithEmail = __settings[5];
	var _sWithDecimal = __settings[6];
	var _sWithInteger = __settings[7];
	var _sWithText = __settings[8];
	var _sExactType = __settings[9]; //v.6
	var _sExactResptxt = "" + __settings[10]; //v.6
	var _sExactResp = _sExactResptxt.split('*'); //v.6
	var _sExactRowtxt = "" + __settings[11]; //v.6
	var _sExactRow = _sExactRowtxt.split('*'); //v.6


	if (__form_name == 'ScreenInfo') {
		$('#backbutton').click();
		return;
	}
	$('#fieldset_' + __form_name + ' input:text,textarea').each(function (index) {
		$(this).val('');
		//console.log("log 001 : clearing text responses");
	});
	$('#fieldset_' + __form_name + ' .abtn-_selected').each(function (index) {
		$(this).click();
		//console.log("log 002 : clearing multi responses");
	});
	$('#fieldset_' + __form_name + ' .abtn-_selected-grid').each(function (index) {
		$(this).click();
		//console.log("log 003 : clearing grid responses");
	});
	var count = 0;
	var _blank = Math.floor((Math.random() * (100 / _sBlank)) + 1);
	var _restype = Math.floor((Math.random() * 6) + 1);
	var _selected = Math.floor((Math.random() * 3) + 1);
	var others = [1, 2, 3, 4];
	var numerics = [1, 2];
	if (_sWithEmail < 1)
		others.splice(others.indexOf(1), 1); //exclude 1
	if (_sWithDecimal < 1)
		others.splice(others.indexOf(2), 1); //exclude 2
	if (_sWithInteger < 1)
		others.splice(others.indexOf(3), 1); //exclude 3
	if (_sWithText < 1)
		others.splice(others.indexOf(4), 1); //exclude 4
	if (_sWithDecimal < 1)
		numerics.splice(numerics.indexOf(1), 1); //exclude 1
	if (_sWithInteger < 1)
		numerics.splice(numerics.indexOf(2), 1); //exclude 2

	//console.log("log 11.98 : others : " + others);
	//console.log("log 11.99 : numerics : " + numerics);
	//console.log("log 12 : _sExactType : " + _sExactType);
	var other = others[Math.floor(Math.random() * others.length)];
	var numeric = numerics[Math.floor(Math.random() * numerics.length)];
	//console.log("log 13 : fn_autoExclude__settings boolean : " + fn_autoExclude__settings([__form_name]));
	if (!fn_autoExclude__settings([__form_name])) {
		//console.log("log 14 : fn_autoExclude__settings boolean inside : " + !fn_autoExclude__settings([__form_name]));
		var _rate = 100 / _sRate;
		if (_blank == 1) {
			$('.questionarea').append('<br /><span>AUTO:_sBlank</span>');
			$('#forwardbutton').click();
		}
		if (_blank != 1 && (!(_sExactType > 0))) {
			popSingle(__form_name);
			popDropdown(__form_name);
			popMulti(__form_name, _rate);
			popGridSingle(__form_name);
			popGridMulti(__form_name, _rate);
			popGridTextList(__form_name, _rate);
			popOpen(__form_name);
			popNumeric(__form_name);
			popTextList(__form_name, _rate);
			
			
			$('#fieldset_' + __form_name + ' .confirmit-gridslider tr').each(function (index) {
				var gridRow = this;
				count = 0;
				$(gridRow).children('td:has(input:radio)').each(function (index3) {
					count++;
				});
				_selected = Math.floor((Math.random() * count));
				$(gridRow).children('td:has(input:radio)').each(function (index2) {
					if (_selected == index2) {
						$('.questionarea').prepend('<br /><span>AUTO:SLIDER ' + index + ' ' + index2 + ' ' + _selected + ' </span>');
						$(this).click();
						$(this).find('input').click();
						autoSpecifyCoded($(this), __form_name);
					}
				});
			});
			$('#fieldset_' + __form_name + ' .ssi-boxcontainer').each(function (index) {
				var boxes = this;
				count = 0;
				$(boxes).children('td:has(input:radio)').each(function (index3) {
					count++;
				});
				_selected = Math.floor((Math.random() * count));
				$('.ssi-button').each(function (index2) {
					$('.questionarea').append('<br /><span>AUTO:CLICK-GRID ' + index + ' ' + index2 + ' ' + _selected + ' </span>');
					if (_selected == index2) {
						$('.questionarea').prepend('<br /><span>AUTO:CLICK-GRID ' + index + ' ' + index2 + ' ' + _selected + ' </span>');
						$(this).click();
						$(this).find('input').click();
					}
				});
			});
		}
		var r_seed = 0;
		if (_blank != 1 && _sExactType > 0) {
			if (_sExactType == 1) {
				_selected = Math.floor((Math.random() * _sExactResp.length));
				$('#fieldset_' + __form_name + ' .confirmit-table .confirmit-abtn').not('.confirmit-abtn.multi').has('#' + __form_name + '_' + _sExactResp[_selected]).each(function (index) {
					$('.questionarea').append('<br /><span>AUTO:SINGLE ' + _selected + '</span>');
					$(this).click();
					autoSpecifyCoded($(this), __form_name);
				});
				$('#fieldset_' + __form_name + ' select').each(function (index) {
					$('.questionarea').append('<br /><span>AUTO:DROPDOWN ' + _selected + '</span>');
					$(this).val(_sExactResp[_selected]);
				});
			}
			if (_sExactType == 2) {
				//console.log("log 16 : _sExactType inside : " + _sExactType);
				//console.log("log 16.1 : _sExactResp : " + _sExactResp);
				for (var eresp = 0; eresp <= _sExactResp.length; eresp++) {
					//console.log("log 16.2 : identifier : " + '#fieldset_' + __form_name + ' .confirmit-table .confirmit-abtn ::'+' #' +__form_name + '_' + _sExactResp[eresp]);
					$('#fieldset_' + __form_name + ' .confirmit-table .confirmit-abtn').has('#' + __form_name + '_' + _sExactResp[eresp]).each(function (index) {
						$('.questionarea').append('<br /><span>AUTO:MULTI ' + eresp + '</span>');
						$(this).click();
						autoSpecifyCoded($(this), __form_name);
					});
				}
			}
			if (_sExactType == 3) {
				$('#fieldset_' + __form_name + ' .confirmit-grid tr').each(function (index) {
					var gridRow = this;
					count = 0;
					$(gridRow).children('td:has(input:radio)').each(function (index3) {
						count++;
					});
					_selected = Math.floor((Math.random() * count));
					$(gridRow).children('td:has(input:radio)').each(function (index2) {
						if (_selected == index2) {
							$('.questionarea').prepend('<br /><span>AUTO:GRID ' + index + ' ' + index2 + ' ' + _selected + ' </span>');
							$(this).click();
							$(this).find('input').click();
							autoSpecifyVerb($(this), __form_name);
						}
					});
				});
				_selected = Math.floor((Math.random() * _sExactResp.length));
				//console.log("log 20 : _sExactType inside : " + _sExactType);
				//console.log("log 20.1 : random index : "+_selected);
				//console.log("log 20.2 : random response : "+_sExactResp[_selected]);
				//console.log("log 20.3 : _sExactRow : "+_sExactRow);
				for (var erow = 0; erow < _sExactRow.length; erow++) {
					//console.log("log 20.4 : indentifier: "+"#fieldset_" + __form_name + " .confirmit-grid tr td :: #" +__form_name+ "_" + _sExactRow[erow] + "_" + _sExactResp[_selected]);
					$('#fieldset_' + __form_name + ' .confirmit-grid tr td').has('#' + __form_name + '_' + _sExactRow[erow] + '_' + _sExactResp[_selected]).each(function (index) {
						$('.questionarea').append('<br /><span>AUTO:GRID ' + _selected + '</span>');
						$(this).click();
						autoSpecifyCoded($(this), __form_name);

					});
					_selected = Math.floor((Math.random() * _sExactResp.length));
				}
			}

			//var hasid = false;
			if (_sExactType == 4) {
				//console.log("log 24 : _sExactType inside : " + _sExactType);
				//console.log("log 24.1 : _sExactResp : "+_sExactResp);
				//console.log("log 24.2 : _sExactRow : "+_sExactRow);


				$('#fieldset_' + __form_name + ' .confirmit-grid tr').each(function (index) {
					////console.log("log 24.5 : not hasid ");
					$(this).attr('id', 'autorow' + index);
					$('#autorow' + index + ' td:has(input:checkbox)').each(function (index2) {
						$('.questionarea').append('<br /><span>AUTO:GRID MULTI</span>');
						_selected = Math.floor((Math.random() * _rate) + 1);
						if (_selected == 1) {
							if (fn_isID($(this).find('input:checkbox').attr('id'), __form_name, _sExactRow, _sExactResp) == false) {
								$(this).click();
								autoSpecifyVerb($(this), __form_name);
							}
						}
					});
				});
				for (var eresp = 0; eresp < _sExactResp.length; eresp++) {
					for (var erow = 0; erow < _sExactRow.length; erow++) {
						//console.log("log 24.6 : indentifier: "+"#fieldset_" + __form_name + " .confirmit-grid tr td::#" +__form_name+ "_" + _sExactRow[erow] + "_" + _sExactResp[eresp]);

						$('#fieldset_' + __form_name + ' .confirmit-grid tr td').has('#' + __form_name + '_' + _sExactRow[erow] + '_' + _sExactResp[eresp]).each(function (index) {
							$('.questionarea').append('<br /><span>AUTO:GRID ' + eresp + '</span>');
							$(this).click();
							autoSpecifyCoded($(this), __form_name);

						});
					}
				}
			}
			if (_sExactType == 5) {
				$('input:text').each(function () {
					if (_sExactResp.length > 0) {
						_selected = Math.floor((Math.random() * _sExactResp.length));
						$(this).val(_sExactResp[_selected]);
						_sExactResp.splice(_sExactResp.indexOf(_selected), 1);
					}
				});
				$('textarea').each(function () {
					if (_sExactResp.length > 0) {
						_selected = Math.floor((Math.random() * _sExactResp.length));
						$(this).val(_sExactResp[_selected]);
						_sExactResp.splice(_sExactResp.indexOf(_selected), 1);
					}
				});
			}
		}
	}
}
/*---------------------------------------------------------------------------------------------*/
function fn_auto_settings(qid) {
	//console.log("log fn_auto_settings: start");
	var setFound = false;
	var __settings = "";
	//console.log("---------fn_getProjectID(): " + fn_getProjectID());
	//console.log("---------fn_autoGetCookie(): " + fn_autoGetCookie(fn_getProjectID()));
	var qid__settings = fn_autoGetCookie(fn_getProjectID()).split('-*');
	//console.log("---------qid__settings: " + qid__settings);

	for (var i = 0; i < qid__settings.length; i++) {
		//console.log("---------qid__settings: " + qid__settings[i] +":" + qid+"_"+fn_getProjectID());
		if (qid__settings[i] == qid + "_" + fn_getProjectID()) {
			setFound = true;
			//console.log("---------qid__settings: " + qid__settings[i] +":" + qid+"_"+fn_getProjectID() +":" + setFound);
		}
	}
	if (setFound) {
		__settings = fn_autoGetCookie(qid + "_" + fn_getProjectID());
	} else {
		__settings = fn_autoGetCookie("GLOBAL_" + fn_getProjectID());
	}
	//console.log("---------__settings: " + __settings);
	//console.log("log fn_auto_settings: end");
	return __settings.split('-*');
}
function fn_autoExclude__settings(eforms) {
	//console.log("log fn_autoExclude__settings: start");
	//console.log("---------fn_getProjectID(): " + fn_getProjectID()+"_EXC");
	var excludes = fn_autoGetCookie(fn_getProjectID() + "_EXC").split('-*');
	//console.log("---------excludes: " + excludes);
	var found = false;
	for (var i = 0; i < eforms.length; i++) {
		for (var x = 0; x < excludes.length; x++) {
			//console.log("---------eforms["+i+"]/excludes["+x+"]: " + eforms[i] +":"+excludes[x]);
			if (eforms[i] == excludes[x]) {
				found = true;
				//console.log("---------found: " + found);
				break;
			}
		}
		if (found)
			break;
	}
	//console.log("log fn_autoExclude__settings: end");
	return found;
}
function fn_autoSetCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function fn_autoGetCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function fn_getForms() {
	//console.log("log fn_getForms: start");
	var pk_forms = [];
	$('fieldset').each(function (index) {
		pk_forms[index] = $(this).attr('id').split('_')[1];
		//console.log("---------pk_forms["+index+"]: " + $(this).attr('id').split('_')[1]);
	});

	//console.log("log fn_getForms: end");
	return pk_forms;
}
function fn_getFormIndex(pk_page) {
	//console.log("log fn_getFormIndex: start");
	var pk_forms = fn_getForms();
	//console.log("---------pk_forms[pk_page]: " +pk_page +":"+pk_forms[pk_page]);
	//console.log("log fn_getFormIndex: end");
	return pk_forms[pk_page];
}
function fn_getProjectID() {
	//console.log("log fn_getProjectID: start");
	var fAction = $('form').attr('action');
	//console.log("---------fAction: " +fAction);
	var removeASPX = fAction.split('.')[0];
	//console.log("---------removeASPX: " +removeASPX);
	var locArr = removeASPX.split('/');
	//console.log("---------locArr: " +locArr);
	var gpid = locArr[locArr.length - 1];
	//console.log("---------gpid: " +gpid);
	$('form').attr('id', 'autobody' + gpid);
	//console.log("log fn_getProjectID: end");
	return gpid;
}
function fn_isID(fid, iform, _sExactRow, _sExactResp) {

	//console.log("log fn_isID: start");
	var isID = false;
	var chkID = "";
	for (var erow = 0; erow < _sExactRow.length; erow++) {
		for (var eresp = 0; eresp < _sExactResp.length; eresp++) {
			//console.log("---------_sExactRow["+erow+"]: " +_sExactRow[erow]);
			//console.log("---------_sExactResp["+eresp+"]: " +_sExactResp[eresp]);
			chkID = iform + "_" + _sExactRow[erow] + "_" + _sExactResp[eresp];
			//console.log("---------fid/chkID: " + fid+"/"+chkID);
			if (fid == chkID) {
				isID = true;
			}
		}
	}
	//console.log("---------isID: " + isID);
	//console.log("log fn_isID: end");
	return isID;
}
function autoSpecifyCoded(ObjButton, __form_name) {
	var __settings = fn_auto_settings(__form_name);
	var _sMin = __settings[3];
	var _sMax = __settings[4];
	var _sWithEmail = __settings[5];
	var _sWithDecimal = __settings[6];
	var _sWithInteger = __settings[7];
	var _sWithText = __settings[8];

	var others = [1, 2, 3, 4];
	if (_sWithEmail < 1)
		others.splice(others.indexOf(1), 1); //exclude 1
	if (_sWithDecimal < 1)
		others.splice(others.indexOf(2), 1); //exclude 2
	if (_sWithInteger < 1)
		others.splice(others.indexOf(3), 1); //exclude 3
	if (_sWithText < 1)
		others.splice(others.indexOf(4), 1); //exclude 4

	var other = others[Math.floor(Math.random() * others.length)];

	if (ObjButton.is('.selectedcolor')) {
		switch (other) {
		case 1:
			ObjButton.find('.other').val('auto@pilot.com');
			break;
		case 2:
			ObjButton.find('.other').val(Math.floor((Math.random() * _sMax) + _sMin) + 0.5);
			break;
		case 3:
			ObjButton.find('.other').val(Math.floor((Math.random() * _sMax) + _sMin));
			break;
		default:
			ObjButton.find('.other').val('AutoPilot' + Math.floor((Math.random() * 999) + 1));
		}
	}
}
function autoSpecifyVerb(ObjButton, __form_name) {
	var __settings = fn_auto_settings(__form_name);
	var _sMin = __settings[3];
	var _sMax = __settings[4];
	var _sWithEmail = __settings[5];
	var _sWithDecimal = __settings[6];
	var _sWithInteger = __settings[7];
	var _sWithText = __settings[8];

	var others = [1, 2, 3, 4];
	if (_sWithEmail < 1)
		others.splice(others.indexOf(1), 1); //exclude 1
	if (_sWithDecimal < 1)
		others.splice(others.indexOf(2), 1); //exclude 2
	if (_sWithInteger < 1)
		others.splice(others.indexOf(3), 1); //exclude 3
	if (_sWithText < 1)
		others.splice(others.indexOf(4), 1); //exclude 4

	var other = others[Math.floor(Math.random() * others.length)];
	switch (other) {
	case 1:
		ObjButton.find('.other').val('auto@pilot.com');
		break;
	case 2:
		ObjButton.find('.other').val(Math.floor((Math.random() * _sMax) + _sMin) + 0.5);
		break;
	case 3:
		ObjButton.find('.other').val(Math.floor((Math.random() * _sMax) + _sMin));
		break;
	default:
		ObjButton.find('.other').val('AutoPilot' + Math.floor((Math.random() * 999) + 1));
	}
}
function objVisible(ObjNode) {
	objVis = false;
	objDom = ObjNode;
	console.log("log init node:" + objDom);
	if (ObjNode.length > 0) {
		console.log("log node:" + objDom);
		if (objDom.is(':visible')) { //css - display: block or inline
			console.log("log node: true visible: " + objDom);
			objVis = true;
		} else {
			console.log("log node: else visible: " + objDom);
			while (!objVis) {
				if (objDom.css('visibility') == 'hidden') { // css - visibility: hidden
					console.log("log node: true hidden: " + objDom);
					objVis = true;
				}
				objDom = objDom.parent();
				if (objDom.hasClass('pagearea') || objDom.is('body') || objDom.is('BODY')) {
					break;
				}
			}
		}
	}
	console.log("log node: end : " + objDom);
	return objVis;
}
function popSingle(__form_name) {
	//console.log("log popSingle: start");
	var count = 0;
	var _selected = 0;
	if (objVisible($('#fieldset_' + __form_name + ' .confirmit-table input:eq(0)'))) {
		//console.log("---------log objVisible: radio true");
		count = $('#fieldset_' + __form_name + ' .confirmit-table input:radio').length;
		_selected = Math.floor(Math.random() * (count));
		$('#fieldset_' + __form_name + ' .confirmit-table input:radio').eq(_selected).click();
		autoSpecifyCoded($('#fieldset_' + __form_name + ' .confirmit-table input:radio').eq(_selected), __form_name);
	} else if (objVisible($('#fieldset_' + __form_name + ' .confirmit-table .confirmit-abtn:eq(0)'))) {
		//console.log("---------log objVisible: button true");
		count = $('#fieldset_' + __form_name + ' .confirmit-table .confirmit-abtn').not('.confirmit-abtn.multi').length;
		_selected = Math.floor(Math.random() * (count));
		$('#fieldset_' + __form_name + ' .confirmit-table .confirmit-abtn').not('.confirmit-abtn.multi').eq(_selected).click();
		autoSpecifyCoded($('#fieldset_' + __form_name + ' .confirmit-table .confirmit-abtn').not('.confirmit-abtn.multi').eq(_selected), __form_name);
	}
	//console.log("log popSingle: end");
}
function popDropdown(__form_name) {
	var count = 0;
	var _selected = 0;
	if (objVisible($('#fieldset_' + __form_name + ' select:eq(0)'))) {
		count = $('#fieldset_' + __form_name + ' select option').length;
		_selected = Math.floor((Math.random() * (count - 1)) + 1);
		$('#fieldset_' + __form_name + ' select').val($('option').eq(_selected).val());
	}
}
function popMulti(__form_name, _rate) {
	if (objVisible($('#fieldset_' + __form_name + ' .confirmit-table .confirmit-abtn.multi:eq(0)'))) {
		$('#fieldset_' + __form_name + ' .confirmit-table .confirmit-abtn.multi').each(function (index) {
			var _selected = Math.floor((Math.random() * _rate) + 1);
			if (_selected == 1) {
				$('.questionarea').append('<br /><span>AUTO:MULTI</span>');
				$(this).click();
				autoSpecifyCoded($(this), __form_name);
			}
		});
	}
}
function popGridSingle(__form_name) {
	$('#fieldset_' + __form_name + ' .confirmit-grid tr').each(function (index) {
		var gridRow = $(this);
		var count = 0;
		var _selected = 0;
		if (objVisible(gridRow.find('input:radio:eq(0)'))) {
			count = gridRow.find('input:radio').length;
			_selected = Math.floor((Math.random() * count));
			gridRow.find('input:radio:eq(' + _selected + ')').click();
			autoSpecifyVerb($(this).parent(), __form_name);
		} else if (objVisible(gridRow.find('.confirmit-abtn:eq(0)'))) {
			count = gridRow.find('.confirmit-abtn').length;
			_selected = Math.floor((Math.random() * count));
			gridRow.find('.confirmit-abtn:eq(' + _selected + ')').click();
			autoSpecifyVerb($(this), __form_name);
		}
	});
}
function popGridMulti(__form_name, _rate) {
	$('#fieldset_' + __form_name + ' .confirmit-grid tr').each(function (index) {
		var gridRow = $(this);
		var _selected = 0;
		count = 0;
		if (objVisible(gridRow.find('input:checkbox:eq(0)'))) {
			gridRow.find('input:checkbox').each(function () {
				_selected = Math.floor((Math.random() * _rate) + 1);
				if (_selected == 1) {
					$(this).click();
					autoSpecifyVerb($(this).parent(), __form_name);
				}
			});
		} else if (objVisible(gridRow.find('.confirmit-abtn:has(input:checkbox):eq(0)'))) {
			gridRow.find('.confirmit-abtn').has('input:checkbox').each(function () {
				_selected = Math.floor((Math.random() * _rate) + 1);
				if (_selected == 1) {
					$(this).click();
					autoSpecifyVerb($(this), __form_name);
				}
			});
		}
	});
}
function popGridTextList(__form_name, _rate) {
	$('#fieldset_' + __form_name + ' .confirmit-grid tr').each(function (index) {
		var gridRow = $(this);
		var _selected = 0;
		count = 0;
		if (objVisible(gridRow.find('input:text:eq(0)'))) {
			gridRow.find('input:text').each(function () {
				_selected = Math.floor((Math.random() * _rate) + 1);
				if (_selected == 1) {
					autoSpecifyVerb($(this), __form_name);
				}
			});
		}
	});
}
function popOpen(__form_name) {
	if (objVisible($('#fieldset_' + __form_name + ' .open:eq(0)'))) {
		var __settings = fn_auto_settings(__form_name);
		var _sMin = __settings[3];
		var _sMax = __settings[4];
		var _sWithEmail = __settings[5];
		var _sWithDecimal = __settings[6];
		var _sWithInteger = __settings[7];
		var _sWithText = __settings[8];

		var others = [1, 2, 3, 4];
		if (_sWithEmail < 1)
			others.splice(others.indexOf(1), 1); //exclude 1
		if (_sWithDecimal < 1)
			others.splice(others.indexOf(2), 1); //exclude 2
		if (_sWithInteger < 1)
			others.splice(others.indexOf(3), 1); //exclude 3
		if (_sWithText < 1)
			others.splice(others.indexOf(4), 1); //exclude 4

		var other = others[Math.floor(Math.random() * others.length)];
		switch (other) {
		case 1:
			$('#fieldset_' + __form_name + ' .open').val('auto@pilot.com');
			break;
		case 2:
			$('#fieldset_' + __form_name + ' .open').val(Math.floor((Math.random() * _sMax) + _sMin) + 0.5);
			break;
		case 3:
			$('#fieldset_' + __form_name + ' .open').val(Math.floor((Math.random() * _sMax) + _sMin));
			break;
		default:
			$('#fieldset_' + __form_name + ' .open').val('AutoPilot' + Math.floor((Math.random() * 999) + 1));
		}
	}
}
function popNumeric(__form_name) {
	if (objVisible($('#fieldset_' + __form_name + ' .numeric:eq(0)'))) {
		var __settings = fn_auto_settings(__form_name);
		var _sMin = __settings[3];
		var _sMax = __settings[4];
		var _sWithDecimal = __settings[6];
		var _sWithInteger = __settings[7];

		var numerics = [1, 2];
		if (_sWithDecimal < 1)
			numerics.splice(numerics.indexOf(1), 1); //exclude 1
		if (_sWithInteger < 1)
			numerics.splice(numerics.indexOf(2), 1); //exclude 2
		var numeric = numerics[Math.floor(Math.random() * numerics.length)];
		switch (numeric) {
		case 1:
			$('#fieldset_' + __form_name + ' .numeric').val(Math.floor((Math.random() * _sMax) + _sMin) + 0.5);
			break;
		case 2:
			$('#fieldset_' + __form_name + ' .numeric').val(Math.floor((Math.random() * _sMax) + _sMin));
			break;
		}
	}
}
function popTextList(__form_name, _rate) {
	if (ObjVisible($('#fieldset_' + __form_name + ' .confirmit-other-input').not('.other').eq(0))) {
		var topOrderPriorityCheck = Math.floor((Math.random() * 10) + 0);
		var count = $('#fieldset_' + __form_name + ' .confirmit-other-input').not('.other').length;
		var _selected = Math.floor((Math.random() * count) + 0);
		if (topOrderPriorityCheck < 8) {
			$('#fieldset_' + __form_name + ' .confirmit-other-input').not('.other').each(function (index) {
				$('.questionarea').append('<br /><span>AUTO:OPEN/NUMERIC LIST (TOP ORDER)</span> ' + _selected + ' ' + other);
				if (index < _selected) {
					autoSpecifyVerb($(this), __form_name);
				}
			});
		} else {
			$('#fieldset_' + __form_name + ' .confirmit-other-input').not('.other').each(function (index) {
				_selected = Math.ceil((Math.random() * _rate) + 0);
				$('.questionarea').append('<br /><span>AUTO:OPEN/NUMERIC LIST</span> ' + _selected + ' ' + other);
				if (_selected == 1) {
					autoSpecifyVerb($(this), __form_name);
				}
			});
		}
	}
}
function popSlider(){
	if(ObjVisible($('#fieldset_' + __form_name + ' .confirmit-gridslider tr:eq(0)'))){
		$('#fieldset_' + __form_name + ' .confirmit-gridslider tr').each(function (index) {
			var gridRow = $(this);
			count = 0;
			gridRow.children('td:has(input:radio)').each(function (index3) {
				count++;
			});
			_selected = Math.floor((Math.random() * count));
			$(gridRow).children('td:has(input:radio)').each(function (index2) {
				if (_selected == index2) {
					$('.questionarea').prepend('<br /><span>AUTO:SLIDER ' + index + ' ' + index2 + ' ' + _selected + ' </span>');
					$(this).click();
					$(this).find('input').click();
					autoSpecifyCoded($(this), __form_name);
				}
			});
		});		
	}		
}
