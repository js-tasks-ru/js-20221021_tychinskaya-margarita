/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const arrPath = path.split(".");
    const getter = (obj) => {
        let findObj = obj;
        for (var i = 0; i < arrPath.length; i++) {
            findObj = findObj[arrPath[i]];
            if (!findObj)
              break;
          }
          return findObj;
    }
    return getter;
}
