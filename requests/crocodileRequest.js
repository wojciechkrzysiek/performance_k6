import { check } from "k6";
import http from "k6/http";
import { Counter, Rate, Trend } from 'k6/metrics';
import { MetricFactory } from "../utils/CustomMetricFactory.js";
import { dataProvider } from "../utils/DataProvider.js";
import { findBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const bodyData = JSON.parse(open("../testdata/crocodile.json"));

const getCrocodileRate = new Rate('_getCrocodileRate');
const getCrocodileCounter = new Counter('_getCrocodileCounter');
const getCrocodileResponse = new Trend('_getCrocodileResponse');

export function getCrocodilesRequest(testContext) {

    let response = http.get(`${testContext.baseUrl}/my/crocodiles/`, testContext.defaultParams);

    let checkResult = check(response, {
        'getCrocodile is status 200': (r) => r.status === 200,
        'getCrocodile body is not empty': (r) => r.body != "",
    });

    MetricFactory.add("getCrocodile", checkResult, response);

    return response;
}

const postCrocodileRate = new Rate('_postCrocodileRate');
const postCrocodileCounter = new Counter('_postCrocodileCounter');
const postCrocodileResponse = new Trend('_postCrocodileResponse');

export function postCrocodilesRequest(testContext, name) {

    let bodyData = dataProvider.crocodileBodyData;
    bodyData.name = name;

    let response = http.post(`${testContext.baseUrl}/my/crocodiles/`, JSON.stringify(bodyData), testContext.defaultParams)

    const checkResult = check(response, {
        ["postCrocodile request status is " + 201]: (res) =>
            res.status === 201,
    });

    MetricFactory.add("postCrocodile", checkResult, response);

    return response;
}

export function deleteCrocodilesRequest(testContext, identifier) {
    let response = http.del(`${testContext.baseUrl}/my/crocodiles/${identifier}/`, null, testContext.defaultParams);
  
    const checkResult = check(response, {
      ["deleteCrocodile request status is " + 204]: (res) =>
        res.status === 204,
    });
  
    MetricFactory.add("deleteCrocodile", checkResult, response);
  
    return response;
  }

  export function putCrocodilesRequest(testContext, identifier, name) {
    let bodyData = dataProvider.crocodileBodyData;
    bodyData.name = name;
  
    let response = http.put(`${testContext.baseUrl}/my/crocodiles/${identifier}/`, JSON.stringify(bodyData), testContext.defaultParams)
  
    const checkResult = check(response,
      {
        ["putCrocodile request status is " + 200]: (res) =>
          res.status === 200,
      });
  
    MetricFactory.add("putCrocodile", checkResult, response);
  
    return response;
  }

  export function patchCrocodilesRequest(testContext, identifier, name) {
    let bodyData = dataProvider.crocodileBodyData;
    bodyData.name = name;
  
    //let response = http.patch(`${testContext.baseUrl}/my/crocodiles/${identifier}/`, JSON.stringify(bodyData), testContext.defaultParams)
    let response = http.post(`${testContext.baseUrl}/my/crocodiles/`, JSON.stringify(dataProvider.crocodileBodyData),{tags:{type:'post'}, headers:testContext.defaultParams.headers})
  
    const checkResult = check(response,
      {
        ["patchCrocodile request status is " + 200]: (res) =>
          res.status === 200,
      });
  
    MetricFactory.add("patchCrocodile", checkResult, response);
  
    return response;
  }

  export function getHTMLCrocodilesRequests(testContext) {
    const params =
    {
      headers: {
        'Host': `${testContext.host}`,
        'Authorization': `Basic ${testContext.authorization}`,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-language': 'en-US,en;q=0.5',
     //   'Accept-encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      },
      tags: { ctype: 'html' }
    };
  
    let responses = http.batch([
      ['GET', `${testContext.baseUrl}/my/crocodiles/`, null, params],
      ['GET', `${testContext.baseUrl}/static/rest_framework/css/bootstrap.min.css`, null, { tags: { ctype: 'css' } }],
      ['GET', `${testContext.baseUrl}/static/rest_framework/js/ajax-form.js`, null, { tags: { ctype: 'js' } }]
    ]);
  
    const checkResult = check(responses[0], {
      ["getHtmlCrocodile request status is " + 200]: (res) =>
        res.status === 200,
    });

    let csrfToken = findBetween(responses[0].body, 'name="csrfmiddlewaretoken" value="', '">');
    console.log(`csrf token = ${csrfToken}`);
  }
