const functions = require("firebase-functions");

const admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const express = require('express');
const cors=require("cors");
const { debug } = require("firebase-functions/logger");


const app= express();
//main 
app.use(cors({origin:true})); 
//main database
const db =admin.firestore();
//routes
app.get('/',(req,res)=>{
    return res.status(200).send("hii");
});

// create product
app.post("/api/create",(req,res)=>{
    (async ()=>{
        try{
            await db.collection("createProducts").doc(`/${Date.now()}/`).create({
                Id:Date.now(),
                Name:req.body.Name,
                Image:req.body.Image,
                Price:req.body.Price,
                OfferPrice:req.body.OfferPrice
            });
            return res.status(200).send({status:"Success",msg:"Product saved"})
        }
        catch(error){ 
            console.log(error);
            return res.status(500).send({status:"Failed",msg:error})
           
        }
    })();
});
//update product
app.put("/api/update/:id",(req,res)=>{
    (async ()=>{
        try{
            const reqDoc = db.collection('createProducts').doc(req.params.id);
            await reqDoc.update({
                Name:req.body.Name,
                Image:req.body.Image,
                Price:req.body.Price,
                OfferPrice:req.body.OfferPrice
            })
            return res.status(200).send({status:"Success",msg:"Product updated"})
        }
        catch(error){ 
            console.log(error);
            return res.status(500).send({status:"Failed",msg:error})
        }
    })();
});
//delete product
app.delete("/api/delete/:id",(req,res)=>{
    (async()=>{
        try{
          const reqDoc = db.collection('createProducts').doc(req.params.id);
         await reqDoc.delete();

            return res.status(200).send({status:"Success",msg:"Product deleted"})
        }
        catch(error){ 
            console.log(error);
            return res.status(500).send({status:"Failed",msg:error})
           
        }
    })();
});
//get specific product
app.get("/api/get/:id",(req,res)=>{
    (async()=>{
        try{
          const reqDoc = db.collection('createProducts').doc(req.params.id);
          let createProduct=await reqDoc.get();
          let response=createProduct.data();

            return res.status(200).send({status:"Success",data:response})
        }
        catch(error){ 
            console.log(error);
            return res.status(500).send({status:"Failed",msg:error})
           
        }
    })();
});
//get all product
app.get("/api/getAll",(req,res)=>{
    (async()=>{
        try{
          const qur = db.collection('createProducts');
          let response=[];

          await qur.get().then((data)=>{
            let docs = data.docs;
            docs.map((doc)=>{
                const selectedProduct={
                Name:doc.data().Name,
                Image:doc.data().Image,
                Price:doc.data().Price,
                OfferPrice:doc.data().OfferPrice
                }
                response.push(selectedProduct)
            });
            return response;
          });

            return res.status(200).send({status:"Success",data:response})
        }
        catch(error){ 
            console.log(error);
            return res.status(500).send({status:"Failed",msg:error})
           
        }
    })();
});
//exports the api to firebase 


exports.app=functions.https.onRequest(app);