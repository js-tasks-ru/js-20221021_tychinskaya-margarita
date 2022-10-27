/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    let newObj = Object.fromEntries(
        (Object.entries(obj).filter((item)=>fields.includes(item[0])))
    );
    return newObj;
};
