drop sequence if exists hibernate_sequence;
drop table if exists role_details cascade;
drop table if exists user_details cascade;

create sequence hibernate_sequence start 1 increment 1;
create table role_details (id int8 not null, role_name varchar(10), primary key (id));
create table user_details (id int8 not null, email varchar(30), first_name varchar(20), last_name varchar(20), recovery_key varchar(20), password varchar(50), role_details_id int8, primary key (id));

alter table role_details add constraint UK_bkomndi882uwkohdwtd6c6cvc unique (role_name);
alter table user_details add constraint UK_4d9rdl7d52k8x3etihxlaujvh unique (email);

drop table if exists course_file_details cascade;
create table course_file_details (id varchar(255) not null, course_category varchar(30), file_link_name varchar(30), file_name varchar(50), file_location varchar(100), primary key (id));
