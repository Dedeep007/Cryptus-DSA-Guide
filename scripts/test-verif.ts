import { executeCode } from '../server/executor';
console.log("Imported executeCode");
executeCode('python', 'print("test")', [{ input: '', output: 'test' }]).then(res => console.log(res));
