var rotate_array = require('../rotate_array');

describe('rotate_array tests', function () {
  it('should rotate left correctly', function () {
    var arr = [1, 2, 3];

    expect(rotate_array(arr, 1)).toEqual([3, 1, 2]);
    expect(rotate_array(arr, 2)).toEqual([2, 3, 1]);
    expect(rotate_array(arr, 3)).toEqual([1, 2, 3]);
    expect(rotate_array(arr, 4)).toEqual([3, 1, 2]);
  });

  it('should rotate right correctly', function () {
    var arr = [1, 2, 3];

    expect(rotate_array(arr, -1)).toEqual([2, 3, 1]);
    expect(rotate_array(arr, -2)).toEqual([3, 1, 2]);
    expect(rotate_array(arr, -3)).toEqual([1, 2, 3]);
    expect(rotate_array(arr, -4)).toEqual([2, 3, 1]);
  });
});
