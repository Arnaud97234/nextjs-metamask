export const formatBalance = (rawBalance) => {
    try {
        if (!rawBalance) return '0.00'
        const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
        return balance
    } catch (error) {
        return '0.00'
    }
}
