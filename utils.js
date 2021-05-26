// 切割字符串
exports.strToArr = (value, split = ' ') => value.split(split)

// 格式化字符串
exports.formatDisplay = (arr, spr = '\r\n') => {
  return arr.map(v => v.map(m => m.padEnd(20, ' ')).join('')).join(spr)
}


exports.hyphens = (val) => {
	if(typeof val==='string' && val.includes('-')){
		let temp = val.split('-');
		let str = temp[0];
		for(let i=1;i<temp.length; i++){
			str+=temp[i].substring(0,1).toUpperCase()+temp[i].substring(1)
		}
		return str;
	}else{
		return val;
	}
}