import uniqueRandoms from "./unique-randoms";

function optionValues(o) {
    return {
        name: o.name,
        value: o.value
    };
}

function setRandomOutOfStock(count, variants) {
    let randoms = uniqueRandoms(count, variants.length);
    randoms.map(i => { variants[i].quantity = 0 });
    return variants;
}

function setRandomNull(count, variants) {
    let randoms = uniqueRandoms(count, variants.length);
    variants = variants.filter((v, i) => randoms.indexOf(i) === -1);
    return variants;
}

export function variantGenerator(options) {
    let randomSamples = [];
    let variants = [];
    let counter = 0;
    let usedSkus = {};
    let optionSets = [];

    for (let i = 0; i < options.optionSets.length; i++) {
        const set = options.optionSets[i];
        const randoms = uniqueRandoms(set.count, set.optionValues.length);
        const values = randoms.map(i => set.optionValues[i]);
        optionSets.push({
            count: set.count,
            nullCount: set.nullCount,
            oosCount: set.oosCount,
            optionName: set.optionName,
            optionValues: values
        });
    }

    for (let i = 0; i < 5000; i++) {
        randomSamples.push({
            sku: '',
            optionValues: [],
            price: parseFloat((10 + Math.random() * 10).toFixed(2)),
            quantity: 1 + Math.floor((Math.random() * 30))
        });

        for (let j = 0; j < optionSets.length; j++) {
            const random = Math.floor(Math.random() * optionSets[j].optionValues.length);
            const neo = optionSets[j].optionValues[random];

            randomSamples[i].optionValues.push({
                name: optionSets[j].optionName,
                value: neo
            });

            randomSamples[i].sku += neo.replace(" ", "_") + '-';
        }

        if (!usedSkus[randomSamples[i].sku] && counter < options.variantCount) {
            const v = randomSamples[i];
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

    for (let i = 0; i < optionSets.length; i++) {
        let set = optionSets[i];
        if (set.nullCount > 0) {
            const randoms = uniqueRandoms(set.nullCount, set.optionValues.length);
            const nullOptions = randoms.map(i => set.optionValues[i]);
            variants = variants.filter(v => {
                const option = v.optionValues.find(o => o.name === set.optionName);
                return nullOptions.indexOf(option.value) === -1;
            });
        }
    }

    for (let i = 0; i < optionSets.length; i++) {
        let set = optionSets[i];
        if (set.oosCount > 0) {
            const randoms = uniqueRandoms(set.oosCount, set.optionValues.length);
            const oosOptions = randoms.map(i => set.optionValues[i]);
            variants.map(v => {
                const option = v.optionValues.find(o => o.name === set.optionName);
                if (oosOptions.indexOf(option.value) !== -1) {
                    v.quantity = 0;
                }
            });
        }
    }

    return {
        optionSets: optionSets,
        variants: variants
    };
}

export function variantExtractor(selectedOptions) {
    const propList = Object.keys(selectedOptions);
    return variant => {
        return propList.map(optionName => { return variant.optionValues.find(x => x.name === optionName).value === selectedOptions[optionName]; }).every(x => x === true);
    }
}

export function getSelectedOptionsFromVariant(variant) {
    let options = {};
    variant.optionValues.map(function (x) {
        this[x.name] = x.value;
    }, options);

    return options;
}