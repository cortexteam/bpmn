/**
 * AUTHOR: mrassinger
 * COPYRIGHT: E2E Technologies Ltd.
 */

var BPMNProcessState = require("../../../lib/execution/processState.js").BPMNProcessState;
var BPMNFlowObject = require("../../../lib/bpmn/flowObject.js").BPMNFlowObject;

var gateway = new BPMNFlowObject("_2", "Parallel Gateway1", "parallelGateway");
var startEvent = new BPMNFlowObject("_1", "Start Event1", "startEvent");

exports.testBPMNProcessStateFindTokens = function(test) {

    var callActivity = new BPMNFlowObject("_1", "My Call Activity", "callActivity");

    var state = new BPMNProcessState();
    state.tokens = [
        {
            "position": "MyCallActivity",
            "substate": {
                "tokens": [
                    {
                        "position": "MyTask"
                    }
                ]
            }
        }
    ];

    var foundTokens = state.findTokens("MyTask");
    test.deepEqual(foundTokens,
        [
            {
                "position": "MyTask"
            }
        ],
        "testBPMNProcessStateFindTokens"
    );

    test.done();
};

exports.testBPMNProcessStateCreateTokens = function(test) {

    var state = new BPMNProcessState();
    state.createTokenAt(startEvent.name, "myPid1");

    test.deepEqual(state.tokens,
        [
            {
                "position": "Start Event1"
            }
        ],
        "testBPMNProcessStateCreateTokens"
    );

    test.done();
};

exports.testBPMNProcessStateRemoveToken = function(test) {
    var state = new BPMNProcessState();
    state.createTokenAt(startEvent.name, "myPid1");
    state.createTokenAt(gateway.name, "myPid1");
    state.createTokenAt(gateway.name, "myPid1");
    state.createTokenAt(gateway.name, "myPid1");

    state.removeTokenAt(gateway);

    test.deepEqual(state.tokens,
        [
            {
                "position": "Start Event1"
            },
            {
                "position": "Parallel Gateway1"
            },
            {
                "position": "Parallel Gateway1"
            }
        ],
        "testBPMNProcessStateRemoveToken: remove one token"
    );

    state.removeAllTokensAt(gateway);

    var hasTokens = state.hasTokensAt(gateway);
    test.equal(hasTokens, false, "testBPMNProcessStateRemoveToken: removed all tokens");

    test.done();
};

exports.testBPMNProcessStateHasToken = function(test) {
    var state = new BPMNProcessState();
    state.createTokenAt(startEvent.name, "myPid1");

    var test1 = state.hasTokensAt(null);
    test.equal(test1, false, "testBPMNProcessStateHasToken: flowObject = null");

    var test2 = state.hasTokensAt(startEvent);
    test.equal(test2, true, "testBPMNProcessStateHasToken: startEvent");

    state.removeTokenAt(startEvent);

    var test3 = state.hasTokensAt(startEvent);
    test.equal(test3, false, "testBPMNProcessStateHasToken: startEvent after removing");

    test.done();
};