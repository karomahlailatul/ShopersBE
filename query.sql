create database shopers_v2;

\c shopers_v2;


create table users(
id 			text 	not null,
username  		text 	not null,
email 			text 	not null,
password  		text 	not null,
name 			text 	not null,
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

name text not null,

logo text ,
address text ,
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
color			 	text 	not null,
size 				text 	not null,
description 			text 	not null,

status		  		text 	,

category_id 			text	,

seller_id 			text	,




created_on 			timestamp default CURRENT_TIMESTAMP not null	,
updated_on 			timestamp default CURRENT_TIMESTAMP not null	,

check 		(status  	in ('enable','disable')),

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


insert into users
(id , username , email, password, name, role)
values
('00000000-0000-0000-0000-000000000000',	'admin',	'admin@admin.com',		'$2b$10$O80qfeE1eu9RWG9ed/q1vOTKkRpPEJviIsua/bI/Pluj0Po0cXdu.',	'admin',	'admin'),
('test0000-0000-0000-0000-seller000000',	'sellertest',	'sellertest@seller.com',	'$2b$10$nQeTcOfyP8raA8TtjyV1OOR90LgZ95dGpCBtZjY2EApSMPI12fu7u',	'seller test',	'seller'),
('test0000-0000-0000-0000-user00000000',	'usertest',	'usertest@user.com',		'$2b$10$3FN56YoUeTQq4t3RPHQhouY8vIUqW4WDVN78DFenejKdj9GJX51JK',	'user test',	'user');



insert into seller (id, users_id ,name ) values 
('test0000-0000-0000-0000-seller000000', 'test0000-0000-0000-0000-seller000000','seller test');






insert into category (id,name) values ('category-1','short');
insert into category (id,name) values ('category-2','jacket');
insert into category (id,name) values ('category-3','pants');
insert into category (id,name) values ('category-4','t-jacket');
insert into category (id,name) values ('category-5','formal suit');
insert into category (id,name) values ('category-6','dress');
insert into category (id,name) values ('category-7','shirt');
insert into category (id,name) values ('category-8','t-shirt');





insert into product (
id,
name,
brand,
price,
stock,
color,
size,
description,
status,
category_id,
seller_id)

values (
'00000000-test-0000-test-product00000',
'test product',
'test product',
'100000',
'95',
'white',
'XL',
'test product',
'enable',
'category-1',
'test0000-0000-0000-0000-seller000000'
);








insert into transaction (
id,
product_id,
quantity,
discount,
total_amount	 ,
payment_id	 ,
status_payment		 ,
status_transaction ,
users_id )

values (
'00000000-test-0000-test-transaction0',
'00000000-test-0000-test-product00000',
'1',
'0',
'100000',
'payment-1',
'pending',
'process',
'test0000-0000-0000-0000-user00000000'
);


insert into transaction (
id,
product_id,
quantity,
discount,
total_amount	 ,
payment_id	 ,
status_payment		 ,
status_transaction ,
users_id )

values (
'00000000-test-0000-test-transaction1',
'00000000-test-0000-test-product00000',
'4',
'5000',
'395000',
'payment-2',
'paid',
'packing',
'test0000-0000-0000-0000-user00000000'
);


