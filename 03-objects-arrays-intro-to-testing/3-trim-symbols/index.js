/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if ((typeof(string) !=="string") 
    || (typeof(size) !=="number") 
    || size<0 
    || !(Number.isInteger(size)))
    {
        return string;
    }
    
    let count = 0;

    const results = string.split("").filter(function(item, index, array) {
        if (item===array[index+1])
        {
            count+=1;
        }
        else 
        {
            count = 0;
        }
        return (count<size);
    });

    return results.join("");
}
