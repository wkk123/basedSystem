export const testSpace = str => {
	var reg = /\s/g
    return reg.test(str)
}

export const testPhone = str => {
	let reg = /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
	return reg.test(str)
}

export const trim = str => {
    let newstr = str+''
    return newstr.replace(/\s/g,"")
}


