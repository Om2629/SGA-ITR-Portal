let res = [
  dbExample = db.getSiblingDB("itr-portal"),
  dbExample.createCollection("users"),

  dbExample.users.insertMany([
      {
          userName: "admin",
          mobileNumber: "1111111111",
          email: "admin@gmail.com",
          password: "$2a$12$Ad14bsmDf4cGXp9jwECk6e2SGSUFOZux08Yc2.bEakGyG4RvIPeGG",
          pancard: "admin123",
          role: "admin"
      },
      {
        userName: "client",
        mobileNumber: "2222222222",
        email: "client@gmail.com",
        password: "$2a$12$Ad14bsmDf4cGXp9jwECk6e2SGSUFOZux08Yc2.bEakGyG4RvIPeGG",
        pancard: "client123",
        role: "client"
    }
  ]),

  dbExample.createCollection("roles"),
  dbExample.permissions.insertMany([
      { name: "admin", permissions: ["create", "read", "update", "delete"] },
      { name: "subAdmin", permissions: ["read", "update"] },
      { name: "client", permissions: ["read"] }
  ]),

]

printjson(res)