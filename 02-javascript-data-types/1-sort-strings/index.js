/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
    let arrSorted = [...arr];
    const sortDesc =  (array, options) => {
        return array.sort((a,b)=>b.localeCompare(
            a, "ru", options, "en"
            ));
        };
    
    if (param === "desc")
    {
        return sortDesc(arrSorted, {});
    }
    else
    {
        return sortDesc(arrSorted, { caseFirst: "upper", sensitivity: "case"}).reverse();
    }
}