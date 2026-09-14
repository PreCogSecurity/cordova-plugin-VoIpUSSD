/**
 * Unit tests for the www/voIpUSSD.js JavaScript bridge.
 *
 * The bridge is a plain Cordova plugin module: it registers itself with
 * `cordova.addConstructor` and forwards calls to the native layer through
 * `cordova.exec`. These tests stub both globals and assert the exact
 * arguments the bridge passes to the native side, so regressions in the
 * JS-to-native contract are caught without a device or emulator.
 */

describe('voIpUSSD bridge', () => {
    let execMock;
    let addConstructorMock;

    beforeEach(() => {
        execMock = jest.fn();
        addConstructorMock = jest.fn();
        global.cordova = {
            exec: execMock,
            addConstructor: addConstructorMock
        };
        global.window = {};
        jest.resetModules();
    });

    afterEach(() => {
        delete global.cordova;
        delete global.window;
    });

    it('registers the plugin constructor with cordova', () => {
        require('../www/voIpUSSD.js');
        expect(addConstructorMock).toHaveBeenCalledTimes(1);
        expect(typeof addConstructorMock.mock.calls[0][0]).toBe('function');
    });

    it('installs the plugin on window.plugins.voIpUSSD', () => {
        require('../www/voIpUSSD.js');
        addConstructorMock.mock.calls[0][0]();
        expect(window.plugins.voIpUSSD).toBeDefined();
        expect(typeof window.plugins.voIpUSSD.show).toBe('function');
    });

    it('creates window.plugins when it does not exist yet', () => {
        require('../www/voIpUSSD.js');
        addConstructorMock.mock.calls[0][0]();
        expect(window.plugins).toBeDefined();
    });

    it('show() forwards ussdCode to cordova.exec with the VoIpUSSD service and show action', () => {
        require('../www/voIpUSSD.js');
        addConstructorMock.mock.calls[0][0]();

        const success = jest.fn();
        const error = jest.fn();
        window.plugins.voIpUSSD.show('*105#', success, error);

        expect(execMock).toHaveBeenCalledTimes(1);
        expect(execMock).toHaveBeenCalledWith(
            success,
            error,
            'VoIpUSSD',
            'show',
            [{ ussdCode: '*105#' }]
        );
    });

    it('show() passes the ussdCode through unchanged', () => {
        require('../www/voIpUSSD.js');
        addConstructorMock.mock.calls[0][0]();

        const success = jest.fn();
        const error = jest.fn();
        window.plugins.voIpUSSD.show('*100#', success, error);

        expect(execMock.mock.calls[0][4][0].ussdCode).toBe('*100#');
    });

    it('show() forwards the success and error callbacks unchanged', () => {
        require('../www/voIpUSSD.js');
        addConstructorMock.mock.calls[0][0]();

        const success = jest.fn();
        const error = jest.fn();
        window.plugins.voIpUSSD.show('*105#', success, error);

        expect(execMock.mock.calls[0][0]).toBe(success);
        expect(execMock.mock.calls[0][1]).toBe(error);
    });
});
