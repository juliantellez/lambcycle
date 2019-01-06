const toLowerCaseShallow = obj =>
    Object.keys(obj).reduce((output, currentKey) => {
        const key = currentKey.toLowerCase();
        let value = obj[currentKey];
        if (typeof value === 'string') value = value.toLowerCase();

        output[key] = value;

        return output;
    }, {});

export default toLowerCaseShallow;
