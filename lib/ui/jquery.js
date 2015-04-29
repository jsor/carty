'use strict';

module.exports = uiJquery;

var $ = require('jquery');

var _defaultOptions = {
    namespace: 'carty',
    numberFormatter: function(number) {
        return number;
    },
    currencyFormatter: function(number) {
        return number;
    }
};

var _inputSelector = 'input,select,textarea';
var _dataAttrPrefixLength = 'data-'.length;

function uiJquery(cart, options) {
    var _options = $.extend({}, _defaultOptions, options);

    function dataKey(prop) {
        return _options.namespace + '-' + prop;
    }

    function dataAttr(prop) {
        return 'data-' + dataKey(prop);
    }

    function dataSelector(prop) {
        return '[' + dataAttr(prop) + ']';
    }

    var _itemSelector = dataSelector('item');
    var _itemDataKey = dataKey('item');
    var _itemDataAttrPrefix = dataAttr('item-');
    var _itemVariantDataAttr = dataAttr('item-variant');
    var _itemVariantDataAttrPrefix = dataAttr('item-variant-');

    var _addDataKey = dataKey('add');
    var _addSelector = dataSelector('add');
    var _addButtonSelector = dataSelector('add') + ':not(' + _inputSelector + ')';
    var _addInputSelector = dataSelector('add') + _inputSelector;
    var _updateDataKey = dataKey('update');
    var _updateSelector = dataSelector('update');
    var _updateButtonSelector = dataSelector('update') + ':not(' + _inputSelector + ')';
    var _updateInputSelector = dataSelector('update') + _inputSelector;
    var _removeSelector = dataSelector('remove');
    var _removeDataKey = dataKey('remove');
    var _clearSelector = dataSelector('clear');

    function ensureObject(data) {
        return $.type(data) !== 'object' ? {} : data;
    }

    function setValue(el, value) {
        el
            .filter(_inputSelector)
            .val(value)
            .end()
            .filter('a')
            .attr('href', value)
            .end()
            .filter('img')
            .attr('src', value)
            .end()
            .not(_inputSelector)
            .not('img')
            .not('a')
            .text(value)
        ;
    }

    function getValue(el, dataKey) {
        return el.data(dataKey) // data- attribute
            || el.val() // form element
            || el.attr('href') // <a> element
            || el.attr('src') // <img> element
            || $.trim(el.text()) // html container element
            || null;
    }

    function collectItemData(el, elData) {
        var itemEl = el;

        var itemData = {};
        var itemVariants = {};
        var itemVariantsFound = false;

        function extract() {
            var el = $(this);

            if (el.is(':checkbox,:radio') && !el.is(':checked')) {
                return;
            }

            $.each(this.attributes, function() {
                if (this.name.indexOf(_itemDataAttrPrefix) < 0) {
                    return;
                }

                var name = el.attr('name');
                var val  = getValue(el, this.name.substr(_dataAttrPrefixLength));

                if (this.name.indexOf(_itemVariantDataAttr) > -1) {
                    if (name || this.name.indexOf(_itemVariantDataAttrPrefix) >= 0) {
                        itemVariants[name || this.name.substr(_itemVariantDataAttrPrefix.length)] = val;
                    } else {
                        $.extend(itemVariants, val);
                    }

                    itemVariantsFound = true;
                } else {
                    itemData[name || this.name.substr(_itemDataAttrPrefix.length)] = val;
                }
            });
        }

        if (!itemEl.is(_itemSelector)) {
            itemEl = el.closest(_itemSelector);
        }

        itemEl.each(extract);
        itemEl.find('*').each(extract);

        if (itemVariantsFound) {
            $.extend(itemData, {variant: itemVariants});
        }

        elData = ensureObject(elData);

        if (el.is(_inputSelector)) {
            var name = el.attr('name');

            if (name) {
                elData[name] = el.val();
            }
        }

        return $.extend(
            itemData,
            ensureObject(itemEl.data(_itemDataKey)),
            elData
        );
    }

    // ---

    var addHandler = function(e) {
        var el = $(e.target);

        if (el.is(_addSelector)) {
            cart.add(collectItemData(el, el.data(_addDataKey)));
        }
    };

    var updateHandler = function(e) {
        var el = $(e.target);

        if (el.is(_updateSelector)) {
            cart.update(collectItemData(el, el.data(_updateDataKey)));
        }
    };

    $(document)
        .on('click', _addButtonSelector, addHandler)
        .on('change', _addInputSelector, addHandler)
        .on('click', _updateButtonSelector, updateHandler)
        .on('change', _updateInputSelector, updateHandler)
        .on('click', _removeSelector, function(e) {
            var el = $(e.target);

            if (el.is(_removeSelector)) {
                cart.remove(collectItemData(el, el.data(_removeDataKey)));
            }
        })
        .on('click', _clearSelector, function() {
            cart.clear()
        })
    ;

    // ---

    function update() {
        $.each([
            'size',
            'quantity'
        ], function (i, prop) {
            setValue(
                $(dataSelector(prop)),
                _options.numberFormatter(cart[prop]())
            );
        });

        $.each([
            'subtotal',
            'shipping',
            'tax',
            'total'
        ], function (i, prop) {
            setValue(
                $(dataSelector(prop)),
                _options.currencyFormatter(cart[prop]())
            );
        });
    }

    $(function() {
        cart.ready(function() {
            update();
            cart.on('changed', update);
        });
    });

    return update;
}
