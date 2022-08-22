const Pool = require('../config/db')
const selectAll = () => {
    return Pool.query(`select * from transaction`);
}
const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select * from transaction  ${querysearch}  order by transaction.${sortby} ${sort} limit ${limit} offset ${offset} `)
}
const selectTransactionId = (id) => {
    return Pool.query(`select * from transaction where id='${id}'`);
}
const insertTransaction = (
    id,
    product_idToLowerCase,
    quantity,
    discount,
    total_amount,
    payment_idToLowercase,
    status_payment,
    status_transaction,
    users_idToLowercase
) => {
    return Pool.query(`insert into transaction ( id, product_id,  quantity, discount, total_amount, payment_id, status_payment, status_transaction, users_id ) values ('${id}', '${product_idToLowerCase}', '${quantity}', '${discount}', '${total_amount}', '${payment_idToLowercase}',  '${status_payment}', '${status_transaction}', '${users_idToLowercase}'  )`)
}

const updateTransaction = (
    id, product_idToLowerCase, quantity, discount, total_amount,
    payment_idToLowercase, status_paymentToLowercase, status_transactionToLowercase,
    users_idToLowercase
) => {
    return Pool.query(`update transaction set product_id = '${product_idToLowerCase}' , quantity = '${quantity}' , discount = '${discount}' , total_amount = '${total_amount}' , payment_id = '${payment_idToLowercase}' , status_payment = '${status_paymentToLowercase}' , status_transaction = '${status_transactionToLowercase}' , users_id = '${users_idToLowercase}' where transaction.id = '${id}'`)
}

const deleteTransaction = (id) => {
    return Pool.query(`delete from transaction where transaction.id='${id}'`)
}

const selectInvoiceTransaction = (transactionID) => {
    return Pool.query(`select  transaction.id,  seller.name , seller.logo , product.name ,  product.brand,  product.price , product.photo , product.color,	 product.size,  transaction.quantity,  transaction.discount,  transaction.total_amount, payment.name, transaction.status_payment,  users.name , users.shipping_address , transaction.status_transaction ,  transaction.created_on from transaction  inner join product on transaction.product_id = product.id  inner join seller on seller.id = product.seller_id  inner join payment on transaction.payment_id = payment.id  inner join users on transaction.users_id = users.id where transaction.id = '${transactionID}'`);
}

const updateStockProduct = (product_idToLowerCase, stockProductUpdate) => {
    return Pool.query(`update product set stock = ${stockProductUpdate} where product.id='${product_idToLowerCase}'`);
}

const checkProduct = (product_idToLowerCase) => {
    return Pool.query(`select * from product where product.id='${product_idToLowerCase}'`);
}

const checkPayment = (payment_idToLowercase) => {
    return Pool.query(`select * from payment where payment.id='${payment_idToLowercase}'`);
}

const checkUsers = (payment_idToLowercase) => {
    return Pool.query(`select * from users where users.id='${payment_idToLowercase}'`);
}
module.exports = {
    selectAll,
    selectPagination,
    selectTransactionId,
    insertTransaction,
    updateTransaction,
    deleteTransaction,
    selectInvoiceTransaction,
    updateStockProduct,
    checkProduct,
    checkPayment,
    checkUsers,
}