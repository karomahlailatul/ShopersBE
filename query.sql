create database shopers_v2;

\c shopers_v2;


create table users(
id 			text 	not null,
email 			text 	not null,
password  		text 	not null,
username  		text 	,
name 			text 	,
gender 			text 	,
phone 			text 	,
date_of_birth 		date 	,
picture 		text 	,
shipping_address 	text 	,

role 			text 	not null ,

created_on 		timestamp default CURRENT_TIMESTAMP not null	,
updated_on 		timestamp default CURRENT_TIMESTAMP not null	,

check 		(gender 	in ('men','women')),
check 		(role  		in ('user', 'seller', 'admin')),

primary key (id) 
);


CREATE  FUNCTION update_updated_on_users()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER update_users_updated_on
    BEFORE UPDATE
    ON
        users
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_users();





create table seller(
id text not null,

users_id 		text	,

name_store text not null,

logo text ,
address text ,
phone 	text ,
description text ,
commission bigint,

created_on timestamp default CURRENT_TIMESTAMP not null,
updated_on timestamp default CURRENT_TIMESTAMP not null,

constraint 	users foreign key(users_id) 	references 	users(id),

primary key (id) 
);






CREATE  FUNCTION update_updated_on_seller()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER update_seller_updated_on
    BEFORE UPDATE
    ON
        seller
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_seller();















create table category(

id 			text 	not null,
name 			text 	not null,
created_on 		timestamp default CURRENT_TIMESTAMP not null	,
primary key(id)
);




create table payment(

id 			text 	not null,
name 			text 	not null,
created_on 		timestamp default CURRENT_TIMESTAMP not null	,
primary key (id) 
);




create table product(
id 				text 	not null,
name 			  	text 	not null,
brand		 		text 	not null,

price 				int 	not null,
stock 				int 	not null,

photo 				text ,
color			 	text	not null,
size 				text 	not null,

condition 			text 	not null,

description 			text 	,


status		  		text 	,

category_id 			text	,

seller_id 			text	,




created_on 			timestamp default CURRENT_TIMESTAMP not null	,
updated_on 			timestamp default CURRENT_TIMESTAMP not null	,

check 		(status  	in ('enable','disable')),

check 		(conditition  	in ('new','used')),

constraint category foreign key(category_id) references category(id),
constraint seller foreign key(seller_id) references seller(id),

primary key (id)
);




CREATE  FUNCTION update_updated_on_product()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER update_product_updated_on
    BEFORE UPDATE
    ON
        product
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_product();









create table transaction(
id 				text 	not null,
product_id 			text	,

quantity	 		int 	not null,
discount	 		int 	not null,
total_amount	 		int 	not null,

payment_id	 		text 	not null,

status_payment		 	text 	not null,

status_transaction 		text 	not null,

users_id 			text	,

created_on 		timestamp default CURRENT_TIMESTAMP not null	,
updated_on 		timestamp default CURRENT_TIMESTAMP not null	,

check 	(status_payment in ('pending', 'paid')),
check 	(status_transaction in ('process', 'packing','shipping','delivered')),

constraint product foreign key(product_id) references product(id),
constraint payment foreign key(payment_id) references payment(id),
constraint users foreign key(users_id) references users(id),

primary key (id)
);




CREATE  FUNCTION update_updated_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER update_transaction_updated_on
    BEFORE UPDATE
    ON
        transaction
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_transaction();









