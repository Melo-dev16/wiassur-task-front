import axios from 'axios'
import { API_BASE_URL, API_TOKEN } from "../constants/api"
import { getUser } from './user';

axios.interceptors.request.use(function (config) {
    return config
}, function (error) {
    return Promise.reject(error);
});

function createGetRoute(baseRoute, params) {
    Object.keys(params).forEach((key, index) => {
        if (index > 0) {
            baseRoute += "&"
        }
        else {
            baseRoute += "?"
        }

        baseRoute += (key + "=" + params[key])
    })

    return baseRoute
}

export function post(endpoint, data, headers = {}) {
    if (endpoint[0] !== '/') {
        endpoint += '/' + endpoint
    }

    return axios.post(API_BASE_URL + endpoint, data, {
        headers: headers
    });
}

export function get(endpoint, data = {}, headers = {}) {
    if (endpoint[0] !== '/') {
        endpoint += '/' + endpoint
    }

    let route = createGetRoute(API_BASE_URL + endpoint, data);

    return axios.get(route, {
        headers: headers
    });
}

export function remove(endpoint, headers = {}) {
    if (endpoint[0] !== '/') {
        endpoint += '/' + endpoint
    }

    return axios.delete(API_BASE_URL + endpoint, {
        headers: headers
    });
}

export function put(endpoint, data, headers = {}) {
    if (endpoint[0] !== '/') {
        endpoint += '/' + endpoint
    }

    return axios.put(API_BASE_URL + endpoint, data, {
        headers: headers
    });
}

export function patch(endpoint, data, headers = {}) {
    if (endpoint[0] !== '/') {
        endpoint += '/' + endpoint
    }

    return axios.patch(API_BASE_URL + endpoint, data, {
        headers: headers
    });
}
