/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
    let arrSorted = [...arr];
    if (param === "desc")
    {
        arrSorted = arrSorted.sort((a,b)=>b.localeCompare(
            a, "ru", "en", {  caseFirst: "upper", sensitivity: "base" }
            )
        );
    }
    else
    {
        arrSorted = arrSorted.sort((a,b)=>b.localeCompare(
            a, "ru", {  caseFirst: "upper", sensitivity: "case" }, "en",  {  caseFirst: "lower", sensitivity: "base" }
            ));
        arrSorted = arrSorted.reverse();
    }

    return  arrSorted;
}