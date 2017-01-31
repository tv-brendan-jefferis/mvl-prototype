import variantGenerator from "./lib/variant-generator";

export default {
	
	model: {
	    sectionVisible: true,
		optionSets: [
            { optionName: "Colour", count: 3, foosCount: 0, optionValues: [
                "white",
                "silver",
                "gray",
                "black",
                "navy",
                "blue",
                "cerulean",
                "sky blue",
                "turquoise",
                "azure",
                "teal",
                "cyan",
                "green",
                "lime",
                "chartreuse",
                "olive",
                "yellow",
                "gold",
                "amber",
                "orange",
                "brown",
                "red",
                "maroon",
                "rose",
                "pink",
                "magenta",
                "purple",
                "indigo",
                "violet",
                "plum"] },
            { optionName: "Size", count: 3, foosCount: 0, optionValues: [
                "3XS",
                "2XS",
                "XS",
                "M",
                "L",
                "XL",
                "2XL",
                "3L",
                "4XL",
                "5XL",
                "6XL",
                "000",
                "00",
                "0",
                "2",
                "4",
                "6",
                "8",
                "10",
                "12",
                "14",
                "16",
                "18",
                "20",
                "22",
                "24",
                "26",
                "28",
                "30",
                "32"
            ] },
            { optionName: "Logo", count: 3, foosCount: 0, optionValues: [
                "Boston Bruins",
                "Buffalo Sabres",
                "Detroit Red Wings",
                "Florida Panthers",
                "Montreal Canadiens",
                "Ottawa Senators",
                "Tampa Bay Lightning",
                "Toronto Maple Leafs",
                "Carolina Hurricanes",
                "Columbus Blue Jackets",
                "New Jersey Devils",
                "New York Islanders",
                "New York Rangers",
                "Philadelphia Flyers",
                "Pittsburgh Penguins",
                "Washington Capitals",
                "Anaheim Ducks",
                "Arizona Coyotes",
                "Calgary Flames",
                "Edmonton Oilers",
                "Los Angeles Kings",
                "San Jose Sharks",
                "Vancouver Canucks",
                "Chicago Blackhawks",
                "Colorado Avalanche",
                "Dallas Stars",
                "Minnesota Wild",
                "Nashville Predators",
                "St. Louis Blues",
                "Winnipeg Jets"
            ] },
		],
        variantCount: 5,
        oosCount: 0,
        variants: [],
        ruleOutOfStock: ["exclude", "disable", "grey-out"],
        ruleNullVariant: ["exclude", "disable", "grey-out"]
	},

	actions(model) {

		return {
            toggleSectionVisible() {
                model.sectionVisible = !model.sectionVisible;
            },
		    updateOptionSetCount(optionName, count) {
                console.log(optionName);
                console.log(count);
            },
            updateOptionSetFoosCount(optionName, count) {

            },
            updateVariantCount(val) {
                model.variantCount = parseInt(val, 10);
            },
		    updateOosCount(val) {
                const count = parseInt(val, 10);
		        model.oosCount = count <= model.variantCount ? count : model.variantCount;
            },
			generateData() {
                let data = variantGenerator(model);
                console.log(data);
			} 
		}
	},

	view() {

	    function renderOptionSet(optionSet) {
	        return `
                <div class="option-set">
                    <h4>${optionSet.optionName} options</h4>
                    <p>
                        <label>Count</label>
                        <input data-change="updateOptionSetCount(${optionSet.optionName}, this.value)" type="number" value="${optionSet.count}" min="0" max="30">
                    </p>
                    <p>
                        <label>foos count</label>
                        <input data-change="updateOptionSetFoosCount(${optionSet.optionName}, this.value)" type="number" value="${optionSet.foosCount}" min="0" max="30">
                    </p>
                </div>
            `;
        }

        function renderRadioButtons(listName, item) {
	        return `
	            <input name="${listName}" value="${item}" type="radio" id="${item}-radio"/>
	            <label for="${item}-radio">${item}</label>
            `;
        }

		return {
			render(model, html) {
				return html`
                    <div>
                        <a href="#" data-click="toggleSectionVisible">${model.sectionVisible ? `- Hide data options` : `+ Show data options`}</a>
                        
                        <div style="${model.sectionVisible ? "" : "display: none"}">
                            <h2>Data</h2>
                            <div class="option-sets">
                                ${model.optionSets.map(renderOptionSet)}
                            </div>
                            <br>
                            <p>
                                <label>Variant count</label>
                                <input data-change="updateVariantCount(this.value)" type="number" value="${model.variantCount}" min="0" max="150">
                            </p>
                            <p>
                                <label>oos count</label>
                                <input data-change="updateOosCount(this.value)" type="number" value="${model.oosCount}" min="0" max="${model.variantCount}">
                            </p>
                            <hr>
                            <h2>Rules</h2>
                            <div class="option-sets">
                                <div class="option-set">
                                    <h4>Out of stock</h4>
                                    ${model.ruleOutOfStock.map(x => renderRadioButtons("ruleOutOfStock", x)) }
                                </div>
                                <div class="option-set">
                                    <h4>Null variant</h4>
                                    ${model.ruleNullVariant.map(x => renderRadioButtons("ruleOutOfStock", x)) }
                                </div>
                            </div>
                            <hr>
                            <button data-click="generateData" type="button">Generate data</button>
                        </div>
                    </div>
				`;
			}
		}
	}
}