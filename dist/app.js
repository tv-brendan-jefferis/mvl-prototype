(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var comp = createCommonjsModule(function (module, exports) {
/* ____ ____ _  _ ___   
*  |___ [__] |\/| |--' . v1.2.0
* 
* A design pattern and micro-framework for creating UI components
*
* Copyright Brendan Jefferis and other contributors
* Released under the MIT license
* 
* Issues? Please visit https://github.com/brendan-jefferis/comp/issues
*
* Date: 2017-01-02T05:23:18.349Z 
*/
(function (global, factory) {
	module.exports = factory();
}(commonjsGlobal, (function () { 'use strict';

function inspectSyntax(str) {
    try {
        new Function(str);
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw new SyntaxError(e);
        }
    }
}

function getEventTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
}

/* eslint-disable no-nested-ternary */
var arr = [];
var charCodeCache = [];

var index = function (a, b) {
	if (a === b) {
		return 0;
	}

	var aLen = a.length;
	var bLen = b.length;

	if (aLen === 0) {
		return bLen;
	}

	if (bLen === 0) {
		return aLen;
	}

	var bCharCode;
	var ret;
	var tmp;
	var tmp2;
	var i = 0;
	var j = 0;

	while (i < aLen) {
		charCodeCache[i] = a.charCodeAt(i);
		arr[i] = ++i;
	}

	while (j < bLen) {
		bCharCode = b.charCodeAt(j);
		tmp = j++;
		ret = j;

		for (i = 0; i < aLen; i++) {
			tmp2 = bCharCode === charCodeCache[i] ? tmp : tmp + 1;
			tmp = arr[i];
			ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
		}
	}

	return ret;
};

var threshold = 3;

function suggestActions(str, component) {
    if (str == null) {
        throw new Error("suggestActions requires a string argument to use as a query");
    }

    if (component == null) {
        throw new Error("suggestActions requires a component to search for actions");
    }

    var suggestions = [];

    Object.keys(component).map(function (actionName) {
        var distance = index(str, actionName);
        if (distance > threshold) {
            return;
        }

        suggestions.push({ term: actionName, distance: distance });
    });

    return suggestions.sort(function (a, b) {
        return a.distance > b.distance;
    });
}

function registerEventDelegator(component) {
    var componentHtmlTarget = document.querySelector("[data-component=" + component.name + "]");
    if (componentHtmlTarget === null) {
        return component;
    }

    Object.keys(Event.prototype).map(function (ev, i) {
        if (i >= 10 && i <= 19) {
            componentHtmlTarget.addEventListener(ev.toLowerCase(), function (e) {
                return delegateEvent(e, component, componentHtmlTarget);
            });
        }
    }, this);

    return component;
}

function delegateEvent(e, component, componentHtmlTarget) {
    var target = getEventTarget(e);
    var action = getEventActionFromElement(e, target, componentHtmlTarget);
    if (action.name === "") {
        return;
    }

    if (component[action.name] == null) {
        var suggestions = suggestActions(action.name, component);
        var suggestionsMessage = suggestions.length ? "\r\n\r\nDid you mean\r\n\r\n" + suggestions.map(function (x) {
            return component.name + "." + x.term + "\n";
        }).join("") + "\r" : "";
        throw new Error("Could not find action " + action.name + " in component " + component.name + suggestionsMessage);
    }

    if (action.args === "") {
        component[action.name]();
    } else {
        component[action.name].apply(action, action.args);
    }
}

function bubbleUntilActionFound(event, element, root) {
    var actionStr = element.getAttribute("data-" + [event.type]) || "";
    if (actionStr !== "" || element === root) {
        try {
            inspectSyntax(actionStr, element);
        } catch (e) {
            var tempDiv = document.createElement("div");
            tempDiv.appendChild(element.cloneNode(false));
            throw new SyntaxError("\r\n\r\nElement: " + tempDiv.innerHTML + "\r\nEvent: data-" + [event.type] + "\r\nAction: " + actionStr + "\r\n\r\n" + e);
        }
        return {
            name: actionStr,
            element: element
        };
    }

    return bubbleUntilActionFound(event, element.parentNode, root);
}

function getEventActionFromElement(event, element, root) {
    var action = bubbleUntilActionFound(event, element, root);

    return {
        name: extractActionName(action.name),
        args: extractArguments(action.name, action.element)
    };
}

function extractActionName(str) {
    var nameResult = str.match(/[^(]*/);
    return nameResult ? nameResult[0] : "";
}

function extractArguments(str, target) {
    var args = /\(\s*([^)]+?)\s*\)/.exec(str);
    if (!args || args[1] == null) {
        return "";
    }

    args = args[1].split(/\s*,\s*/).map(function (arg) {
        var argList = arg.split(".");
        if (argList.length === 1 && argList.indexOf("this") === -1) {
            return arg;
        }

        var dataset = argList.indexOf("dataset") === 1 ? Object.assign({}, target.dataset) : null;

        return dataset ? dataset[argList[2]] : target[argList[1]];
    }, target);

    return args;
}

var compEvents = Object.freeze({
	registerEventDelegator: registerEventDelegator,
	delegateEvent: delegateEvent,
	bubbleUntilActionFound: bubbleUntilActionFound,
	getEventActionFromElement: getEventActionFromElement,
	extractActionName: extractActionName,
	extractArguments: extractArguments
});

var parser = new window.DOMParser();
var htmlType = 'text/html';
var xhtmlType = 'application/xhtml+xml';
var testCode = '<i></i>';
var documentRootName = 'HTML';
var supportsHTMLType = false;
var supportsXHTMLType = false;

// Check if browser supports text/html DOMParser
try {
  /* istanbul ignore next: Fails in older browsers */
  if (parser.parseFromString(testCode, htmlType)) supportsHTMLType = true;
} catch (err) {}

try {
  /* istanbul ignore next: Only used in ie9 */
  if (!supportsHTMLType && parser.parseFromString(testCode, xhtmlType)) supportsXHTMLType = true;
} catch (err) {}

/**
 * Returns the results of a DOMParser as an HTMLElement.
 * (Shims for older browser and IE9).
 */
var parseHtml = supportsHTMLType
  ? function parseHTML (markup, rootName) {
    var doc = parser.parseFromString(markup, htmlType);
    return rootName === documentRootName
      ? doc.documentElement
      : doc.body.firstChild
  }
  /* istanbul ignore next: Only used in older browsers */
  : function parseHTML (markup, rootName) {
    var isRoot = rootName === documentRootName;

    // Special case for ie9 (documentElement.innerHTML not supported).
    if (supportsXHTMLType && isRoot) {
      return parser.parseFromString(markup, xhtmlType).documentElement
    }

    // Fallback to innerHTML for other older browsers.
    var doc = document.implementation.createHTMLDocument('');
    if (isRoot) {
      doc.documentElement.innerHTML = markup;
      return doc.documentElement
    } else {
      doc.body.innerHTML = markup;
      return doc.body.firstChild
    }
  };

var parseHTML = parseHtml;
var KEY_PREFIX = '_set-dom-';
var NODE_INDEX = KEY_PREFIX + 'index';
var NODE_MOUNTED = KEY_PREFIX + 'mounted';
var ELEMENT_TYPE = window.Node.ELEMENT_NODE;
var DOCUMENT_TYPE = window.Node.DOCUMENT_NODE;
setDOM.KEY = 'data-key';
setDOM.IGNORE = 'data-ignore';
setDOM.CHECKSUM = 'data-checksum';

var index$1 = setDOM;

/**
 * @description
 * Updates existing dom to match a new dom.
 *
 * @param {Node} prev - The html entity to update.
 * @param {String|Node} next - The updated html(entity).
 */
function setDOM (prev, next) {
  // Ensure a realish dom node is provided.
  assert(prev && prev.nodeType, 'You must provide a valid node to update.');

  // Alias document element with document.
  if (prev.nodeType === DOCUMENT_TYPE) prev = prev.documentElement;

  // If a string was provided we will parse it as dom.
  if (typeof next === 'string') next = parseHTML(next, prev.nodeName);

  // Update the node.
  setNode(prev, next);

  // Trigger mount events on initial set.
  if (!prev[NODE_MOUNTED]) {
    prev[NODE_MOUNTED] = true;
    mount(prev);
  }
}

/**
 * @private
 * @description
 * Updates a specific htmlNode and does whatever it takes to convert it to another one.
 *
 * @param {Node} prev - The previous HTMLNode.
 * @param {Node} next - The updated HTMLNode.
 */
function setNode (prev, next) {
  if (prev.nodeType === next.nodeType) {
    // Handle regular element node updates.
    if (prev.nodeType === ELEMENT_TYPE) {
      // Ignore elements if their checksum matches.
      if (getCheckSum(prev) === getCheckSum(next)) return
      // Ignore elements that explicity choose not to be diffed.
      if (isIgnored(prev) && isIgnored(next)) return

      // Update all children (and subchildren).
      setChildNodes(prev, prev.childNodes, next.childNodes);

      // Update the elements attributes / tagName.
      if (prev.nodeName === next.nodeName) {
        // If we have the same nodename then we can directly update the attributes.
        setAttributes(prev, prev.attributes, next.attributes);
      } else {
        // Otherwise clone the new node to use as the existing node.
        var newPrev = next.cloneNode();
        // Copy over all existing children from the original node.
        while (prev.firstChild) newPrev.appendChild(prev.firstChild);
        // Replace the original node with the new one with the right tag.
        prev.parentNode.replaceChild(newPrev, prev);
      }
    } else {
      // Handle other types of node updates (text/comments/etc).
      // If both are the same type of node we can update directly.
      if (prev.nodeValue !== next.nodeValue) {
        prev.nodeValue = next.nodeValue;
      }
    }
  } else {
    // we have to replace the node.
    dismount(prev);
    prev.parentNode.replaceChild(next, prev);
    mount(next);
  }
}

/**
 * @private
 * @description
 * Utility that will update one list of attributes to match another.
 *
 * @param {Node} parent - The current parentNode being updated.
 * @param {NamedNodeMap} prev - The previous attributes.
 * @param {NamedNodeMap} next - The updated attributes.
 */
function setAttributes (parent, prev, next) {
  var i, a, b, ns, name;

  // Remove old attributes.
  for (i = prev.length; i--;) {
    a = prev[i];
    ns = a.namespaceURI;
    name = a.localName;
    b = next.getNamedItemNS(ns, name);
    if (!b) prev.removeNamedItemNS(ns, name);
  }

  // Set new attributes.
  for (i = next.length; i--;) {
    a = next[i];
    ns = a.namespaceURI;
    name = a.localName;
    b = prev.getNamedItemNS(ns, name);
    if (!b) {
      // Add a new attribute.
      next.removeNamedItemNS(ns, name);
      prev.setNamedItemNS(a);
    } else if (b.value !== a.value) {
      // Update existing attribute.
      b.value = a.value;
    }
  }
}

/**
 * @private
 * @description
 * Utility that will update one list of childNodes to match another.
 *
 * @param {Node} parent - The current parentNode being updated.
 * @param {NodeList} prevChildNodes - The previous children.
 * @param {NodeList} nextChildNodes - The updated children.
 */
function setChildNodes (parent, prevChildNodes, nextChildNodes) {
  var key, a, b, newPosition, nextEl;

  // Convert nodelists into a usuable map.
  var prev = keyNodes(prevChildNodes);
  var next = keyNodes(nextChildNodes);

  // Remove old nodes.
  for (key in prev) {
    if (next[key]) continue
    // Trigger custom dismount event.
    dismount(prev[key]);
    // Remove child from dom.
    parent.removeChild(prev[key]);
  }

  // Set new nodes.
  for (key in next) {
    a = prev[key];
    b = next[key];
    // Extract the position of the new node.
    newPosition = b[NODE_INDEX];

    if (a) {
      // Update an existing node.
      setNode(a, b);
      // Check if the node has moved in the tree.
      if (a[NODE_INDEX] === newPosition) continue
      // Get the current element at the new position.
      /* istanbul ignore next */
      nextEl = prevChildNodes[newPosition] || null; // TODO: figure out if || null is needed.
      // Check if the node has already been properly positioned.
      if (nextEl === a) continue
      // Reposition node.
      parent.insertBefore(a, nextEl);
    } else {
      // Get the current element at the new position.
      nextEl = prevChildNodes[newPosition] || null;
      // Append the new node at the correct position.
      parent.insertBefore(b, nextEl);
      // Trigger custom mounted event.
      mount(b);
    }
  }
}

/**
 * @private
 * @description
 * Converts a nodelist into a keyed map.
 * This is used for diffing while keeping elements with 'data-key' or 'id' if possible.
 *
 * @param {NodeList} childNodes - The childNodes to convert.
 * @return {Object}
 */
function keyNodes (childNodes) {
  var result = {};
  var len = childNodes.length;
  var el;

  for (var i = 0; i < len; i++) {
    el = childNodes[i];
    el[NODE_INDEX] = i;
    result[getKey(el) || i] = el;
  }

  return result
}

/**
 * @private
 * @description
 * Utility to try to pull a key out of an element.
 * Uses 'data-key' if possible and falls back to 'id'.
 *
 * @param {Node} node - The node to get the key for.
 * @return {String}
 */
function getKey (node) {
  if (node.nodeType !== ELEMENT_TYPE) return
  var key = node.getAttribute(setDOM.KEY) || node.id;
  if (key) key = KEY_PREFIX + key;
  return key && KEY_PREFIX + key
}

/**
 * @private
 * @description
 * Utility to try to pull a checksum attribute from an element.
 * Uses 'data-checksum' or user specified checksum property.
 *
 * @param {Node} node - The node to get the checksum for.
 * @return {String|NaN}
 */
function getCheckSum (node) {
  return node.getAttribute(setDOM.CHECKSUM) || NaN
}

/**
 * @private
 * @description
 * Utility to try to check if an element should be ignored by the algorithm.
 * Uses 'data-ignore' or user specified ignore property.
 *
 * @param {Node} node - The node to check if it should be ignored.
 * @return {Boolean}
 */
function isIgnored (node) {
  return node.getAttribute(setDOM.IGNORE) != null
}

/**
 * Recursively trigger a mount event for a node and it's children.
 *
 * @param {Node} node - the initial node to be mounted.
 */
function mount (node) {
  // Trigger mount event for this element if it has a key.
  if (getKey(node)) dispatch(node, 'mount');

  // Mount all children.
  var child = node.firstChild;
  while (child) {
    mount(child);
    child = child.nextSibling;
  }
}

/**
 * Recursively trigger a dismount event for a node and it's children.
 *
 * @param {Node} node - the initial node to be dismounted.
 */
function dismount (node) {
  // Dismount all children.
  var child = node.firstChild;
  while (child) {
    dismount(child);
    child = child.nextSibling;
  }

  // Trigger dismount event for this element if it has a key.
  if (getKey(node)) dispatch(node, 'dismount');
}

/**
 * @private
 * @description
 * Create and dispatch a custom event.
 *
 * @param {Node} el - the node to dispatch the event for.
 * @param {String} type - the name of the event.
 */
function dispatch (el, type) {
  var e = document.createEvent('Event');
  var prop = { value: el };
  e.initEvent(type, false, false);
  Object.defineProperty(e, 'target', prop);
  Object.defineProperty(e, 'srcElement', prop);
  el.dispatchEvent(e);
}

/**
 * @private
 * @description
 * Confirm that a value is truthy, throws an error message otherwise.
 *
 * @param {*} val - the val to test.
 * @param {String} msg - the error message on failure.
 * @throws Error
 */
function assert (val, msg) {
  if (!val) throw new Error('set-dom: ' + msg)
}

function unwrapExports$$1 (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule$$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index$3 = createCommonjsModule$$1(function (module, exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var chars={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#39;","`":"&#96;"};var re=new RegExp(Object.keys(chars).join("|"),"g");exports["default"]=function(){var str=arguments.length<=0||arguments[0]===undefined?"":arguments[0];return String(str).replace(re,function(match){return chars[match]})};module.exports=exports["default"];
});

var index$2 = createCommonjsModule$$1(function (module, exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:true});function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var _htmlEs6cape=index$3;var _htmlEs6cape2=_interopRequireDefault(_htmlEs6cape);exports["default"]=function(literals){for(var _len=arguments.length,substs=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){substs[_key-1]=arguments[_key];}return literals.raw.reduce(function(acc,lit,i){var subst=substs[i-1];if(Array.isArray(subst)){subst=subst.join("");}else{subst=(0,_htmlEs6cape2["default"])(subst);}return acc+subst+lit})};module.exports=exports["default"];
});

var html = unwrapExports$$1(index$2);

var components = {};

function componentize(name, actions, render, model) {
    render(model);
    var component = {};
    Object.keys(actions).map(function (action) {
        component[action] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var returnValue = actions[action].apply(actions, args);

            if (returnValue && returnValue.then) {
                handlePromise(returnValue, render);
            }
            render(model);
        };
    }, this);
    component.name = name;
    component.get = function (prop) {
        return model[prop];
    };
    return component;
}

function handlePromise(promise, render) {
    promise.then(function (updatedModel) {
        if (updatedModel == null) {
            throw new Error("No model received: aborting render");
        }
        render(updatedModel);
    }).catch(function (err) {
        if (typeof err === "string") {
            console.error(err);
        } else {
            console.error("Error unhandled by component. Add a catch handler to your AJAX method.");
        }
    });
}

function create(name, actions, view, model) {
    if (name == null || name === "") {
        throw new Error("Your component needs a name");
    }

    if (actions == null) {
        var example = "// It must be a function that takes a model and returns an object of functions, e.g.\r\n\r\nYourComponent.Actions = function (model) {\r\n    return {\r\n        sayHello: function () { console.log('Hi.'); },\r\n        greet: function (name) { console.log('Hello, ' + name); }\r\n    }\r\n}";
        throw new Error(name + " needs some actions! Here's an example of an Actions function:\r\n\r\n" + example + "\r\n\r\n");
    }

    var _view = view && view();
    var viewInit = _view && _view.init ? _view.init : function () {};
    var viewRender = _view && _view.render ? function (_model) {
        var htmlString = _view.render(_model, html);
        if (typeof document !== "undefined" && htmlString) {
            var target = document.querySelector("[data-component=" + name + "]");
            if (target) {
                if (target.innerHTML === "") {
                    target.innerHTML = htmlString;
                } else {
                    index$1(target.firstElementChild, htmlString);
                }
            }
        }
    } : function () {};

    var component = componentize(name, actions(model), viewRender, model);
    components[name] = component;

    if (typeof document !== "undefined" && typeof compEvents !== "undefined") {
        component = registerEventDelegator(component);
    }

    viewInit(component, model);

    return component;
}

var comp = {
    components: components,
    create: create
};

return comp;

})));
});

