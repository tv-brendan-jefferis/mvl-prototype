import variantGenerator from "./lib/variant-generator";
import comp from "comp";

export default {
	
	model: {
	    sectionVisible: true,
		optionSets: [
            { optionName: "Colour", count: 3, nullCount: 0, optionValues: [
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
            { optionName: "Size", count: 3, nullCount: 0, optionValues: [
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
            { optionName: "Logo", count: 3, nullCount: 0, optionValues: [
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
            { optionName: "Fabric", count: 0, nullCount: 0, optionValues: [
                "Cotton",
                "Leather",
                "Canvas",
                "Sack-cloth",
                "Denim",
                "Satin",
                "Silk",
                "Suede",
                "Crushed velvet",
                "Velour",
                "Fishnet",
                "Flannel",
                "Wool",
                "Cheesecloth",
                "Cashmere",
                "Gingham",
                "Horsehair",
                "Lambswool",
                "Possum fur",
                "Feathers",
                "Moleskin",
                "Nylon",
                "Polyester",
                "Lace",
                "Ultrasuede",
                "Wolf pelt",
                "Spider silk",
                "Vegan leather",
                "PVC",
                "Twill"] },
            { optionName: "Gull", count: 0, nullCount: 0, optionValues: [
                "Pacific gull",
                "Belcher gull",
                "Olror gull",
                "Black-tailed gull",
                "Heermann gull",
                "Common gull",
                "Ring-billed gull",
                "California gull",
                "Great black-backed gull",
                "Kelp gull",
                "Cape gull",
                "Glaucous-winged gull",
                "Western gull",
                "Yellow-footed gull",
                "Glaucous gull",
                "Iceland gull",
                "Kumlien gull",
                "Thayer gull",
                "European herring gull",
                "American herring gull",
                "Caspian gull",
                "Yellow-legged gull",
                "East Siberian herring gull",
                "Armenian gull",
                "Slaty-backed gull",
                "Lesser black-backed gull",
                "Heuglin gull",
                "Mediterranean gull",
                "White-eyed gull",
                "Sooty gull"
            ]}
		],
        variantCount: 5,
        oosCount: 1,
        variants: [],
        rulesList: ["grey-out", "disable", "exclude"],
        ruleOutOfStock: "grey-out",
        ruleNullVariant: "grey-out"
	},

	actions(model) {

	    function optionValueToSelectListItem(optionSet) {
	        let optionValues = [];

	        for (let i = 0; i < optionSet.optionValues.length; i++) {
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
            toggleSectionVisible() {
                model.sectionVisible = !model.sectionVisible;
            },
		    updateOptionSetCount(optionName, count) {
                model.optionSets.map(x => {
                    if (x.optionName === optionName) {
                        x.count = parseInt(count, 10);
                    }
                });
            },
            updateRule(ruleName, value) {
                model[ruleName] = value;
            },
            updateOptionSetNullCount(optionName, count) {
                model.optionSets.map(x => {
                    if (x.optionName === optionName) {
                        x.nullCount = parseInt(count, 10);
                    }
                });
            },
            updateVariantCount(val) {
                model.variantCount = parseInt(val, 10);
            },
		    updateOosCount(val) {
                const count = parseInt(val, 10);
		        model.oosCount = count <= model.variantCount ? count : model.variantCount;
            },
			generateData() {
                const options = Object.assign({}, model);
                options.optionSets = model.optionSets.filter(x => x.count > 0);
                const data = variantGenerator(options);
                model.variants = data.variants;
                let optionSets = data.optionSets.map(optionValueToSelectListItem);
                comp.components.demo.importData(optionSets, model.variants, model.ruleOutOfStock, model.ruleNullVariant);
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
                        <label>Null count</label>
                        <input data-change="updateOptionSetNullCount(${optionSet.optionName}, this.value)" type="number" value="${optionSet.nullCount}" min="0" max="30">
                    </p>
                </div>
            `;
        }

        function renderRadioButtons(listName, item, defaultValue) {
	        return `
	            <input data-change="updateRule(this.name, this.value)" name="${listName}" value="${item}" type="radio" id="${listName}-${item}-radio" ${item === defaultValue ? "checked": ""}/>
	            <label for="${listName}-${item}-radio">${item}</label>
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
                                <label>Out of stock count</label>
                                <input data-change="updateOosCount(this.value)" type="number" value="${model.oosCount}" min="0" max="${model.variantCount}">
                            </p>
                            <hr>
                            <h2>Rules</h2>
                            <div class="option-sets">
                                <div class="option-set">
                                    <h4>Out of stock</h4>
                                    ${model.rulesList.map(x => renderRadioButtons("ruleOutOfStock", x, model.ruleOutOfStock)) }
                                </div>
                                <div class="option-set">
                                    <h4>Null variant</h4>
                                    ${model.rulesList.map(x => renderRadioButtons("ruleNullVariant", x, model.ruleNullVariant)) }
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