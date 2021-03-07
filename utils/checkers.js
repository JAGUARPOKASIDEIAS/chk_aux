const axios = require("axios");
const https = require('https');
const UserAgent = require("user-agents");


async function Agent(){
	
		const userAgent = await new UserAgent ({ deviceCategory : 'mobile'}) ;    
		return userAgent.toString()
}

async function RequesT(metodo, url1, headers1, post = false, cookies = false, proxy=false){
	
		if (metodo == "post") {
		
				return await axios({
					method: "post",
					url: url1,
					headers: headers1,
					cookies:cookies,
					data: post,
					httpAgent: proxy,
					validateStatus: async function (status) {
   					return status > 200;}
			}).then(async (res) =>{
				return {success:true, response: res}

			}).catch(()=>{
				return {success:false, status:'error'}
			})
		}else{
				return  await axios({
					method: "get",
					url: url1,
					headers: headers1,
					cookies:cookies,
					data: post,
					httpAgent: proxy,
					validateStatus: async function (status) {
   					return status > 200;}
			}).then(async (res)=>{
				return {success:true, response: res}
			}).catch(() =>{
				return {success:false, status:'error'}
			})
		}
}



function msleep(n) {
	
	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  
}

function sleep(n) {
	
	msleep(n*1000);
  
}

function getStr(str,start,end){
	let str2 = str.split(start)
	str2 = str2[1]
	str2 = str2.split(end)
	return str2[0]
}


module.exports = {
	sleep:sleep,
	useragent:Agent,
	req: RequesT,
	getstr:getStr,
}