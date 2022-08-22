const Pool = require('../config/db')
const selectAll = () => {
    return Pool.query(`select * from category`);
}
const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`SELECT * FROM category  ${querysearch}  ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset} `)
}
const selectCategoryId = (id) => {
    return Pool.query(`select * from category where id='${id}'`);
}
const insertCategory = (id, name) => {
    return Pool.query(`insert into category(id, name) values ('${id}','${name}')`);
}
const updateCategory = (id, name) => {
    return Pool.query(`update category set name='${name}' where id='${id}'`)
}
const deleteCategory = (id) => {
    return Pool.query(`delete from category where id='${id}'`)
}
const countData = () => {
    return Pool.query('SELECT COUNT(*) FROM category')
}

module.exports = {
    selectAll,
    selectPagination,
    selectCategoryId,
    insertCategory,
    updateCategory,
    deleteCategory,
    countData
}