/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
    let arrSorted = arr.slice(0);
    if (param === "desc")
    {
        arrSorted = arrSorted.sort((a,b)=>b.localeCompare(
            a, { sensitivity: "base" }
            ));
    }
    else
    {
        arrSorted = arrSorted.sort((a,b)=>b.localeCompare(
            a, "ru", {  caseFirst: "upper", sensitivity: "case" }
            ));
        arrSorted = arrSorted.reverse();
    }

    return  arrSorted;
}