var comp$1 = unwrapExports(comp);

var uniqueRandoms = function (count, max) {
    var randoms = [];
    while (randoms.length !== count) {
        var rand = Math.floor(Math.random() * max);
        if (randoms.indexOf(rand) === -1) {
            randoms.push(rand);
        }
    }
    return randoms;
};

function optionValues(o) {
    return {
        name: o.name,
        value: o.value
    };
}

function setRandomOutOfStock(count, variants) {
    var randoms = uniqueRandoms(count, variants.length);
    randoms.map(function (i) {
        variants[i].quantity = 0;
    });
    return variants;
}

function setRandomNull(count, variants) {
    var randoms = uniqueRandoms(count, variants.length);
    variants = variants.filter(function (v, i) {
        return randoms.indexOf(i) === -1;
    });
    return variants;
}

var variantGenerator = function (options) {
    var randomSamples = [];
    var variants = [];
    var counter = 0;
    var usedSkus = {};
    var optionSets = [];

    var _loop = function _loop(i) {
        var set = options.optionSets[i];
        var randoms = uniqueRandoms(set.count, set.optionValues.length);
        var values = randoms.map(function (i) {
            return set.optionValues[i];
        });
        optionSets.push({
            count: set.count,
            nullCount: set.nullCount,
            oosCount: set.oosCount,
            optionName: set.optionName,
            optionValues: values
        });
    };

    for (var i = 0; i < options.optionSets.length; i++) {
        _loop(i);
    }

    for (var i = 0; i < 5000; i++) {
        randomSamples.push({
            sku: '',
            optionValues: [],
            price: parseFloat((10 + Math.random() * 10).toFixed(2)),
            quantity: 1 + Math.floor(Math.random() * 30)
        });

        for (var j = 0; j < optionSets.length; j++) {
            var random = Math.floor(Math.random() * optionSets[j].optionValues.length);
            var neo = optionSets[j].optionValues[random];

            randomSamples[i].optionValues.push({
                name: optionSets[j].optionName,
                value: neo
            });

            randomSamples[i].sku += neo.replace(" ", "_") + '-';
        }

        if (!usedSkus[randomSamples[i].sku] && counter < options.variantCount) {
            var v = randomSamples[i];
            variants.push({
                sku: v.sku,
                price: v.price,
                quantity: v.quantity,
                optionValues: v.optionValues.map(optionValues)
            });

            usedSkus[randomSamples[i].sku] = true;
            counter++;
        }
    }

    if (options.oosCount > 0) {
        variants = setRandomOutOfStock(options.oosCount, variants);
    }

    if (options.nullCount > 0) {
        variants = setRandomNull(options.nullCount, variants);
    }

    var _loop2 = function _loop2(_i) {
        var set = optionSets[_i];
        if (set.nullCount > 0) {
            (function () {
                var randoms = uniqueRandoms(set.nullCount, set.optionValues.length);
                var nullOptions = randoms.map(function (i) {
                    return set.optionValues[i];
                });
                variants = variants.filter(function (v) {
                    var option = v.optionValues.find(function (o) {
                        return o.name === set.optionName;
                    });
                    return nullOptions.indexOf(option.value) === -1;
                });
            })();
        }
    };

    for (var _i = 0; _i < optionSets.length; _i++) {
        _loop2(_i);
    }

    var _loop3 = function _loop3(_i2) {
        var set = optionSets[_i2];
        if (set.oosCount > 0) {
            (function () {
                var randoms = uniqueRandoms(set.oosCount, set.optionValues.length);
                var oosOptions = randoms.map(function (i) {
                    return set.optionValues[i];
                });
                variants.map(function (v) {
                    var option = v.optionValues.find(function (o) {
                        return o.name === set.optionName;
                    });
                    if (oosOptions.indexOf(option.value) !== -1) {
                        v.quantity = 0;
                    }
                });
            })();
        }
    };

    for (var _i2 = 0; _i2 < optionSets.length; _i2++) {
        _loop3(_i2);
    }

    return {
        optionSets: optionSets,
        variants: variants
    };
};

