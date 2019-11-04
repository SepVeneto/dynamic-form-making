function letters(rule, value, callback) {
// const regExp = new RegExp('[a-z][A-Z]', 'g');
const regExp = /^[a-zA-Z]+$/g;
  value === '' && callback();
  if (regExp.test(value)) {
    callback();
  } else {
    callback('请输入字母');
  }
}
export default {
  letters: {validator: letters},
  custom: {validator: letters},
}