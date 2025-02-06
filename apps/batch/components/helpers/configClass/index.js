const { log, error } = require('@repo/kwe-lib/components/logHelper');

/**
 * @dev
 * process 전역 객체 공통 핸들러
 */

class configClass {

    constructor(threadName, initialInterval = 1 * 60 * 1000) {
        this.threadName = threadName
        this.batchTimeoutId = null;
        this.currentInterval = initialInterval;
    }

    commonProcessHandler = {
        // 프로세스 종료 시 브라우저 닫기
        'SIGINT': async() => {
            log('SIGINT signal received.'); 
        },
        'SIGTERM': async() => {
            log('SIGTERM signal received.'); 
        },
        'exit': async() => {
            log('Process exit event received.'); 
        },
        // 예기치 않은 오류 처리
        'uncaughtException': async(err) => {
            error('Uncaught Exception:', err);
        },
        'unhandledRejection': async(reason, promise) => {
            error('Unhandled Rejection:', reason);
        }
    };

    setBatchInterval = (fn, interval) => {
        
        if (interval !== undefined) {
            this.currentInterval = interval;
        }

        if (this.batchTimeoutId) {
            clearTimeout(this.batchTimeoutId);
        }
        
        setTimeout(() => {
            try {
                console.log("enter : ", this.threadName, new Date(), this.currentInterval);
                fn();
                this.batchTimeoutId = this.setBatchInterval(fn, this.currentInterval);
            } catch (ex) {
                error(ex);
            }
        }, this.currentInterval);
    };

    updateInterval(newInterval) {
        this.currentInterval = newInterval;
    }

    registerProxyFunction = (fn, state) => {
        const proxyHandler = {
            async apply(target, thisArg, args) {
                if (state.onExcute) {
                    console.log("Already Excute.");
                    return;
                }
                
                state.onExcute = true;
                
                const result = Reflect.apply(target, thisArg, args);
                if (result instanceof Promise) {
                    return result
                    .then((_result) => {
                        state.onExcute = false;
                        return _result;
                    })
                    .catch((ex) => {
                        error(ex);
                    });
                }
                state.onExcute = false;
    
                return result;
            }
        }
    
        return new Proxy(fn, proxyHandler);   
    };
}




module.exports = configClass;