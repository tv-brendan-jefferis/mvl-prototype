import { variantExtractor, getSelectedOptionsFromVariant, validateCurrentSelection, validateOptionSets } from "./lib/variant-utils";

export default {
    model: {
        optionSets: [],
        variants: [],
        selectedOptions: {},
        selectedVariant: null,
        canBuyNow: false,
        ruleOutOfStock: "",
        ruleNullVariant: "",
        variantSectionVisible: false
    },

    actions(model) {

        function updateOptionSets(_model, currentDimension) {
            if (currentDimension) {
                const unavailableOptions = validateCurrentSelection(currentDimension, _model.selectedOptions, _model.variants);
                if (unavailableOptions.length > 0) {
                    for (let i = 0; i < unavailableOptions.length; i++) {
                        const set = _model.optionSets.find(s => s.optionName === unavailableOptions[i].name);
                        //set.optionValues.map(o => applyRules(o.name === unavailableOptions[i].value ? "disable" : "", 0));
                    }
                }
            }

            return validateOptionSets(_model.selectedOptions, _model.optionSets, _model.variants, _model.ruleOutOfStock);
        }

        return {
            importData(optionSets, variants, ruleOutOfStock, ruleNull, preselectOptionsOnLoad, preselectOutOfStock) {
                model.optionSets = optionSets;
                model.variants = variants;
                model.ruleOutOfStock = ruleOutOfStock;
                model.ruleNullVariant = ruleNull;
                model.selectedVariant = preselectOutOfStock
                    ? model.variants.find(v => v.quantity === 0)
                    : model.variants.find(v => v.quantity !== 0);
                model.selectedOptions = preselectOptionsOnLoad || preselectOutOfStock
                    ? getSelectedOptionsFromVariant(model.selectedVariant || model.variants[0])
                    : {};
                model.optionSets = updateOptionSets(model);
                model.canBuyNow = model.selectedVariant && model.selectedVariant.quantity > 0;
            },
            setSelectedOption(key, value) {
                model.selectedOptions[key] = value;
                model.optionSets = updateOptionSets(model, key);
                if (Object.keys(model.selectedOptions).length === model.variants[0].optionValues.length) {
                    model.selectedVariant = model.variants.find(variantExtractor(model.selectedOptions));
                    model.canBuyNow = model.selectedVariant && model.selectedVariant.quantity > 0;
                }
            },
            buyNow() {
                alert(`Congratulations, you fake bought \r\n${model.selectedVariant.sku}\r\n`);
            },
            toggleVariantSectionVisible() {
                model.variantSectionVisible = !model.variantSectionVisible;
            }
        }
    },

    view() {
        function renderSelectListItem(selectedOption, item) {
            return item.excluded
                ? ""
                : `
                    <option value="${item.name}" ${item.disabled ? "disabled" : ""} style="${item.greyedOut ? "color:graytext;": ""}${item.disabled ? "color:crimson;": ""}" ${selectedOption === item.name ? "selected" : ""}>${item.name} ${item.disabled ? "- unavailable" : ""}</option>
                `;
        }

        function renderOptionSet(selectedOptions, optionSet) {
            return `
                <label>${optionSet.optionName}</label>
                <select name="${optionSet.optionName}" data-change="setSelectedOption(${optionSet.optionName}, this.value)">
                    <option value="">-Select-</option>
                    ${optionSet.optionValues.length > 0 ? optionSet.optionValues.map(o => renderSelectListItem(selectedOptions[optionSet.optionName], o)) : ""}
                </select>
            `;
        }

        function renderVariant(variant) {
            return variant
                ? `
                    <li style="${variant.quantity === 0 ? "color:red;" : ""}">${variant.sku} <span>Qty: ${variant.quantity}</span></li>
                   `
                : "";
        }

        return {
            render(model, html) {
                return html`
                    <div>
                        <h2>Demo</h2>
                        <div class="option-sets">
                            ${model.optionSets.map(o => renderOptionSet(model.selectedOptions, o))}                        
                        </div>
                        <br>
                        <button data-click="buyNow" ${model.canBuyNow ? "" : "disabled"}>Buy Now</button>
                        <br>
                        <br>
                        <a href="#" data-click="toggleVariantSectionVisible" style="${model.variants.length === 0 ? "display:none;" : ""}">${model.variantSectionVisible ? `- Hide variants` : `+ Show variants`}</a>
                        <div style="${model.variantSectionVisible ? "" : "display:none;"}">
                            <div style="${model.variants.length === 0 ? "display:none;" : ""}">
                                <br>
                                <h4>All variants</h4>
                                <ul>
                                    ${model.variants.map(renderVariant)}
                                </ul>
                            </div>
                            <div style="${model.selectedVariant ? "" : "display: none;"}">
                                <h4>Selected variant</h4>
                                <p>${model.selectedVariant && model.selectedVariant.sku} <span>Qty: ${model.selectedVariant && model.selectedVariant.quantity}</span></p>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    }
}
