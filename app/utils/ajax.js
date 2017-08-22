import fetch from 'isomorphic-fetch'
import { API_PREFIX, API_SUFFIX } from '../constants'

// todo : 连接store
// const code = global.$GLOBALCONFIG.STAFF.code

function buildParams(obj) {
    if (!obj) {
        return ''
    }
    const params = []
    for (const key of Object.keys(obj)) {
        const value = obj[key] === undefined ? '' : obj[key]
        params.push(`${key}=${encodeURIComponent(value)}`)
    }
    const arg = params.join('&')
    return arg
}

// 下面是注释用formdata的方式传输数据
/*export function fetchJSON(url, params) {
 params = {
 ...params,
 headers: {
 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
 ...params.headers,
 },
 }
 url = `${API_PREFIX}${url}${API_SUFFIX}`
 return fetch(url, params)
 }*/

export function fetchJSON(url, params, target) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let token = sessionStorage.getItem('token')
    if(token) {
        myHeaders.append("token", token);
    }
    // if (token) {
    let data = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(params)
    }

    if(target){
        url = `${target}${url}${API_SUFFIX}`
    } else {
        url = `${API_PREFIX}${url}${API_SUFFIX}`
    }
    return fetch(url, data)
}


// eslint-disable-next-line arrow-parens
export const fetchJSONByPost = (url, target) => query => {
    // 下面是注释用formdata的方式传输数据
  /*const params = {
   method: 'POST',
   body: buildParams(query),
   }
   return fetchJSON(url, params)*/
    return fetchJSON(url, query, target)
}



export const fetchJSONStringByPost = url => query => {
    const params = {
        method: 'POST',
        body: query,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    }
    return fetchJSON(url, params)
}