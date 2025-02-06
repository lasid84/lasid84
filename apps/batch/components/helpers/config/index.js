const { log, error } = require('@repo/kwe-lib/components/logHelper');

/**
 * @dev
 * process 전역 객체 공통 핸들러
 */
const commonProcessHandler = {
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

/**
 * @dev
 * batch setTimeout Proxy 제작 함수
 */
const registerProxyFunction = (fn, state) => {
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

/**
 * @dev
 * batch setTimeout 원본 함수
 */
const setBatchInterval = (fn, interval) => {
    setTimeout(() => {
        try {
            fn();
            setBatchInterval(fn, interval);
        } catch (ex) {
            error(ex);
        }
    }, interval);
};

module.exports = {
    commonProcessHandler,
    registerProxyFunction,
    setBatchInterval
}