var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var _templateObject = taggedTemplateLiteral(["\n                    <div>\n                        <a href=\"#\" data-click=\"toggleSectionVisible\">", "</a>\n                        \n                        <div style=\"", "\">\n                            <h2>Data</h2>\n                            <div class=\"option-sets\">\n                                ", "\n                            </div>\n                            <br>\n                            <p>\n                                <label>Variant count</label>\n                                <input data-change=\"updateVariantCount(this.value)\" type=\"number\" value=\"", "\" min=\"0\" max=\"150\">\n                            </p>\n                            <p>\n                                <label>Random out of stock variants</label>\n                                <input data-change=\"updateOosCount(this.value)\" type=\"number\" value=\"", "\" min=\"0\" max=\"", "\">\n                            </p>\n                            <p>\n                                <label>Random null variants</label>\n                                <input data-change=\"updateNullCount(this.value)\" type=\"number\" value=\"", "\" min=\"0\" max=\"", "\">\n                            </p>\n                            <hr>\n                            <h2>Rules</h2>\n                            <div class=\"option-sets\">\n                                <div class=\"option-set\">\n                                    <h4>Out of stock</h4>\n                                    ", "\n                                </div>\n                                <div class=\"option-set\">\n                                    <h4>Null variant</h4>\n                                    ", "\n                                </div>\n                            </div>\n                            <hr>\n                            <button data-click=\"generateData\" type=\"button\">Generate data</button>\n                        </div>\n                    </div>\n\t\t\t\t"], ["\n                    <div>\n                        <a href=\"#\" data-click=\"toggleSectionVisible\">", "</a>\n                        \n                        <div style=\"", "\">\n                            <h2>Data</h2>\n                            <div class=\"option-sets\">\n                                ", "\n                            </div>\n                            <br>\n                            <p>\n                                <label>Variant count</label>\n                                <input data-change=\"updateVariantCount(this.value)\" type=\"number\" value=\"", "\" min=\"0\" max=\"150\">\n                            </p>\n                            <p>\n                                <label>Random out of stock variants</label>\n                                <input data-change=\"updateOosCount(this.value)\" type=\"number\" value=\"", "\" min=\"0\" max=\"", "\">\n                            </p>\n                            <p>\n                                <label>Random null variants</label>\n                                <input data-change=\"updateNullCount(this.value)\" type=\"number\" value=\"", "\" min=\"0\" max=\"", "\">\n                            </p>\n                            <hr>\n                            <h2>Rules</h2>\n                            <div class=\"option-sets\">\n                                <div class=\"option-set\">\n                                    <h4>Out of stock</h4>\n                                    ", "\n                                </div>\n                                <div class=\"option-set\">\n                                    <h4>Null variant</h4>\n                                    ", "\n                                </div>\n                            </div>\n                            <hr>\n                            <button data-click=\"generateData\" type=\"button\">Generate data</button>\n                        </div>\n                    </div>\n\t\t\t\t"]);

