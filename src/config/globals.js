'use strict';

window.HOST = location.protocol+"//"+location.host;
window.WS_HOST = location.hostname === 'localhost' ? `ws://${location.host}`: "wss:"+"//"+location.host;
window.DOMAIN = location.protocol+"//"+location.hostname
