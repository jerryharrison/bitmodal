/*************************************************************************************************************************/
/*************************************************************************************************************************/
/*************************************************************************************************************************/
/**
 * SqueezeBox - Expandable Lightbox
 *
 * Allows to open various content as modal,
 * centered and animated box.
 *
 * Dependencies: MooTools 1.2
 *
 * Inspired by
 *  ... Lokesh Dhakar	- The original Lightbox v2
 *
 * @version		1.1 rc4
 *
 * @license		MIT-style license
 * @author		Harald Kirschner <mail [at] digitarald.de>
 * @copyright	Author
 */

/*
 *	bitModal Is a simple to use, easy to style modal system that is built using framework-free minimal-javascript. Meaning it does not require use of mooTools, zepto, jQuery, or anyother javascript framework.
 *	Copyright (C) 2012  Jerry Harrison - bitModal.org - github.com/jerryharrison/bitmodal
 *
 *	This program is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 * 	(at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU General Public License for more details.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

function microAjax(url, callbackFunction) {
	
	this.bindFunction = function (caller, object) {
		return function() {
			return caller.apply(object, [object]);
		};
	};

	this.stateChange = function (object) {
		if (this.request.readyState==4)
			this.callbackFunction(this.request.responseText);
	};

	this.getRequest = function() {
		if (window.ActiveXObject)
			return new ActiveXObject('Microsoft.XMLHTTP');
		else if (window.XMLHttpRequest)
			return new XMLHttpRequest();
		return false;
	};

	this.postBody = (arguments[2] || "");

	this.callbackFunction=callbackFunction;
	this.url=url;
	this.request = this.getRequest();
	
	if(this.request) {
		var req = this.request;
		req.onreadystatechange = this.bindFunction(this.stateChange, this);

		if (this.postBody!=="") {
			req.open("POST", url, true);
			req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			req.setRequestHeader('Connection', 'close');
		} else {
			req.open("GET", url, true);
		}

		req.send(this.postBody);
	}
}

/*

	bitModal.createWithURL('/users/login/','usersLogin');

*/

