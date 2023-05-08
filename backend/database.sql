drop database if exists blogdb;
create database blogdb;

use blogdb;

create table posts(
    id integer not null primary key AUTO_INCREMENT,
    user varchar(30) not null,
    post varchar(1000) not null
);

create table comments(
    id integer not null primary key AUTO_INCREMENT,
    referencePostId integer not null,
    user varchar(30) not null,
    comment varchar(200) not null,
    foreign key(referencePostId) references posts(id)
);

insert into posts (`user`,`post`) values('Ivan','Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero dicta repellat cupiditate dolorem repellendus, officia quis culpa voluptates tenetur officiis?');
insert into comments (`referencePostId`,`user`,`comment`) values(1,'Pavel','Agreed!');
insert into comments (`referencePostId`,`user`,`comment`) values(1,'Arseniiy','Sure, why not?');

insert into posts (`user`,`post`) values('James','Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero dicta repellat cupiditate dolorem repellendus, officia quis culpa voluptates tenetur officiis?');
insert into comments (`referencePostId`,`user`,`comment`) values(2,'Ivan','Cool!');
insert into comments (`referencePostId`,`user`,`comment`) values(2,'Julia',"Ok, let's roll!");
