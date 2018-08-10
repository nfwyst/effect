class Structure extends Array {
  constructor(...props) {
    super(...props);
  }

  _swap(id1, id2) {
    [this[id1], this[id2]] = [this[id2], this[id1]];
  }

  // 冒泡
  bubbleSort(s2b = false) {
    const { length } = this;
    this.forEach((_, i) => {
      for(let j = 0; j < length - 1 - i; j++) {
        this[j] > this[j + 1] ? ( s2b ? null : this._swap(j, j+1) ) : null;
      }
    });
  }

  // 选择
  selectSort(s2b = false) {
    const { length } = this;
    let minLoc = null;
    this.forEach((_, i) => {
      minLoc = i;
      for(let j = i; j < length; j++) {
        this[minLoc] > this[j] && (minLoc = j);
      }
      minLoc !== i && this._swap(i, minLoc);
    });
    s2b ? this.reverse() : null;
  }

  // 插入
  insertSort(s2b = false) {
    this.forEach((value, i) => {
      if(i === 0) return null;
      const val = value;
      while(value < this[i - 1]) {
        this[i] = this[i - 1];
        i--;
      }
      this[i] = val;
    });
    s2b ? this.reverse() : null;
  }

  // 归并
  mergeSort(s2b = false) {
    const { length } = this;
    if (length === 1) return this;
    const middle = Math.trunc(length / 2);
    const left = this.slice(0, middle);
    const right = this.slice(middle);
    return this._merge(this.mergeSort.call(left), this.mergeSort.call(right));
  }

  _merge(left, right) {
    let result = new Structure();
    while(left.length && right.length) {
      left[0] > right[0] ? result.push(right.shift()) : result.push(left.shift());
    }
    result = result.concat(left).concat(right);
    for(let [k, v] of result.entries()) {
      this[k] = v;
    }
    return result;
  }

  // 快排
  quickSort() {
    if(this.length <= 1) return this;
    const { length } = this;
    const middle = Math.trunc(length / 2);
    const value = this.splice(middle, 1);
    const left = new Structure();
    const right = new Structure();
    this.forEach(v => {
      if(v < value) left.push(v);
      else right.push(v);
    });
    const result = this.quickSort.call(left).concat(value, this.quickSort.call(right));
    for(let [k, v] of result.entries()) {
      this[k] = v;
    }
    return result;
  }

  // 二分搜索
  binSearch(value) {
    const { length } = this;
    this.quickSort();
    let arr = this;
    let middle = Math.trunc(length / 2);
    let loc = middle;
    while(arr.length) {
      if(value < arr[middle]) {
        arr = arr.slice(0, middle);
        middle = Math.trunc(arr.length / 2);
        loc -= middle;
      } else if(value > arr[middle]) {
        arr = arr.slice(middle);
        middle = Math.trunc(arr.length / 2);
        loc += middle;
      } else {
        return loc;
      }
    }
    return -1;
  }
}

let data = new Structure(6, 1, 4, 2, 3, 4, 9, 1, 8);

// bubble sort
// data.bubbleSort(true);

// select sort
// data.selectSort();

// insert sort
// data.insertSort(true);

// merge sort
// data.mergeSort();

// quick sort
// data.quickSort();

// binSearch
console.log(data.binSearch(3));
