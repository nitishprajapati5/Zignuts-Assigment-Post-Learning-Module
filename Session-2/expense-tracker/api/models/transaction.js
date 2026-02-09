module.exports = {
    attributes: {
        from: {
            model: "account",
            required: true,
        },
        fromUser: {
            model: "user",
            required: true,
        },
        to: {
            model: "account",
            required: true,
        },
        toUser: {
            model: "user",
            required: true,
        },
        amount: {
            type: "number",
            required: true,
        },
        type: {
            type: "string",
            required: true,
        },
        isDeleted: {
            type: "boolean",
            defaultsTo: false,
        },
        user: {
            model: "user",
            required: true,
        },
    }
}