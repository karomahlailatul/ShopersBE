const Pool = require('../config/db')
const selectAll = () => {
    return Pool.query(`select * from product`);
}
const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select * from product ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
}
const selectProduct = (id) => {
    return Pool.query(`select * from product where id='${id}'`);
}
const insertProduct = (
    id,
    name,
    brand,
    price,
    stock,
    photo,
    color,
    size,
    description,
    statusLowerCase,
    category_idLowerCase,
    seller_idLowerCase

) => {
    return Pool.query(`insert into product ( id , name , brand , price , stock , photo , color , size , description , status , category_id , seller_id )   values ( '${id}' , '${name}' ,  '${brand}' , '${price}' , '${stock}' , '${photo}' , '${color}' , '${size}' , '${description}' , '${statusLowerCase}' , '${category_idLowerCase}' , '${seller_idLowerCase}' ) `)
}

const updateProduct = (
    id,
    name,
    brand,
    price,
    stock,
    photo,
    color,
    size,
    description,
    statusLowerCase,
    category_idLowerCase,
    seller_idLowerCase

) => {
    return Pool.query(`update product set name = '${name}' , brand = '${brand}' , price = '${price}' , stock = '${stock}' , photo = '${photo}' , color = '${color}' , size = '${size}' , description = '${description}' , status = '${statusLowerCase}', category_id = '${category_idLowerCase}', seller_id = '${seller_idLowerCase}' where id = '${id}' `)
}

const deleteProduct = (id) => {
    return Pool.query(`delete from product where id='${id}'`)
}

const selectCategory = (category_idLowerCase) => {
    return Pool.query(`select * from category where id='${category_idLowerCase}'`)
}

const selectSeller = (seller_idLowerCase) => {
    return Pool.query(`select * from seller where id='${seller_idLowerCase}'`)
}

const findSeller = (email) => {
    return Pool.query(`select users_id from seller inner join users on seller.users_id = users.id where email='${email}'`)
}


module.exports = {
    selectAll,
    selectPagination,
    selectProduct,
    insertProduct,
    updateProduct,
    deleteProduct,
    selectCategory,
    selectSeller,
    findSeller
}