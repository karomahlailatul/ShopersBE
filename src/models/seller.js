const Pool = require('../config/db')
const findEmail = (email) => {
    return Pool.query(`SELECT * FROM users WHERE email='${email}'`);
}
const selectAll = () => {
    return Pool.query(`select * from seller`);
}
const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select * from seller ${querysearch} order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
}
const selectSellerId = (id) => {
    return Pool.query(`select * from seller where id='${id}'`);
}
const insertSeller = (
    id,
    users_id,
    name,
    logo,
    address,
    description,

) => {
    return Pool.query(`insert into seller ( id ,users_id, name, logo, address, description)   values   ('${id}', '${users_id}',  '${name}',   '${logo}',   '${address}' ,  '${description}' )`)
}

const updateSeller = (
    id,
    name,
    logo,
    address,
    description

) => {
    return Pool.query(`update seller set name = '${name}' , logo = '${logo}', address = '${address}' , description = '${description}' where id = '${id}' `)
}

const deleteSeller = (id) => {
    return Pool.query(`delete from seller where id='${id}'`)
}

module.exports = {
    findEmail,
    selectAll,
    selectPagination,
    selectSellerId,
    insertSeller,
    updateSeller,
    deleteSeller
}