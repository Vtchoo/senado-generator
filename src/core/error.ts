class AppError extends Error {

    constructor(message: string, data?: any) {
        super(message)

    }
}

export default AppError
