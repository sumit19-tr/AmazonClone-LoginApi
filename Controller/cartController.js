const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");//to post call
const cartModel = require("../Model/cartModel");
const cart = require("../Model/cartModel");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/add-id', async (req, res) => {
    try {

        const productId = req.body.productId;
        const user_name = req.body.user_name;

        const existingCartItem = await cartModel.findOne({ productId, user_name});

        if (existingCartItem) {
            // Product ID already exists in the cart
            res.status(400).send({ success: false, msg: "Product already exists in the cart" });
        } else {
            const cart_obj = new cartModel({
                user_name: req.body.user_name,
                productId: req.body.productId,
                product_name: req.body.product_name,
                Image: req.body.Image,
                content: req.body.content,
                Price: req.body.Price,
                Quantity: req.body.Quantity
            })

            const cartData = await cart_obj.save();

            const product_details = await cartModel.find({ productId: productId });//fetch the product details before deleting it
            const product = product_details[0];
            const productname = product.product_name;//store the product name in variable

            res.status(200).send({ success: true, msg: productname+" added to cart succesfully", data: cartData });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
})

//items in cart
router.get('/cart-items/:user', async (req, res) => {
    try {
        const user = req.params.user;
        const cartItems = await cartModel.find({"user_name":user}).sort({productId:-1});
        res.status(200).send({ success: true, data: cartItems });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
});

//remove item from cart
router.delete('/removeItems/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product_details = await cartModel.find({ productId: id });//fetch the product details before deleting it
        const product = product_details[0];

        // console.log(product_details);
        const productname = product.product_name;//store the product name in variable
        // console.log(productname);
        const removeProduct = await cartModel.deleteOne({ productId: id });

        res.status(200).send({ success: true, data: `${productname} removed from cart successfully` });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
});

// update Quantity
router.put('/updateQuantity/:user',async(req,res)=>{
    try {
        const user = req.params.user;
        const productId = Number(req.body.productId);
        const updatedQuantity = Number(req.body.Quantity);        
        const product_details = await cartModel.findOne({ productId:productId,user_name: user});

        // Check if product exists
        if (!product_details) {
            return res.status(404).send({
                success: false,
                msg: "Product not found"
            });
        }

        const currentQuantity = Number(product_details.Quantity);
        const currentPrice = Number(product_details.Price);

        if(currentQuantity === 0){
            return res.status(400).send({
                success:false,
                msg:"Current quantity cannot be 0"
            })
        }

         if(!productId || isNaN(updatedQuantity)){
            return res.status(400).send({
                success:false,
                msg:"Invalid productId or Quantity"
            });
        }

        // calculate the new prize based on the updated quantity
        const updatedPrice = (currentPrice/currentQuantity)*updatedQuantity;
        // console.log("Price",Price);
        await cartModel.updateOne(
            {productId:productId,user_name: user},
            {
                $set:{
                    "Quantity":updatedQuantity,
                    "Price":updatedPrice
                }
            });
        res.status(200).send({success:true,msg:"Quantity updated successfully"});
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });    
    }
})

module.exports = router;