var configData = {

    model: {
        sectionVisible: true,
        optionSets: [{ optionName: "Colour", count: 3, nullCount: 0, oosCount: 0, optionValues: ["white", "silver", "gray", "black", "navy", "blue", "cerulean", "sky blue", "turquoise", "azure", "teal", "cyan", "green", "lime", "chartreuse", "olive", "yellow", "gold", "amber", "orange", "brown", "red", "maroon", "rose", "pink", "magenta", "purple", "indigo", "violet", "plum"] }, { optionName: "Size", count: 3, nullCount: 0, oosCount: 0, optionValues: ["3XS", "2XS", "XS", "M", "L", "XL", "2XL", "3L", "4XL", "5XL", "6XL", "000", "00", "0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32"] }, { optionName: "Logo", count: 3, nullCount: 0, oosCount: 0, optionValues: ["Boston Bruins", "Buffalo Sabres", "Detroit Red Wings", "Florida Panthers", "Montreal Canadiens", "Ottawa Senators", "Tampa Bay Lightning", "Toronto Maple Leafs", "Carolina Hurricanes", "Columbus Blue Jackets", "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", "Pittsburgh Penguins", "Washington Capitals", "Anaheim Ducks", "Arizona Coyotes", "Calgary Flames", "Edmonton Oilers", "Los Angeles Kings", "San Jose Sharks", "Vancouver Canucks", "Chicago Blackhawks", "Colorado Avalanche", "Dallas Stars", "Minnesota Wild", "Nashville Predators", "St. Louis Blues", "Winnipeg Jets"] }, { optionName: "Fabric", count: 0, nullCount: 0, oosCount: 0, optionValues: ["Cotton", "Leather", "Canvas", "Sack-cloth", "Denim", "Satin", "Silk", "Suede", "Crushed velvet", "Velour", "Fishnet", "Flannel", "Wool", "Cheesecloth", "Cashmere", "Gingham", "Horsehair", "Lambswool", "Possum fur", "Feathers", "Moleskin", "Nylon", "Polyester", "Lace", "Ultrasuede", "Wolf pelt", "Spider silk", "Vegan leather", "PVC", "Twill"] }, { optionName: "Gull", count: 0, nullCount: 0, oosCount: 0, optionValues: ["Pacific gull", "Belcher gull", "Olror gull", "Black-tailed gull", "Heermann gull", "Common gull", "Ring-billed gull", "California gull", "Great black-backed gull", "Kelp gull", "Cape gull", "Glaucous-winged gull", "Western gull", "Yellow-footed gull", "Glaucous gull", "Iceland gull", "Kumlien gull", "Thayer gull", "European herring gull", "American herring gull", "Caspian gull", "Yellow-legged gull", "East Siberian herring gull", "Armenian gull", "Slaty-backed gull", "Lesser black-backed gull", "Heuglin gull", "Mediterranean gull", "White-eyed gull", "Sooty gull"] }],
        variantCount: 5,
        oosCount: 1,
        nullCount: 0,
        variants: [],
        rulesList: ["grey-out", "disable", "exclude"],
        ruleOutOfStock: "grey-out",
        ruleNullVariant: "grey-out"
    },

    actions: function actions(model) {

        function optionValueToSelectListItem(optionSet) {
            var optionValues = [];

            for (var i = 0; i < optionSet.optionValues.length; i++) {
                optionValues.push({
                    name: optionSet.optionValues[i]
                });
            }

            return {
                optionName: optionSet.optionName,
                optionValues: optionValues
            };
        }

        return {
            toggleSectionVisible: function toggleSectionVisible() {
                model.sectionVisible = !model.sectionVisible;
            },
            updateOptionSetCount: function updateOptionSetCount(optionName, count) {
                model.optionSets.map(function (x) {
                    if (x.optionName === optionName) {
                        x.count = parseInt(count, 10);
                    }
                });
            },
            updateOptionSetOosCount: function updateOptionSetOosCount(optionName, count) {
                model.optionSets.map(function (x) {
                    if (x.optionName === optionName) {
                        x.oosCount = parseInt(count, 10);
                    }
                });
            },
            updateOptionSetNullCount: function updateOptionSetNullCount(optionName, count) {
                model.optionSets.map(function (x) {
                    if (x.optionName === optionName) {
                        x.nullCount = parseInt(count, 10);
                    }
                });
            },
            updateRule: function updateRule(ruleName, value) {
                model[ruleName] = value;
            },
            updateVariantCount: function updateVariantCount(val) {
                model.variantCount = parseInt(val, 10);
            },
            updateOosCount: function updateOosCount(val) {
                var count = parseInt(val, 10);
                model.oosCount = count <= model.variantCount ? count : model.variantCount;
            },
            updateNullCount: function updateNullCount(val) {
                var count = parseInt(val, 10);
                model.nullCount = count <= model.variantCount ? count : model.variantCount;
            },
            generateData: function generateData() {
                var options = Object.assign({}, model);
                options.optionSets = model.optionSets.filter(function (x) {
                    return x.count > 0;
                });
                var data = variantGenerator(options);
                model.variants = data.variants;
                var optionSets = data.optionSets.map(optionValueToSelectListItem);
                comp$1.components.demo.importData(optionSets, model.variants, model.ruleOutOfStock, model.ruleNullVariant);
            }
        };
    },
    view: function view() {

        function renderOptionSet(optionSet) {
            return "\n                <div class=\"option-set\">\n                    <h4>" + optionSet.optionName + " options</h4>\n                    <p>\n                        <label>Count</label>\n                        <input data-change=\"updateOptionSetCount(" + optionSet.optionName + ", this.value)\" type=\"number\" value=\"" + optionSet.count + "\" min=\"0\" max=\"30\">\n                    </p>\n                    <p>\n                        <label>Out of stock</label>\n                        <input data-change=\"updateOptionSetOosCount(" + optionSet.optionName + ", this.value)\" type=\"number\" value=\"" + optionSet.oosCount + "\" min=\"0\" max=\"30\">\n                    </p>\n                    <p>\n                        <label>Null</label>\n                        <input data-change=\"updateOptionSetNullCount(" + optionSet.optionName + ", this.value)\" type=\"number\" value=\"" + optionSet.nullCount + "\" min=\"0\" max=\"30\">\n                    </p>\n                </div>\n            ";
        }

        function renderRadioButtons(listName, item, defaultValue) {
            return "\n\t            <input data-change=\"updateRule(this.name, this.value)\" name=\"" + listName + "\" value=\"" + item + "\" type=\"radio\" id=\"" + listName + "-" + item + "-radio\" " + (item === defaultValue ? "checked" : "") + "/>\n\t            <label for=\"" + listName + "-" + item + "-radio\">" + item + "</label>\n            ";
        }

        return {
            render: function render(model, html) {
                return html(_templateObject, model.sectionVisible ? "- Hide data options" : "+ Show data options", model.sectionVisible ? "" : "display: none", model.optionSets.map(renderOptionSet), model.variantCount, model.oosCount, model.variantCount, model.nullCount, model.variantCount, model.rulesList.map(function (x) {
                    return renderRadioButtons("ruleOutOfStock", x, model.ruleOutOfStock);
                }), model.rulesList.map(function (x) {
                    return renderRadioButtons("ruleNullVariant", x, model.ruleNullVariant);
                }));
            }
        };
    }
};