var bitModal = {
	show: function(){

	},
	createWithURL: function(url, className, adjustModalToCenter, modalToClose){
		$.get(url, function(data) {
			this.createWithContent(data, className, adjustModalToCenter, modalToClose);
		});
	},
	createWithContent: function(data, className, adjustModalToCenter, modalToClose){

		// if (typeof className == 'undefined') {
		// 			className = 'classic';
		// 		}

		var modalID = Math.round(new Date().getTime() / 1000),
			amtOfModals = $('.whorlrModalWrapper').length,
			zIndexLvl = (amtOfModals * 10),
			zIndex1 = 1001 + zIndexLvl,
			zIndex2 = 1002 + zIndexLvl,
			$modal = $('<div id="Modal-' + modalID + '" class="whorlrModalWrapper"></div>'),
			$modalOverlay = $('<div id="ModalOverlay-' + modalID + '" class="whorlrModalOverlay"></div>'),
			$modalContentWrapper = $('<div class="whorlrModalContentWrapper"></div>'),
			$modalContent = $('<div class="modalContent"></div>'),
			$body = $("body"),
			$bodySection = $("body > section#Wrapper"),
			$html = $("html");

		// hide any extra spaces top and bottom and esstentially disable scrolling
		$html.css({'overflow': 'hidden'});
		$body.css({'overflow': 'hidden'});

		// we were adding the data to the $modalContent elem here. however, this was causing errors with the inclusion of that data into the DOM.
		// essentially because it was being inserted via .html() the js within that view was being wiped b/c it didn't exist within the dom itself.

		// add any styles from classes
	    $modalContentWrapper.addClass(className);

	    // append each over the elements to eachother and the body
		$modalContentWrapper.append($modalContent);
		$modalContentWrapper.css('display','block');
		$modal.append($modalContentWrapper);

		$modal.css({'display':'block','z-index':zIndex2});
		$bodySection.append($modal);

		$modalOverlay.css({'overflow':'hidden','display':'block','z-index':zIndex1});
		$bodySection.append($modalOverlay);

		// how many modals do we have open?
		// for every modal we have open we push the z-index up by a factor of 10, first starts at 1001 and 1002 (overlay and wrapper, respecfully)

		// let's center the modal.
		var $modalWidth = $('div#Modal-' + modalID + ' .whorlrModalContentWrapper').width();

	    if (typeof performCSSModal != 'string') {
			$('div#Modal-' + modalID + ' .whorlrModalContentWrapper').css({
				'top': '20px',
				'display': 'block',
			    'marginLeft': "-" + parseInt($modalWidth / 2) + "px",
			});
	    }

		if (modalToClose != undefined) {
			this.close(modalToClose);
		};

		// showing the modal and the content.
		$('div#Modal-' + modalID + ' .whorlrModalContentWrapper .modalContent').html(data); // clear all html in modal before we load new content

	},
	close: function($childElement){

		var $body = $("body"),
			$html = $("html"),
			$modals = [];

		if ($childElement == undefined) {

			$('.whorlrModalWrapper').each(function(){
				var modalID = $(this).attr('id');
				if (modalID != undefined) {
					$modals.push(modalID.replace('Modal-',''));
				};
			});

			$parentID = $modals[$modals.sort().length-1];

		} else if ($childElement == 'first') {

			$('.whorlrModalWrapper').each(function(){
				var modalID = $(this).attr('id');
				if (modalID != undefined) {
					$modals.push(modalID.replace('Modal-',''));
				};
			});

			$parentID = $modals[0];

		} else if ($childElement == 'last') {

			$('.whorlrModalWrapper').each(function(){
				var modalID = $(this).attr('id');
				if (modalID != undefined) {
					$modals.push(modalID.replace('Modal-',''));
				};
			});

			$parentID = $modals[$modals.sort().length-1];

		} else {

			var $parentID = getModalParent($childElement, 'whorlrModalWrapper');

		};


		$('div#Modal-' + $parentID).remove();
		$('div#ModalOverlay-' + $parentID).remove();

		$html.css({'overflow': 'auto'});
		$body.css({'overflow': 'auto'});

		$(document).unbind('keydown');
	},
};


function replaceModalContent(url, className, performCSSModal, $childElement) {

	$.get(url, function(data) {

		var $parentID = (typeof $childElement != 'string')? getModalParent($childElement, 'whorlrModalWrapper'):$childElement.replace('Modal-','');
		var $modalContentWrapper = $('div#Modal-' + $parentID + ' .whorlrModalContentWrapper'),
			$modalContent = $('div#Modal-' + $parentID + ' .whorlrModalContentWrapper .modalContent');

		// add any styles from classes
	    $modalContentWrapper.removeClass().addClass('whorlrModalContentWrapper ' + className);

		// let's center the modal.
	    if (typeof performCSSModal != 'string') {
	    	var $modalWidth = $('div#Modal-' + $parentID + ' .whorlrModalContentWrapper').width();

			$('div#Modal-' + $parentID + ' .whorlrModalContentWrapper').css({
				'top': '20px',
				'display': 'block',
			    'marginLeft': "-" + parseInt($modalWidth / 2) + "px",
			});
	    }

		// showing the modal and the content.
		$modalContent.html(data); // clear all html in modal before we load new content

	});

}



function getParents(o, tag) {
    var results = [];
    while ((o = o.parentNode) && o.tagName) {
        if (o.tagName.toLowerCase() == tag.toLowerCase()) {
            results.push(o);
        }
    }
    return(results);
}


function getModalParent(o, cName) {
    var result = '';
    // while allows us to climb through each of the parent nodes and find the modal with the className we give
    while (o = o.parentNode) {
        if (o.className == cName) {
            result = o.id.replace('Modal-','');
        }
    }
    return(result);
}


/*	END MODAL CODE	*/
/*************************************************************************************************************************/
/*************************************************************************************************************************/
/*************************************************************************************************************************/
