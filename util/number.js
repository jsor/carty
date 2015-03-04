module.exports = function number(value, decimal) {
    var float = parseFloat(value);

    if (isFinite(float)) {
        return float;
    }

    var string = '' + value;

    if (!decimal) {
        var dotPos = string.indexOf('.'),
            commaPos = string.indexOf(',');

        decimal = '.';

        if (dotPos > -1 && commaPos > -1 && commaPos > dotPos) {
            decimal = ',';
        }
    }

    var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]);

    return parseFloat(
        string
            .replace(/\(([^-]+)\)/, "-$1") // replace bracketed values with negatives
            .replace(regex, '') // strip out any cruft
            .replace(decimal, '.') // make sure decimal point is standard
    ) || 0;
};
