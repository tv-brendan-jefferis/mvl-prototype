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

        function extractVariant() {

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
            importData(optionSets, variants, ruleOutOfStock, ruleNull) {
                model.optionSets = optionSets;
                model.variants = variants;
                model.ruleOutOfStock = ruleOutOfStock;
                model.ruleNullVariant = ruleNull;
            },
            selectSelectedOption(key, value) {
                model.selectedOptions[key] = value;
                model.selectedVariant = extractVariant;
            }
        }
    },

    view() {

        function renderSelectListItem(item) {
            return item.excluded
                ? ""
                : `
                    <option value="${item.name}" ${item.disabled ? "disabled" : ""} style="${item.greyedOut ? "color:graytext;": ""}${item.disabled ? "color:crimson;": ""}">${item.name} ${item.disabled ? "- out of stock" : ""}</option>
                `;
        }

        function renderOptionSet(optionSet) {
            return `
                <label>${optionSet.optionName}</label>
                <select name="${optionSet.optionName}" data-change="selectSelectedOption(${optionSet.optionName}, this.value)">
                    <option value="null">-Select-</option>
                    ${optionSet.optionValues.length > 0 ? optionSet.optionValues.map(renderSelectListItem) : ""}
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
                            ${model.optionSets.map(renderOptionSet)}                        
                        </div>
                        <br>
                        <button ${model.canBuyNow ? "" : "disabled"}>Buy Now</button>
                        <div style="${model.variants.length === 0 ? "display:none;" : ""}">
                            <br>
                            <h4>All variants</h4>
                            <ul>
                                ${model.variants.map(renderVariant)}
                            </ul>
                        </div>
                    </div>
                `;
            }
        }
    }
}
