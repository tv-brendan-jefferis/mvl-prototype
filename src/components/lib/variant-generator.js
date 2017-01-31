function optionValues(o) {
    return {
        name: o.name,
        value: o.value
    };
}

function setRandomOutOfStock(count, variants) {
    for (let i = 0; i <= count; i++) {
        const rand = Math.floor(Math.random() * variants.length);
        variants[rand].quantity = 0;
    }
    return variants;
}


// const optionSets = [
//     { optionName: "Colour", count: 3, foosCount: 0, optionValues: ["white","silver","gray"] },
// ];

export default function(options) {
    let variants = [];
    let output = [];
    let counter = 0;
    let usedSkus = {};

    for (let i = 0; i < 5000; i++) {
        variants.push({
            sku: '',
            optionValues: [],
            price: parseFloat((10 + Math.random() * 10).toFixed(2)),
            quantity: 1 + Math.floor((Math.random() * 30))
        });

        for (let j = 0; j < 3; j++) {
            const random = Math.floor(Math.random() * options.optionSets[j].optionValues.length);
            const neo = options.optionSets[j].optionValues[random];

            variants[i].optionValues.push({
                name: options.optionSets[j].optionName,
                value: neo
            });

            variants[i].sku += neo + '-';
        }

        if (!usedSkus[variants[i].sku] && counter < options.variantCount) {
            const v = variants[i];
            output.push({
                sku: v.sku,
                price: v.price,
                quantity: v.quantity,
                optionValues: v.optionValues.map(optionValues)
            });

            usedSkus[variants[i].sku] = true;
            counter++;
        }
    }

    output = setRandomOutOfStock(options.oosCount, output);

    return output;
}
