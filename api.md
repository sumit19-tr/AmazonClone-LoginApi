-> items in cart
    (GET)http://localhost:9091/api/auth/cart-items
        https://amazonclone-loginapi.onrender.com/api/auth/cart-items/Sumit%20mehra


-> Add item to cart (Post api)
   http://localhost:9091/api/auth/add-id
   https://amazonclone-loginapi.onrender.com/api/auth/add-id
    example=>
    body=>
    {
            "productId": 12 ,
            "Image": "https://i.ibb.co/tJ6XbT7/Redmi-Note-7-Pro.jpghttps://i.ibb.co/tJ6XbT7/Redmi-Note-7-Pro.jpg",
            "content": "Redmi Note 7 Pro (Space Black, 64GB, 4GB RAM)",
            "Price":7999,
            "Quantity": 2
        }
    response=>
    {
        "success": false,
        "msg": "Product already exists in the cart"
    }
-> remove items (delete request);
    http://localhost:9091/api/auth/removeItems/1
    https://amazonclone-loginapi.onrender.com/api/auth/removeItems/12

    {
    "success": true,
    "data": "product  removed from cart successfully"
}


-> update Quantity
 (PUT)http://localhost:9091/api/auth/updateQuantity

 {
    "Quantity":2,
    "productId":5
}

{
    "success": true,
    "msg": "Quantity updated successfully[object Object]"
}

----------------------------------------------------------------------------------------------------------------

login api

---------------------Register--------------------------------------------
(POST) > http://localhost:9091/api/auth/register
(body) => { 
    "name": "rahul kumar",
    "email":"rahul@gmail.com",
    "password":"rahul123@",
    "phone":6745389612,
    "role":"user"
}
(response) => {
    "success": true,
    "msg": "Registration succesfull"
}

--------------------Get all user--------------------------
(GET)->http://localhost:9091/api/auth/users

----------------Login-----------------------------------
(POST) => http://localhost:9091/api/auth/login
(Body) => {
    "email":"amit@gmail.com",
    "password":"amit123@"
}
(response)-> {
    "auth": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTViZGMwYjFmZGI0OTEzMmE0MzMyMiIsImlhdCI6MTY4ODYzNjA1NSwiZXhwIjoxNjg4NzIyNDU1fQ.15OYdIBA7b8_EUtOs0s5doVekB-j5q87NbH9ZlvJDpk"
}

-----------------UserInfo------------------------
(GET) => http://localhost:9091/api/auth/userinfo

(Headers) => key:x-access-token value:Token value from login

(response)-> {
    "_id": "6479c03239a0a195a85b5602",
    "name": "rohit mishra",
    "email": "rohitmhr.99@gmail.com",
    "password": "$2a$08$236X.sXgx3oXBu4raSzGk.ZIFS2dsKvLs27mL1zgAH/emkpkb3fwq",
    "phone": 7987466251,
    "role": "user",
    "__v": 0
}