var _templateObject$1 = taggedTemplateLiteral(["\n                    <div>\n                        <h2>Demo</h2>\n                        <div class=\"option-sets\">\n                            ", "                        \n                        </div>\n                        <br>\n                        <button ", ">Buy Now</button>\n                        <div style=\"", "\">\n                            <br>\n                            <h4>All variants</h4>\n                            <ul>\n                                ", "\n                            </ul>\n                        </div>\n                    </div>\n                "], ["\n                    <div>\n                        <h2>Demo</h2>\n                        <div class=\"option-sets\">\n                            ", "                        \n                        </div>\n                        <br>\n                        <button ", ">Buy Now</button>\n                        <div style=\"", "\">\n                            <br>\n                            <h4>All variants</h4>\n                            <ul>\n                                ", "\n                            </ul>\n                        </div>\n                    </div>\n                "]);

var demo = {

    model: {
        optionSets: [],
        variants: [],
        selectedOptions: {},
        selectedVariant: null,
        canBuyNow: false,
        ruleOutOfStock: "",
        ruleNullVariant: ""
    },

    actions: function actions(model) {

        function extractVariant() {}

        return {
            importData: function importData(optionSets, variants, ruleOutOfStock, ruleNull) {
                model.optionSets = optionSets;
                model.variants = variants;
                model.ruleOutOfStock = ruleOutOfStock;
                model.ruleNullVariant = ruleNull;
            },
            selectSelectedOption: function selectSelectedOption(key, value) {
                model.selectedOptions[key] = value;
                model.selectedVariant = extractVariant;
            }
        };
    },
    view: function view() {

        function renderSelectListItem(item) {
            return item.excluded ? "" : "\n                    <option value=\"" + item.name + "\" " + (item.disabled ? "disabled" : "") + " style=\"" + (item.greyedOut ? "color:graytext;" : "") + (item.disabled ? "color:crimson;" : "") + "\">" + item.name + " " + (item.disabled ? "- out of stock" : "") + "</option>\n                ";
        }

        function renderOptionSet(optionSet) {
            return "\n                <label>" + optionSet.optionName + "</label>\n                <select name=\"" + optionSet.optionName + "\" data-change=\"selectSelectedOption(" + optionSet.optionName + ", this.value)\">\n                    <option value=\"null\">-Select-</option>\n                    " + (optionSet.optionValues.length > 0 ? optionSet.optionValues.map(renderSelectListItem) : "") + "\n                </select>\n            ";
        }

        function renderVariant(variant) {
            return variant ? "\n                    <li style=\"" + (variant.quantity === 0 ? "color:red;" : "") + "\">" + variant.sku + " <span>Qty: " + variant.quantity + "</span></li>\n                   " : "";
        }

        return {
            render: function render(model, html) {
                return html(_templateObject$1, model.optionSets.map(renderOptionSet), model.canBuyNow ? "" : "disabled", model.variants.length === 0 ? "display:none;" : "", model.variants.map(renderVariant));
            }
        };
    }
};

function app() {
	comp$1.create("configData", configData.actions, configData.view, configData.model);
	comp$1.create("demo", demo.actions, demo.view, demo.model);
}

app();

}());
//# sourceMappingURL=app.js.map
