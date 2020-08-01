drop sequence if exists hibernate_sequence;
drop table if exists role_details cascade;
drop table if exists user_details cascade;

create sequence hibernate_sequence start 1 increment 1;
create table role_details (id int8 not null, role_name varchar(10), primary key (id));
create table user_details (id int8 not null, email varchar(30), first_name varchar(20), last_name varchar(20), recovery_key varchar(20), password varchar(50), role_details_id int8, primary key (id));

alter table role_details add constraint UK_bkomndi882uwkohdwtd6c6cvc unique (role_name);
alter table user_details add constraint UK_4d9rdl7d52k8x3etihxlaujvh unique (email);