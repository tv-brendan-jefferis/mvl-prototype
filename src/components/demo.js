export default {

    model: {
        optionSets: [],
        variants: [],
        selectedOptions: {},
        selectedVariant: null,
        canBuyNow: false,
        ruleOutOfStock: "",
        ruleNullVariant: ""
    },

    actions(model) {

        function variantExtractor(selectedOptions) {
            const propList = Object.keys(selectedOptions);
            return variant => {
                return propList.map(optionName => { return variant.optionValues.find(x => x.name === optionName).value === selectedOptions[optionName]; }).every(x => x === true);
            }
        }

        function getSelectedOptionsFromVariant(variant) {
            let options = {};
            variant.optionValues.map(function (x) {
                this[x.name] = x.value;
            }, options);

            return options;
        }

        function applyRules(ruleSet, option) {
            switch(ruleSet) {
                case "grey-out":
                    option.greyedOut = true;
                    option.disabled = false;
                    option.excluded = false;
                    break;

                case "disable":
                    option.greyedOut = false;
                    option.disabled = true;
                    option.excluded = false;
                    break;

                case "exclude":
                    option.greyedOut = false;
                    option.disabled = false;
                    option.excluded = true;
                    break;

                default:
                    break;
            }
            return option;
        }

        return {
            importData(optionSets, variants, ruleOutOfStock, ruleNull, preselectOptionsOnLoad, preselectOutOfStock) {
                model.optionSets = optionSets;
                model.variants = variants;
                model.ruleOutOfStock = ruleOutOfStock;
                model.ruleNullVariant = ruleNull;
                const preselectedVariant = preselectOutOfStock
                    ? model.variants.find(v => v.quantity === 0)
                    : model.variants.find(v => v.quantity !== 0);
                model.selectedOptions = preselectOptionsOnLoad
                    ? getSelectedOptionsFromVariant(preselectedVariant || model.variants[0])
                    : {};
            },
            selectSelectedOption(key, value) {
                model.selectedOptions[key] = value;
                if (Object.keys(model.selectedOptions).length === model.variants[0].optionValues.length) {
                    model.selectedVariant = model.variants.find(variantExtractor(model.selectedOptions));
                    model.canBuyNow = model.selectedVariant && model.selectedVariant.quantity > 0;
                } else {
                    // filterOptions
                }
            },
            buyNow() {
                alert(`Congratulations, you fake bought \r\n${model.selectedVariant.sku}\r\n`);
            }
        }
    },

    view() {

        function renderSelectListItem(selectedOption, item) {
            return item.excluded
                ? ""
                : `
                    <option value="${item.name}" ${item.disabled ? "disabled" : ""} style="${item.greyedOut ? "color:graytext;": ""}${item.disabled ? "color:crimson;": ""}" ${selectedOption === item.name ? "selected" : ""}>${item.name} ${item.disabled ? "- out of stock" : ""}</option>
                `;
        }

        function renderOptionSet(selectedOptions, optionSet) {
            return `
                <label>${optionSet.optionName}</label>
                <select name="${optionSet.optionName}" data-change="selectSelectedOption(${optionSet.optionName}, this.value)">
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
                `;
            }
        }
    }
}
