/**
 * Enum representing different log levels.
 * @enum {string}
 */
enum LogLevel {
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    ERROR = 'ERROR',
    EXCEPTION = 'EXCEPTION'
}

/**
 * Class representing a simple logger with common log formatting.
 */
class Logger {

    /**
     * Get details about the calling function, including filename and functionName.
     * @private
     * @returns {{ filename?: string, functionName?: string }} Object containing filename and functionName.
     */
    private static getCallerDetails(): { filename?: string, functionName?: string } {
        /**
         * Original implementation of `prepareStackTrace` to be restored later.
         * @type {Function}
         */
        const originalPrepareStackTrace = Error.prepareStackTrace;

        // Override `prepareStackTrace` to capture stack trace details.
        Error.prepareStackTrace = (_, stack) => stack;

        // Create a new Error object to capture the stack trace.
        const error = new Error();

        // Use type assertion to 'unknown' first.
        const errorWithStack = error as unknown as { stack: NodeJS.CallSite[] | string | undefined };

        // Capture stack trace with the overridden `prepareStackTrace`.
        Error.captureStackTrace(errorWithStack, Logger.getCallerDetails);

        const callerStack = Array.isArray(errorWithStack.stack) ? errorWithStack.stack.slice(1) : [];
        const caller = callerStack[0];

        // Restore the original `prepareStackTrace`.
        Error.prepareStackTrace = originalPrepareStackTrace;

        return {
            filename: caller?.getFileName() || undefined,
            functionName: caller?.getFunctionName() || undefined,
        };
    }

    /**
     * Format log message with timestamp, log level, filename, functionName, and message.
     * @private
     * @param {LogLevel} level - Log level.
     * @param {string} message - Log message.
     * @param {{ filename?: string, functionName?: string }} details - Additional details such as filename and functionName.
     * @returns {string} Formatted log message.
     */
    private static formatLogMessage(level: LogLevel, message: string, details: { filename?: string, functionName?: string }): string {
        const timestamp = new Date().toISOString();
        const fileDetails = details.filename ? `(${details.filename}${details.functionName ? `, ${details.functionName}` : ''})` : '';
        return `[${timestamp}] [${level}]${fileDetails} ${message}`;
    }

    /**
     * Log a message with the specified log level.
     * @param {LogLevel} level - Log level.
     * @param {string} message - Log message.
     */
    static log(level: LogLevel, message: string): void {
        const callerDetails = Logger.getCallerDetails();
        const logMessage = Logger.formatLogMessage(level, message, callerDetails);
        console.log(logMessage);
    }

    /**
     * Log an information message.
     * @param {string} message - Log message.
     */
    static info(message: string): void {
        Logger.log(LogLevel.INFO, message);
    }

    /**
     * Log a debug message.
     * @param {string} message - Log message.
     */
    static debug(message: string): void {
        Logger.log(LogLevel.DEBUG, message);
    }

    /**
     * Log an error message.
     * @param {string} message - Log message.
     */
    static error(message: string): void {
        Logger.log(LogLevel.ERROR, message);
    }

    /**
     * Log an exception message.
     * @param {string} message - Log message.
     */
    static exception(message: string): void {
        Logger.log(LogLevel.EXCEPTION, message);
    }
}

export default Logger;
