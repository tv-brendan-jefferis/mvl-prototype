export default {

    model: {
        optionSets: [
            { optionName: "Colour", optionValues: [
                    {name: "cheese", disabled: false, greyedOut: false, excluded: false},
                    {name: "bread", disabled: true, greyedOut: false, excluded: false},
                    {name: "wine", disabled: false, greyedOut: true, excluded: false},
                    {name: "wine", disabled: false, greyedOut: true, excluded: true}
                ]
            },
            { optionName: "Size", optionValues: [] },
            { optionName: "Logo", optionValues: [] }
        ],
        selectedOptions: {},
        selectedVariant: null,
        canBuyNow: false
    },

    actions(model) {

        function extractVariant() {

        }

        return {
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
                    </div>
                `;
            }
        }
    }
}
