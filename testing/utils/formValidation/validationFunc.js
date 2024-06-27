export function checkRepeatChar(str)
{
	str = str.replace(/\s+/g,"");
	str = str.toUpperCase();
	if(/([A-Za-z])(\1{4,})/g.test(str)) {
		return true;
	} else {
		return false;
	}
}

export function checkAlphaNumeric(str) {
    const rgx_alpha_numeric = /^[a-z0-9]+$/i;
    return rgx_alpha_numeric.test(str);
}
function uniqueArray(a)
{
    var temp = new Array();
    for (var i = 0; i < a.length; i++)
    {
        temp[a[i]] = true;
	}
    var r = new Array();
    for (var k in temp)
    {
		if (k != 'undefined' && typeof(k) != 'undefined' && k != 'contains')
		{
			r.push($.trim(k));
		}
	}
    return r;
}


export function checkRepeatText(str)
{
	var str_arr 	   = str.split(' ');
	var unique_arr	   = uniqueArray(str_arr);

	return (str_arr.length != unique_arr.length) ? true : false;
}