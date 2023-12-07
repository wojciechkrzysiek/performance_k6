import TestContext from "../../configuration/testcontext.js";
import { group } from "k6";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { getCrocodilesRequest, postCrocodilesRequest, putCrocodilesRequest, patchCrocodilesRequest, deleteCrocodilesRequest, getHTMLCrocodilesRequests } from "../../requests/crocodileRequest.js";

export const options = {
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(50)', 'p(90)', 'p(95)', 'p(99)', 'p(99.99)', 'count'],
    scenarios: {
        crocodile_scenario: {
            // name of the executor to use
            executor: 'shared-iterations',
            // common scenario configuration
            //startTime: '5s',
            gracefulStop: '5s',
            // executor-specific configuration
            vus: 2,
            iterations: 10,
            maxDuration: '200s',
            exec: "crocodileTest",
        },
        //NFR: we expected 10 reads of all crocodile per min
        crocodile_reads: {
            executor: 'constant-arrival-rate',
            // How long the test lasts
            duration: '60s',
            // How many iterations per timeUnit
            rate: 10,
            // Start `rate` iterations per second
            timeUnit: '60s',
            // Pre-allocate VUs
            preAllocatedVUs: 5,
            exec: "readCrocodilesTest"
        },
    },
    "thresholds": {
        "_putCrocodile_duration": ["avg<100", "p(95)<200"],
        http_req_duration: ['p(95)<500'],
        "http_req_duration{type:post}":["min<200"],
        "group_duration{group:::Read all crocodiles via HTML}": ["max < 10000"]
    },

};

// create test context
export async function setup() {
    const testContext = new TestContext();
    return testContext;
}

// perform the test
/*export default function crocodileTest(testContext) {

    // read crocodiles
    getCrocodilesRequest(testContext);

    let response = postCrocodilesRequest(testContext);

    deleteCrocodilesRequest(testContext, response.json().id);

}*/

/*xport default function crocodileTest(testContext) {

    // read crocodiles
    let response = getCrocodilesRequest(testContext);
    let json = response.json();
  
    let crocodileId = response.json().id;
    let crocodileNewName = response.json().name + "put";
    
    response = putCrocodilesRequest(testContext, crocodileId, crocodileNewName);
    //console.log(response.json());
    // delete each crocodile
    json.forEach(obj => {
      deleteCrocodilesRequest(testContext, obj.id);
    });
  }*/


export function crocodileTest(testContext) {

    // read crocodiles
    //getCrocodilesRequest(testContext);
    // create crocodiles
    let crocodileName = randomString(10);
    let response = postCrocodilesRequest(testContext,crocodileName);
    // update by put request
    let crocodileId = response.json().id;
    let crocodileNewName = response.json().name + "put";
    response = putCrocodilesRequest(testContext, crocodileId, crocodileNewName);

    //crocodileId = response.json().id;
    crocodileNewName = response.json().name + "patch";
    response = patchCrocodilesRequest(testContext, crocodileId, crocodileNewName);

    console.log(response.json());
    // delete crocodiles
    deleteCrocodilesRequest(testContext, response.json().id);
}

export function readCrocodilesTest(testContext) {

    // read crocodiles
    group('Read all crocodiles via HTML', function () {
        getHTMLCrocodilesRequests(testContext);
      });
      
}