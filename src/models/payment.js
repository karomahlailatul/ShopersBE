const Pool = require('../config/db')
const selectAll = () => {
    return Pool.query(`select * from payment`);
}
const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`SELECT * FROM payment  ${querysearch}  ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset} `)
}
const selectPaymentId = (id) => {
    return Pool.query(`select * from payment where id='${id}'`);
}
const insertPayment = (id, name) => {
    return Pool.query(`insert into payment(id, name) values ('${id}','${name}')`);
}
const updatePayment = (id, name) => {
    return Pool.query(`update payment set name='${name}' where id='${id}'`)
}
const deletePayment = (id) => {
    return Pool.query(`delete from payment where id='${id}'`)
}
const countData = () => {
    return Pool.query('SELECT COUNT(*) FROM payment')
}

module.exports = {
    selectAll,
    selectPagination,
    selectPaymentId,
    insertPayment,
    updatePayment,
    deletePayment,
    countData
}