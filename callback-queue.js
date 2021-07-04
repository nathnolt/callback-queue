function CallbackQueue(handler) {
	this.results = []
	this.handler = handler
	
	// binded methods
	this.add = closureThisBind(this._add, this)
	this.addTyped = closureThisBind(this._addTyped, this)
}

CallbackQueue.prototype = {
	_add: function addToQueue(data) {
		this.results.push({data: data})
		this.handler(this)
	},
	_addTyped: function addToQueueTyped(type) {
		var _this = this
		return function addTypedClosure(data) {
			_this.results.push({type: type, data: data})
			_this.handler(_this)
		}
	}
}

var start
function myHandler(queue) {
	if(queue.results.length < 5){ return }
	var now = new Date().getTime()
	console.log('took: ', now - start)
	console.log(queue.results)
}
var timerQueue = new CallbackQueue(myHandler)

start = new Date().getTime()

// Execute fn twice
callbackMethod(timerQueue.add)
callbackMethod(timerQueue.add)
callbackMethod(timerQueue.add)
callbackMethod(timerQueue.add)
callbackMethod(timerQueue.addTyped('nice'))



// callback method
function callbackMethod(cb) {
	var time = 400 + Math.random() * 1000
	setTimeout(function callbackMethod_done() {
		var data = getRandomStr(2 + Math.random() * 40 | 0)
		// console.log(cb)
		cb([data, time])
	}, time)
}

function getRandomStr(len) {
	var str = ''
	for(var i = 0; i < len; i++) {
		str += String.fromCharCode(Math.random()*255|0)
	}
	return str
}



// Function.prototype.bind alternative, for if you use an even older version of js.
// instead of doing var bound = fn.bind(this)
// var bound = closureThisBind(fn, this)
function closureThisBind(method, _this) {
	return function Bounded() {
		return method.apply(_this, arguments)
	}
}
