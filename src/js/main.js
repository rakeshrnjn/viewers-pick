var likedProducts = window.likedProducts || {};

/**
 *   @namespace: service
 *   @memberof: likedProducts
 *   @desc: For making AJAX requests
 */
likedProducts.service = (function(window, $, namespace) {
    'use strict';

    var _ajax;

    _ajax = function(url, method, params, success, error) {
        var ajaxMethod = method ? method : "GET",
            dataParam = params ? params : {};

        $.ajax({
            url: url,
            type: ajaxMethod,
            data: dataParam
        }).done(function(data) {
            if (typeof success === 'function') {
                success(data);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.info(errorThrown);

            if (typeof error === 'function') {
                error(jqXHR, textStatus, errorThrown);
            }
        });
    }

    return {
        ajax: _ajax
    }
}(this, jQuery, 'likedProducts'));

/**
 *   @namespace: view
 *   @memberof: likedProducts
 *   @desc: Handles the creation/interaction/updation of the UI elements
 */
likedProducts.view = (function(window, $, namespace) {
	var _init,
        _json,
        _createView,
        _draw,
        _attachListeners,
        _postSuccess,
        _postError;
		
	var template;
    var $gridContainer = $('.grid-container');
	
	//Initialize the view
	_init = function(data){
		_json = data;

        _createView();
	}
	
	//Initialize the creation of the view. The View of the product grid is loaded from a partial
    _createView = function() {
        //I have stored the HTML string in a partial as it makes the code cleaner and organized

        //Loading the HTML partial
        likedProducts.service.ajax('likedProducts.html', 'GET', {}, _draw, _onError);
    }

    _draw = function(response) {
        template = response;

        //Iterating through the product array of the JSON data
        _json.product.map(function(item,index){
            var $template = $(template);
            //Populate the relevant HTML elements using the JSON data
            $template.find('.product-name').text(item.name);
            $template.find('.product-image').text(item.image.url);
            $template.find('.product-likedCount').text(item.likedCount);
            $template.find('.product-dislikedCount').text(item.dislikedCount);
        });
    }

    _postSuccess = function(response) {

    }

    _postError = function(jqXHR, textStatus, errorThrown) {
        alert("Data Posted");
    }

    _onError = function(jqXHR, textStatus, errorThrown) {

    }
	
	return {
        init: _init
    }
	
}(this, jQuery, 'likedProducts'));

/**
 *   @namespace: main
 *   @memberof: likedProducts
 *   @desc: The main method of the application, ths is the entry point for the application
 */
likedProducts.main = (function(window, $, namespace) {
	'use strict';

    var _init,
        _loadData,
        _onSuccess,
        _onError,
        _data;
		
	//Load the data for building the grid
    _loadData = function() {
        akqa.service.ajax('/data/likedProductsList.json', 'GET', {}, _onSuccess, _onError);
    }
	
	//Initialize the view
    _onSuccess = function(response) {
        _data = response;
        akqa.view.init(_data);
    }
	
	_onError = function(jqXHR, textStatus, errorThrown) {

    }
	
	_init = function() {
        _loadData();
    }
	
	//Public API
    return {
        init: _init
    }
}(this, jQuery, 'likedProducts'));

likedProducts.main.init();