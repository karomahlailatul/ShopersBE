const Pool = require('../config/db')
const selectAll = () => {
    return Pool.query(`select * from product`);
}
const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    // return Pool.query(`select * from product ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
    return Pool.query(`select product.id,product.name,product.brand,product.price,product.stock,product.photo,product.color,product.size,product.condition,product.description,product.status,product.category_id,product.seller_id,product.created_on,product.updated_on,seller.users_id,seller.name_store,seller.logo,seller.address,seller.description as seller_description,seller.phone ,category.name as category_name from product inner join seller on seller.id = product.seller_id inner join category on category.id = product.category_id ${querysearch} order by product.${sortby} ${sort} limit ${limit} offset ${offset} `)
}

const selectPaginationTotal = ({ querysearch }) => {
    // return Pool.query(`select * from product ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
    return Pool.query(`select * from product ${querysearch}`)
}

const selectProduct = (id) => {
    return Pool.query(`select product.id ,product.name ,product.brand,product.price ,product.stock ,product.photo ,product.color,product.size ,product.description ,product.condition,product.status,product.category_id ,product.seller_id ,product.created_on ,product.updated_on ,seller.users_id ,seller.name_store,seller.logo ,seller.address  ,seller.phone ,seller.description  as seller_description ,category.name as category_name from product inner join seller on seller.id = product.seller_id inner join category on category.id = product.category_id where product.id='${id}'`);
}
const insertProduct = (
    id,
    namelowerCase,
    brand,
    price,
    stock,
    photo,
    color,
    size,
    conditionLowerCase,
    description,
    statusLowerCase,
    category_idLowerCase,
    seller_idLowerCase

) => {
    return Pool.query(`insert into product ( id , name , brand , price , stock , photo , color , size , condition , description , status , category_id , seller_id )   values ( '${id}' , '${namelowerCase}' ,  '${brand}' , '${price}' , '${stock}' , '${photo}' , '${color}' , '${size}' , '${conditionLowerCase}' , '${description}' , '${statusLowerCase}' , '${category_idLowerCase}' , '${seller_idLowerCase}' ) `)
}

const updateProduct = (
    id,
    namelowerCase,
    brand,
    price,
    stock,
    photo,
    color,
    size,
    conditionLowerCase,
    description,
    statusLowerCase,
    category_idLowerCase,
    seller_idLowerCase

) => {
    return Pool.query(`update product set name = '${namelowerCase}' , brand = '${brand}' , price = '${price}' , stock = '${stock}' , photo = '${photo}' , color = '${color}' , size = '${size}' , condition = '${conditionLowerCase}' , description = '${description}' , status = '${statusLowerCase}', category_id = '${category_idLowerCase}', seller_id = '${seller_idLowerCase}' where id = '${id}' `)
}


const updateProductNoPhoto = (
    id,
    namelowerCase,
    brand,
    price,
    stock,
    color,
    size,
    conditionLowerCase,
    description,
    statusLowerCase,
    category_idLowerCase,
    seller_idLowerCase

) => {
    return Pool.query(`update product set name = '${namelowerCase}' , brand = '${brand}' , price = '${price}' , stock = '${stock}'  , color = '${color}' , size = '${size}' , condition = '${conditionLowerCase}' , description = '${description}' , status = '${statusLowerCase}', category_id = '${category_idLowerCase}', seller_id = '${seller_idLowerCase}' where id = '${id}' `)
}

const deleteProduct = (id) => {
    return Pool.query(`delete from product where id = '${id}'`)
}

const deleteProductSelected = (id) => {
    return Pool.query(`delete from product where id in (${id})`)
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

const selectPaginationCategory = ({ limit, offset, sortby, sort, querysearch }) => {
    // return Pool.query(`select * from product ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
    return Pool.query(`select product.id,product.name,product.brand,product.price,product.stock,product.photo,product.color,product.size,product.description,product.status,product.category_id,product.seller_id,product.created_on,product.updated_on,seller.users_id,seller.name_store,seller.logo,seller.address,seller.description,seller.commission,seller.created_on,seller.updated_on,seller.phone ,category.name as category_name from product inner join seller on seller.id = product.seller_id inner join category on category.id = product.category_id ${querysearch} order by product.${sortby} ${sort} limit ${limit} offset ${offset} `)
}

const selectPaginationPopular = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select product.id ,  product.name , product.brand , product.price , product.stock , product.photo , product.color , product.size , product.description , product.status , product.category_id , product.seller_id , product.created_on ,  product.updated_on , seller.users_id , seller.name_store , seller.logo , seller.address , seller.description , seller.phone  , COUNT(transaction.product_id) AS ValueFrequency from product inner join transaction on transaction.product_id = product.id inner join seller on seller.id = product.seller_id group by product.id ,  product.name , product.brand , product.price , product.stock , product.photo , product.color , product.size , product.description , product.status , product.category_id , product.seller_id , product.created_on , product.updated_on , seller.users_id , seller.name_store , seller.logo , seller.address , seller.description  ,  seller.phone  ${querysearch} order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
    // return Pool.query(`select product.id,product.name,product.brand,product.price,product.stock,product.photo,product.color,product.size,product.description,product.status,product.category_id,product.seller_id,product.created_on,product.updated_on,seller.users_id,seller.name_store,seller.logo,seller.address,seller.description,seller.phone from product inner join seller on seller.id = product.seller_id ${querysearch} order by product.${sortby} ${sort} limit ${limit} offset ${offset} `)
}

const selectPaginationSeller = ({ limit, offset, sortby, sort, querysearch }) => {
    // return Pool.query(`select product.id ,  product.name , product.brand , product.price , product.stock , product.photo , product.color , product.size , product.description , product.status , product.category_id , product.seller_id , product.created_on ,  product.updated_on , seller.users_id , seller.name_store , seller.logo , seller.address , seller.description , seller.phone  , COUNT(transaction.product_id) AS ValueFrequency from product inner join transaction on transaction.product_id = product.id inner join seller on seller.id = product.seller_id group by product.id ,  product.name , product.brand , product.price , product.stock , product.photo , product.color , product.size , product.description , product.status , product.category_id , product.seller_id , product.created_on , product.updated_on , seller.users_id , seller.name_store , seller.logo , seller.address , seller.description  ,  seller.phone  ${querysearch} order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
    return Pool.query(`select product.id,product.name,product.brand,product.price,product.stock,product.photo,product.color,product.size,product.description,product.status,product.category_id,product.seller_id,product.created_on,product.updated_on,seller.users_id,seller.name_store,seller.logo,seller.address,seller.description,seller.commission,seller.created_on,seller.updated_on,seller.phone ,category.name as category_name from product inner join seller on seller.id = product.seller_id inner join category on category.id = product.category_id ${querysearch} order by product.${sortby} ${sort} limit ${limit} offset ${offset} `)
}

module.exports = {
    selectAll,
    selectPagination,
    selectPaginationTotal,
    selectProduct,
    insertProduct,
    updateProduct,
    updateProductNoPhoto,
    deleteProduct,
    deleteProductSelected,
    selectCategory,
    selectSeller,
    findSeller,
    selectPaginationCategory,
    selectPaginationPopular,
    selectPaginationSeller
}