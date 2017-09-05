var listToSort = [["cat",4],["dog",2],["frog",3]]
console.log(listToSort)

listToSort.sort(function(a, b) {
    a = a[1];
    b = b[1];

    return a < b ? -1 : (a > b ? 1 : 0);
})

console.log(listToSort)