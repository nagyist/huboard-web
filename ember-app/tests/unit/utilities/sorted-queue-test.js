import sortedQueue from "app/utilities/sorted-queue";

import {
  module,
  test
} from "qunit";

var sut;
module("sortedQueue", {
  setup: function(){
    sut = sortedQueue;
  }
});

test("Executes the queue aginst a callback", (assert) =>{
  var finishTest = assert.async();

  var time = 100;
  var item1 = "Item";
  var item2 = "Item2";
  var item3 = "Item3";
  var callback = sinon.spy();

  var targetObject = {
    whenImCalled: sut(callback, {time: time})
  };

  targetObject.whenImCalled(item1);
  targetObject.whenImCalled(item2);
  targetObject.whenImCalled(item3);

  setTimeout(function(){
    assert.ok(callback.calledWith(item1), "Item1 was processed");
    assert.ok(callback.calledWith(item2), "Item2 was processed");
    assert.ok(callback.calledWith(item3), "Item3 was processed");
    finishTest();
  }, time);
});

test("Executes the queue in order", (assert) =>{
  var finishTest = assert.async();

  var time = 100;
  var item1 = "d";
  var item2 = "a";
  var item3 = "b";
  var item4 = "c";

  var expected = "";
  var callback = function(item){
    expected = expected + item;
  };

  var targetObject = {
    whenImCalled: sut(callback, {time: time})
  };

  targetObject.whenImCalled(item1);
  targetObject.whenImCalled(item2);
  targetObject.whenImCalled(item3);
  targetObject.whenImCalled(item4);

  setTimeout(function(){
    assert.equal(expected, "abcd");
    finishTest();
  }, time);
});

test("Accepts a sort callback", (assert) =>{
  var finishTest = assert.async();

  var time = 100;
  var item1 = {id: 2, data: "o"};
  var item2 = {id: 1, data: "d"};
  var item3 = {id: 4, data: "e"};
  var item4 = {id: 3, data: "n"};

  var sortBy = function(a,b){
    return a.id - b.id;
  };

  var expected = "";
  var targetObject = {
    whenImCalled: sut(function(item){
      expected = expected + item.data;
    }, {time: time, sort: sortBy})
  };

  targetObject.whenImCalled(item1);
  targetObject.whenImCalled(item2);
  targetObject.whenImCalled(item3);
  targetObject.whenImCalled(item4);

  setTimeout(function(){
    assert.equal(expected, "done");
    finishTest();
  }, time);
});
