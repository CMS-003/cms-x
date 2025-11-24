import ee from 'event-emitter'

const MyClass = function () { /* .. */ };
ee(MyClass.prototype);

const events = new MyClass()

export default events;